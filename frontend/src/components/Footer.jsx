import { Link } from "react-router-dom";
import { FiGithub, FiInstagram, FiTwitter } from "react-icons/fi";
import logo_footer from "../assets/logo/recipe_box_footer.png";
const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-orange-500 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* BRAND */}
          {/* <h2 className="text-xl font-bold">
            🍗 RecipeBox
          </h2> */}

          <img src={logo_footer} alt="logo" className="h-17 rounded-2xl" />

          {/* NAV LINKS */}
          <div className="flex gap-6 text-sm">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/create" className="hover:underline">
              Create
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>

          {/* SOCIALS */}
          <div className="flex gap-4 text-lg">
            <FiGithub className="cursor-pointer hover:scale-110 transition" />
            <FiInstagram className="cursor-pointer hover:scale-110 transition" />
            <FiTwitter className="cursor-pointer hover:scale-110 transition" />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/30 my-6"></div>

        {/* BOTTOM */}
        <p className="text-center text-sm text-white/90">
          © 2026 RecipeBox — Built with ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
