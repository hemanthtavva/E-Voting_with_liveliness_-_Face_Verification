import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import IndianFlagVotingLogo from './IndianFlagVotingLogo';

interface FaceVerificationPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

const FaceVerificationPage: React.FC<FaceVerificationPageProps> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState<'instructions' | 'capture' | 'processing'>('instructions');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [cameraReady, setCameraReady] = useState(false);
  const [videoElementReady, setVideoElementReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
  }, [stream]);

  // Effect to handle step changes and ensure video element is ready
  useEffect(() => {
    if (step === 'capture' && videoRef.current) {
      console.log('Video element is now available in DOM');
      setVideoElementReady(true);
    } else {
      setVideoElementReady(false);
    }
  }, [step]);

  // Effect to start camera when video element becomes ready
  useEffect(() => {
    if (videoElementReady && step === 'capture' && !stream) {
      console.log('Starting camera automatically...');
      startCamera();
    }
  }, [videoElementReady, step, stream]);

  const startCamera = async () => {
    try {
      setError('');
      setCameraReady(false);
      console.log('Requesting camera access...');
      
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      // Check if video element is available
      if (!videoRef.current) {
        console.error('Video element not found in DOM');
        setError('Camera interface not ready. Please try again in a moment.');
        return;
      }
      
      const constraints = {
        video: { 
          width: { ideal: 640, min: 320, max: 1280 }, 
          height: { ideal: 480, min: 240, max: 720 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted');
      
      // Double check video element is still available
      if (videoRef.current) {
        // Set up event handlers before assigning the stream
        const video = videoRef.current;
        
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
          
          // Ensure video has valid dimensions
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            video.play()
              .then(() => {
                console.log('Video playing successfully');
                setCameraReady(true);
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setError('Failed to start video playback. Please try again.');
              });
          } else {
            console.error('Invalid video dimensions');
            setError('Camera initialization failed. Please try again.');
          }
        };

        const handleError = (err: any) => {
          console.error('Video error:', err);
          setError('Video playback error occurred.');
        };

        const handleCanPlay = () => {
          console.log('Video can play');
        };

        // Remove existing event listeners
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
        video.removeEventListener('canplay', handleCanPlay);
        
        // Add event listeners
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
        video.addEventListener('canplay', handleCanPlay);
        
        // Assign the stream
        video.srcObject = mediaStream;
        setStream(mediaStream);
        
        // Force load if needed
        video.load();
      } else {
        // Clean up the stream if video element is not available
        mediaStream.getTracks().forEach(track => track.stop());
        throw new Error('Video element became unavailable during setup');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = 'Unable to access camera. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions in your browser and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (err.name === 'NotReadableError') {
          errorMessage += 'Camera is being used by another application. Please close other camera apps and try again.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage += 'Camera does not support the required settings.';
        } else if (err.message.includes('Video element')) {
          errorMessage += 'Camera interface not ready. Please wait a moment and try again.';
        } else {
          errorMessage += `Error: ${err.message}. Please check permissions and try again.`;
        }
      }
      
      setError(errorMessage);
      setStep('instructions');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) {
      setError('Camera not ready. Please wait for the camera to load and try again.');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    // Ensure video is playing and has valid dimensions
    if (!context) {
      setError('Canvas not available for image capture.');
      return;
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Video dimensions not available. Please ensure camera is working.');
      return;
    }
    
    try {
      console.log('Capturing photo with dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save the current transform
      context.save();
      
      // Flip horizontally for mirror effect (like a selfie)
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      
      // Restore the transform
      context.restore();
      
      // Get the image data URL with good quality
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Validate the captured image
      if (imageDataUrl && imageDataUrl.length > 1000) { // Basic validation
        setCapturedImage(imageDataUrl);
        console.log('Photo captured successfully, size:', imageDataUrl.length, 'bytes');
        
        // Stop the video stream
        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
            console.log('Camera track stopped');
          });
          setStream(null);
        }
        
        setCameraReady(false);
        setStep('processing');
        
        // Simulate face verification processing
        setTimeout(() => {
          setSuccess(true);
          
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }, 3000);
      } else {
        throw new Error('Failed to generate image data');
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Unable to capture image. Please ensure the camera is working properly and try again.');
    }
  };

  const retakePhoto = () => {
    console.log('Retaking photo - cleaning up...');
    setCapturedImage('');
    setCameraReady(false);
    setStep('instructions');
    setSuccess(false);
    setError('');
    
    // Clean up video stream
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped during retake');
      });
      setStream(null);
    }
    
    // Clean up video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2 rounded-t-lg"></div>
          <div className="bg-white rounded-b-lg shadow-xl p-8 text-center">
            {success ? (
              <>
                <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Face Verified Successfully!</h2>
                <p className="text-gray-600 mb-6">Identity confirmed. Redirecting to voting page...</p>
                {capturedImage && (
                  <div className="mb-4">
                    <img 
                      src={capturedImage} 
                      alt="Captured face" 
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-green-500"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-blue-100 p-4 rounded-full inline-block mb-6">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Your Identity</h2>
                <p className="text-gray-600 mb-6">Please wait while we process your verification...</p>
                {capturedImage && (
                  <div className="mb-4">
                    <img 
                      src={capturedImage} 
                      alt="Captured face" 
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-500"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2 rounded-t-lg"></div>
        <div className="bg-white rounded-b-lg shadow-xl p-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-green-600 p-3 rounded-full">
                {step === 'instructions' ? (
                  <IndianFlagVotingLogo size="md" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Face Verification
            </h1>
            <p className="text-gray-600 text-center">
              {step === 'instructions' 
                ? 'Secure your vote with biometric verification'
                : 'Position your face in the frame and click capture'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {step === 'instructions' ? (
            <div>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 mb-2">Tips for successful verification:</h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Ensure proper lighting on your face</li>
                      <li>• Face the camera directly</li>
                      <li>• Remove sunglasses or face coverings</li>
                      <li>• Keep a neutral expression</li>
                      <li>• Stay still during capture</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setError('');
                  setStep('capture');
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Start Camera
              </button>
            </div>
          ) : (
            <div>
              <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect for selfie
                  onLoadedMetadata={() => console.log('Video metadata loaded event')}
                  onCanPlay={() => console.log('Video can play event')}
                  onPlay={() => console.log('Video play event')}
                  onError={(e) => console.error('Video element error:', e)}
                />
                {!cameraReady && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm">Initializing camera...</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-lg m-4"></div>
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm text-center">
                    {cameraReady ? 'Position your face within the frame' : 'Loading camera...'}
                  </div>
                </div>
                {/* Face outline guide */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-48 border-2 border-green-400 rounded-full opacity-50"></div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                >
                  {cameraReady ? 'Capture Photo' : 'Loading...'}
                </button>
                <button
                  onClick={retakePhoto}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default FaceVerificationPage;