import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const Contact = ({ userRef, listing }) => {
  const [landloard, setLandloard] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getLandloard() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandloard(docSnap.data());
      } else {
        toast.error("Could not get landloard data");
      }
    }
    getLandloard();
  }, [userRef]);

  function onChange(e) {
    setMessage(e.target.value);
  }

  return (
    <>
      {landloard !== null && (
        <div className="flex flex-col w-full">
          <p>
            Contact {landloard.name} for the {listing.name.toLowerCase()}
          </p>
          <div className="mt-3 mb-6">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-600"
            ></textarea>
          </div>
          <a
            href={`mailto:${landloard.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              type="button"
              className="px-7 py-3 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
