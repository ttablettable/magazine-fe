"use client";

import NotifPop from "./NotifPop";
import { Noti } from "@/hooks/useNotifications";

export default function NotificationHost({
  notis,
  remove,
}: {
  notis: Noti[];
  remove: (id: string) => void;
}) {
  return (
    <>
      {notis.map((n) => (
        <NotifPop key={n.id} {...n} onClose={remove} />
      ))}
    </>
  );
}
