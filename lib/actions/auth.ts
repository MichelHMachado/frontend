import { LoginSchema, SignUpSchema } from "@/lib/definitions";
import api from "../api";
import { NextResponse } from "next/server";

export async function signup(formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await api.post(`/auth/sign-up`, validatedFields.data);

    const { access_token } = response.data;
    sessionStorage.setItem("access_token", access_token);
  } catch (error) {
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

  try {
    const response = await api.post(`/auth/login`, validatedFields.data);

    const { access_token } = response.data;
    sessionStorage.setItem("access_token", access_token);
  } catch (error) {
    return NextResponse.json(
      { error: `Login failed, ${error}` },
      { status: 401 }
    );
  }
}

export async function logout() {
  try {
    await api.delete(`/auth/logout`);
    sessionStorage.removeItem("access_token");
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  } catch (error) {
    return NextResponse.json(
      { error: `Login failed, ${error}` },
      { status: 401 }
    );
  }
}
