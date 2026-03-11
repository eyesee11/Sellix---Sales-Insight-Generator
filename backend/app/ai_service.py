import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

_client = Groq(api_key=os.environ["GROQ_API_KEY"])
_MODEL = "llama-3.3-70b-versatile"


def _safe(val) -> str:
    return str(val).replace("\n", " ").replace("\r", " ")[:200]


def generate_summary(stats: dict) -> str:
    region_lines = "\n".join(
        f"  - {_safe(r)}: ${v:,.2f}" for r, v in stats["region_breakdown"].items()
    )
    category_lines = "\n".join(
        f"  - {_safe(c)}: ${v:,.2f}" for c, v in stats["category_breakdown"].items()
    )
    status_lines = "\n".join(
        f"  - {_safe(s)}: {n} orders" for s, n in stats["status_breakdown"].items()
    )

    prompt = f"""You are a senior business analyst writing an executive summary for a C-suite audience.

Sales data snapshot ({_safe(stats['date_range'])}, {stats['row_count']} records):

Overall:
  - Total Revenue: ${stats['total_revenue']:,.2f}
  - Total Units Sold: {stats['total_units']:,}

Revenue by Region:
{region_lines}

Revenue by Category:
{category_lines}

Order Status:
{status_lines}

Top Performer: {_safe(stats['top_region'])} region (${stats['top_region_revenue']:,.2f}), \
{_safe(stats['top_category'])} category (${stats['top_category_revenue']:,.2f})

Write a polished 3-4 paragraph executive summary. Lead with the headline number, highlight regional \
and category standouts, flag any operational concerns (e.g. cancellations), and close with a brief \
forward-looking remark. Use exact figures. Keep the tone confident and data-driven — no filler phrases."""

    response = _client.chat.completions.create(
        model=_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=600,
    )
    return response.choices[0].message.content
