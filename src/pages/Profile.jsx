import { useState } from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Sachin kumar",
    email: "sachin123@gmail.com",
  });
  const { name, email } = formData;
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <section className="max-w-6xl mx-auto flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl mt-6 font-bold">My Profile</h1>
      <div className="w-full md:w-[50%] mt-6 px-3">
        <form>
          <input
            type="text"
            value={name}
            id="name"
            disabled
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          />
          <input
            type="email"
            value={email}
            id="email"
            disabled
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          />
          <div className="flex justify-between items-center whitespace-nowrap text-sm sm:text-lg">
            <p>
              Do you want to change your name?
              <span className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer">
                Edit
              </span>
            </p>
            <p
              className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              onClick={onLogout}
            >
              Sign out
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
