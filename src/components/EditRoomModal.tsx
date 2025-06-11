import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../materials/Modal";
import { updateRoom } from "../firebase/roomService";

interface FormValues {
  name: string;
  description: string;
  imageUrl: string;
}

interface EditRoomModalProps {
  roomId: string;
  initialValues: FormValues;
  onClose: () => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({
  roomId,
  initialValues,
  onClose,
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").trim(),
    description: Yup.string().required("Description is required").trim(),
    imageUrl: Yup.string().url("Invalid URL").required("Image URL is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      await updateRoom(roomId, values);
      setStatus({ success: true, message: "Room updated successfully!" });
      setTimeout(onClose, 1000);
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || "Failed to update room.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Edit Room">
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
              <label htmlFor="name" className="block text-white mb-1">
                Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="Room name"
              />
              <ErrorMessage
                name="name"
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
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="Room description"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-red-200 text-sm mt-1"
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-white mb-1">
                Image URL
              </label>
              <Field
                type="text"
                name="imageUrl"
                id="imageUrl"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="Image URL"
              />
              <ErrorMessage
                name="imageUrl"
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
              {isSubmitting ? "Updating..." : "Update Room"}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditRoomModal;
