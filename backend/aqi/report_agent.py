import google.generativeai as genai
import datetime
import os
from dotenv import load_dotenv
import json
from collections import defaultdict
from fpdf import FPDF
from datetime import datetime
from fpdf import FPDF
from io import BytesIO
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_GEMINI_API_KEY'))  # Replace with your Gemini API key
model = genai.GenerativeModel('gemini-2.0-flash')



# Define pollutant breakpoints (CPCB - India)
BREAKPOINTS = {
    "PM2.5": [
        (0, 30, 0, 50),
        (31, 60, 51, 100),
        (61, 90, 101, 200),
        (91, 120, 201, 300),
        (121, 250, 301, 400),
        (251, 500, 401, 500)
    ],
    "PM10": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 250, 101, 200),
        (251, 350, 201, 300),
        (351, 430, 301, 400),
        (431, 1000, 401, 500)
    ],
    "NO2": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 180, 101, 200),
        (181, 280, 201, 300),
        (281, 400, 301, 400),
        (401, 1000, 401, 500)
    ],
    "SO2": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 380, 101, 200),
        (381, 800, 201, 300),
        (801, 1600, 301, 400),
        (1601, 10000, 401, 500)
    ],
    "CO": [
        (0, 1, 0, 50),
        (1.1, 2, 51, 100),
        (2.1, 10, 101, 200),
        (10.1, 17, 201, 300),
        (17.1, 34, 301, 400),
        (34.1, 100, 401, 500)
    ],
    "O3": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 168, 101, 200),
        (169, 208, 201, 300),
        (209, 748, 301, 400),
        (749, 1000, 401, 500)
    ]
}


def calculate_aqi_for_pollutant(pollutant, concentration):
    breakpoints = BREAKPOINTS.get(pollutant)

    if not breakpoints:
        raise ValueError(f"No breakpoints defined for pollutant: {pollutant}")

    for bp in breakpoints:
        lo_c, hi_c, lo_aqi, hi_aqi = bp
        if lo_c <= concentration <= hi_c:
            aqi = ((concentration - lo_c) / (hi_c - lo_c)) * (hi_aqi - lo_aqi) + lo_aqi
            return round(aqi)

    # If it exceeds the highest defined range, cap at 500
    return 500
def calculate_aqi(pm25, pm10, no2, so2, co, o3):
    aqi_values = {
        "PM2.5": calculate_aqi_for_pollutant("PM2.5", pm25),
        "PM10": calculate_aqi_for_pollutant("PM10", pm10),
        "NO2": calculate_aqi_for_pollutant("NO2", no2),
        "SO2": calculate_aqi_for_pollutant("SO2", so2),
        "CO": calculate_aqi_for_pollutant("CO", co),
        "O3": calculate_aqi_for_pollutant("O3", o3),
    }

    # The final AQI is the highest individual pollutant AQI
    return max(aqi_values.values())

# AQI Category Function
def aqi_category(aqi):
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Satisfactory"
    elif aqi <= 200:
        return "Moderate"
    elif aqi <= 300:
        return "Poor"
    elif aqi <= 400:
        return "Very Poor"
    else:
        return "Severe"

# Aggregate pollutant data by period
def aggregate_pollutants(data):
    aggregated = defaultdict(lambda: defaultdict(list))
    for entry in data:
        period = entry['period']
        pollutant = entry['pollutant']
        value = entry['value']
        if value is not None:  # Ignore None values
            aggregated[period][pollutant].append(value)
    return aggregated

# Calculate average pollutant values for each period
def calculate_averages(aggregated):
    averages = {}
    for period, pollutants in aggregated.items():
        averages[period] = {
            pollutant: sum(values) / len(values) if values else 0
            for pollutant, values in pollutants.items()
        }
    return averages





import os
import time
from datetime import datetime
from fpdf import FPDF

