import { LoginSchema, SignUpSchema } from "@/app/lib/definitions";
import api from "../api";
import { NextResponse } from "next/server";

export async function signup(formData: FormData) {
  // Validate form fields
  const validatedFields = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log("validatedFields.data: ", validatedFields.data);
  try {
    const response = await api.post(`/auth/sign-up`, validatedFields.data);
    console.log("response.data: ", response.data);
    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token);
  } catch (error) {
    console.log("error: ", error);
    if (error.status === 409) {
      throw { message: "User already exists, try to sign in", status: 409 };
    }
    console.error("Error during signup:", error.response.data.error);
    throw new Error(error.response.data || "Signup failed");
  }
}

export async function login(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log("validatedFields.data: ", validatedFields.data);
  try {
    const response = await api.post(`/auth/login`, validatedFields.data);
    console.log("response.data: ", response.data);
    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token);
  } catch (error) {
    return NextResponse.json(
      { error: `Login failed, ${error}` },
      { status: 401 }
    );
  }
}

export async function logout() {
  try {
    const response = await api.post(`/auth/logout`);
    console.log("response.data: ", response.data);
    localStorage.removeItem("access_token");
  } catch (error) {
    return NextResponse.json(
      { error: `Login failed, ${error}` },
      { status: 401 }
    );
  }
}
