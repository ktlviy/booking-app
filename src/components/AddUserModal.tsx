import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../materials/Modal";
import { addUserToRoom } from "../firebase/roomService";

interface FormValues {
  email: string;
}

interface AddUserModalProps {
  roomId: string;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ roomId, onClose }) => {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      await addUserToRoom(roomId, values.email.toLowerCase());
      setStatus({ success: true, message: "User added successfully!" });
      setTimeout(onClose, 1000);
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || "Failed to add user.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add User to Room">
      <Formik
        initialValues={{ email: "" }}
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
              <label htmlFor="email" className="block text-white mb-1">
                User Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="user@example.com"
              />
              <ErrorMessage
                name="email"
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
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddUserModal;
