import Button from "../ui/Button";
import logo from "../../assets/logo-bh66-removebg.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-10 py-6">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-8" />
        <span className="text-yellow-500 font-semibold text-lg">BH66</span>
      </div>

      {/* MENU */}
      <div className="hidden md:flex items-center gap-8 text-gray-300">
        <a href="#" className="hover:text-white transition">
          Collections
        </a>
        <a href="#" className="hover:text-white transition">
          Sur mesure
        </a>
        <a href="#" className="hover:text-white transition">
          À propos
        </a>
      </div>

      {/* CTA */}
      <div>
        <Button onClick={() => navigate("/login")}>Se connecter</Button>
      </div>
    </div>
  );
}
