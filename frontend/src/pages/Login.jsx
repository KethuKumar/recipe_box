import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from || "/create";
      navigate(redirectPath);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-100 px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-orange-100">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Login to continue your food journey
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-orange-400 transition">
            <FiMail className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
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
              className="w-full outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <button className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-full font-semibold hover:scale-[1.02] active:scale-95 transition shadow-md">
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-orange-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;