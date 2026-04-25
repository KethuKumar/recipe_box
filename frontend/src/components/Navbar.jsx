import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo/recipe_box.png";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  // ⏳ debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔍 smart parsing
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      navigate("/");
      return;
    }

    const words = debouncedSearch.toLowerCase().split(" ");

    let name = "";
    let time = "";
    let tag = "";

    words.forEach((word) => {
      if (!isNaN(word)) {
        time = word;
      } else if (word.includes("veg")) {
        tag = word;
      } else {
        name += word + " ";
      }
    });

    navigate(`/?search=${name.trim()}&time=${time}&tag=${tag}`);
  }, [debouncedSearch]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        {/* <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent cursor-pointer"
        >
          🍗 RecipeBox
        </h1> */}

        <img src={logo} alt="logo" className="h-17" />

        {/* 🔍 SEARCH (Desktop) */}
        <div className="hidden md:flex items-center bg-white shadow-sm border rounded-full px-3 py-1 w-80 focus-within:ring-2 focus-within:ring-orange-400 transition">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">

          <Link className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition" to="/">
            Home
          </Link>

          <button
            onClick={() => navigate("/create")}
            className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
          >
            Create
          </button>

          {!user ? (
            <>
              <Link className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition" to="/login">
                Login
              </Link>
              <Link className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
             
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
               <span className="text-gray-600 text-sm">
                👋 {user.username}
              </span>

            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl text-orange-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white/90 backdrop-blur-md border-t">

          {/* SEARCH */}
          <div className="flex items-center bg-white border rounded-full px-3 py-2">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link to="/" className="block py-2">Home</Link>

          <button
            onClick={() => navigate("/create")}
            className="w-full py-2 bg-orange-500 text-white rounded"
          >
            Create
          </button>

          {!user ? (
            <>
              <Link to="/login" className="block py-2">Login</Link>
              <Link to="/register" className="block py-2">Register</Link>
            </>
          ) : (
            <>
              <p className="text-gray-600">👋 {user.username}</p>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;