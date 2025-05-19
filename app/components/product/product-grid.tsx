import { Product } from "@/lib/shopify/types";
import Grid from "@/components/ui/grid";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  filtersOpen: boolean;
};

export function ProductGrid({ products, filtersOpen }: ProductGridProps) {
  return (
    <Grid
      className={` w-full
        grid-cols-1 md:grid-cols-2 
        ${filtersOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"}
        gap-6 transition-all
      `}
    >
      {products.map((product) => (
        <Grid.Item key={product.id}>
          <ProductCard product={product} />
        </Grid.Item>
      ))}
    </Grid>
  );
}
