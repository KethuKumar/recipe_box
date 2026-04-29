import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // ✅ wait for success
      await dispatch(registerUser(form)).unwrap();

      // ✅ navigate only if success
      navigate("/login");

    } catch (err) {
      console.log(err);
      alert(err || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-100 px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-orange-100">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Account ✨
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Join and start sharing recipes
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* USERNAME */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-orange-400 transition">
            <FiUser className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              className="w-full outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-orange-400 transition">
            <FiMail className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              className="w-full outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-orange-400 transition">
            <FiLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              className="w-full outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-full font-semibold hover:scale-[1.02] active:scale-95 transition shadow-md disabled:opacity-70"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;