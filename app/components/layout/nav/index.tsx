import { Container } from "@/components/ui/container";
import { Collection, ShopInfo } from "@/lib/shopify/types";
import { Link } from "@remix-run/react";
import { User, ShoppingBag, MenuIcon } from "lucide-react";
import { SearchInput } from "./search";
import NavDropdown from "./navigation-menu";
import { Spacing } from "@/components/spacing";
import { MobileMenuSheet } from "./mobile-menu";
import { useState } from "react";

interface Props {
  shop: ShopInfo;
  collections: Collection[];
  openCart: () => void;
  isCustomer: boolean;
  cartQuantity: number;
}

export default function Nav({
  shop,
  collections,
  openCart,
  isCustomer,
  cartQuantity,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-white py-6 shadow-md">
      <div className="flex flex-col gap-6">
        <Container>
          <MobileMenuSheet
            collections={collections}
            open={menuOpen}
            onOpenChange={setMenuOpen}
          />

          <nav className="flex justify-between items-center">
            <div className="flex gap-[3rem]">
              <div className="flex gap-2 items-center">
                <button onClick={() => setMenuOpen(true)} className="sm:hidden">
                  <MenuIcon size={25} />
                </button>
                <Link to="/">
                  <img
                    src={shop.brand.logo.image.url}
                    alt={shop.brand.logo.image.altText}
                    className="h-auto w-[10rem] object-contain"
                  />
                </Link>
              </div>
              <div className="hidden md:block w-[30rem]">
                <SearchInput collections={collections} />
              </div>
            </div>

            <div className="flex justify-between gap-5">
              <Link
                to="/account"
                className="flex gap-2 items-start font-[450] text-lg group"
              >
                <User size={25} />
                <h2 className="relative hidden lg:block">
                  {!isCustomer ? "Sign in / Register" : "My Account"}
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                </h2>
              </Link>
              <button
                className="flex gap-2 items-start font-[450] text-lg group"
                onClick={openCart}
              >
                <ShoppingBag size={25} />
                <h2 className="relative hidden lg:block">
                  Cart ({cartQuantity})
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                </h2>
              </button>
            </div>
          </nav>
          <div className="md:hidden">
            <Spacing size={1} />
          </div>
          <div className=" md:hidden w-full">
            <SearchInput collections={collections} />
          </div>
        </Container>
        <div className="hidden sm:block">
          <NavDropdown collections={collections} />
        </div>
      </div>
    </div>
  );
}
