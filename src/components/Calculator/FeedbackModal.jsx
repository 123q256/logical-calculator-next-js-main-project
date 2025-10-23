import React, { useState } from "react";
import { useCreatecalculatorFeedbackEmailMutation } from "../../redux/services/AllEmails/calculatorfeedbackApi";
import { toast } from "react-toastify";

const FeedbackModal = ({ isOpen, onClose, calName }) => {
  const [createcalculatorFeedbackEmail, { isLoading, isError }] =
    useCreatecalculatorFeedbackEmailMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required.");
      setDone(null);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        calName: calName || "",
      };

      const result = await createcalculatorFeedbackEmail(payload).unwrap();

      toast.success("Your message has been sent successfully!");
      setError(null);

      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      const errorMsg =
        err?.data?.error?.message || "Something went wrong. Please try again.";
      setError(errorMsg);
      setDone(null);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
      <div className="relative p-1 w-full max-w-3xl max-h-full bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#2845F5]">
            Give Us Your Feedback
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full w-8 h-8 inline-flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="px-6 pb-5">
          {error && (
            <p className="text-sm text-left mb-3">
              <strong className="text-red-500 text-[18px]">{error}</strong>
            </p>
          )}
          {done && (
            <p className="text-sm text-left mb-3">
              <strong className="text-green-500 text-[16px]">{done}</strong>
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="mb-3 w-full p-3  input_border  rounded-md "
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              className="mb-3 w-full p-3  input_border  rounded-md "
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
            />
            <textarea
              className="mb-3 p-3 w-full  input_border rounded-md "
              name="message"
              rows="3"
              placeholder="Write Your Feedback"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg transition text-white flex items-center justify-center
            bg-[#2845F5] cursor-pointer
            ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-white rounded-full animate-ping mr-2"></span>
                    Sending...
                  </span>
                ) : (
                  "Send Feedback"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
