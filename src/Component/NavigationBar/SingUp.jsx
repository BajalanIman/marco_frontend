import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { BASE_URL } from "../../constants/constants";

function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}users`, form);
      setMessage("Signup successful!");
      setSuccess(true);

      // Save user info (optional: remove password for security)
      localStorage.setItem(
        "marco_user",
        JSON.stringify({ ...form, password: undefined })
      );

      // Automatically clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Signup failed.");
      setSuccess(false);

      // Automatically clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // Redirect to Mainbody after successful signup
  if (success) return <Navigate to="/" />;

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-white p-6 rounded shadow-md space-y-4"
      >
        <div>
          <Link style={{ color: "gray" }} to="/">
            <X />
          </Link>
          <h2 className="text-xl font-bold text-center">Sign Up</h2>
        </div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded pr-10"
            required
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <Eye size={20} color="blue" />
            ) : (
              <EyeOff size={20} color="gray" />
            )}
          </span>
        </div>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name (Optional)"
          value={form.full_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              success ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
      <div className="flex gap-1 ">
        <p>You already have an account?</p>
        <Link to="/login" style={{ color: "blue" }}>
          Click here!
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
