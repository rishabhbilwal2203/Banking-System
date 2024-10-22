"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authFormSchema } from "@/lib/utils";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      // Sign up with Appwrite & create plaid token
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password
        });
        if(response) router.push('/')
      }
    } catch (error) {
    } finally {
    }
    console.log(data);
    setIsLoading(false);
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center flex gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold">Horizon</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900 ">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "please Enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* Plaid Link */}</div>
      ) : (
        <>
          <Form {...form}>
            {type === "sign-up" && (
              <>
                <div className="flex gap-4">
                  <CustomInput
                    control={form.control}
                    name="firstName"
                    label="FirstName"
                    placeholder="ex: John"
                  />
                  <CustomInput
                    control={form.control}
                    name="lastName"
                    label="LastName"
                    placeholder="ex: Doe"
                  />
                </div>
                <CustomInput
                  control={form.control}
                  name="address1"
                  label="Address"
                  placeholder="Enter the specific Address"
                />
                <CustomInput
                  control={form.control}
                  name="city"
                  label="City"
                  placeholder="Enter the city"
                />
                <div className="flex gap-4">
                  <CustomInput
                    control={form.control}
                    name="state"
                    label="State"
                    placeholder="Example: NY"
                  />
                  <CustomInput
                    control={form.control}
                    name="postalCode"
                    label="PostalCode"
                    placeholder="Example: 11101"
                  />
                </div>
                <div className="flex gap-4">
                  <CustomInput
                    control={form.control}
                    name="dateOfBirth"
                    label="Date of Birth"
                    placeholder="YYYY-MM-DD"
                  />
                  <CustomInput
                    control={form.control}
                    name="ssn"
                    label="SSN"
                    placeholder="ex: 1234"
                  />
                </div>
              </>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter the email"
              />
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter the password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account ?"
                : "Already have an account ?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "sign Up" : "sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
