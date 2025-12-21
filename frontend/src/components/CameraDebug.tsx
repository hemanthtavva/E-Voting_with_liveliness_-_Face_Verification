import React, { useState, useRef } from 'react';

const CameraDebug: React.FC = () => {
  const [status, setStatus] = useState('Not started');
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const testCamera = async () => {
    try {
      setStatus('Requesting camera access...');
      setError('');
      
      // Check if video element exists
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }
      
      setStatus('Video element found, requesting camera...');
      
      const constraints = {
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStatus('Camera access granted, setting up video...');
      
      const video = videoRef.current;
      
      video.onloadedmetadata = () => {
        setStatus(`Video metadata loaded - ${video.videoWidth}x${video.videoHeight}`);
        video.play()
          .then(() => setStatus('Video playing successfully!'))
          .catch(err => setError(`Play error: ${err.message}`));
      };
      
      video.onerror = (err) => {
        setError(`Video error: ${err}`);
      };
      
      video.srcObject = mediaStream;
      setStream(mediaStream);
      
    } catch (err) {
      console.error('Camera test error:', err);
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus('Camera stopped');
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Camera Debug Test</h2>
      
      <div className="mb-4">
        <p className="text-sm font-medium">Status: <span className="text-blue-600">{status}</span></p>
        {error && <p className="text-sm text-red-600 mt-1">Error: {error}</p>}
      </div>
      
      <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-48 bg-gray-200 rounded"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={testCamera}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Test Camera
        </button>
        <button
          onClick={stopCamera}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
};

export default CameraDebug;
