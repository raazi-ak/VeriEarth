import requests
import tkinter as tk
from tkinter import simpledialog, messagebox, ttk

BASE_URL = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"

POLYGONS = {
    "New Delhi": "POLYGON((77.068 28.412, 77.341 28.412, 77.341 28.881, 77.068 28.881, 77.068 28.412))",
    "Surat": "POLYGON((72.761 21.067, 72.880 21.067, 72.880 21.244, 72.761 21.244, 72.761 21.067))",
    "Gulf of Mexico": "POLYGON((-97.5 24.5, -81.5 24.5, -81.5 30.5, -97.5 30.5, -97.5 24.5))",
    "Suez Canal": "POLYGON((32.262 29.729, 32.612 29.729, 32.612 31.232, 32.262 31.232, 32.262 29.729))",
    "Custom Polygon": None  # Placeholder for user-defined polygon
}


def get_user_choices():
    """GUI to select satellite and region, supports custom polygon input."""
    root = tk.Tk()
    root.withdraw()

    satellite = simpledialog.askstring(
        "Satellite Selection",
        "Choose satellite (Sentinel-1 or Sentinel-5P):",
        initialvalue="Sentinel-1"
    )
    if satellite not in ["Sentinel-1", "Sentinel-5P"]:
        messagebox.showerror("Invalid Selection", "Choose either Sentinel-1 or Sentinel-5P.")
        raise ValueError("Invalid satellite choice")

    region_selection_window = tk.Toplevel(root)
    region_selection_window.title("Select Region")

    region_var = tk.StringVar(value="New Delhi")
    ttk.Label(region_selection_window, text="Select Area of Interest:").pack(pady=10)

    radio_buttons = []
    for region in POLYGONS.keys():
        rb = ttk.Radiobutton(region_selection_window, text=region, variable=region_var, value=region)
        rb.pack(anchor="w")
        radio_buttons.append(rb)

    # Custom polygon input field
    custom_polygon_frame = ttk.Frame(region_selection_window)
    custom_polygon_label = ttk.Label(custom_polygon_frame, text="Enter Custom Polygon (WKT format):")
    custom_polygon_entry = ttk.Entry(custom_polygon_frame, width=60)

    def toggle_custom_polygon(*args):
        """Show/hide polygon entry based on selection."""
        if region_var.get() == "Custom Polygon":
            custom_polygon_frame.pack(pady=5)
        else:
            custom_polygon_frame.pack_forget()

    region_var.trace_add("write", toggle_custom_polygon)

    custom_polygon_label.pack(side="left")
    custom_polygon_entry.pack(side="left")

    def submit_selection():
        selected_region = region_var.get()

        if selected_region == "Custom Polygon":
            custom_polygon = custom_polygon_entry.get().strip()
            if not custom_polygon.startswith("POLYGON") or "()" in custom_polygon:
                messagebox.showerror("Invalid Polygon", "Please enter a valid WKT polygon.")
                return
            POLYGONS["Custom Polygon"] = custom_polygon

        region_selection_window.destroy()

    ttk.Button(region_selection_window, text="Submit", command=submit_selection).pack(pady=10)
    region_selection_window.wait_window()

    selected_region = region_var.get()
    selected_polygon = POLYGONS[selected_region]

    return satellite, selected_region, selected_polygon


def fetch_data(satellite, polygon_wkt):
    """Fetch raw data from Copernicus API"""
    query_url = (
        f"{BASE_URL}?$filter=OData.CSC.Intersects(area=geography'SRID=4326;{polygon_wkt}') "
        f"and Collection/Name eq '{satellite.upper()}'&$top=50"
    )

    try:
        response = requests.get(query_url, timeout=20)
        response.raise_for_status()
    except requests.RequestException as e:
        raise ConnectionError(f"Failed to fetch data: {e}")

    return response.json()


def fetch_and_return_products():
    """Wrapper that handles user selection + fetch flow, returns product list."""
    satellite, region, polygon = get_user_choices()
    print(f"🌍 Satellite: {satellite}")
    print(f"📍 Region: {region}")

    data = fetch_data(satellite, polygon)

    if not data or 'value' not in data:
        print(f"❌ No products found for {satellite} in {region}")
        return []

    products = data['value']
    print(f"✅ Found {len(products)} products for {satellite} in {region}")
    return products, satellite, region
