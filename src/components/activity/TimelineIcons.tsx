import React from "react";
import Icon from "../ui/Icon";

export type TimelineIconName = "calendar" | "handshake" | "image" | "medal";

type TimelineIconColor = "green" | "yellow" | "purple" | "pink";

const colorVar: Record<TimelineIconColor, string> = {
  green: "var(--green)",
  yellow: "var(--highlight-yellow)",
  purple: "var(--purple)",
  pink: "var(--pink)",
};

interface TimelineIconsProps {
  name: TimelineIconName;
  color: TimelineIconColor;
  size?: number;
}

const TimelineIcons: React.FC<TimelineIconsProps> = ({ name, color, size = 25 }) => {
  return (
    <div style={{ color: colorVar[color] }}>
      <Icon name={name} size={size} />
    </div>
  );
};

export default TimelineIcons;
