
import React, { useEffect, useState } from 'react';

interface Blob {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const AnimatedBackground: React.FC = () => {
  const [blobs, setBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    const colors = [
      'rgba(14, 165, 233, 0.3)',   // ntru-primary
      'rgba(51, 195, 240, 0.2)',   // ntru-secondary
      'rgba(211, 228, 253, 0.25)'  // ntru-accent
    ];

    const newBlobs = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 150 + Math.random() * 200,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setBlobs(newBlobs);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="blob animate-float"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            background: blob.color,
            animationDelay: `${blob.id * 0.8}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
