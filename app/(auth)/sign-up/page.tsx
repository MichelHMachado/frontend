import SignUpForm from "@/components/Auth/SingUpForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className=" flex items-center justify-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className=" text-2xl font-semibold text-center text-gray-700 mb-6">
          Sign Up
        </h2>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
