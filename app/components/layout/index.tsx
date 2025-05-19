import React, { useEffect, useState, useRef } from "react";
import Nav from "./nav";
import Footer from "./footer";
import { Cart, Collection, ShopInfo } from "@/lib/shopify/types";
import { Spacing } from "../spacing";
import { Container } from "../ui/container";
import { useBreadcrumb } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { CartList } from "../cart/cart-list";
import { CartSummary } from "../cart/cart-summary";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface Props {
  shop: ShopInfo;
  collections: Collection[];
  children: React.ReactNode;
  cart: Cart | "NO_CART";
}

export default function RootLayout({
  children,
  shop,
  collections,
  cart,
}: Props) {
  const [showStickyNav, setShowStickyNav] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement | null>(null);
  const [navInView, setNavInView] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const emptyCart = !cart || cart === "NO_CART" || cart.lines.length === 0;
  useEffect(() => {
    const navElement = navRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNavInView(entry.isIntersecting);
      },
      { threshold: 0 }
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

  return (
    <>
      <header ref={navRef}>
        <Nav
          shop={shop}
          collections={collections}
          openCart={() => setIsCartOpen(true)}
        />
        {breadcrumb !== "Home" && (
          <div className="flex items-center w-full bg-gray-100 h-[50px] w-full ">
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
          />
        </div>
      )}

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side="right"
          className="w-full flex flex-col sm:w-[650px]"
        >
          <SheetHeader>
            <SheetTitle className="text-5xl font-[450] self-start">
              Your Cart
            </SheetTitle>
          </SheetHeader>
          <Spacing size={2} />
          <Separator />
          <Spacing size={2} />
          <ScrollArea>
            <CartList sheet cart={cart} />
          </ScrollArea>
          {!emptyCart && (
            <CartSummary
              closeSheet={() => setIsCartOpen(false)}
              sheet
              cart={cart}
            />
          )}
        </SheetContent>
      </Sheet>
      <Spacing size={2} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
