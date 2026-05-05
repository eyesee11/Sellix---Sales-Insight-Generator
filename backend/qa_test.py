import asyncio
import os
from dotenv import load_dotenv

load_dotenv('.env')

from app.file_parser import parse_file
from app.ai_service import generate_summary
from app.email_service import send_email

async def main():
    try:
        print('1. Reading file...')
        with open('../sales_q1_2026.csv', 'rb') as f:
            content = f.read()
        
        print('2. Parsing file...')
        stats = parse_file(content, 'sales_q1_2026.csv')
        print('Stats generated successfully.')
        
        print('\n3. Generating AI insight...')
        summary = generate_summary(stats)
        print('\n--- Generated Summary ---')
        print(summary)
        print('-------------------------\n')
        
        print('4. Sending email...')
        target_email = os.environ.get('SMTP_USER')
        await send_email(
            to=target_email,
            subject='QA Test: Sales Executive Summary',
            summary=summary
        )
        print('5. Email sent successfully to', target_email)
    except Exception as e:
        print('Error occurred:', e)

if __name__ == '__main__':
    asyncio.run(main())