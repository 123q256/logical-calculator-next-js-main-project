import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the CSS
import FeedbackModal from "./FeedbackModal";
import { useCreateuserresponseMutation } from "../../redux/services/Userresponse/userresponse";

const CalculatorFeedback = ({ page, device, calName, likes, dislikes }) => {
  
  const [createUserRespones, { data, isLoading }] =
    useCreateuserresponseMutation();

  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Client-side only code
    setLocation(window.location.href);
  }, []);

  const handleLikeDislike = async (type) => {
    if (typeof window === "undefined") return;
    
    const pathSegments = window.location.pathname.split("/");
    const page = pathSegments[pathSegments.length - 1];

    const calculator_name = calName || "nothing";

    const feedback = type === "like" ? "like" : "dislike";

    try {
      await createUserRespones({
        calculator_name,
        feedback,
        page,
      }).unwrap();
      toast.success("Feedback submitted!");
    } catch (err) {
      toast.error("Error submitting feedback!");
    }
  };

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(location);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      {/* Add ToastContainer to render notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div
        className={`lg:flex md:flex flex px-5 mb-3 bg-[#2845F5] text-white rounded-lg items-center mt-2 ${
          page && page.includes("ai_tools")
            ? "justify-between"
            : "justify-between"
        }`}
      >
        <p className="hidden mb-1 mt-3 mt-md-2" id="feedback_status">
          <span
            className={`bg-gray rounded px-md-3 ms-3 ms-md-0 py-2 ${
              device === "mobile" ? "text-[12px]" : "text-[16px]"
            }`}
          >
            {isSending ? "Sending..." : ""}
          </span>
        </p>
        <div id="actual_feedback">
          <div
            className={`md:flex items-center text-center flex-wrap ${
              device === "mobile"
                ? "justify-content-start text-[12px] ps-2"
                : ""
            }`}
          >
            <div>
              {data ? (
                "Thanks for feedback"
              ) : isLoading ? (
                "Loading..."
              ) : (
                <div
                  className={`md:flex items-center text-center flex-wrap ${
                    device === "mobile"
                      ? "justify-content-start text-[12px] ps-2"
                      : ""
                  }`}
                >
                  <strong
                    className={`me-md-2  ${
                      device === "mobile" ? "text-[14px]" : "text-[16px]"
                    }`}
                  >
                    Was this helpful?
                  </strong>
                  <div
                    className={`bg-gray rounded flex items-center text-[13px] ${
                      device === "mobile" ? "mt-1" : ""
                    }`}
                  >
                    <div
                      className="flex-grow-1 cursor-pointer text-end"
                      id="like"
                      onClick={() => handleLikeDislike("like")}
                    >
                      <span className="me-1">👍 Like</span>
                      <span className="hidden" id="like_count">
                        {likeCount}
                      </span>
                    </div>
                    <div className="mx-1">|</div>
                    <div
                      className="flex-grow-1 cursor-pointer text-start pl-2"
                      id="dislike"
                      onClick={() => handleLikeDislike("dislike")}
                    >
                      <span className="me-1">👎 Dislike</span>
                      <span className="hidden" id="dislike_count">
                        {dislikeCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center justify-center p-2 ${
            device === "mobile" ? "justify-center" : ""
          }`}
        >
      
          <p
            className="me-2 p-2 text-[15px] rounded-lg cursor-pointer hover:bg-[#e3e3e3] bg-white flex items-center justify-center"
            onClick={() => setIsOpen(true)}
          >
            <img src="/icons/new-share.png" width={18} alt="Share" />
          </p>

          <p
            className="mx-md-1 p-2 text-[15px] rounded-lg cursor-pointer hover:bg-[#e3e3e3] bg-white flex items-center justify-center"
            onClick={() => setIsShareOpen(true)}
          >
            <img src="/icons/report.png" width={20} alt="" className="text-danger" />
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black focus:outline-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Modal Title */}
            <hp className="text-xl font-bold text-center mb-4">
              Share your Result
              <p />
              <p className="text-center text-xl mb-6 font-medium text-gray-800" />
              {/* Social Media Icons */}
              <div className="flex justify-center space-x-4 mb-6">
                <a
                  href="#"
                  className="bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700"
                  id="facebookShare"
                >
                  <svg
                    width={26}
                    height={26}
                    viewBox="0 0 15 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.2281 14.625L13.9375 10H9.5V6.99869C9.5 5.73338 10.1199 4.5 12.1074 4.5H14.125V0.5625C14.125 0.5625 12.294 0.25 10.5434 0.25C6.88869 0.25 4.5 2.465 4.5 6.475V10H0.4375V14.625H4.5V25.8056C5.31463 25.9334 6.1495 26 7 26C7.8505 26 8.68537 25.9334 9.5 25.8056V14.625H13.2281Z"
                      fill="white"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-blue-400 rounded-full p-2 text-white hover:bg-blue-500"
                  id="twitterShare"
                >
                  <svg
                    width={26}
                    height={26}
                    viewBox="0 0 22 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.3637 2.57333C20.5841 2.91381 19.7595 3.14 18.9153 3.24491C19.8052 2.71719 20.4704 1.88116 20.7848 0.895439C19.9518 1.38983 19.0404 1.73801 18.09 1.92491C17.5076 1.30207 16.7513 0.868896 15.9194 0.68173C15.0875 0.494564 14.2185 0.56207 13.4254 0.875467C12.6324 1.18886 11.952 1.73365 11.4728 2.43896C10.9936 3.14427 10.7377 3.97747 10.7384 4.83018C10.7355 5.15565 10.7686 5.48045 10.8374 5.7986C9.14681 5.71556 7.49276 5.27681 5.98328 4.51101C4.47381 3.74521 3.14287 2.66958 2.07739 1.35439C1.52973 2.28998 1.36006 3.39942 1.60305 4.45594C1.84605 5.51245 2.48338 6.43628 3.38476 7.0386C2.71197 7.02046 2.05342 6.84066 1.46476 6.51439V6.5607C1.46665 7.54139 1.8061 8.49153 2.42605 9.25141C3.04599 10.0113 3.90863 10.5346 4.86897 10.7333C4.50554 10.8288 4.13103 10.8755 3.75529 10.8723C3.48473 10.8773 3.21442 10.8533 2.94897 10.8007C3.2241 11.6441 3.75379 12.3816 4.46519 12.9116C5.17658 13.4417 6.03473 13.7383 6.92160 13.7607C5.41870 14.9354 3.56597 15.5735 1.65844 15.5733C1.31856 15.5762 0.978869 15.5565 0.641602 15.5144C2.58659 16.7684 4.85373 17.431 7.16792 17.4218C14.989 17.4218 19.2648 10.9439 19.2648 5.32912C19.2648 5.14176 19.2648 4.96070 19.25 4.77965C20.0827 4.17868 20.799 3.43103 21.3637 2.57333Z"
                      fill="white"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600"
                  id="linkedinShare"
                >
                  <svg
                    width={26}
                    height={26}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.42131 2.18316C4.42172 2.61554 4.29386 3.03833 4.0539 3.39802C3.81394 3.7577 3.47267 4.03812 3.07328 4.20378C2.67389 4.36944 2.23433 4.41289 1.81024 4.32864C1.38614 4.24439 0.996572 4.03622 0.690831 3.73048C0.38509 3.42474 0.176921 3.03517 0.0926689 2.61107C0.00841716 2.18698 0.0518701 1.74742 0.217528 1.34803C0.383187 0.948637 0.663604 0.607367 1.02329 0.367407C1.38298 0.127447 1.80577 -0.00041534 2.23815 1.01359e-06C2.81699 0.000558393 3.37196 0.230748 3.78126 0.640049C4.19056 1.04935 4.42075 1.60432 4.42131 2.18316Z"
                      fill="white"
                    />
                    <path
                      d="M3.38785 5.27734H1.0889C0.790089 5.27734 0.547852 5.51958 0.547852 5.8184V15.4584C0.547852 15.7572 0.790089 15.9994 1.0889 15.9994H3.38785C3.68667 15.9994 3.9289 15.7572 3.9289 15.4584V5.8184C3.9289 5.51958 3.68667 5.27734 3.38785 5.27734Z"
                      fill="white"
                    />
                    <path
                      d="M15.947 10.8349V15.5023C15.947 15.6341 15.8947 15.7604 15.8015 15.8536C15.7083 15.9468 15.582 15.9991 15.4502 15.9991H12.9828C12.8511 15.9991 12.7247 15.9468 12.6315 15.8536C12.5383 15.7604 12.486 15.6341 12.486 15.5023V10.9802C12.486 10.3044 12.6818 8.03283 10.7218 8.03283C9.20178 8.03283 8.89231 9.59493 8.82704 10.296V15.5128C8.82431 15.642 8.77133 15.7651 8.67936 15.8559C8.58738 15.9467 8.46365 15.9981 8.33441 15.9991H5.94704C5.88172 15.9994 5.81699 15.9868 5.75658 15.9619C5.69617 15.937 5.64129 15.9004 5.5951 15.8542C5.54891 15.808 5.51232 15.7532 5.48745 15.6928C5.46258 15.6324 5.44992 15.5676 5.4502 15.5023V5.77598C5.44992 5.71056 5.46257 5.64573 5.48741 5.5852C5.51226 5.52468 5.54881 5.46966 5.59498 5.4233C5.64114 5.37694 5.696 5.34016 5.75642 5.31506C5.81684 5.28996 5.88162 5.27704 5.94704 5.27704H8.33441C8.40064 5.27592 8.46643 5.288 8.52794 5.31257C8.58945 5.33715 8.64545 5.37372 8.69268 5.42016C8.7399 5.46661 8.77741 5.52199 8.80301 5.58308C8.82861 5.64417 8.84179 5.70975 8.84178 5.77598V6.61809C9.40599 5.77598 10.2439 5.11914 12.027 5.11914C15.9702 5.11704 15.947 8.80756 15.947 10.8349Z"
                      fill="white"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="bg-green-500 rounded-full p-2 text-white hover:bg-green-600"
                >
                  <svg
                    width={26}
                    height={26}
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.00375 7.79148L17.4375 3.58398V11.944C17.4363 12.3678 17.2675 12.7739 16.9678 13.0736C16.6681 13.3733 16.262 13.5422 15.8381 13.5434H2.16187C1.73805 13.5422 1.33191 13.3733 1.03222 13.0736C0.732531 12.7739 0.563654 12.3678 0.5625 11.944V3.67211L9.00375 7.79148Z"
                      fill="white"
                    />
                    <path
                      d="M8.99625 6.21086L0.5625 2.09461V2.05836C0.563654 1.63453 0.732531 1.2284 1.03222 0.928706C1.33191 0.629015 1.73805 0.460139 2.16187 0.458984H15.8381C16.2522 0.459806 16.6499 0.620754 16.948 0.908144C17.2461 1.19553 17.4215 1.58709 17.4375 2.00086L8.99625 6.21086Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
              {/* Copyable Link */}
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <input
                  type="text"
                  value={location}
                  readOnly
                  className="flex-grow bg-transparent text-[14px] border-none font-[700] text-gray-600 px-4"
                />
                <button
                  onClick={copyLink}
                  className="ml-2 text-white rounded-lg px-2 py-1  focus:outline-none cursor-pointer"
                >
                  <img src="/images_app/copy.svg" alt="" />
                </button>
              </div>
            </hp>
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={isShareOpen}
        calName={calName}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
};

export default CalculatorFeedback;