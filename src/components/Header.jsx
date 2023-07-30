import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const [pageState, setPageState] = useState("Sign In");
  const location = useLocation();
  const navigate = useNavigate();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) return true;
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });
  }, [auth]);

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
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
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "border-red-500 text-black"
              }`}
              onClick={() => navigate("/profile")}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
