import { useGoogleAuth } from "@/src/context";
import { Redirect } from "expo-router";
import { PropsWithChildren } from "react";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user } = useGoogleAuth();
  if (user === null) {
    return <Redirect href={"/onboarding"} />;
  }
  return children;
}
