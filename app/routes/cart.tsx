import { type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { getCart } from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { CartList } from "@/components/cart/cart-list";
import { CartSummary } from "@/components/cart/cart-summary";
import { Spacing } from "@/components/spacing";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async ({ request }) => {
  const req = await getCart(request);
  if (!req.success) {
    if (req.error !== "NO_CART") {
      throw new Response(req.error, {
        status: 500,
        statusText: "Failed to fetch cart please try again later.",
      });
    }
  }
  const loaderCart = req.success ? req.result : req.error;

  return { loaderCart };
};

export default function CartPage() {
  const { loaderCart } = useLoaderData<typeof loader>();
  const { cart, setCart } = useCartStore();
  useEffect(() => {
    if (loaderCart !== "NO_CART") {
      setCart(loaderCart);
    }
  }, [loaderCart, setCart]);
  const emptyCart =
    loaderCart === "NO_CART" || cart?.lines.length === 0 || cart === null;
  return (
    <>
      <h1 className="text-6xl font-[500]">Your Cart</h1>
      <Spacing size={2} />
      <Separator />
      <Spacing size={2} />
      <CartList cart={cart} />
      {!emptyCart && <CartSummary cart={cart} />}
    </>
  );
}
