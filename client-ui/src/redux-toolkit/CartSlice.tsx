import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

export interface Product {
  id: number | string;
  qnty?: number;
  [key: string]: any;
}

interface CartState {
  cart: Product[];
  likes: Product[];
}

const initialState: CartState = {
  cart: [],
  likes: [],
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
        toast.error("Product already added!");
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
      toast.error("Item successfully removed!");
    },

    addLikeData: (state, action: PayloadAction<Product>) => {
      const exists = state.likes.some(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        toast.error("Product already liked!");
      } else {
        state.likes.push(action.payload);
        toast.success("Product successfully added to likes");
      }
    },

    itemDislike: (state, action: PayloadAction<{ id: Product["id"] }>) => {
      state.likes = state.likes.filter(
        (item) => item.id !== action.payload.id
      );
      toast.error("Item disliked!");
    },
  },
});

export const {
  addCartData,
  itemInc,
  itemDec,
  itemDel,
  addLikeData,
  itemDislike,
} = cartSlice.actions;

export default cartSlice.reducer;