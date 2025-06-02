import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Collection } from "@/lib/shopify/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";

interface MobileMenuSheetProps {
  collections: Collection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MenuPage = "main" | "categories" | "collectionsByType";

export function MobileMenuSheet({
  open,
  collections,
  onOpenChange,
}: MobileMenuSheetProps) {
  // Filter out undefined or null types from collections
  const types = Array.from(
    new Set(
      collections
        .map((col) => col.type)
        .filter((t): t is string => typeof t === "string" && t.trim() !== ""),
    ),
  );

  const [currentPage, setCurrentPage] = useState<MenuPage>("main");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Collections filtered by selected type
  const filteredCollections = selectedType
    ? collections.filter((col) => col.type === selectedType)
    : [];

  // Helper to go back
  function goBack() {
    if (currentPage === "collectionsByType") {
      setCurrentPage("categories");
      setSelectedType(null);
    } else if (currentPage === "categories") {
      setCurrentPage("main");
    }
  }

  // Close sheet resets to main menu
  function handleClose() {
    setCurrentPage("main");
    setSelectedType(null);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="left"
        className="w-full sm:hidden p-4 flex flex-col gap-5"
      >
        <SheetHeader>
          <SheetTitle>
            {currentPage === "main" && "Menu"}
            {currentPage === "categories" && (
              <Button onClick={goBack} variant="link">
                <ArrowLeft size={20} />
                Categories
              </Button>
            )}
            {currentPage === "collectionsByType" && (
              <Button onClick={goBack} variant="link">
                <ArrowLeft size={20} />
                {selectedType}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Animate pages with simple CSS transition using translateX */}
        <div className="relative h-[400px] overflow-hidden">
          {/* Main menu */}
          <nav
            className={`absolute top-0 left-0 w-full transition-transform duration-300 ${
              currentPage === "main" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <ul className="flex flex-col gap-4">
              <li>
                <Button onClick={handleClose} variant="link">
                  <Link to="/">Home</Link>
                </Button>
              </li>
              <li className="flex w-full justify-between">
                <Button
                  variant="link"
                  onClick={() => setCurrentPage("categories")}
                >
                  Categories
                  <ArrowRight size={25} />
                </Button>
              </li>
              <li>
                <Button onClick={handleClose} variant="link">
                  <Link to="/products">Products</Link>
                </Button>
              </li>
              <li>
                <Button onClick={handleClose} variant="link">
                  <Link to="/sale">Sale</Link>
                </Button>
              </li>
              <li>
                <Button onClick={handleClose} variant="link">
                  <Link to="/collections">Collections</Link>
                </Button>
              </li>
            </ul>
          </nav>

          {/* Categories page */}
          <nav
            className={`absolute top-0 left-0 w-full transition-transform duration-300 ${
              currentPage === "categories"
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          >
            <ul className="flex flex-col gap-4">
              {types.length === 0 && <li>No categories found.</li>}
              {types.map((type) => (
                <li key={type}>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedType(type);
                      setCurrentPage("collectionsByType");
                    }}
                  >
                    {type}
                    <ArrowRight size={25} />
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collections by type page */}
          <nav
            className={`absolute top-0 left-0 w-full transition-transform duration-300 ${
              currentPage === "collectionsByType"
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          >
            <ul className="flex flex-col gap-4">
              {filteredCollections.length === 0 && (
                <li>No collections found for {selectedType}</li>
              )}
              {filteredCollections.map((col) => (
                <li key={col.id}>
                  <Button variant="link" onClick={handleClose}>
                    <Link to={`/products?collection=${col.handle}`}>
                      {col.title}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
