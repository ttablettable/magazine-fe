import type { TimelineIconName } from "./TimelineIcons";
import type { ActivityType } from "./activity.types";

export const ACTIVITY_META: Record<
  ActivityType,
  {
    icon: TimelineIconName;
    color: "green" | "yellow" | "purple" | "pink";
  }
> = {
  authored: { icon: "calendar", color: "green" },
  edited: { icon: "calendar", color: "yellow" },
  annotated: { icon: "handshake", color: "yellow" },
  moderated: { icon: "calendar", color: "yellow" },
  collaborated: { icon: "handshake", color: "pink" },
  subject: { icon: "image", color: "purple" },
  collected: { icon: "medal", color: "green" },
};
