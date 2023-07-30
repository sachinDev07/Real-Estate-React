import { useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update the display name in  firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update the name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: formData.name,
        });
      }

      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
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
            disabled={!changeDetails}
            onChange={onChange}
            className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
              changeDetails && "bg-red-200 focus:bg-red-100"
            }`}
          />
          <input
            type="email"
            value={email}
            id="email"
            disabled={!changeDetails}
            onChange={onChange}
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          />
          <div className="flex justify-between items-center whitespace-nowrap text-sm sm:text-lg">
            <p>
              Do you want to change your name?
              <span
                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                onClick={() => {
                  changeDetails && onSubmit();
                  setChangeDetails((prevState) => !prevState);
                }}
              >
                {changeDetails ? "Apply changes" : "Edit"}
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
