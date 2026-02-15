import { useEffect, useState } from 'react';

const BlobCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div 
      className="blob-cursor"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    />
  );
};

export default BlobCursor;