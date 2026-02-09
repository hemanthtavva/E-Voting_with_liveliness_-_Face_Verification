# How to Run the Voting System

## Prerequisites
- Node.js (Frontend)
- Python 3.9+ (Backend)
- Webcam (for Face Verification)

## 1. Start the Backend Server
The backend handles API requests, face recognition, and blockchain operations.

```bash
cd backend
# Activate virtual environment if you have one
# source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 5001 --reload
```

Server will be running at `http://localhost:5001`.
Swagger Docs: `http://localhost:5001/docs`

## 2. Start the Frontend Application
The frontend provides the user interface for Voters and Admins.

```bash
cd frontend
npm install
npm run dev
```

Application will be running at `http://localhost:5173`.

## 3. Usage Guide

### Admin Setup (First Time)
1. Go to the Landing Page.
2. Click on the hidden/small "Admin Portal" button (or navigate to `/admin` if routing was standard, effectively you click the button).
3. Login using credentials in `backend/.env` (Default: `admin` / `admin123`).
4. **Register Voters**:
   - Go to "Register Voter".
   - Enter details (Name, Aadhaar, etc.).
   - Capture 3 photos of the voter.
   - Click Register. This creates a profile and face embedding.

### Voter Flow
1. Go to Landing Page.
2. Click "Start Voting Process".
3. **Authentication**: Enter Aadhaar number (OTP is simulated/bypassed for this demo).
4. **Face Verification**:
   - Follow instructions.
   - Camera will capture your face.
   - System verifies Liveness and matches with Registered Face.
5. **Voting**:
   - If verified, you will see candidates for your constituency.
   - Select a candidate.
   - Confirm and Submit.
6. **Confirmation**: You will receive a success message.

## Troubleshooting
- **Camera Issues**: Ensure browser permissions are allowed.
- **Backend Errors**: Check the terminal running the backend for logs.
- **Face Model**: Ensure `models/antispoofing_model.pth` exists if liveness fails (currently bypassed/mocked if missing).
