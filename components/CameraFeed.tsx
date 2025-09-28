import React, { useEffect, useState, RefObject } from 'react';

interface CameraFeedProps {
  videoRef: RefObject<HTMLVideoElement>;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ videoRef }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const enableStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        if (err instanceof Error) {
            setError(`Error accessing camera: ${err.message}. Please enable camera permissions in your browser.`);
        } else {
            setError("An unknown error occurred while accessing the camera.");
        }
      }
    };

    enableStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black p-4">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover transform scale-x-[-1]"
    />
  );
};

export default CameraFeed;
