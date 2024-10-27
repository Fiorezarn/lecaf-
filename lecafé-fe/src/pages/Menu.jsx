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
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useSelector } from "react-redux";
import MenuDetail from "@/components/menu/MenuDetail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Menu() {
  const { menuById } = useSelector((state) => state.menu);
  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="flex bg-[#C0AF90]">
      <SidebarProvider>
        <Sidebar className="fixed">
          <SidebarContent className="bg-earth">
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
          <div className="w-full h-10 flex items-center p-8 bg-earth4">
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
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {menuById ? (
                    <BreadcrumbPage>{menuById?.mn_name}</BreadcrumbPage>
                  ) : null}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {/* <Avatar className="justify-self-end">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
          </div>
          <main className="p-10">
            {menuById ? <MenuDetail /> : <MenuList />}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Menu;
