import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { AuthProps } from "../types";
import { loginUser } from "../firebase/authService";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const initialValues: AuthProps = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: AuthProps,
    { setSubmitting, setStatus }: FormikHelpers<AuthProps>
  ) => {
    setStatus(null);
    try {
      const response = await loginUser(values);
      navigate("/main");
      console.log(response);
    } catch (error) {
      setStatus({ success: false, message: "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-cyan-600 min-h-screen flex items-center justify-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="backdrop-blur-md bg-white/10 border border-white/30 rounded-xl shadow-lg p-10 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Login
            </h2>

            {status && (
              <div
                className={`mb-4 p-2 rounded-lg text-center ${
                  status.success
                    ? "bg-green-500/20 text-green-200"
                    : "bg-red-500/20 text-red-200"
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-200 text-sm mt-1"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-white mb-1">
                Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-200 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 bg-cyan-500 text-white font-semibold rounded-lg transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-cyan-600"
              }`}
            >
              {isSubmitting ? "Logging In..." : "Log In"}
            </button>
            <p className="flex justify-center text-white mt-2">
              Or you can
              <a className="ml-1 text-cyan-300" href="/register">
                register
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
