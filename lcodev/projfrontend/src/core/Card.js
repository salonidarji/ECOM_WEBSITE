import React, { useState } from "react";
import ImageHelper from "./helper/imageHelper";
import { Redirect } from "react-router-dom";
import { addItemToCart, removeItemFromCart } from "./helper/cartHelper";
import { isAuthenticated } from "../auth/helper";

//TODO: deal later
// const isAuthenticated = true;

const Card = ({
  product,
  addtoCart = true,
  removeFromCart = false,
  reload = undefined,
  setReload = (f) => f,
}) => {
  const [redirect, setRedirect] = useState(false);

  const cartTitle = product ? product.name : "A photo";
  const cartDescription = product ? product.description : "A Desc";
  const cartPrice = product ? product.price : "A Price";

  const addToCart = () => {
    if (isAuthenticated()) {
      addItemToCart(product, () => setRedirect(true));
      console.log("Added to cart");
    } else {
      console.log("login please first..");
    }
  };

  const getAredirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = (addToCart) => {
    return (
      addtoCart && (
        <button
          onClick={addToCart}
          className="btn btn-block btn-outline-success mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };

  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <button
          onClick={() => {
            //TODO: handle later
            removeItemFromCart(product._id);
            setReload(!reload);
            console.log("product removed from cart..");
          }}
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from Cart
        </button>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info">
      <div className="card-header lead">{cartTitle}</div>
      <div className="card-body">
        {getAredirect(redirect)}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cartDescription}
        </p>
        <p className="btn btn-success rounded btn-sm px-4">${cartPrice}</p>
        <div className="row">
          <div className="col-12">{showAddToCart(addToCart)}</div>
          <div className="col-12">{showRemoveFromCart(removeFromCart)}</div>
        </div>
      </div>
    </div>
  );
};
export default Card;
