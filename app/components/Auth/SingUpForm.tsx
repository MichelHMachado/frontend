"use client";

import React, { useEffect, useState } from "react";
import { TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { SignUpSchema } from "@/app/lib/definitions";
import { signup } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";

type SignUpValues = TypeOf<typeof SignUpSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const isAuthenticated = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // Navigate after component has mounted and authenticated
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    setError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      await signup(formData);

      router.push("/");
    } catch (err) {
      if (err?.status === 409) {
        setError(err?.message);
        reset();
      } else {
        setError(err?.message || "Failed to sign up");
      }
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        {...register("name")}
        label="Name"
        fullWidth
        variant="outlined"
        error={Boolean(errors.name)}
        helperText={errors.name ? errors.name.message : ""}
      />

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
        {isSubmitting ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>

      <Button
        onClick={() => router.push("/sign-in")} // Navigate to the sign-in page
        variant="text"
        color="primary"
        fullWidth
        className="mt-2"
      >
        Already have an account? Sign In
      </Button>
    </form>
  );
};

export default SignUpForm;
