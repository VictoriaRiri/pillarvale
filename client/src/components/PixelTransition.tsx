import * as React from 'react';

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  className?: string;
}

const PixelTransition = ({ 
  firstContent, 
  secondContent, 
  gridSize = 10, 
  className 
}: PixelTransitionProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className={`relative w-full h-full group overflow-hidden ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Layer 1: The "Front" (Visible by default) */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        {firstContent}
      </div>

      {/* Layer 2: The "Back" (Revealed on hover) */}
      <div className="absolute inset-0 z-0">
        {secondContent}
      </div>

      {/* The Pixel Overlay Grid */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none grid" 
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`, 
          gridTemplateRows: `repeat(${gridSize}, 1fr)` 
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div
            key={i}
            className="bg-white transition-all duration-300"
            style={{
              opacity: isHovered ? 0 : 0,
              transform: isHovered ? 'scale(0)' : 'scale(1)',
              transitionDelay: `${Math.random() * 0.4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PixelTransition;
