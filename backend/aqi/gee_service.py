import ee
from datetime import datetime
from typing import List, Dict, Literal

# Initialize Earth Engine
def initialize_earth_engine():
    try:
        ee.Initialize(project='ee-raazifaisal')
        print("✅ Earth Engine Initialized with project 'ee-raazifaisal'")
    except Exception as e:
        print(f"⚠️ Earth Engine Initialization Failed: {e}")
        raise e

# Define the pollutants and their datasets
POLLUTANTS = [
    {'name': 'NO2', 'dataset': 'COPERNICUS/S5P/OFFL/L3_NO2', 'band': 'NO2_column_number_density'},
    {'name': 'CO', 'dataset': 'COPERNICUS/S5P/OFFL/L3_CO', 'band': 'CO_column_number_density'},
    {'name': 'HCHO', 'dataset': 'COPERNICUS/S5P/OFFL/L3_HCHO', 'band': 'tropospheric_HCHO_column_number_density'},
    {'name': 'CH4', 'dataset': 'COPERNICUS/S5P/OFFL/L3_CH4', 'band': 'CH4_column_volume_mixing_ratio_dry_air'},
    {'name': 'SO2', 'dataset': 'COPERNICUS/S5P/OFFL/L3_SO2', 'band': 'SO2_column_number_density'},
    {'name': 'AOD', 'dataset': 'MODIS/061/MCD19A2_GRANULES', 'band': 'Optical_Depth_047'},
    {'name': 'O3', 'dataset': 'COPERNICUS/S5P/OFFL/L3_O3', 'band': 'O3_column_number_density'},
]

def generate_date_ranges(start_date: ee.Date, end_date: ee.Date, interval: Literal['day', 'week', 'month', 'year']):
    """ Generate date ranges based on the interval type. """
    ranges = []
    current = start_date

    while current.millis().lt(end_date.millis()).getInfo():
        if interval == 'day':
            next_date = current.advance(1, 'day')
        elif interval == 'week':
            next_date = current.advance(1, 'week')
        elif interval == 'month':
            next_date = current.advance(1, 'month')
        elif interval == 'year':
            next_date = current.advance(1, 'year')
        else:
            raise ValueError(f"Unsupported interval: {interval}")

        ranges.append((current, next_date))
        current = next_date

    return ranges

def fetch_pollutant_data(aoi: Dict, start_date: str, end_date: str, interval: Literal['day', 'week', 'month', 'year']) -> List[Dict]:
    initialize_earth_engine()

    print("\n🚀 Fetching pollutant data for AOI and time range:")
    print(f"   Start Date: {start_date}")
    print(f"   End Date: {end_date}")
    print(f"   Interval: {interval}")
    print(f"   AOI: {aoi['coordinates']}")

    aoi_geometry = ee.Geometry.Polygon(aoi['coordinates'])
    start_date = ee.Date(start_date)
    end_date = ee.Date(end_date)

    date_ranges = generate_date_ranges(start_date, end_date, interval)
    print(f"📆 Total {interval}s in range: {len(date_ranges)}")

    all_data = []

    for pollutant in POLLUTANTS:
        print(f"\n🔎 Processing pollutant: {pollutant['name']} from dataset: {pollutant['dataset']} using band: {pollutant['band']}")

        collection = ee.ImageCollection(pollutant['dataset']) \
            .filterBounds(aoi_geometry) \
            .filterDate(start_date, end_date) \
            .select(pollutant['band'])

        print(f"   ✅ Collection Filtered - Found {collection.size().getInfo()} images for {pollutant['name']}")

        for start, end in date_ranges:
            if interval == 'day':
                period_label = start.format('YYYY-MM-dd').getInfo()
            elif interval == 'week':
                year = start.get('year').format().getInfo()
                week = start.get('week').format().getInfo()  # Week 1 to 52
                period_label = f"{year}-W{week.zfill(2)}"
            elif interval == 'month':
                period_label = start.format('YYYY-MM').getInfo()
            elif interval == 'year':
                period_label = start.format('YYYY').getInfo()
            else:
                raise ValueError(f"Unsupported interval: {interval}")

            print(f"   📊 Processing {interval}: {period_label}")

            period_image = collection.filterDate(start, end).mean().clip(aoi_geometry)

            try:
                mean_value = period_image.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=aoi_geometry,
                    scale=1000,
                    maxPixels=1e13
                ).get(pollutant['band']).getInfo()

                print(f"      ✅ {pollutant['name']} average for {period_label}: {mean_value}")

                all_data.append({
                    "period": period_label,
                    "pollutant": pollutant['name'],
                    "value": mean_value,
                    "interval": interval
                })

            except Exception as e:
                print(f"      ⚠️ Failed to compute mean for {pollutant['name']} in {period_label}: {e}")
                all_data.append({
                    "period": period_label,
                    "pollutant": pollutant['name'],
                    "value": None,
                    "interval": interval
                })

    print("\n✅ Data fetching complete. Total records:", len(all_data))
    return all_data


# # Test block
# if __name__ == "__main__":
#     # Define the AOI (Area of Interest)
#     aoi = {
#         "type": "Polygon",
#         "coordinates": [
#             [
#                 [77.2090, 28.6139],  # Point 1
#                 [77.2100, 28.6139],  # Point 2
#                 [77.2100, 28.6150],  # Point 3
#                 [77.2090, 28.6150],  # Point 4
#                 [77.2090, 28.6139]   # Close the polygon (same as Point 1)
#             ]
#         ]
#     }

#     # Define the time range and interval
#     start_date = "2023-01-01"
#     end_date = "2023-12-31"
#     interval = "month"  # Can be 'day', 'week', 'month', or 'year'

#     # Fetch pollutant data
#     print("🚀 Starting pollutant data fetch...")
#     data = fetch_pollutant_data(
#         aoi=aoi,
#         start_date=start_date,
#         end_date=end_date,
#         interval=interval
#     )

#     # Print the fetched data
#     print("\n📊 Fetched Data:")
#     for record in data:
#         print(record)