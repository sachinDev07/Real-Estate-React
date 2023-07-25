import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) return true;
  };

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex items-center justify-between px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="realtor-logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`py-3 border-b-[3px] border-transparent text-sm font-semibold text-gray-400 cursor-pointer ${
                pathMatchRoute("/") && "border-red-500 text-black"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`py-3 border-b-[3px] border-transparent text-sm font-semibold text-gray-400 cursor-pointer ${
                pathMatchRoute("/offer") && "border-red-500 text-black"
              }`}
              onClick={() => navigate("/offer")}
            >
              Offer
            </li>
            <li
              className={`py-3 border-b-[3px] border-transparent text-sm font-semibold text-gray-400 cursor-pointer ${
                pathMatchRoute("/sign-in") && "border-red-500 text-black"
              }`}
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;