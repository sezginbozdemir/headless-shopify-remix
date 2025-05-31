import {
  Twitter,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Link } from "@remix-run/react";
import { Collection, Menu, Page, ShopInfo } from "@/lib/shopify/types";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/components/spacing";

interface Props {
  shop: ShopInfo;
  collections: Collection[];
  footer: Menu[];
  pages: Page[];
}
const list = [
  { label: "New Arrivals", to: "/products?sort=CREATED-DESC" },
  { label: "Best Sellers", to: "/products?sort=BEST_SELLING-ASC" },
  { label: "Sale", to: "/products?collection=sale" },
];
export default function Footer({ shop, collections, footer, pages }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground">
      <Container>
        <div className="pt-12 pb-6 text-white flex flex-wrap justify-between gap-8">
          <div>
            <h3 className="font-[450] text-2xl pl-4 mb-4">Shop</h3>
            <ul className="space-y-2">
              {list.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="hover:opacity-70 flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 mr-1 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-300">
                      <ArrowRight size={16} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-[450] text-2xl pl-4 mb-4">Collections</h3>
            <ul className="space-y-2">
              {collections.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/products?collection=${item.handle}`}
                    className="hover:opacity-70 flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 mr-1 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-300">
                      <ArrowRight size={16} />
                    </span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[450] text-2xl pl-4 mb-4">Company</h3>
            <ul className="space-y-2">
              {footer.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className="hover:opacity-70 flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 mr-1 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-300">
                      <ArrowRight size={16} />
                    </span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-[450] text-2xl pl-4 mb-4">Pages</h3>
            <ul className="space-y-2">
              {pages.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.handle}
                    className="hover:opacity-70 flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 mr-1 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-300">
                      <ArrowRight size={16} />
                    </span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[450] text-2xl pl-4 mb-4">Stay in Touch</h3>
            <div className="flex items-center mb-4">
              <Mail size={16} className="mr-2" />
              <span>support@mystore.com</span>
            </div>
            <div className="flex items-center mb-4">
              <Phone size={16} className="mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center mb-6">
              <MapPin size={16} className="mr-2" />
              <span>123 Main Street, City, Country</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-white">
          <div className="flex flex-col justify-between">
            <h2 className="text-5xl font-semibold text-white mb-4">
              {shop.name}
            </h2>
            <p className="mb-6 max-w-sm">{shop.brand.shortDescription}</p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
          <form className="mt-4 flex flex-col gap-4 w-[400px] text-white">
            <label htmlFor="email">Subscribe to our newsletter</label>
            <div className="flex items-center gap-4">
              <Input type="email" placeholder="Your email address" />
              <Button type="submit">Subscribe</Button>
            </div>
          </form>
        </div>
        <Spacing size={2} />
        <div className="border-t border-white">
          <div className="py-4 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">
                &copy; {currentYear} {shop.name}. All rights reserved.
              </p>
              <div className="flex text-white space-x-6 mt-4 md:mt-0">
                <img alt="Snoya" src="/v.svg" className="w-[3rem]" />
                <img alt="Snoya" src="/pp.svg" className="w-[3rem]" />
                <img alt="Snoya" src="/mc.svg" className="w-[3rem]" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
