import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthenticationPage from './components/AuthenticationPage';
import FaceVerificationPage from './components/FaceVerificationPage';
import VotingPage from './components/VotingPage';
import ConfirmationPage from './components/ConfirmationPage';
import CameraDebug from './components/CameraDebug';

type PageType = 'landing' | 'auth' | 'face-verification' | 'voting' | 'confirmation' | 'camera-debug';

interface UserData {
  aadhaar: string;
  otpVerified: boolean;
  faceVerified: boolean;
  hasVoted: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [userData, setUserData] = useState<UserData>({
    aadhaar: '',
    otpVerified: false,
    faceVerified: false,
    hasVoted: false
  });

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onStart={() => navigateToPage('auth')}
            onDebug={() => navigateToPage('camera-debug')}
          />
        );
      case 'auth':
        return (
          <AuthenticationPage
            onSuccess={(aadhaar) => {
              updateUserData({ aadhaar, otpVerified: true });
              navigateToPage('face-verification');
            }}
            onBack={() => navigateToPage('landing')}
          />
        );
      case 'face-verification':
        return (
          <FaceVerificationPage
            onSuccess={() => {
              updateUserData({ faceVerified: true });
              navigateToPage('voting');
            }}
            onBack={() => navigateToPage('auth')}
          />
        );
      case 'voting':
        return (
          <VotingPage
            onVoteSubmit={() => {
              updateUserData({ hasVoted: true });
              navigateToPage('confirmation');
            }}
            onBack={() => navigateToPage('face-verification')}
          />
        );
      case 'confirmation':
        return <ConfirmationPage onRestart={() => {
          setUserData({
            aadhaar: '',
            otpVerified: false,
            faceVerified: false,
            hasVoted: false
          });
          navigateToPage('landing');
        }} />;
      case 'camera-debug':
        return (
          <div className="p-4">
            <button 
              onClick={() => navigateToPage('landing')}
              className="mb-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back to App
            </button>
            <CameraDebug />
          </div>
        );
      default:
        return <LandingPage onStart={() => navigateToPage('auth')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {renderCurrentPage()}
    </div>
  );
}

export default App;