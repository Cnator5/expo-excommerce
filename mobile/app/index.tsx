// mobile/app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  // Prevent any UI from painting before we know auth state
  if (!isLoaded) return null;

  return isSignedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}