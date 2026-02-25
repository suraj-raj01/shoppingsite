import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

export interface Product {
  id: number | string;
  qnty?: number;
  [key: string]: any;
}

interface CartState {
  cart: Product[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart", // ✅ only one name
  initialState,
  reducers: {
    addCartData: (state, action: PayloadAction<Product>) => {
      const exists = state.cart.some(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        toast.info("Product already added!");
      } else {
        state.cart.push({
          ...action.payload,
          qnty: action.payload.qnty ?? 1,
        });
        toast.success("Item added successfully!");
      }
    },

    itemInc: (state, action: PayloadAction<{ id: Product["id"] }>) => {
      const item = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (item) item.qnty = (item.qnty ?? 1) + 1;
    },

    itemDec: (state, action: PayloadAction<{ id: Product["id"] }>) => {
      const item = state.cart.find(
        (item) => item.id === action.payload.id
      );

      if (!item) return;

      if ((item.qnty ?? 1) <= 1) {
        state.cart = state.cart.filter(
          (i) => i.id !== action.payload.id
        );
        toast.success("Item successfully removed!");
      } else {
        item.qnty!--;
      }
    },

    itemDel: (state, action: PayloadAction<{ id: Product["id"] }>) => {
      state.cart = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      toast.success("Item successfully removed!");
    },
  },
});

export const {
  addCartData,
  itemInc,
  itemDec,
  itemDel,
} = cartSlice.actions;

export default cartSlice.reducer;