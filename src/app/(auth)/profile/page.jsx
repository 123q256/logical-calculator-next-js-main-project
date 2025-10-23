"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../../redux/services/auth/authTokenApi";

const Profile = () => {
  const { data, isLoading, error } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // ✅ Profile data aane ke baad form populate karna
  useEffect(() => {
    if (data?.payload) {
      reset({
        name: data.payload.name,
        email: data.payload.email,
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      await updateProfile(formData).unwrap();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile!");
    }
  };

  if (isLoading)
    return <div className="text-center py-10">Loading profile...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading profile
      </div>
    );

  return (
    <div className="max-w-[1140px] mx-auto lg:px-0 px-5 my-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        encType="multipart/form-data"
      >
        {/* Profile Avatar */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div id="upload-button" className="relative">
            <img
              src={
                data?.payload?.avatar || "/icons/profile_img.png"
              } // ✅ agar API avatar bhejti hai to use karo, warna default
              width="100"
              height="100"
              className="profile-image rounded-full h-[100px] w-[100px] object-cover"
              id="profile-image"
              alt="User Avatar"
            />
            <input
              type="file"
              hidden
              id="avatar"
              name="avatar"
              accept="image/*"
            />
            <label
              htmlFor="avatar"
              className="overlay-img flex items-center justify-center opacity-0 cursor-pointer"
            >
              <img
                src="/icons/Editprofile.svg"
                width={25}
                height={25}
                alt="Edit Profile Icon"
              />
            </label>
          </div>

          <h1 className="text-[20px] text-center mt-5 font-bold text-[#1A1A1A]">
            {data?.payload?.name}
          </h1>
          <p className="text-[14px] text-center mt-1 text-[#A3A3A3] font-semibold">
            {data?.payload?.email}
          </p>
        </div>

        {/* Form Inputs */}
        <div className="max-w-screen-lg mx-auto mt-14">
          <div className="flex flex-col gap-y-4 lg:w-[50%] w-[100%] mx-auto">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-[14px] font-medium text-[#000] pl-5"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="bg-white border-[#F0F0F0] rounded-[30.5px] border-2 text-gray-900 text-sm block w-full p-3"
                placeholder="Enter your Name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-[14px] font-medium text-[#000] pl-5"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="bg-white border-[#F0F0F0] rounded-[30.5px] border-2 text-gray-900 text-sm block w-full p-3"
                placeholder="Enter your Email"
                disabled // ✅ usually email change allowed nahi hota
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="max-w-[100%] mx-auto flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting || isUpdating}
              className="bg-[#000] lg:max-w-[370px] md:max-w-[370px] w-full py-5 shadow-2xl mb-8 text-[#fff] hover:bg-[#1A1A1A] duration-200 font-[600] text-[16px] rounded-[44px] px-5 mx-auto"
            >
              {isSubmitting || isUpdating ? "Updating..." : "Update Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
