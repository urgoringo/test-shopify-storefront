import {useCart} from "@shopify/hydrogen-react";
import {useContext} from "react";

const sleepUntil = async (f: () => boolean, timeoutMs = 1000) => {
  return new Promise((resolve, reject) => {
    const timeWas = new Date();
    const wait = setTimeout(() => setInterval(function () {
      if (f()) {
        clearInterval(wait);
        resolve(true);
      } else if (+new Date() - +timeWas > timeoutMs) {
        clearInterval(wait);
        reject(false);
      }
    }, 20), 200);
  });
};

export const useCustomCart = () => {
  const cart = useCart();

  return {
    create() {
      cart.cartCreate({});
    },
    cart: cart,
    async addProduct(productId: string) {
      console.log("Attribute update")
      cart.cartAttributesUpdate([{key: "shippingData", value: "abc"}]);

      await sleepUntil(() => {
        if (cart.status !== "idle") {
          console.log("Cart status", cart.status);
        }
        return cart.status === "idle";
      });

      console.log("Lines add");
      cart.linesAdd([
        {
          merchandiseId: productId,
          quantity: 20,
        },
      ]);
      await sleepUntil(() => {
        if (cart.status !== "idle") {
          console.log("Cart status", cart.status);
        }
        return cart.status === "idle";
      });
    }
  }
}

