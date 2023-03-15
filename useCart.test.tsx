import {act, renderHook, waitFor} from "@testing-library/react";
import React, {ReactNode} from "react";
import {CartProvider, ShopifyProvider, useCart} from "@shopify/hydrogen-react";
import "whatwg-fetch";

const accessToken = "8b6008fe5f922fb7b1f0df8b142c2d38";

const renderCart = () => {
  const wrapper = ({children}: {children: ReactNode}) => (
    <ShopifyProvider
      storeDomain={`https://test-cleankitchen.myshopify.com`}
      storefrontApiVersion="2023-01"
      storefrontToken={accessToken}
      countryIsoCode="EE"
      languageIsoCode="ET"
    >
      <CartProvider
        onLineAddComplete={() => console.log("Line add complete")}
        onLineUpdateComplete={() => console.log("Line update complete")}
        onAttributesUpdateComplete={() =>
          console.log("Attributes update complete")
        }
      >
        {children}
      </CartProvider>
    </ShopifyProvider>
  );
  return renderHook(() => useCart(), {wrapper});
};

const sleepUntil = async (f: () => boolean, timeoutMs = 1000) => {
  return new Promise((resolve, reject) => {
    const timeWas = new Date();
    const wait = setInterval(function () {
      if (f()) {
        clearInterval(wait);
        resolve(true);
      } else if (+new Date() - +timeWas > timeoutMs) {
        clearInterval(wait);
        reject(false);
      }
    }, 20);
  });
};

test("when calling attributes update and lines remove then the latter is ignored", async () => {
  const {result} = renderCart();

  act(() => result.current.cartCreate({}));
  await waitFor(() => {
    expect(result.current.status).toBe("idle");
  });
  await act(() => {
    result.current.linesAdd([
      {
        merchandiseId: "gid://shopify/ProductVariant/44671043141922",
        quantity: 1,
      },
    ]);
  });
  await waitFor(() => {
    expect(result.current.status).toBe("idle");
  });
  await act(() => {
    result.current.cartAttributesUpdate([
      {key: "test2", value: "val2"},
      {key: "test2", value: "val3"},
    ]);
    sleepUntil(() => {
      console.log("Current status", result.current.status);
      return result.current.status === "idle";
    });
    //TODO if you run linesRemove inside timeout then it works
    // setTimeout(
    //   () => result.current.linesRemove(result.current.lines.map((it) => it.id)),
    //   800
    // )
      result.current.linesRemove(result.current.lines.map((it) => it.id));
  });
  await waitFor(() => {
    expect(result.current.status).toBe("idle");
  });
  await waitFor(() => {
    expect(
      result.current.attributes.filter((it) => it.key === "test2")[0]
    ).toStrictEqual({
      key: "test2",
      value: "val3",
    });
  });
  await waitFor(() => {
    expect(result.current.lines.length).toBe(0);
  });
});

test("when calling line remove and line add the latter is ignored", async () => {
  const {result} = renderCart();

  act(() => result.current.cartCreate({}));
  await waitFor(() => {
    expect(result.current.status).toBe("idle");
  });
  await act(() => {
    result.current.linesAdd([
      {
        merchandiseId: "gid://shopify/ProductVariant/44671043141922",
        quantity: 1,
      },
    ]);
  });
  await waitFor(() => {
    expect(result.current.status).toBe("idle");
  });
  await act(() => {
    result.current.linesRemove(result.current.lines.map((it) => it.id));
    sleepUntil(() => {
      console.log("Current status", result.current.status);
      return result.current.status === "idle";
    });
    result.current.linesAdd([
      {
        merchandiseId: "gid://shopify/ProductVariant/44671043141922",
        quantity: 20,
      },
    ]);
  });
  await waitFor(() => {
    expect(result.current.status).toBe("idle");
  });
  await waitFor(() => {
    expect(
      result.current.totalQuantity
    ).toBe(20);
  });
})
