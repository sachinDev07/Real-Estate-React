import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          src={listing.imgUrls[0]}
          alt=""
          loading="lazy"
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale ease-in"
        />
        <div className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-sembold rounded-md px-2 py-1 shadow-lg">
          {moment(listing.timestamp.toDate()).fromNow()}
        </div>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            {
              <p className="font-semibold text-sm text-gray-600 truncate">
                {listing.address}
              </p>
            }
          </div>
          <p className="font-semibold mt-2 text-xl m-0 truncate">
            {listing.name}
          </p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          onClick={() => onDelete(listing.id)}
          className="absolute right-2 bottom-2 h-[14px] text-red-500 cursor-pointer"
        />
      )}
      {onEdit && (
        <MdEdit
          onClick={() => onEdit(listing.id)}
          className="absolute right-8 bottom-2 h-4 text-black cursor-pointer"
        />
      )}
    </li>
  );
};

export default ListingItem;
