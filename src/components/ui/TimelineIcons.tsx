import React from 'react';

interface TimelineIconsProps {
  name: 'calendar' | 'handshake' | 'image' | 'medal'; 
  color?: string; 
  size?: number; // Optional: Define the size (defaults to 24px)
}

const TimelineIcons: React.FC<TimelineIconsProps> = ({ name, color = '#000', size = 50 }) => {
  const iconPath = `/timeline/${name}.svg`;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
      }}
    >
      <img
        src={iconPath}
        alt={`${name} icon`}
        style={{
          width: '100%',
          height: '100%',
          filter: color ? `invert(1) sepia(1) saturate(5) hue-rotate(200deg) brightness(1) ${color}` : '',
        }}
      />
    </div>
  );
};

export default TimelineIcons;
