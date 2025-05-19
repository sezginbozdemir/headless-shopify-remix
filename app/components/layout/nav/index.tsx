import { Container } from "@/components/ui/container";
import { Collection, ShopInfo } from "@/lib/shopify/types";
import { Link } from "@remix-run/react";
import { User, ShoppingBag } from "lucide-react";
import { SearchInput } from "./search";
import NavDropdown from "./navigation-menu";

interface Props {
  shop: ShopInfo;
  collections: Collection[];
  openCart: () => void;
}

export default function Nav({ shop, collections, openCart }: Props) {
  return (
    <div className="bg-white py-6 shadow-md">
      <div className="flex flex-col gap-6">
        <Container>
          <nav className="flex justify-between items-center">
            <div className="flex gap-[3rem]">
              <Link to="/">
                <img
                  src={shop.brand.logo.image.url}
                  alt={shop.brand.logo.image.altText}
                  className="h-[3rem] w-auto object-contain"
                />
              </Link>
              <SearchInput collections={collections} />
            </div>

            <div className="flex justify-between gap-5">
              <Link
                to="/account"
                className="flex gap-2 items-start font-[450] text-lg group"
              >
                <User size={25} />
                <h2 className="relative">
                  Sign in
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                </h2>
              </Link>
              <button
                className="flex gap-2 items-start font-[450] text-lg group"
                onClick={openCart}
              >
                <ShoppingBag size={25} />
                <h2 className="relative">
                  Cart
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                </h2>
              </button>
            </div>
          </nav>
        </Container>
        <NavDropdown collections={collections} />
      </div>
    </div>
  );
}
