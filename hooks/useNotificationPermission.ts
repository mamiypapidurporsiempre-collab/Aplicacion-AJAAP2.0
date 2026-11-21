import { useCallback, useEffect, useState } from 'react';

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function useNotificationPermission(): {
  permission: NotificationPermissionState;
  request: () => void;
} {
  const [permission, setPermission] = useState<NotificationPermissionState>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }
    const current = Notification.permission;
    setPermission(current);
    if (current === 'default') {
      Notification.requestPermission()
        .then(setPermission)
        .catch(() => setPermission('denied'));
    }
  }, []);

  const request = useCallback(() => {
    if (!('Notification' in window)) return;
    Notification.requestPermission()
      .then(setPermission)
      .catch(() => setPermission('denied'));
  }, []);

  return { permission, request };
}
