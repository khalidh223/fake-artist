import React, { useRef, useEffect } from 'react';

interface CanvasImageDisplayProps {
  imageDataUrl: string;
}

const CanvasImageDisplay: React.FC<CanvasImageDisplayProps> = ({ imageDataUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const image = new Image();

      image.onload = () => {
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
      };

      image.src = imageDataUrl;
    }
  }, [imageDataUrl]);

  return (
    <canvas ref={canvasRef} width="460" height="600" />
  );
};

export default CanvasImageDisplay;
