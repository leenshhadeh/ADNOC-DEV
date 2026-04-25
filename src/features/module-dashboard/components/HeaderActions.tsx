import { useMemo, useState } from 'react'
import { Bell } from 'lucide-react'
import NotificationsDrawer, { type NotificationItem } from './NotificationsDrawer'

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Assessment submitted',
    description: 'Your chamber benchmarking assessment was submitted successfully.',
    createdAt: '2026-04-05T10:15:00.000Z',
    read: false,
  },
  {
    id: '2',
    title: 'Case study approved',
    description: 'Your case study has been approved and published.',
    createdAt: '2026-04-05T08:30:00.000Z',
    read: false,
  },
  {
    id: '3',
    title: 'Profile updated',
    description: 'Your chamber profile details were updated.',
    createdAt: '2026-04-03T12:00:00.000Z',
    read: true,
  },
]

const HeaderActions = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  )

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    )
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open notifications"
          onClick={() => setOpen(true)}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-accent"
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[#E5484D]" />
          )}
        </button>
      </div>

      <NotificationsDrawer
        open={open}
        onOpenChange={setOpen}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationRead={handleNotificationRead}
      />
    </>
  )
}

export default HeaderActions
