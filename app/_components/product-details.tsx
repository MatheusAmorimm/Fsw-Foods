"use client";

import { Prisma } from "@prisma/client";
import Image from "next/image";
import { calculateProductsTotalPrice, formatCurrency } from "../_helpers/price";
import DiscountBadge from "./discount-badge";
import { Button } from "./ui/button";
import { BikeIcon, MinusIcon, PlusIcon, TimerIcon } from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";
import ProductList from "./product-list";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () =>
    setQuantity((currentState) => currentState + 1);
  const handleDecreaseQuantity = () =>
    setQuantity((currentState) => {
      if (currentState === 1) return 1;
      return currentState - 1;
    });

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl bg-white py-5">
      {/*IMAGE*/}
      <div className="flex items-center gap-[0.375rem] px-5">
        <div className="relative h-6 w-6">
          <Image
            src={product.restaurant.imageUrl}
            alt={product.restaurant.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {product.restaurant.name}
        </span>
      </div>

      <h1 className="mb-2 mt-1 px-5 text-xl font-semibold">{product.name}</h1>

      {/*PRODUCT PRICE AND QUANTITY*/}
      <div className="flex justify-between px-5">
        {/*PRICE WITH DISCOUNT*/}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {formatCurrency(calculateProductsTotalPrice(product))}
            </h2>
            {product.discountPercentage > 0 && (
              <DiscountBadge product={product} />
            )}
          </div>

          {/*ORIGINAL PRICE*/}
          {product.discountPercentage > 0 && (
            <p className="text-muted-foreground">
              De: {formatCurrency(Number(product.price))}
            </p>
          )}
        </div>

        {/*QUANTIDADE*/}
        <div className="flex items-center gap-3 text-center">
          <Button
            size="icon"
            variant="ghost"
            className="border border-solid border-muted-foreground "
            onClick={handleDecreaseQuantity}
          >
            <MinusIcon />
          </Button>
          <span className="w-4">{quantity}</span>
          <Button
            size="icon"
            className="border border-solid border-primary transition-colors hover:bg-red-700"
            onClick={handleIncreaseQuantity}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      {/*DATAS OF DELIVERY*/}
      <div className="px-5">
        <Card className="mt-6 flex justify-around py-3">
          {/*DELIVERY FEE*/}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Entrega</span>
              <BikeIcon size={14} />
            </div>

            {Number(product.restaurant.deliveryFee) > 0 ? (
              <p className="text-xs font-semibold">
                {formatCurrency(Number(product.restaurant.deliveryFee))}
              </p>
            ) : (
              <p className="text-xs font-semibold">Free</p>
            )}
          </div>

          {/*DELIVERY TIME*/}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Entrega</span>
              <TimerIcon size={14} />
            </div>

            <p className="text-xs font-semibold">
              {product.restaurant.deliveryTimeMinutes} min
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <h3 className="font-semibold">Sobre</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="px-5 font-semibold">Sucos</h3>
        <ProductList products={complementaryProducts} />
      </div>

      <div className="mt-6 px-5">
        <Button className="w-full font-semibold">Adicionar à Sacola</Button>
      </div>
    </div>
  );
};

export default ProductDetails;
