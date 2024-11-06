"use client";

import React, { useEffect, useState } from "react";
import { TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { LoginSchema } from "@/app/lib/definitions";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";

type LoginFormValues = TypeOf<typeof LoginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // Navigate after component has mounted and authenticated
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    console.log("formData on submit: ", formData);
    try {
      const response = await login(formData);
      console.log("User logged successfully:", response);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to login");
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        {...register("email")}
        label="Email"
        fullWidth
        variant="outlined"
        className="w-full"
        error={Boolean(errors.email)}
        helperText={errors.email ? errors.email.message : ""}
      />

      <TextField
        {...register("password")}
        type="password"
        label="Password"
        fullWidth
        variant="outlined"
        className="w-full"
        error={Boolean(errors.password)}
        helperText={errors.password ? errors.password.message : ""}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting}
        className="mt-4 py-2"
      >
        {isSubmitting ? <CircularProgress size={24} /> : "Login"}
      </Button>
      <Button
        onClick={() => router.push("/sign-up")} // Navigate to the sign-up page
        variant="text"
        color="primary"
        fullWidth
        className="mt-2"
      >
        Don&apos;t have an account? Sign Up
      </Button>
    </form>
  );
};

export default LoginForm;
