import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaShare } from "react-icons/fa";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

import Spinner from "../components/Spinner";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  async function fetchListing() {
    const docRef = doc(db, "listings", params.listingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setListing(docSnap.data());
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        className="fixed top-[13%] right-[3%] z-10 bg-white w-12 h-12 flex justify-center items-center rounded-full shadow-lg cursor-pointer border-2 border-gray-400"
      >
        <FaShare className="text-lg text-slate-500" />
      </button>
      {shareLinkCopied && (
        <p className="fixed top-[20%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link copied
        </p>
      )}
    </main>
  );
};

export default Listing;
