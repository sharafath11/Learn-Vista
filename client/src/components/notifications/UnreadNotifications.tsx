"use client";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { IUnreadNotificationsProps } from "@/src/types/sharedProps";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";

export const UnreadNotifications = ({
  notifications,
  markAsRead,
  variant = "dark",
}: IUnreadNotificationsProps) => {
  const unread = notifications
    .filter((n) => !n.isRead)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const itemBgClass =
    variant === "dark"
      ? "bg-zinc-700 hover:bg-zinc-600"
      : "bg-gray-100 hover:bg-gray-200";
  const itemTextClass = variant === "dark" ? "text-white" : "text-gray-900";
  const timeTextClass = variant === "dark" ? "text-gray-400" : "text-gray-500";

  const markAsReadButtonClass =
    variant === "dark"
      ? "text-gray-400 hover:text-emerald-400 hover:bg-zinc-600"
      : "text-gray-500 hover:text-emerald-600 hover:bg-gray-200";

  return (
    <div className="space-y-2">
  {unread.length === 0 ? (
    <p className={cn("text-sm text-center py-4", timeTextClass)}>
      No unread notifications.
    </p>
  ) : (
    unread.map((notification) => (
      <div
        key={notification.id}
        className={cn(
          "flex items-center justify-between p-3 rounded-lg transition-colors", 
          itemBgClass
        )}
      >
        <WithTooltip content={notification.message||""}>
          <div
            className="flex-1 cursor-pointer"
            onClick={() => markAsRead(notification.id)}
          >
            <p className={cn("text-sm font-medium", itemTextClass)}>
              {notification.message}
            </p>
            <WithTooltip content={new Date(notification.createdAt).toLocaleString()}>
              <p className={cn("text-xs", timeTextClass)}>
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </WithTooltip>
          </div>
        </WithTooltip>

        <div className="flex items-center gap-1">
          <WithTooltip content="Mark as read">
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
              className={cn("p-1 rounded-md", markAsReadButtonClass)}
            >
              <Check size={16} />
            </button>
          </WithTooltip>
        </div>
      </div>
    ))
  )}
</div>

  );
};
