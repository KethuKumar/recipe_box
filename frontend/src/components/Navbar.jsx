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
          <Link
            className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
            to="/"
          >
            Home
          </Link>

          {/* <button
            onClick={() => navigate("/create")}
            className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
          >
            Create
          </button> */}

          {!user ? (
            <>
              <Link
                className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                to="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* <Link
                className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                to="/meal-planner"
              >
                Planner
              </Link> */}

              <Link
                className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                to="/feed"
              >
                Feed
              </Link>
              <Link
                className="px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                to="/profile"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>

              <span className="text-gray-600 text-sm">👋 {user.username}</span>
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
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-lg z-40 transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex flex-col p-6 gap-6">
            {/* TOP BAR */}
            <div className="flex justify-between items-center">
              <img src={logo} className="h-10" />

              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-orange-500"
              >
                <FiX />
              </button>
            </div>

            {/* SEARCH */}
            <div className="flex items-center bg-white border rounded-full px-4 py-2 shadow-sm">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search recipes..."
                className="outline-none w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* NAV LINKS */}
            <div className="flex flex-col gap-3 text-lg">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 rounded-xl bg-orange-500 text-white text-center"
              >
                Home
              </Link>

              <button
                onClick={() => {
                  navigate("/create");
                  setMenuOpen(false);
                }}
                className="py-3 px-4 rounded-xl bg-orange-500 text-white"
              >
                Create
              </button>

              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl bg-orange-500 text-white text-center"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl bg-orange-500 text-white text-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/feed"
                    onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl bg-orange-500 text-white text-center"
                  >
                    Feed
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl bg-orange-500 text-white text-center"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="py-3 px-4 rounded-xl bg-red-500 text-white"
                  >
                    Logout
                  </button>

                  <p className="text-gray-600 px-2">👋 {user.username}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
