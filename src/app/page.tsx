"use client";

import Link from "next/link";
import { useAuth } from "../../components/AuthContext";

export default function Home() {
  const { username, isAuthenticated, logout} = useAuth();

  const onLogoutHandler = async () => {
    await logout();
    alert("logout success")
  }

  return (
    <>
      {!isAuthenticated ? (
        <Link href="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      ) : (
        <div>
          <p>Welcome, {username}!</p>
          <button onClick={onLogoutHandler} className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Logout
          </button>
        </div>
      )}
    </>
  );
}