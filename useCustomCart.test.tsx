import {act, renderHook, waitFor} from "@testing-library/react";
import React, {ReactNode, useState} from "react";
import {CartProvider, ShopifyProvider} from "@shopify/hydrogen-react";
import "whatwg-fetch";
import {useCustomCart} from "./useCustomCart";

const accessToken = "8b6008fe5f922fb7b1f0df8b142c2d38";

const renderCart = () => {
  const wrapper = ({children}: { children: ReactNode }) => {
    const [callback, setCallback] = useState<() => void>();

    return (
      <ShopifyProvider
        storeDomain={`https://test-cleankitchen.myshopify.com`}
        storefrontApiVersion="2023-01"
        storefrontToken={accessToken}
        countryIsoCode="EE"
        languageIsoCode="ET"
      >
        <CartProvider
          onLineAddComplete={() => console.log("Lines add complete", new Date())}
          onLineUpdateComplete={() => console.log("Line update complete", new Date())}
          onLineRemoveComplete={() => console.log("Lines Remove complete") }
          onAttributesUpdateComplete={() =>
            console.log("Attributes update complete", new Date())
          }
        >
          {children}
        </CartProvider>
      </ShopifyProvider>
    );
  };
  return renderHook(() => useCustomCart(), {wrapper});
};


test("when calling line remove and line add the latter is ignored", async () => {
  const {result} = renderCart();

  act(() => result.current.create());
  await waitFor(() => {
    expect(result.current.cart.status).toBe("idle");
  });
  await waitFor(async () => {
    await result.current.addProduct("gid://shopify/ProductVariant/44671043141922");
  });
  await waitFor(() => {
    expect(result.current.cart.status).toBe("idle");
  });
  await waitFor(() => {
    expect(
      result.current.cart.totalQuantity
    ).toBe(20);
  });
})
