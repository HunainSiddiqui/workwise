"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer,toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Example POST request to signup endpoint
      const response = await fetch("https://workwise-backend-hunain.onrender.com/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password ,fullname }),
      });

      if (response.ok) {
        router.push("/login");
      } else {
    
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-500">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

            <div className="mb-4">
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                type="text"
                id="fullname"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                />
            </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-green-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
