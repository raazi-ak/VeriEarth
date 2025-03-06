import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import List, Dict, Literal
from datetime import datetime
from aqi.gee_service import fetch_pollutant_data
from aqi.report_agent import generate_esg_audit_report

router = APIRouter()

# Input validation models
class AOI(BaseModel):
    type: Literal["Polygon"]
    coordinates: List[List[List[float]]]

    @validator("coordinates")
    def validate_coordinates(cls, v):
        if not v or not isinstance(v, list):
            raise ValueError("Coordinates must be a non-empty list")
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

class FetchDataRequest(BaseModel):
    aoi: AOI
    start_date: str
    end_date: str
    interval: Literal["day", "week", "month", "year"]

    @validator("start_date", "end_date")
    def validate_date_format(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

class GenerateReportRequest(BaseModel):
    region: str
    data: List[Dict]

# Routes
@router.post("/fetch-data")
async def fetch_data(request: FetchDataRequest):
    try:
        data = fetch_pollutant_data(
            aoi=request.aoi.dict(),
            start_date=request.start_date,
            end_date=request.end_date,
            interval=request.interval
        )
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-report")
async def generate_report(request: GenerateReportRequest):
    try:
        report = generate_esg_audit_report(request.region, request.data)
        return {"status": "success", "report": json.loads(report)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))