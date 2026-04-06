import { X, Check } from 'lucide-react'
import clsx from 'clsx'
import NoTasks from './NoTasks'

export interface NotificationItem {
  id: string
  title: string
  description: string
  createdAt: string
  read: boolean
}

interface NotificationsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notifications: NotificationItem[]
  unreadCount: number
  onMarkAllAsRead: () => void
  onNotificationRead: (id: string) => void
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date().getTime()
  const createdAt = new Date(dateString).getTime()
  const diffInSeconds = Math.floor((now - createdAt) / 1000)

  if (diffInSeconds < 60) return 'Just now'

  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo`

  const years = Math.floor(days / 365)
  return `${years}y`
}

const NotificationsDrawer = ({
  open,
  onOpenChange,
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onNotificationRead,
}: NotificationsDrawerProps) => {
  const handleNotificationClick = (notification: NotificationItem) => {
    onNotificationRead(notification.id)
  }

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-end transition-colors duration-300',
        open ? 'pointer-events-auto bg-black/20' : 'pointer-events-none bg-black/0',
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-[26px] leading-none font-semibold text-[#151718]">Notifications</h2>
            <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#F1F3F5] px-2 text-[16px] font-semibold text-[#151718]">
              {unreadCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#151718] transition hover:bg-[#F1F3F5]"
            aria-label="Close"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {notifications.length === 0 ? (
            <div className="min-h-full">
              <NoTasks />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end px-6 py-5">
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="flex cursor-pointer items-center gap-1 text-[14px] text-[#0047BA] transition hover:opacity-70"
                >
                  <Check className="h-4.5 w-4.5" />
                  Mark all as read
                </button>
              </div>

              <div className="relative flex flex-col">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={clsx(
                        'relative px-8 py-4',
                        !notification.read ? 'bg-[#ECEDED]' : 'bg-white',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="flex w-full items-start gap-4 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="truncate text-[16px] leading-[1.25] font-semibold text-[#151718]">
                              {notification.title}
                            </h4>

                            <div className="flex shrink-0 items-center gap-2 pt-[1px]">
                              <span className="text-[14px] font-normal text-[#8D959E]">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                          </div>

                          <p className="pt-2 text-[14px] leading-[1.4] text-[#8D959E]">
                            {notification.description}
                          </p>
                        </div>
                      </button>
                      {!notification.read && (
                        <span className="absolute top-4 right-5 h-2 w-2 rounded-full bg-[#E5484D]" />
                      )}
                    </div>

                    {index !== notifications.length - 1 && (
                      <div className="border-t border-[#DFE3E6]" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsDrawer
