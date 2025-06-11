import Modal from "../materials/Modal";
import { cancelBooking } from "../firebase/bookingService";
import { useState } from "react";

interface CancelAcceptModalProps {
  bookingId: string;
  onClose: () => void;
}

const CancelAcceptModal: React.FC<CancelAcceptModalProps> = ({
  bookingId,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      await cancelBooking(bookingId);
      setStatus({ success: true, message: "Booking cancelled successfully!" });
      setTimeout(onClose, 1000);
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || "Failed to cancel booking.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Cancel Booking">
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
          Are you sure you want to cancel this booking?
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className={`flex-1 py-2 bg-red-500 text-white rounded-lg ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-600"
            }`}
          >
            {isSubmitting ? "Cancelling..." : "Yes, Cancel"}
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

export default CancelAcceptModal;
