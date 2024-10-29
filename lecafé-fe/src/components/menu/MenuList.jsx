// MenuList.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";

function MenuList() {
  const dispatch = useDispatch();
  const { menu, error } = useSelector((state) => state.menu);
  const { cookie } = useSelector((state) => state.auth);
  const { message, errorCart } = useSelector((state) => state.cart);
  const BASE_URL = import.meta.env.VITE_BASE_URL_BE;

  useEffect(() => {
    dispatch({ type: "auth/getCookie" });
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: "menu/getAllMenu" });
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      if (errorCart) {
        toast.error(message);
        dispatch({ type: "cart/setMessage" });
      } else {
        toast.success(message);
        dispatch({ type: "cart/setMessage" });
      }
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = e.target.quantity.value;
    const userId = cookie?.us_id;
    const menuId = e.target.menuId.value;

    dispatch({
      type: "cart/addCart",
      payload: { userId, menuId, quantity },
    });
    e.target.reset();
  };

  const clickDetail = (id) => {
    dispatch({ type: "menu/getMenuById", payload: id });
  };

  if (error) {
    toast.error(error);
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menu?.map((item) => (
          <Card
            key={item.mn_id}
            className="shadow-md border border-gray-200 rounded-lg overflow-hidden bg-earth4"
          >
            <div
              className="cursor-pointer"
              onClick={() => clickDetail(item.mn_id)}
            >
              <CardHeader
                className="h-48 overflow-hidden"
                onClick={() => clickDetail(item.mn_id)}
              >
                <img
                  className="w-full h-full object-cover"
                  src={`${BASE_URL}/${item.mn_image}`}
                  alt={item.mn_name}
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold">
                  {item.mn_name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {item.mn_category}
                </CardDescription>
                <p className="font-semibold text-primary mt-2">
                  Rp {item.mn_price}
                </p>
              </CardContent>
            </div>
            <CardFooter className="flex justify-between items-center">
              <form
                className="flex w-[50%] space-x-2 mr-6"
                onSubmit={handleSubmit}
              >
                <Input
                  className="hidden"
                  value={item.mn_id}
                  id="menuId"
                  type="number"
                  min="1"
                  required
                ></Input>
                <Input
                  className=""
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  required
                ></Input>
                <Button className=" bg-earth" type="submit">
                  <ShoppingCart />
                </Button>
              </form>
              <Button className="bg-earth">Order Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default MenuList;
