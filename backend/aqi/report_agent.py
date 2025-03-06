import google.generativeai as genai
import datetime
import os
from dotenv import load_dotenv
import json
from collections import defaultdict

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_GEMINI_API_KEY'))  # Replace with your Gemini API key
model = genai.GenerativeModel('gemini-2.0-flash')

# AQI Calculation Function
def calculate_aqi(pm25, pm10, no2, so2, co, o3):
    aqi_values = {
        "PM2.5": (pm25 / 250) * 500,  
        "PM10": (pm10 / 430) * 500,
        "NO2": (no2 / 400) * 500,
        "SO2": (so2 / 80) * 500,
        "CO": (co / 4) * 500,
        "O3": (o3 / 180) * 500,
    }
    return round(max(aqi_values.values()))

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

# Generate ESG Audit Report using Gemini API
def generate_esg_audit_report(region, data):
    # Aggregate and calculate averages
    aggregated = aggregate_pollutants(data)
    averages = calculate_averages(aggregated)

    # Prepare pollutant data for each period
    period_reports = []
    for period, pollutants in averages.items():
        pm25 = pollutants.get('PM2.5', 0)
        pm10 = pollutants.get('PM10', 0)
        no2 = pollutants.get('NO2', 0)
        so2 = pollutants.get('SO2', 0)
        co = pollutants.get('CO', 0)
        o3 = pollutants.get('O3', 0)

        # Calculate AQI
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

    # Prepare prompt for Gemini API
    prompt = f"""
    You are an ESG (Environmental, Social, and Governance) Audit Report Agent. Your task is to generate a detailed audit report for the region: {region}.

    **Pollutant Data (Monthly Averages):**
    {json.dumps(period_reports, indent=4)}

    **Instructions:**
    1. Analyze the pollutant levels and AQI trends for the region over the given periods.
    2. Research (hypothetically) the environmental impact of these pollution levels in {region}.
    3. Provide recommendations for improving air quality and reducing pollution.
    4. Include ESG-specific insights, such as:
       - Environmental impact (e.g., carbon footprint, health risks).
       - Social impact (e.g., public health, community well-being).
       - Governance recommendations (e.g., policy changes, corporate responsibility).
    5. Format the report professionally in markdown.

    **Output:**
    Generate a detailed ESG Audit Report in markdown format.
    """

    # Call Gemini API
    response = model.generate_content(prompt)
    report_text = response.text

    # Add VeriEarth header and timestamp
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    header = f"""
    # VeriEarth - ESG Audit Report
    **Region:** {region}  
    **Date & Time:** {timestamp}  
    ---
    """
    full_report = header + report_text

    # Prepare JSON response
    report_data = {
        "service_name": "VeriEarth",
        "region": region,
        "timestamp": timestamp,
        "period_reports": period_reports,
        "report": full_report,
    }

    return json.dumps(report_data, indent=4)

# Example Usage
data = [
    {'period': '2023-01', 'pollutant': 'NO2', 'value': 0.00034806002779003386, 'interval': 'month'},
    {'period': '2023-02', 'pollutant': 'NO2', 'value': 0.00023625353752795402, 'interval': 'month'},
    {'period': '2023-03', 'pollutant': 'NO2', 'value': 0.00019583348933626752, 'interval': 'month'},
    {'period': '2023-04', 'pollutant': 'NO2', 'value': 0.0001809637364855079, 'interval': 'month'},
    {'period': '2023-05', 'pollutant': 'NO2', 'value': 0.00017974759022935913, 'interval': 'month'},
    {'period': '2023-06', 'pollutant': 'NO2', 'value': 0.00014804984388073572, 'interval': 'month'},
    {'period': '2023-07', 'pollutant': 'NO2', 'value': 0.00012717517359295852, 'interval': 'month'},
    {'period': '2023-08', 'pollutant': 'NO2', 'value': 0.00011856830544140587, 'interval': 'month'},
    {'period': '2023-09', 'pollutant': 'NO2', 'value': 0.00015006379015152462, 'interval': 'month'},
    {'period': '2023-10', 'pollutant': 'NO2', 'value': 0.00019321943529708517, 'interval': 'month'},
    {'period': '2023-11', 'pollutant': 'NO2', 'value': 0.00020616379333398543, 'interval': 'month'},
    {'period': '2023-12', 'pollutant': 'NO2', 'value': 0.0003436887021186854, 'interval': 'month'},
    {'period': '2023-01', 'pollutant': 'CO', 'value': 0.04361344917060935, 'interval': 'month'},
    {'period': '2023-02', 'pollutant': 'CO', 'value': 0.043613785995107915, 'interval': 'month'},
    {'period': '2023-03', 'pollutant': 'CO', 'value': 0.04100703578707357, 'interval': 'month'},
    {'period': '2023-04', 'pollutant': 'CO', 'value': 0.039196158936516415, 'interval': 'month'},
    {'period': '2023-05', 'pollutant': 'CO', 'value': 0.040295098769578715, 'interval': 'month'},
    {'period': '2023-06', 'pollutant': 'CO', 'value': 0.0349786894378563, 'interval': 'month'},
    {'period': '2023-07', 'pollutant': 'CO', 'value': 0.0368569004203798, 'interval': 'month'},
    {'period': '2023-08', 'pollutant': 'CO', 'value': 0.036561224217572526, 'interval': 'month'},
    {'period': '2023-09', 'pollutant': 'CO', 'value': 0.039118699269970025, 'interval': 'month'},
    {'period': '2023-10', 'pollutant': 'CO', 'value': 0.04032887891894762, 'interval': 'month'},
    {'period': '2023-11', 'pollutant': 'CO', 'value': 0.05378171454272479, 'interval': 'month'},
    {'period': '2023-12', 'pollutant': 'CO', 'value': 0.04750573550547966, 'interval': 'month'},
    {'period': '2023-01', 'pollutant': 'O3', 'value': 0.11901316704777312, 'interval': 'month'},
    {'period': '2023-02', 'pollutant': 'O3', 'value': 0.11984179697147826, 'interval': 'month'},
    {'period': '2023-03', 'pollutant': 'O3', 'value': 0.1266987934240384, 'interval': 'month'},
    {'period': '2023-04', 'pollutant': 'O3', 'value': 0.13495631420415524, 'interval': 'month'},
    {'period': '2023-05', 'pollutant': 'O3', 'value': 0.13134233429076408, 'interval': 'month'},
    {'period': '2023-06', 'pollutant': 'O3', 'value': 0.12908664794501357, 'interval': 'month'},
    {'period': '2023-07', 'pollutant': 'O3', 'value': 0.12515343728710482, 'interval': 'month'},
    {'period': '2023-08', 'pollutant': 'O3', 'value': 0.12480832329798464, 'interval': 'month'},
    {'period': '2023-09', 'pollutant': 'O3', 'value': 0.12555356721776004, 'interval': 'month'},
    {'period': '2023-10', 'pollutant': 'O3', 'value': 0.12440049410654781, 'interval': 'month'},
    {'period': '2023-11', 'pollutant': 'O3', 'value': 0.12576995747975392, 'interval': 'month'},
    {'period': '2023-12', 'pollutant': 'O3', 'value': 0.1274083386760295, 'interval': 'month'},
]

region = "Delhi, India"

# Generate JSON response
json_response = generate_esg_audit_report(region, data)
print(json_response)