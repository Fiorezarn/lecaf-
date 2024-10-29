import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";
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
        <div className="flex flex-col justify-between px-10 py-6">
          <h1 className="text-4xl font-bold mb-10">{menuById?.mn_name}</h1>
          <div className="mb-10">
            <p className="text-gray-600 text-2xl font-semibold">
              {menuById?.mn_desc}
            </p>
            <p className="text-gray-600">{menuById?.mn_category}</p>
          </div>
          <span className="text-2xl font-bold">Rp. {menuById?.mn_price}</span>
          <div className="flex space-x-4 mt-4">
            <Input type="number" min="1" placeholder="Quantity"></Input>
            <Button>
              <ShoppingCart />
            </Button>
            <Button>Order</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuDetail;
