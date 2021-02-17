import React, { useEffect } from "react";
import close from "assets/images/close.svg";

function Modal({
  className,
  children,
  visible,
  onClose,
  style,
  closeable = true,
  contentStyle
}) {
  useEffect(() => {
    if (visible) {
      // document.body.style.overflow = 'hidden';
    } else {
      // document.body.style.overflow = 'scroll';
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`modal col align-center ${className}`}
      onClick={() => closeable && onClose()}
      style={style}
    >
      <div
        className="modal-content top-60"
        onClick={(e) => e.stopPropagation()}
        style={contentStyle}
      >
        {closeable && (
          <img
            className="link close-button"
            src={close}
            alt=""
            onClick={onClose}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
