import React from "react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-[95vw]  max-h-[90vh]">
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h3 className="md:text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center">
              {showActionBtn && (
                <button
                  className="btn-small-light mr-2 flex items-center gap-1"
                  onClick={() => onActionClick?.()}
                >
                  {actionBtnIcon}
                  {actionBtnText}
                </button>
              )}
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 bg-transparent rounded-lg text-sm w-8 h-8 flex justify-center items-center"
                onClick={onClose}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1 L13 13 M13 1 L1 13"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
