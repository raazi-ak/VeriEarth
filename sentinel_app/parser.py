import tkinter as tk
from tkinter import messagebox, simpledialog
import os
import shutil
import pandas as pd

def detect_satellite_type(df):
    if '@odata.mediaContentType' in df.columns and 'Name' in df.columns:
        sample_name = df['Name'].iloc[0]
        if sample_name.startswith('S1'):
            return 'Sentinel-1'
        elif sample_name.startswith('S5P'):
            return 'Sentinel-5P'
    raise ValueError("Unable to detect satellite type from data. Check file format.")

def parse_sentinel1_type(name):
    parts = name.split('_')
    if len(parts) > 2:
        return parts[2]
    return 'UNKNOWN'

def parse_sentinel5p_type(name):
    parts = name.split('_')
    if len(parts) > 4:
        return parts[4]
    return 'UNKNOWN'

def gui_user_select_types(options):
    root = tk.Tk()
    root.withdraw()

    selected = []
    for option in options:
        if messagebox.askyesno("Select Data Type", f"Include data of type '{option}'?"):
            selected.append(option)
    return selected

def cli_user_select_types(options):
    print("\nAvailable data types:")
    for idx, option in enumerate(options, 1):
        print(f"{idx}. {option}")

    selected = []
    print("Enter the numbers of the types you want to include, separated by commas (e.g., 1,3):")
    choice = input("> ").strip()
    selected_indices = [int(i) - 1 for i in choice.split(",") if i.strip().isdigit()]

    for idx in selected_indices:
        if 0 <= idx < len(options):
            selected.append(options[idx])

    return selected

def user_select_types(options):
    try:
        return gui_user_select_types(options)
    except (tk.TclError, RuntimeError):
        print("⚠️ GUI not available, falling back to CLI mode.")
        return cli_user_select_types(list(options))

def filter_and_save_file(original_path, df, selected_types, satellite_type):
    folder_name = os.path.splitext(os.path.basename(original_path))[0] + "_filtered"
    os.makedirs(folder_name, exist_ok=True)

    if satellite_type == 'Sentinel-1':
        filtered_df = df[df['Name'].apply(lambda x: parse_sentinel1_type(x) in selected_types)]
    elif satellite_type == 'Sentinel-5P':
        filtered_df = df[df['Name'].apply(lambda x: any(t in x for t in selected_types))]
    else:
        raise ValueError("Unsupported satellite type")

    filtered_csv_path = os.path.join(folder_name, "filtered_data.csv")
    original_csv_path = os.path.join(folder_name, os.path.basename(original_path))

    filtered_df.to_csv(filtered_csv_path, index=False)
    shutil.copy(original_path, original_csv_path)

    try:
        messagebox.showinfo("Success", f"Filtered data saved to: {filtered_csv_path}\nOriginal CSV also copied to: {original_csv_path}")
    except (tk.TclError, RuntimeError):
        print(f"✅ Filtered data saved to: {filtered_csv_path}")
        print(f"📂 Original CSV also copied to: {original_csv_path}")

def process_csv(file_path):
    """Main entry point to process the CSV after fetching."""
    df = pd.read_csv(file_path)

    try:
        satellite_type = detect_satellite_type(df)
    except ValueError as e:
        try:
            messagebox.showerror("Error", str(e))
        except (tk.TclError, RuntimeError):
            print(f"❌ Error: {e}")
        return None

    try:
        messagebox.showinfo("Satellite Detected", f"Detected: {satellite_type}")
    except (tk.TclError, RuntimeError):
        print(f"🔎 Detected Satellite: {satellite_type}")

    if satellite_type == 'Sentinel-1':
        types = set(df['Name'].apply(parse_sentinel1_type))
    elif satellite_type == 'Sentinel-5P':
        types = set(parse_sentinel5p_type(name) for name in df['Name'])
    else:
        try:
            messagebox.showerror("Error", "Unrecognized satellite type.")
        except (tk.TclError, RuntimeError):
            print("❌ Error: Unrecognized satellite type.")
        return None

    if not types:
        try:
            messagebox.showerror("Error", "No valid types found in file.")
        except (tk.TclError, RuntimeError):
            print("❌ Error: No valid types found in file.")
        return None

    selected_types = user_select_types(types)

    if not selected_types:
        try:
            messagebox.showwarning("No Types Selected", "No types were selected. No file will be saved.")
        except (tk.TclError, RuntimeError):
            print("⚠️ Warning: No types selected. No file will be saved.")
        return None

    folder_name = os.path.splitext(os.path.basename(file_path))[0] + "_filtered"
    os.makedirs(folder_name, exist_ok=True)

    if satellite_type == 'Sentinel-1':
        filtered_df = df[df['Name'].apply(lambda x: parse_sentinel1_type(x) in selected_types)]
    elif satellite_type == 'Sentinel-5P':
        filtered_df = df[df['Name'].apply(lambda x: any(t in x for t in selected_types))]
    else:
        raise ValueError("Unsupported satellite type")

    filtered_csv_path = os.path.join(folder_name, "filtered_data.csv")
    original_csv_path = os.path.join(folder_name, os.path.basename(file_path))

    filtered_df.to_csv(filtered_csv_path, index=False)
    shutil.copy(file_path, original_csv_path)

    try:
        messagebox.showinfo("Success", f"Filtered data saved to: {filtered_csv_path}\nOriginal CSV also copied to: {original_csv_path}")
    except (tk.TclError, RuntimeError):
        print(f"✅ Filtered data saved to: {filtered_csv_path}")
        print(f"📂 Original CSV also copied to: {original_csv_path}")

    return filtered_csv_path  # <--- Return the filtered file path
