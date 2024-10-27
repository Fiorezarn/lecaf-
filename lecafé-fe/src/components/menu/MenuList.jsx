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
import { Toaster } from "@/components/ui/sonner";

function MenuList() {
  const dispatch = useDispatch();
  const { menu, loading, error } = useSelector((state) => state.menu);
  const BASE_URL = import.meta.env.VITE_BASE_URL_BE;

  useEffect(() => {
    dispatch({ type: "menu/getAllMenu" });
  }, [dispatch]);

  const clickDetail = (id) => {
    dispatch({ type: "menu/getMenuById", payload: id });
  };
  console.log(error);

  if (error) {
    toast.error(error);
  }

  return (
    <div className="flex flex-col gap-6">
      <Pagination className="mb-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Toaster richColors position="top-right" />
        {menu?.map((item) => (
          <Card
            onClick={() => clickDetail(item.mn_id)}
            key={item.mn_id}
            className="shadow-md border border-gray-200 rounded-lg overflow-hidden bg-earth4 cursor-pointer"
          >
            <CardHeader className="h-48 overflow-hidden">
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
                {item.mn_desc}
              </CardDescription>
              <p className="font-semibold text-primary mt-2">
                Rp {item.mn_price}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button className="flex items-center space-x-2 bg-earth">
                <ShoppingCart />
              </Button>
              <Button className="bg-earth">Order Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MenuList;
