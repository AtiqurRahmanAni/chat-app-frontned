"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

type LoginFormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const { login } = useContext(AuthContext);

  return (
    <form
      action={async (formData: FormData) => {
        await login(
          formData.get("email") as string,
          formData.get("password") as string
        );
      }}
    >
      <div>
        <input
          type="email"
          className="bg-gray-50 border border-gray-300 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Email Address"
          name="email"
          required
        />
      </div>
      <div className="mt-2">
        <input
          type="password"
          className="bg-gray-50 border border-gray-300 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Password"
          name="password"
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 rounded-lg bg-amber-300 mt-2 w-full"
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;
