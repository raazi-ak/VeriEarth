from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, validator, model_validator
from typing import List, Dict, Literal
from datetime import datetime
from sqlalchemy.orm import Session
from aqi.gee_service import fetch_pollutant_data
from aqi.report_agent import generate_esg_audit_report
from db.database import get_db
import db
from auth.auth import get_current_user
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

router = APIRouter()

# ------------------ Input Models ------------------

class AOI(BaseModel):
    type: Literal["Polygon"]
    coordinates: List[List[List[float]]]

    @validator("coordinates")
    def validate_coordinates(cls, v):
        if not v or not isinstance(v, list):
            raise ValueError("Coordinates must be a non-empty list")

        if len(v) > 10:
            raise ValueError("Polygon can have a maximum of 10 vertices")

        for ring in v:
            if not ring or not isinstance(ring, list):
                raise ValueError("Each ring must be a non-empty list")
            for point in ring:
                if not isinstance(point, list) or len(point) != 2:
                    raise ValueError("Each point must be a list of two numbers (longitude, latitude)")
                lon, lat = point
                if not (-180 <= lon <= 180) or not (-90 <= lat <= 90):
                    raise ValueError("Longitude must be between -180 and 180, and latitude between -90 and 90")
        return v


class FetchAndGenerateReportRequest(BaseModel):
    aoi: AOI
    start_date: str
    end_date: str
    interval: Literal["day", "week", "month", "year"]
    region: str

    @validator("start_date", "end_date")
    def validate_date_format(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

    @model_validator(mode="after")
    def validate_date_range(self):
        start_date = datetime.strptime(self.start_date, "%Y-%m-%d")
        end_date = datetime.strptime(self.end_date, "%Y-%m-%d")
        if start_date > end_date:
            raise ValueError("Start date must be before or equal to end date")
        return self


# ------------------ Email Utility ------------------

def send_email_with_attachment(to_email: str, name: str, file_path: str):
    smtp_server = os.getenv("MAIL_SERVER")
    smtp_port = int(os.getenv("MAIL_PORT", 587))
    smtp_username = os.getenv("MAIL_USERNAME")
    smtp_password = os.getenv("MAIL_PASSWORD")
    mail_from = os.getenv("MAIL_FROM")

    msg = MIMEMultipart()
    msg["From"] = mail_from
    msg["To"] = to_email
    msg["Subject"] = "Your ESG Audit Report from VeriEarth"

    body = f"""
    Dear {name},

    Your ESG Audit Report is ready! Please find the attached PDF report.

    Thank you for using VeriEarth.

    Best regards,
    The VeriEarth Team
    """
    msg.attach(MIMEText(body, "plain"))

    # --- Intentional Delay ---
    time.sleep(3)  # This is the intentional 3-second delay

    try:
        with open(file_path, "rb") as file:
            pdf_data = file.read()

        attachment = MIMEApplication(pdf_data, _subtype="pdf")
        attachment.add_header(
            "Content-Disposition",
            f"attachment; filename=ESG_Audit_Report_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        )
        msg.attach(attachment)

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(mail_from, to_email, msg.as_string())

        print(f"✅ Email sent to {to_email}")

        # Optional Cleanup: Delete the report after sending if desired
        os.remove(file_path)
        print(f"🗑️ Deleted report file: {file_path}")

    except Exception as e:
        print(f"⚠️ Failed to send email: {e}")


# ------------------ Background Task ------------------

def generate_and_send_report(
    aoi: Dict,
    start_date: str,
    end_date: str,
    interval: str,
    region: str,
    email: str,
    name: str
):
    try:
        data = fetch_pollutant_data(
            aoi=aoi,
            start_date=start_date,
            end_date=end_date,
            interval=interval
        )

        # Generate PDF report and save to disk, get file path
        file_path = generate_esg_audit_report(region, data)

        # Send email with attachment (reading after 3-second delay)
        send_email_with_attachment(to_email=email, name=name, file_path=file_path)

    except Exception as e:
        print(f"⚠️ Error in background task: {e}")


# ------------------ Route Handler ------------------

@router.post("/fetch-and-generate-report")
async def fetch_and_generate_report(
    request: FetchAndGenerateReportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: db.models.User = Depends(get_current_user)
):
    try:
        email = current_user.email
        name = getattr(current_user, "full_name", "User")

        background_tasks.add_task(
            generate_and_send_report,
            aoi=request.aoi.dict(),
            start_date=request.start_date,
            end_date=request.end_date,
            interval=request.interval,
            region=request.region,
            email=email,
            name=name
        )

        return {"status": "success", "message": "Request accepted. Report will be emailed shortly."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate report generation: {str(e)}")

