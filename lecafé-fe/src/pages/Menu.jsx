// Menu.js
"use client";
import * as React from "react";
import MenuList from "@/components/menu/MenuList";
import Navbar from "@/components/navbar/Navbar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, ShoppingBasket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useDispatch, useSelector } from "react-redux";
import MenuDetail from "@/components/menu/MenuDetail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Menu() {
  const dispatch = useDispatch();
  const { menuById } = useSelector((state) => state.menu);
  const { cart } = useSelector((state) => state.cart);
  const { cookie } = useSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const userId = cookie?.us_id;
  const totalPrice = cart?.Menu?.reduce((acc, item) => {
    return acc + item.mn_price * item.Cart?.cr_quantity;
  }, 0);

  useEffect(() => {
    dispatch({ type: "cart/getCartByUserId", payload: userId });
  }, [userId]);

  useEffect(() => {
    dispatch({ type: "auth/getCookie" });
  }, [dispatch]);

  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  return (
    <div className="flex bg-[#C0AF90]">
      <SidebarProvider
        style={{
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        }}
      >
        <Sidebar className="fixed">
          <SidebarContent className="bg-earth px-6">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white ml-10 text-4xl mb-16 mt-6">
                Le Café
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Search
                  </label>
                  <Input type="email" placeholder="Search" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Category
                  </label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {value
                          ? frameworks.find((f) => f.value === value)?.label
                          : "Choose Category"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {frameworks.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                onSelect={() => {
                                  setValue((currentValue) =>
                                    currentValue === framework.value
                                      ? ""
                                      : framework.value
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value === framework.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {framework.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Price
                  </label>
                  <Slider defaultValue={[33]} max={100} step={1} />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="w-full">
          <div className="w-full h-10 flex items-center justify-between p-8 bg-earth4">
            <div className="flex items-center">
              <SidebarTrigger className="hover:bg-earth4" />
              <Breadcrumb className="px-10">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/menu">Menu</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    {menuById ? (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>{menuById?.mn_name}</BreadcrumbPage>
                      </>
                    ) : null}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-6">
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
              <Sheet>
                <SheetTrigger asChild>
                  <ShoppingBasket
                    className="text-muted-foreground hover:text-black cursor-pointer"
                    size={28}
                    strokeWidth={1.75}
                  />
                </SheetTrigger>
                <SheetContent className="flex justify-between flex-col gap-6">
                  <SheetTitle>Cart</SheetTitle>
                  <ul className="flex flex-col gap-2 mt-10 p-4 rounded-md overflow-y-scroll h-[500px]">
                    {cart?.Menu?.map((item, index) => {
                      return (
                        <li
                          className="flex justify-between bg-earth4 p-4 rounded-lg"
                          key={index}
                        >
                          <div>
                            <h1>{item.mn_name}</h1>
                            <p>{item.mn_category}</p>
                          </div>
                          <div className="flex w-1/2 items-center">
                            <Input
                              type="number"
                              value={item.Cart?.cr_quantity}
                            />
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: "cart/deleteCart",
                                  payload: { userId, menuId: item.mn_id },
                                })
                              }
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <p>Total: Rp.{totalPrice}</p>
                  <div>
                    <Select>
                      <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Type Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                        <SelectItem value="Dine-in">Dine-In</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input className="mb-4" type="text" placeholder="Address" />
                    <Button className="w-full">Checkout</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <main className="px-10 py-6">
            {menuById ? <MenuDetail /> : <MenuList />}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Menu;
