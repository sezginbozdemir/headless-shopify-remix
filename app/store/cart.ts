import { create } from "zustand";
import { Cart } from "@/lib/shopify/types";

type CartState = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setCart: (cart: Cart) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateLine: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,
  error: null,
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateLine: (lineId, quantity) =>
    set((state) => {
      if (!state.cart) return state;

      const updatedLines = state.cart.lines.map((line) =>
        line.id === lineId
          ? {
              ...line,
              quantity,
              cost: {
                ...line.cost,
                totalAmount: {
                  ...line.cost.totalAmount,
                  amount: (
                    quantity * Number(line.cost.amountPerQuantity.amount)
                  ).toFixed(2),
                },
              },
            }
          : line,
      );

      const subtotal = updatedLines.reduce((sum, line) => {
        const lineTotal = Number(line.cost.totalAmount.amount);
        return sum + lineTotal;
      }, 0);

      const totalTaxAmount = state.cart.cost.totalTaxAmount;
      const total = totalTaxAmount
        ? subtotal + Number(totalTaxAmount.amount)
        : subtotal;

      return {
        cart: {
          ...state.cart,
          lines: updatedLines,
          cost: {
            ...state.cart.cost,
            subtotalAmount: {
              ...state.cart.cost.subtotalAmount,
              amount: subtotal.toFixed(2),
            },
            totalAmount: {
              ...state.cart.cost.totalAmount,
              amount: total.toFixed(2),
            },
          },
        },
      };
    }),
  removeLine: (lineId) =>
    set((state) => {
      if (!state.cart) return state;

      const filteredLines = state.cart.lines.filter(
        (line) => line.id !== lineId,
      );

      const subtotal = filteredLines.reduce((sum, line) => {
        const lineTotal = Number(line.cost.totalAmount.amount);
        return sum + lineTotal;
      }, 0);

      const totalTaxAmount = state.cart.cost.totalTaxAmount;
      const total = totalTaxAmount
        ? subtotal + Number(totalTaxAmount.amount)
        : subtotal;

      return {
        cart: {
          ...state.cart,
          lines: filteredLines,
          cost: {
            ...state.cart.cost,
            subtotalAmount: {
              ...state.cart.cost.subtotalAmount,
              amount: subtotal.toFixed(2),
            },
            totalAmount: {
              ...state.cart.cost.totalAmount,
              amount: total.toFixed(2),
            },
          },
        },
      };
    }),
}));
