import { ShoppingBasket } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { cookie } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "auth/getCookie" });
  }, [dispatch]);
  console.log(cookie);

  return (
    <nav className="w-full py-6 px-24 flex justify-between items-center">
      <h1 className="text-white text-3xl">Le Café</h1>
      <div>
        <ul className="flex gap-6 text-2xl text-white">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/menu">Menu</a>
          </li>
          <li>
            <Menubar className="">
              <MenubarMenu className="">
                <MenubarTrigger className="">Order</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>My Order</MenubarItem>
                  <MenubarItem>My Order History</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </li>
        </ul>
      </div>
      <div>
        <ul className="flex items-center gap-8 text-white">
          <li className="text-xl">
            {cookie ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="/login">Login</a>
            )}
          </li>
          <li>
            <ShoppingBasket size={28} color="#ffffff" strokeWidth={1.75} />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
