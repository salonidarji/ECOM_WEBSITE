import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { cartEmpty } from "./helper/cartHelper";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated, signout } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({ products, reload = undefined, setReload = (f) => f }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated && isAuthenticated().user.id;
  const token = isAuthenticated && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((info) => {
      if (info.error) {
        setInfo({
          ...info,
          error: info.error,
        });
        signout(() => {
          return <Redirect to="/" />;
        });
      } else {
        console.log("u token:", info);
        console.log("info token:", info.client_token);
        const clientToken = info.client_token;
        setInfo({ clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      console.log("product:", p);
      amount = amount + parseInt(p.price);
    });
    return amount;
  };

  const showbtnDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button onClick={onPurchase} className="btn btn-block btn-success">
              Buy Now
            </button>
          </div>
        ) : (
          <h3>Please login first</h3>
        )}
      </div>
    );
  };

  const onPurchase = () => {
    setInfo({ loading: true });
    let nounce;
    let getNounce = info.instance
      .requestPaymentMethod()
      .then((data) => {
        console.log("onpurchase data:", data);
        nounce = data.nonce;
        const paymentData = {
          paymentMethodNounce: nounce,
          amount: getAmount(),
        };
        console.log("paymentData:", paymentData);
        processPayment(userId, token, paymentData)
          .then((response) => {
            if (response.error) {
              if (response.code == "1") {
                console.log("Pyment FAILED");
                signout(() => {
                  return <Redirect to="/" />;
                });
              }
            } else {
              setInfo({ ...info, success: response.success, loading: false });
              console.log("payment SUCCESS");

              let product_names = "";
              products.forEach(function (item) {
                product_names += item.name + ",";
              });

              const orderData = {
                products: product_names,
                transaction_id: response.transaction.id,
                amount: response.transaction.amount,
              };
              console.log("uid", userId);
              console.log("token", token);
              console.log("order data", orderData);
              createOrder(userId, token, orderData)
                .then((response) => {
                  if (response.error) {
                    if (response.code == "1") {
                      console.log("Order Failed");
                    }
                    signout(() => {
                      return <Redirect to="/" />;
                    });
                  } else {
                    if (response.success == true) {
                      console.log("order placed");
                    }
                  }
                })
                .catch((e) => {
                  setInfo({ loading: false, success: false });
                  console.log("order failed", e);
                });
              cartEmpty(() => {
                console.log("cart is empty");
              });
              setReload(!reload);
            }
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log("Nounce error:", e));
  };

  return (
    <div>
      <h3>Your amount is {getAmount()}</h3>
      {showbtnDropIn()}
    </div>
  );
};

export default PaymentB;
