import { API } from "../../backend";

export const getProducts = () => {
  return fetch(`${API}product`, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .catch((e) => console.log("error: ", e));
};
