"use client";

import { useState, useEffect } from "react";
import { useCreatefeedbackEmailMutation } from "../../redux/services/AllEmails/feedbackApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackForm = () => {
  const [createfeedbackEmail, { isLoading }] = useCreatefeedbackEmailMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    msg: "",
  });
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.msg
    ) {
      setError("All fields are required.");
      setDone(null);
      return;
    }

    try {
      await createfeedbackEmail({
        ...formData,
        message: formData.msg,
      }).unwrap();
      setDone("Your message has been sent successfully!");
      toast.success("Your message has been sent successfully!");
      setError(null);
      setFormData({ name: "", email: "", subject: "", msg: "" });
    } catch (err) {
      console.error("Submission error:", err);
      const errorMsg =
        err?.data?.error?.message || "Something went wrong. Please try again.";
      setError(errorMsg);
      setDone(null);
    }
  };

  return (
    <section className="bg-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <div className="py-5 lg:py-6 px-4 mx-auto max-w-screen-md">
        <div className="w-full mx-auto rounded-lg text-center mb-[20px]">
          <h1 className="text-[30px] text-[#1A1A1A] mt-1 leading-[45.57px] font-[700] tracking-wider">
            Feedback
          </h1>
          <p className="text-[16px] font-[600] text-[#000000]">
            Let us know if you have any questions regarding our content and
            calculators. Our team at Calculator-Logical will be available 24/7
            to assist you. Feel free to contact us for any queries!
          </p>
        </div>

        {error && (
          <p className="text-lg text-center text-red-500 font-semibold">
            {error}
          </p>
        )}
        {done && (
          <p className="text-lg text-center text-blue-500 font-semibold">
            {done}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
              required
              className="w-full p-3 text-sm text-gray-900 rounded-[13.5px] border input_border shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              required
              className="w-full p-3 text-sm text-gray-900 rounded-[13.5px] border input_border shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Let us know how we can help you"
              required
              className="w-full p-3 text-sm text-gray-900 rounded-[13.5px] border input_border shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="msg"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your Message
            </label>
            <textarea
              id="msg"
              name="msg"
              rows={6}
              value={formData.msg}
              onChange={handleChange}
              placeholder="Message"
              required
              className="w-full p-3 text-sm text-gray-900 rounded-[13.5px] border input_border shadow-sm"
            ></textarea>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#000] cursor-pointer w-full py-5 text-white font-[600] text-[16px] rounded-[44px] flex justify-center items-center shadow-2xl
                 ${
                   isLoading
                     ? "opacity-70 cursor-not-allowed"
                     : "hover:bg-[#1A1A1A] hover:text-white"
                 }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-white rounded-full animate-ping mr-2"></span>
                  Sending...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;
