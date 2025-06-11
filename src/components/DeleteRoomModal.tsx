import Modal from "../materials/Modal";
import { deleteRoom } from "../firebase/roomService";
import { useState } from "react";

interface DeleteRoomModalProps {
  roomId: string;
  roomName: string;
  onClose: () => void;
}

const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({
  roomId,
  roomName,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteRoom(roomId);
      setStatus({ success: true, message: "Room deleted successfully!" });
      setTimeout(onClose, 1000);
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || "Failed to delete room.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Delete Room">
      <div className="space-y-4">
        {status && (
          <div
            className={`p-2 rounded-lg text-center ${
              status.success
                ? "bg-green-500/20 text-green-200"
                : "bg-red-500/20 text-red-200"
            }`}
          >
            {status.message}
          </div>
        )}
        <p className="text-white text-center">
          Are you sure you want to delete <strong>{roomName}</strong>? This will
          also delete all associated bookings.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className={`flex-1 py-2 bg-red-500 text-white rounded-lg ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-600"
            }`}
          >
            {isSubmitting ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteRoomModal;
