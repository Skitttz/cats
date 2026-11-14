import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { lockScroll } from '../../Utils/scrollLock';

export default function Dialog({ children, label, className, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = ref.current;
    const unlockScroll = lockScroll(document.body);
    dialog.showModal();
    return () => {
      dialog.close();
      unlockScroll();
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>,
    document.body,
  );
}
