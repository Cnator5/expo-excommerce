import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  // After SSO completes, send user to app
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // Fallback
  return <Redirect href="/(auth)" />;
}


