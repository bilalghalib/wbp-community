import pandas as pd
import json
import os

file_path = 'Research/Springboard Annual Survey.xlsx'
output_path = 'utils/constants/taxonomies.ts'

def clean_value(val):
    if pd.isna(val) or val == "" or val is None:
        return None
    return str(val).strip()

try:
    xls = pd.ExcelFile(file_path)
    
    # --- Process TWP Taxonomy ---
    df_tax = pd.read_excel(xls, sheet_name='TWP Taxonomy', header=0)
    
    # The columns in df_tax are currently "Organziation", "Unnamed: 1", etc.
    # The first row of data (df_tax.iloc[0]) contains the REAL names we want ("Type of Registration", etc.)
    
    real_headers = df_tax.iloc[0]
    taxonomies = {}
    
    # Iterate over columns
    for col in df_tax.columns:
        header_name = real_headers[col]
        if pd.isna(header_name):
            continue
            
        # Get all values from row 1 onwards, drop NA
        values = df_tax[col].iloc[1:].dropna().unique().tolist()
        # Clean values
        clean_values = [clean_value(v) for v in values if clean_value(v)]
        if clean_values:
            taxonomies[header_name] = sorted(clean_values)

    # --- Process Other (Mappings) ---
    df_other_raw = pd.read_excel(xls, sheet_name='Other', header=None)
    
    # Row 0 is title: "Country - Continent Relationship" ... "Country - Region relationship"
    # Row 1 is header: "Country" "Continent" ... "Country" "Region"
    # Data starts row 2.
    
    country_region_map = {}
    country_continent_map = {}
    
    # Col indices (0-based)
    c_cont_country_idx = 0
    c_cont_continent_idx = 1
    
    c_reg_country_idx = 3
    c_reg_region_idx = 4
    
    for index, row in df_other_raw.iterrows():
        if index < 2: continue # Skip title and header rows
        
        # Continent Map
        ctry = clean_value(row[c_cont_country_idx])
        cont = clean_value(row[c_cont_continent_idx])
        if ctry and cont:
            country_continent_map[ctry] = cont
            
        # Region Map
        ctry_reg = clean_value(row[c_reg_country_idx])
        reg = clean_value(row[c_reg_region_idx])
        if ctry_reg and reg:
            country_region_map[ctry_reg] = reg

    # Generate TypeScript Content
    ts_content = "// This file is auto-generated from 'Springboard Annual Survey.xlsx'\n\n"
    
    # 1. Taxonomies
    ts_content += "export const TAXONOMIES = {\n"
    for key, values in taxonomies.items():
        # Sanitize key for JS variable name if needed, but string key is safer
        safe_key = key.replace('"', '\\"').strip()
        ts_content += f'  "{safe_key}": [\n'
        for v in values:
            safe_val = v.replace("\"", "\\\"")
            ts_content += f'    "{safe_val}",\n'
        ts_content += "  ],\n"
    ts_content += "} as const;\n\n"
    
    # 2. Mappings
    ts_content += "export const COUNTRY_TO_REGION: Record<string, string> = {\n"
    for k, v in sorted(country_region_map.items()):
        safe_k = k.replace("\"", "\\\"")
        safe_v = v.replace("\"", "\\\"")
        ts_content += f'  "{safe_k}": "{safe_v}",\n'
    ts_content += "};\n\n"
    
    ts_content += "export const COUNTRY_TO_CONTINENT: Record<string, string> = {\n"
    for k, v in sorted(country_continent_map.items()):
        safe_k = k.replace("\"", "\\\"")
        safe_v = v.replace("\"", "\\\"")
        ts_content += f'  "{safe_k}": "{safe_v}",\n'
    ts_content += "};\n"
    
    # Write to file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(ts_content)
        
    print(f"Successfully generated {output_path}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()