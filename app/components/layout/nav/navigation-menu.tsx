import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Collection } from "@/lib/shopify/types";
import { SquareArrowRight } from "lucide-react";
import { Link } from "@remix-run/react";
import { useState } from "react";

const menu = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "Products", to: "/products" },
  { label: "Sale", to: "/products?collection=sale" },
];

interface Props {
  collections: Collection[];
}
export default function NavDropdown({ collections }: Props) {
  const [hoveredType, setHoveredType] = useState("Winter Apparel");
  const filteredCollections = collections.filter(
    (collection) => collection.type === hoveredType,
  );
  const [menuKey, setMenuKey] = useState("");
  return (
    <NavigationMenu
      className="font-[500] max-w-full z-30"
      value={menuKey}
      onValueChange={setMenuKey}
    >
      <Container>
        <NavigationMenuList>
          {menu.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                href={item.to}
                className="relative inline-block"
              >
                <span className="hover:after:w-full after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-foreground after:transition-all after:duration-300 font-heading text-lg">
                  {item.label}
                </span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <h2 className="text-lg">Shop by Category</h2>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex justify-between h-[600px]">
              <div className=" h-full  w-[100vw]">
                <Container>
                  <div className="flex justify-between gap-6 h-full py-9">
                    <div className="flex flex-col items-start gap-9 h-full">
                      {[
                        ...new Set(
                          collections.map((item) => item.type).filter(Boolean),
                        ),
                      ].map((type, index) => (
                        <Button
                          className="text-2xl"
                          key={index}
                          variant="ghost"
                          onMouseEnter={() => setHoveredType(type!)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                    <Separator
                      orientation="vertical"
                      className="h-full w-[2px]"
                    />
                    <div className="h-full flex-1  flex flex-wrap gap-6">
                      {filteredCollections.map((item, index) => (
                        <Link
                          onClick={() => setMenuKey("")}
                          to={`/products?collection=${item.handle}`}
                          key={index}
                          className="flex flex-col gap-6 bg-gray-100 h-[300px] lg:w-[300px] md:w-[250px] sm:w-full rounded-md mb-3"
                        >
                          <div className="h-[200px] w-full  rounded-md overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src={item.image?.url}
                              alt={item.image?.altText}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <h2 className="text-2xl pl-4">{item.title}</h2>
                            <SquareArrowRight size={45} className="pr-4" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Container>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </Container>
    </NavigationMenu>
  );
}
