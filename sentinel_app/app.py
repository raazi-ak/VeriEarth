from fetcher import fetch_and_return_products
from parser import process_csv
import pandas as pd
import subprocess

def run_app():
    try:
        products, satellite, region = fetch_and_return_products()

        if not products:
            print("⚠️ No products available, nothing to process.")
            return

        print(f"🎉 Ready to process {len(products)} products for {satellite} - {region}")

        # Save initial CSV
        csv_filename = f"{satellite}_{region.replace(' ', '_')}_products.csv"
        df = pd.DataFrame(products)
        df.to_csv(csv_filename, index=False)

        print(f"📂 Initial product list saved as: {csv_filename}")

        # Pass to parser for filtering
        filtered_csv = process_csv(csv_filename)

        if filtered_csv:
            print(f"🚀 Launching downloader with filtered CSV: {filtered_csv}")
            subprocess.run(["python", "downloader.py", filtered_csv])

    except Exception as e:
        print(f"💥 Error during processing: {e}")

if __name__ == "__main__":
    run_app()
