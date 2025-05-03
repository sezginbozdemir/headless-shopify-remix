import { Product } from "@/lib/shopify/types";
import Grid from "@/components/ui/grid";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Grid.Item key={product.id}>
          <ProductCard product={product} />
        </Grid.Item>
      ))}
    </Grid>
  );
}
