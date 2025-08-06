'use client';
import { authClient } from "@/lib/auth-client";

export default function SignOut() {

  function handleLogout() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    })
  }

  return (
    <button onClick={handleLogout} className="hover:underline">
      Logout
    </button>
  );
}
