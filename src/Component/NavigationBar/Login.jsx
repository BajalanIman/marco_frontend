import React, { useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { BASE_URL } from "../../constants/constants";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await axios.post(`${BASE_URL}login`, form);
      setMessage("Login successful!");
      setSuccess(true);

      // ✅ Only store if not already set
      if (!localStorage.getItem("marco_user")) {
        localStorage.setItem("marco_user", JSON.stringify(res.data.user));
      }

      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Login failed.");
      setSuccess(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  if (success) return <Navigate to="/" />;

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-white p-5 pt-2 rounded shadow-md space-y-4"
      >
        <div>
          <Link style={{ color: "gray" }} to="/">
            <X />
          </Link>
          <h2 className="text-xl font-bold text-center">Login</h2>
        </div>
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
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
        <p>New user?</p>
        <Link to="/singup" style={{ color: "blue" }}>
          Click here!
        </Link>
      </div>
    </div>
  );
}

export default Login;
