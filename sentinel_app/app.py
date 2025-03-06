from fetcher import fetch_and_return_products
from parser import process_csv
import pandas as pd
import subprocess
import shlex

def run_app():
    try:
        result = fetch_and_return_products()
        if not isinstance(result, (list, tuple)) or len(result) != 3:
            raise ValueError("Unexpected data structure returned from fetch_and_return_products()")

        products, satellite, region = result

        if not products:
            print("⚠️ No products available, nothing to process.")
            return

        print(f"📡 Fetched {len(products)} products for satellite '{satellite}' in region '{region}'")

        csv_filename = f"{satellite}_{region.replace(' ', '_')}_products.csv"
        df = pd.DataFrame(products)
        df.to_csv(csv_filename, index=False)

        print(f"📂 Initial product list saved as: {csv_filename}")

        filtered_csv = process_csv(csv_filename)

        if filtered_csv:
            print(f"🚀 Launching downloader with filtered CSV: {filtered_csv}")
            subprocess.run(["python", "downloader.py", shlex.quote(filtered_csv)])
        else:
            print("⚠️ No filtered CSV was generated — skipping download.")

    except Exception as e:
        print(f"💥 Error during processing: {e}")

if __name__ == "__main__":
    run_app()
