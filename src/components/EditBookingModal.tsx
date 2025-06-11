import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../materials/Modal";
import { updateBooking } from "../firebase/bookingService";

interface FormValues {
  startDate: string;
  endDate: string;
  description: string;
}

interface EditBookingModalProps {
  bookingId: string;
  initialValues: FormValues;
  onClose: () => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({
  bookingId,
  initialValues,
  onClose,
}) => {
  const validationSchema = Yup.object({
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
    description: Yup.string(),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      await updateBooking(bookingId, {
        startDate: values.startDate,
        endDate: values.endDate,
        description: values.description,
      });
      setStatus({ success: true, message: "Booking updated successfully!" });
      setTimeout(onClose, 1000);
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || "Failed to update booking.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Edit Booking">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
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
            <div>
              <label htmlFor="startDate" className="block text-white mb-1">
                Start Date
              </label>
              <Field
                type="datetime-local"
                name="startDate"
                id="startDate"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <ErrorMessage
                name="startDate"
                component="p"
                className="text-red-200 text-sm mt-1"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-white mb-1">
                End Date
              </label>
              <Field
                type="datetime-local"
                name="endDate"
                id="endDate"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <ErrorMessage
                name="endDate"
                component="p"
                className="text-red-200 text-sm mt-1"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-white mb-1">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="Booking description"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-red-200 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 bg-cyan-500 text-white rounded-lg ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-cyan-600"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Booking"}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditBookingModal;
