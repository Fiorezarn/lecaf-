import { ShoppingBasket } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

function Navbar({ navbarClass }) {
  const { cookie } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL_BE;

  useEffect(() => {
    dispatch({ type: "auth/getCookie" });
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      navigate(0);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <nav className={navbarClass}>
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
            <a href="/order">Order</a>
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
                  <DropdownMenuLabel>{cookie?.us_username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Order</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
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
