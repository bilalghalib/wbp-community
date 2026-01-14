import pandas as pd
import json
import os

file_path = 'Research/Springboard Annual Survey.xlsx'

try:
    # Read all sheets
    xls = pd.ExcelFile(file_path)
    all_sheets = {}
    
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        # Convert to records to make it easy to read
        # Handling NaN to avoid JSON errors or confusion
        df = df.where(pd.notnull(df), None)
        all_sheets[sheet_name] = df.to_dict(orient='records')

    print(json.dumps(all_sheets, indent=2, default=str))

except Exception as e:
    print(f"Error reading excel file: {e}")
