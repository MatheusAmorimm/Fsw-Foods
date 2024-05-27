/* eslint-disable no-unused-vars */
"use client";

import { Prisma, Product } from "@prisma/client";
import { ReactNode, useMemo, useState } from "react";
import { createContext } from "react";
import { calculateProductsTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          deliveryFee: true;
        };
      };
    };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subTotalPrice: number;
  totalPrice: number;
  totalDiscounts: number;
  addProductsToCart: (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true;
          };
        };
      };
    }>,
    quantity: number,
  ) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subTotalPrice: 0,
  totalPrice: 0,
  totalDiscounts: 0,
  addProductsToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subTotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const totalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + calculateProductsTotalPrice(product) * product.quantity;
    }, 0);
  }, [products]);

  const totalDiscounts = subTotalPrice - totalPrice;

  const addProductsToCart = (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true;
          };
        };
      };
    }>,
    quantity: number,
  ) => {
    const isProductsAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    if (isProductsAlreadyOnCart) {
      return setProducts((prev) =>
        prev.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity,
            };
          }
          return cartProduct;
        }),
      );
    }

    setProducts((prev) => [...prev, { ...product, quantity: quantity }]);
  };

  const increaseProductQuantity = (productId: string) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        }
        return cartProduct;
      }),
    );
  };

  const decreaseProductQuantity = (productId: string) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          if (cartProduct.quantity === 1) {
            return cartProduct;
          }
          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          };
        }
        return cartProduct;
      }),
    );
  };

  const removeProductFromCart = (productId: string) => {
    return setProducts((prev) =>
      prev.filter((product) => product.id !== productId),
    );
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subTotalPrice,
        totalPrice,
        totalDiscounts,
        addProductsToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
