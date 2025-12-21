# Voter Verification System

A secure, real-time voter verification system with face recognition and liveness detection.

## 📁 Project Structure

```
project_final/
├── frontend/              # React + TypeScript frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
│
├── backend/              # Python backend
│   ├── preprocessing/    # Face detection & alignment
│   ├── config.py        # Configuration
│   ├── requirements.txt # Python dependencies
│   └── venv/            # Virtual environment
│
├── docs/                # Documentation
│
└── .gitignore          # Git ignore rules
```

## 🚀 Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons

### Backend
- Python 3.11+
- PyTorch
- OpenCV
- MTCNN (Face Detection)
- MediaPipe

## 📋 Current Status

**Completed:**
- ✅ Project structure setup
- ✅ Frontend UI components
- ✅ Face detection (MTCNN)
- ✅ Face alignment
- ✅ Frame extraction

**In Progress:**
- 🔄 Liveness detection
- 🔄 Face recognition
- 🔄 Backend API

**Planned:**
- ⏳ End-to-end verification pipeline
- ⏳ Database integration
- ⏳ Deployment

## 📝 License

Private project for educational purposes.
