import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurants-item";

const RestaurantList = async () => {
  //TOOD: Pegar os restaurantes com maior numero de pedidos
  const restaurants = await db.restaurant.findMany({ take: 10 });
  return (
    <div className="gap flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
      {restaurants.map((restaurant) => (
        <RestaurantItem key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};

export default RestaurantList;
