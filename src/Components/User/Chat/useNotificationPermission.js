import { useCallback, useState } from 'react';
import {
  isDirectMessageMuted,
  setDirectMessageMuted,
} from './notificationUtils';

const notificationsSupported = () =>
  typeof globalThis.Notification !== 'undefined';

function useNotificationPermission() {
  const [permissionState, setPermissionState] = useState(() =>
    notificationsSupported()
      ? globalThis.Notification.permission
      : 'unsupported',
  );
  const [mutedState, setMutedState] = useState(isDirectMessageMuted);
  const requestPermission = useCallback(async () => {
    if (!notificationsSupported()) return;
    if (globalThis.Notification.permission !== 'default') return;

    const result = await globalThis.Notification.requestPermission();
    setPermissionState(result);
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState((currentState) => {
      const nextState = !currentState;
      setDirectMessageMuted(nextState);
      return nextState;
    });
  }, []);

  return {
    supported: permissionState !== 'unsupported',
    permission: permissionState,
    muted: mutedState,
    enabled: permissionState === 'granted' && !mutedState,
    requestPermission,
    toggleMute,
  };
}

export { useNotificationPermission };
