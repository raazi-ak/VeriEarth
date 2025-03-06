import os
import sys
import requests
import pandas as pd
from dotenv import load_dotenv, set_key
from tqdm import tqdm
from time import sleep
from requests.exceptions import ConnectionError, Timeout, RequestException
from getpass import getpass

# Load tokens and credentials from .env
ENV_FILE = ".env"
load_dotenv(ENV_FILE)

# Fetch credentials and ask if missing
def get_or_ask_env_var(key, prompt, is_password=False):
    value = os.getenv(key)
    if not value:
        if is_password:
            value = getpass(f"🔑 {prompt}: ")
        else:
            value = input(f"🔑 {prompt}: ").strip()
        if value:
            set_key(ENV_FILE, key, value)
    return value

USERNAME = get_or_ask_env_var("COPERNICUS_USERNAME", "Enter your Copernicus username")
PASSWORD = get_or_ask_env_var("COPERNICUS_PASSWORD", "Enter your Copernicus password", is_password=True)
ACCESS_TOKEN = os.getenv("COPERNICUS_ACCESS_TOKEN")
REFRESH_TOKEN = os.getenv("COPERNICUS_REFRESH_TOKEN")

if not USERNAME or not PASSWORD:
    raise ValueError("❌ Missing essential credentials (username or password). Exiting.")


def fetch_new_tokens():
    """Authenticate and fetch new tokens (access + refresh), save to .env."""
    global ACCESS_TOKEN, REFRESH_TOKEN

    token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    payload = {
        "username": USERNAME,
        "password": PASSWORD,
        "grant_type": "password",
        "client_id": "cdse-public"
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(token_url, data=payload, headers=headers)
    response.raise_for_status()

    tokens = response.json()
    ACCESS_TOKEN = tokens['access_token']
    REFRESH_TOKEN = tokens.get('refresh_token')

    set_key(ENV_FILE, "COPERNICUS_ACCESS_TOKEN", ACCESS_TOKEN)
    set_key(ENV_FILE, "COPERNICUS_REFRESH_TOKEN", REFRESH_TOKEN)

    print("🔑 Tokens refreshed and saved to .env.")


# Initial token fetch if missing
if not ACCESS_TOKEN:
    print("🔄 No access token found. Fetching new tokens...")
    fetch_new_tokens()


def extract_product_ids_from_csv(csv_file):
    df = pd.read_csv(csv_file)
    if 'Id' not in df.columns:
        raise ValueError("❌ Error: No 'Id' column found in the CSV.")
    return df['Id'].tolist()


def create_session():
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {ACCESS_TOKEN}"})
    return session


def download_product(product_id, session, retries=3):
    """Download product and handle token refresh + resumption."""
    global ACCESS_TOKEN

    url = f"https://download.dataspace.copernicus.eu/odata/v1/Products({product_id})/$value"
    local_filename = f"product_{product_id}.zip"
    temp_filename = local_filename + ".part"

    def make_request():
        session.headers.update({"Authorization": f"Bearer {ACCESS_TOKEN}"})
        headers = {}
        if os.path.exists(temp_filename):
            resume_from = os.path.getsize(temp_filename)
            headers["Range"] = f"bytes={resume_from}-"
        return session.get(url, stream=True, headers=headers)

    for attempt in range(retries):
        try:
            response = make_request()

            if response.status_code == 401:  # Unauthorized - refresh token
                print(f"🔐 Token expired for {product_id}, refreshing token...")
                fetch_new_tokens()
                response = make_request()

            if response.status_code not in [200, 206]:
                print(f"❌ Failed to download {product_id} - Status: {response.status_code}")
                return False

            total_size = int(response.headers.get('content-length', 0)) + os.path.getsize(temp_filename) if os.path.exists(temp_filename) else int(response.headers.get('content-length', 0))

            mode = 'ab' if os.path.exists(temp_filename) else 'wb'
            with open(temp_filename, mode) as file, tqdm(
                total=total_size,
                initial=os.path.getsize(temp_filename) if os.path.exists(temp_filename) else 0,
                unit='B',
                unit_scale=True,
                unit_divisor=1024,
                desc=f"📥 {product_id}",
                ascii=True,
                ncols=100,
                dynamic_ncols=True,
                leave=True
            ) as progress:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
                    progress.update(len(chunk))

            os.rename(temp_filename, local_filename)
            print(f"✅ Downloaded: {local_filename}")
            return True

        except (ConnectionError, Timeout) as e:
            print(f"⚠️ Network error: {e}. Retrying in 5 seconds...")
            sleep(5)
        except RequestException as e:
            print(f"❌ Critical error during download: {e}")
            return False

    print(f"❌ Exhausted retries for {product_id}")
    return False


def download_from_csv(filtered_csv):
    print(f"🚀 Starting downloads from filtered file: {filtered_csv}")

    product_ids = extract_product_ids_from_csv(filtered_csv)
    print(f"📥 Found {len(product_ids)} products to download.")

    session = create_session()

    successful_downloads = 0
    failed_downloads = []

    for idx, product_id in enumerate(product_ids, start=1):
        print(f"\n📄 [{idx}/{len(product_ids)}] Downloading product ID: {product_id} ({len(product_ids) - idx} left)")
        success = download_product(product_id, session)

        if success:
            successful_downloads += 1
        else:
            failed_downloads.append(product_id)

    print("\n🎉 Download process complete.")
    print(f"✅ Successful downloads: {successful_downloads}/{len(product_ids)}")
    if failed_downloads:
        print(f"❌ Failed downloads ({len(failed_downloads)}): {', '.join(failed_downloads)}")


def select_csv_file():
    """Get CSV from argument or fallback to file picker (for local/manual runs)."""
    if len(sys.argv) > 1:
        return sys.argv[1]
    else:
        from tkinter import Tk, filedialog
        root = Tk()
        root.withdraw()
        file_path = filedialog.askopenfilename(title="Select CSV file", filetypes=[("CSV Files", "*.csv")])
        if not file_path:
            print("❌ No file selected. Exiting.")
            sys.exit(1)
        return file_path


if __name__ == "__main__":
    csv_file = select_csv_file()
    download_from_csv(csv_file)
