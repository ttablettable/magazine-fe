import React from "react";

export type TimelineIconName =
  | "calendar"
  | "handshake"
  | "image"
  | "medal";

interface TimelineIconsProps {
  name: TimelineIconName;
  color?: string;
  size?: number;
}

const TimelineIcons: React.FC<TimelineIconsProps> = ({
  name,
  color = "#111",
  size = 25,
}) => {
  const iconPath = `/timeline/${name}.svg`;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "inline-block",
      }}
    >
      <img
        src={iconPath}
        alt={`${name} icon`}
        style={{
          width: "100%",
          height: "100%",
          filter: color
            ? `invert(1) sepia(1) saturate(5) hue-rotate(200deg) brightness(1) ${color}`
            : undefined,
        }}
      />
    </div>
  );
};

export default TimelineIcons;
