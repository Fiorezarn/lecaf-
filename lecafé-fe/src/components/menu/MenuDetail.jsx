import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
function MenuDetail() {
  const { menuById } = useSelector((state) => state.menu);
  const BASE_URL = import.meta.env.VITE_BASE_URL_BE;
  return (
    <div className="border-4 border-black flex rounded-xl">
      <img
        className="w-1/2 rounded-l-md"
        src={`${BASE_URL}/${menuById?.mn_image}`}
        alt="Americano coffee"
      />

      <div className="w-2/3 rounded-r-xl flex flex-col justify-between bg-earth4">
        <div className="flex flex-col px-10 py-6">
          <h1 className="text-3xl font-semibold">{menuById?.mn_name}</h1>
          <p className="text-gray-600">{menuById?.mn_desc}</p>
          <p className="text-gray-600">{menuById?.mn_category}</p>
          <span className="text-xl font-bold text-green-600">
            Rp. {menuById?.mn_price}
          </span>
          <div className="flex space-x-4 mt-4">
            <Button>Order</Button>
            <Button>
              <ShoppingCart />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuDetail;
