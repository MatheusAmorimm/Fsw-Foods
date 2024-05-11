import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurants-item";
import { db } from "@/app/_lib/prisma";

const RecommendedRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({});

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">
          Restaurantes Recomendados
        </h2>
        <div className="flex w-full flex-col gap-7 ">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className="min-w-full max-w-full rounded-md px-1 pb-2 shadow-xl"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedRestaurants;
