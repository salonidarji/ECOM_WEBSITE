import React from "react";

const imageHelper = ({ product }) => {
  const imageUrl = product
    ? product.image
    : `https://images.pexels.com/photos/1115815/pexels-photo-1115815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

  return (
    <div className="rounded border border-success p-2">
      <img
        src={imageUrl}
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-3 rounded"
        alt="image not available"
      />
    </div>
  );
};
export default imageHelper();
