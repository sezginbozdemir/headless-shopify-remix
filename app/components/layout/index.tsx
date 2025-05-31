import React, { useEffect, useState, useRef } from "react";
import Nav from "./nav";
import Footer from "./footer";
import {
  Cart,
  Collection,
  Menu,
  Metaobject,
  Page,
  ShopInfo,
} from "@/lib/shopify/types";
import { Spacing } from "../spacing";
import { Container } from "../ui/container";
import { useBreadcrumb } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { AnnouncementBar } from "./announcement-bar";
import { CartSheet } from "./cart-sheet";

interface Props {
  shop: ShopInfo;
  collections: Collection[];
  children: React.ReactNode;
  loaderCart: Cart | "NO_CART";
  isCustomer: boolean;
  footer: Menu[];
  pages: Page[];
  announcements: Metaobject[];
}

export default function RootLayout({
  children,
  shop,
  collections,
  loaderCart,
  isCustomer,
  footer,
  pages,
  announcements,
}: Props) {
  const [showStickyNav, setShowStickyNav] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement | null>(null);
  const [navInView, setNavInView] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { cart, setCart, isCartOpen, setIsCartOpen } = useCartStore();
  useEffect(() => {
    if (loaderCart !== "NO_CART") {
      setCart(loaderCart);
    }
  }, [loaderCart, setCart]);
  const emptyCart =
    loaderCart === "NO_CART" || cart?.lines.length === 0 || cart === null;

  useEffect(() => {
    const navElement = navRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNavInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    if (navElement) observer.observe(navElement);

    return () => {
      if (navElement) observer.unobserve(navElement);
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (scrollingUp && !navInView) {
        setShowStickyNav(true);
      } else {
        setShowStickyNav(false);
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [navInView]);

  useEffect(() => {
    if (showStickyNav) {
      setIsMounted(true);
      return;
    }

    const timeout = setTimeout(() => setIsMounted(false), 100);

    return () => clearTimeout(timeout);
  }, [showStickyNav]);
  const breadcrumb = useBreadcrumb();
  const announcementsArray = JSON.parse(announcements[0].fields[0].value);
  const cartTotalQuantity = cart?.totalQuantity;

  return (
    <>
      <header ref={navRef}>
        <AnnouncementBar announcements={announcementsArray} />
        <Nav
          cartQuantity={cartTotalQuantity}
          shop={shop}
          collections={collections}
          openCart={() => setIsCartOpen(true)}
          isCustomer={isCustomer}
        />
        {breadcrumb !== "Home" && (
          <div className="flex items-center bg-gray-100 h-[50px] w-full ">
            <Container className="flex items-center text-sm w-full h-full">
              <p>{breadcrumb}</p>
            </Container>
          </div>
        )}
      </header>

      {isMounted && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md ${
            showStickyNav
              ? "animate-in slide-in-from-top"
              : "animate-out slide-out-to-top"
          }`}
        >
          <Nav
            shop={shop}
            collections={collections}
            openCart={() => setIsCartOpen(true)}
            isCustomer={isCustomer}
            cartQuantity={cartTotalQuantity}
          />
        </div>
      )}
      <CartSheet
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cart={cart}
        emptyCart={emptyCart}
      />

      <Spacing size={2} />
      <main>{children}</main>
      <Spacing size={2} />
      <Footer
        pages={pages}
        footer={footer}
        shop={shop}
        collections={collections}
      />
    </>
  );
}
