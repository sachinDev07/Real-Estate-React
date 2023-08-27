import React from "react";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing(listings);
      setLoading(false);
    }

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listing.length === 0) {
    return <></>;
  }
  return (
    listing && (
      <>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, type: "progressbar" }}
          effect="fade"
          autoplay={{ delay: 3000 }}
        >
          {listing.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center, no-repeat`,
                  backgroundSize: "cover",
                }}
                className="relatvie w-full h-[300px] overflow-hidden"
              ></div>
              <p className="text-white absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
                {data.name}
              </p>
              <p className="text-white absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                ${data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " / month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
