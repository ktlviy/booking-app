import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../materials/Modal";
import { createBooking } from "../firebase/bookingService";
import { useAuth } from "../hooks/useAuth";

interface FormValues {
  startDate: string;
  endDate: string;
  description: string;
}

interface BookRoomModalProps {
  roomId: string;
  onClose: () => void;
  userEmail: string;
}

const BookRoomModal: React.FC<BookRoomModalProps> = ({ roomId, onClose }) => {
  const { user } = useAuth();

  const initialValues: FormValues = {
    startDate: "",
    endDate: "",
    description: "",
  };

  const validationSchema = Yup.object({
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    description: Yup.string().trim(),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      if (!user) throw new Error("User not authenticated");
      const response = await createBooking({
        roomId,
        userId: user.uid,
        email: user.email ?? "",
        startDate: values.startDate,
        endDate: values.endDate,
        description: values.description,
      });
      if (response) {
        setStatus({ success: true, message: "Booking created successfully!" });
      }
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || "Failed to create booking.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Book Room">
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
                {status.success && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="block mx-auto mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                  >
                    Close
                  </button>
                )}
              </div>
            )}
            {!status?.success && (
              <>
                <div>
                  <label htmlFor="startDate" className="block text-white mb-1">
                    Start Date & Time
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
                    End Date & Time
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
                  <label
                    htmlFor="description"
                    className="block text-white mb-1"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
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
                  {isSubmitting ? "Booking..." : "Book Room"}
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default BookRoomModal;
