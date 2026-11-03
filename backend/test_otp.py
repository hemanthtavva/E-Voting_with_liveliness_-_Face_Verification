"""
Test OTP sending to diagnose the error
"""
import json
from pathlib import Path
from services.otp_service import OTPService

# Load a voter's phone number
voters_file = Path(__file__).parent.parent / "data" / "voters.json"

with open(voters_file, 'r') as f:
    voters = json.load(f)

# Get first voter
aadhaar = "624316839998"
voter = voters.get(aadhaar)

if voter:
    phone = voter.get('phone_number')
    print(f"Testing OTP for Aadhaar: {aadhaar}")
    print(f"Phone: {phone}")
    
    # Ensure E.164 format
    if not phone.startswith('+'):
        phone = '+91' + phone
    
    print(f"Formatted phone: {phone}")
    
    # Try to send OTP
    otp_service = OTPService()
    print("\nSending OTP...")
    
    try:
        result = otp_service.send_otp(phone, aadhaar)
        print(f"Result: {result}")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"Voter {aadhaar} not found")
