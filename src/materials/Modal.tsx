import { type ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
