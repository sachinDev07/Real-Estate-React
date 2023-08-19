import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/firebase";

import Spinner from "../components/Spinner";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const EditListing = () => {
  const navigate = useNavigate();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 50,
    discountedPrice: 50,
    longitude: 0,
    latitude: 0,
    images: {},
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    longitude,
    latitude,
    images,
  } = formData;

  const params = useParams();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("you can't edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  async function fetchListing() {
    const docRef = doc(db, "listings", params.listingID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setListing(docSnap.data());
      setFormData({ ...docSnap.data() });
      setLoading(false);
    } else {
      navigate("/");
      toast.error("listing does not exits");
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchListing();
  }, [navigate, params.listingID]);

  const onChange = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    // files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = doc(db, "listings", params.listingID);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing edited successfully");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="mt-6 max-w-md mx-auto px-2">
      <h1 className="text-3xl font-bold text-center">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex mt-1">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-700 text-white"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-700 text-white"
            }`}
          >
            rent
          </button>
        </div>
        <label className="mt-6 block text-lg font-semibold">Name</label>
        <input
          type="text"
          placeholder="Your Name"
          id="name"
          value={name}
          onChange={onChange}
          max="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <div className="flex space-x-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full text-xl px-4 py-2 text-gray-700 border-gray-300 bg-white rounded transition duration-150 focus:text-gray-800 text-center focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Bath</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full text-xl px-4 py-2 text-gray-700 border-gray-300 bg-white rounded transition duration-150 focus:text-gray-800 text-center focus:border-slate-600"
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking spot</p>
        <div className="flex mt-1">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
              !parking ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
              parking ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            no
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex mt-1">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
              !furnished ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
              furnished ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            no
          </button>
        </div>
        <label className="mt-6 block text-lg font-semibold">Address</label>
        <textarea
          type="text"
          placeholder="Your address"
          id="address"
          value={address}
          onChange={onChange}
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        {!geoLocationEnabled && (
          <div className="flex space-x-6">
            <div>
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                min="-90"
                max="90"
                required
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-700 text-center"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                min="-180"
                max="180"
                required
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-700 text-center"
              />
            </div>
          </div>
        )}
        <label className="block text-lg font-semibold">Description</label>
        <textarea
          type="text"
          placeholder="Description"
          id="description"
          value={description}
          onChange={onChange}
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex mt-1 mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
              !offer ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
              offer ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            no
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div>
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex  justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="40000000"
                className="w-full px-4 py-2 text-gray-700 text-xl border border-gray-300 bg-white rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div>
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mb-6">
            <div>
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex  justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="40000000"
                  className="w-full px-4 py-2 text-gray-700 text-xl border border-gray-300 bg-white rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png, .jpeg"
            max="6"
            multiple
            required
            className="text-lg w-full px-3 py-1 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out "
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
};

export default EditListing;
