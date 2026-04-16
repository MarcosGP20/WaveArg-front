"use client";

import { GoogleLogin } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: { credential?: string }) => void;
  onError: () => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

export default function GoogleLoginButton({ onSuccess, onError, text = "continue_with" }: GoogleLoginButtonProps) {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      text={text}
      shape="rectangular"
      theme="outline"
      size="large"
      width="350"
    />
  );
}
