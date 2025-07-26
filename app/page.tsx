"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-500 to-white">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            {showForgotPassword ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            {showForgotPassword
              ? "Enter your email to reset password"
              : "Login to continue"}
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            {showForgotPassword ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <button
                  type="button"
                  className="text-sm text-sky-600 underline mt-1"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 mt-4">
          {showForgotPassword ? (
            <>
              <Button className="w-full">Send OTP</Button>
              <Button
                variant="ghost"
                className="text-sm text-sky-600 underline"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </Button>
            </>
          ) : (
            
              
              <Link href="/Dashboard">
                <Button className="w-full">Login</Button>
              </Link>
            
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