def generate_esg_audit_report(region, data):
    # Aggregate and calculate averages (assuming these functions exist and work correctly)
    aggregated = aggregate_pollutants(data)
    averages = calculate_averages(aggregated)

    period_reports = []
    for period, pollutants in averages.items():
        pm25 = pollutants.get('PM2.5', 0)
        pm10 = pollutants.get('PM10', 0)
        no2 = pollutants.get('NO2', 0)
        so2 = pollutants.get('SO2', 0)
        co = pollutants.get('CO', 0)
        o3 = pollutants.get('O3', 0)

        aqi = calculate_aqi(pm25, pm10, no2, so2, co, o3)
        category = aqi_category(aqi)

        period_reports.append({
            "period": period,
            "pollutants": {
                "PM2.5": pm25,
                "PM10": pm10,
                "NO2": no2,
                "SO2": so2,
                "CO": co,
                "O3": o3,
            },
            "aqi": {
                "value": aqi,
                "category": category,
            },
        })

    pdf = FPDF()
    pdf.add_page()

    # Header
    pdf.set_font("Arial", "B", 24)
    pdf.set_text_color(0, 128, 0)
    pdf.cell(0, 10, "VeriEarth", ln=True, align="C")
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "ESG Audit Report", ln=True, align="C")

    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
    pdf.cell(0, 10, f"Region: {region}", ln=True)
    pdf.ln(10)

    pdf.set_font("Arial", "B", 14)
    for report in period_reports:
        pdf.cell(0, 10, f"Period: {report['period']}", ln=True)
        pdf.set_font("Arial", "", 12)
        pdf.cell(0, 10, f"AQI: {report['aqi']['value']} ({report['aqi']['category']})", ln=True)
        pdf.cell(0, 10, "Pollutant Levels:", ln=True)
        for pollutant, value in report['pollutants'].items():
            pdf.cell(0, 10, f"- {pollutant}: {value}", ln=True)
        pdf.ln(10)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Recommendations:", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 10, """
    - Reduce vehicle emissions & industrial pollution.
    - Promote public transport & alternative energy sources.
    - Stricter enforcement of environmental policies.
    """)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Conclusion:", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 10, """
    Immediate actions are required to mitigate pollution effects.
    """)

    # Save to file (you can change the directory as needed)
    output_dir = "/tmp"
    os.makedirs(output_dir, exist_ok=True)

    file_path = os.path.join(
        output_dir,
        f"ESG_Audit_Report_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.pdf"
    )

    pdf.output(file_path)
    print(f"✅ PDF report saved to: {file_path}")

    # Optional: simulate processing delay (remove if unnecessary)
    time.sleep(3)

    return file_path


# # Example Usage
# data = [
#     {'period': '2023-01', 'pollutant': 'NO2', 'value': 0.00034806002779003386, 'interval': 'month'},
#     {'period': '2023-02', 'pollutant': 'NO2', 'value': 0.00023625353752795402, 'interval': 'month'},
#     {'period': '2023-03', 'pollutant': 'NO2', 'value': 0.00019583348933626752, 'interval': 'month'},
#     {'period': '2023-04', 'pollutant': 'NO2', 'value': 0.0001809637364855079, 'interval': 'month'},
#     {'period': '2023-05', 'pollutant': 'NO2', 'value': 0.00017974759022935913, 'interval': 'month'},
#     {'period': '2023-06', 'pollutant': 'NO2', 'value': 0.00014804984388073572, 'interval': 'month'},
#     {'period': '2023-07', 'pollutant': 'NO2', 'value': 0.00012717517359295852, 'interval': 'month'},
#     {'period': '2023-08', 'pollutant': 'NO2', 'value': 0.00011856830544140587, 'interval': 'month'},
#     {'period': '2023-09', 'pollutant': 'NO2', 'value': 0.00015006379015152462, 'interval': 'month'},
#     {'period': '2023-10', 'pollutant': 'NO2', 'value': 0.00019321943529708517, 'interval': 'month'},
#     {'period': '2023-11', 'pollutant': 'NO2', 'value': 0.00020616379333398543, 'interval': 'month'},
#     {'period': '2023-12', 'pollutant': 'NO2', 'value': 0.0003436887021186854, 'interval': 'month'},
#     {'period': '2023-01', 'pollutant': 'CO', 'value': 0.04361344917060935, 'interval': 'month'},
#     {'period': '2023-02', 'pollutant': 'CO', 'value': 0.043613785995107915, 'interval': 'month'},
#     {'period': '2023-03', 'pollutant': 'CO', 'value': 0.04100703578707357, 'interval': 'month'},
#     {'period': '2023-04', 'pollutant': 'CO', 'value': 0.039196158936516415, 'interval': 'month'},
#     {'period': '2023-05', 'pollutant': 'CO', 'value': 0.040295098769578715, 'interval': 'month'},
#     {'period': '2023-06', 'pollutant': 'CO', 'value': 0.0349786894378563, 'interval': 'month'},
#     {'period': '2023-07', 'pollutant': 'CO', 'value': 0.0368569004203798, 'interval': 'month'},
#     {'period': '2023-08', 'pollutant': 'CO', 'value': 0.036561224217572526, 'interval': 'month'},
#     {'period': '2023-09', 'pollutant': 'CO', 'value': 0.039118699269970025, 'interval': 'month'},
#     {'period': '2023-10', 'pollutant': 'CO', 'value': 0.04032887891894762, 'interval': 'month'},
#     {'period': '2023-11', 'pollutant': 'CO', 'value': 0.05378171454272479, 'interval': 'month'},
#     {'period': '2023-12', 'pollutant': 'CO', 'value': 0.04750573550547966, 'interval': 'month'},
#     {'period': '2023-01', 'pollutant': 'O3', 'value': 0.11901316704777312, 'interval': 'month'},
#     {'period': '2023-02', 'pollutant': 'O3', 'value': 0.11984179697147826, 'interval': 'month'},
#     {'period': '2023-03', 'pollutant': 'O3', 'value': 0.1266987934240384, 'interval': 'month'},
#     {'period': '2023-04', 'pollutant': 'O3', 'value': 0.13495631420415524, 'interval': 'month'},
#     {'period': '2023-05', 'pollutant': 'O3', 'value': 0.13134233429076408, 'interval': 'month'},
#     {'period': '2023-06', 'pollutant': 'O3', 'value': 0.12908664794501357, 'interval': 'month'},
#     {'period': '2023-07', 'pollutant': 'O3', 'value': 0.12515343728710482, 'interval': 'month'},
#     {'period': '2023-08', 'pollutant': 'O3', 'value': 0.12480832329798464, 'interval': 'month'},
#     {'period': '2023-09', 'pollutant': 'O3', 'value': 0.12555356721776004, 'interval': 'month'},
#     {'period': '2023-10', 'pollutant': 'O3', 'value': 0.12440049410654781, 'interval': 'month'},
#     {'period': '2023-11', 'pollutant': 'O3', 'value': 0.12576995747975392, 'interval': 'month'},
#     {'period': '2023-12', 'pollutant': 'O3', 'value': 0.1274083386760295, 'interval': 'month'},
# ]

# region = "Delhi, India"

# # Generate JSON response
# json_response = generate_esg_audit_report(region, data)
# print(json_response)