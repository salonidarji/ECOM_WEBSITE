import { API } from "../../backend";

export const createOrder = (userId, token, orderData) => {
  console.log("in helper orderData:", orderData);
  const formData = new FormData();
  for (const name in orderData) {
    console.log("name:", name);
    console.log("orderData[name]:", orderData[name]);
    formData.append(name, orderData[name]);
  }

  console.log("name form Data:", formData);
  return fetch(`${API}order/add/${userId}/${token}/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("order response:", response);
      return response.json();
    })
    .catch((e) => console.log(e));
};
