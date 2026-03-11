import pandas as pd
from io import BytesIO


def parse_file(content: bytes, filename: str) -> dict:
    buf = BytesIO(content)
    df = pd.read_csv(buf) if filename.lower().endswith(".csv") else pd.read_excel(buf)

    region_rev = df.groupby("Region")["Revenue"].sum()
    category_rev = df.groupby("Product_Category")["Revenue"].sum()

    return {
        "total_revenue": float(df["Revenue"].sum()),
        "total_units": int(df["Units_Sold"].sum()),
        "top_region": str(region_rev.idxmax()),
        "top_region_revenue": float(region_rev.max()),
        "top_category": str(category_rev.idxmax()),
        "top_category_revenue": float(category_rev.max()),
        "status_breakdown": df["Status"].value_counts().to_dict(),
        "region_breakdown": region_rev.to_dict(),
        "category_breakdown": category_rev.to_dict(),
        "date_range": f"{df['Date'].min()} to {df['Date'].max()}",
        "row_count": len(df),
    }
