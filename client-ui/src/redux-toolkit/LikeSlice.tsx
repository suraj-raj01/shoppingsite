import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

export interface Product {
  id: number | string;
  qnty?: number;
  [key: string]: any;
}

interface likesState {
  likes: Product[];
}

const initialState: likesState = {
  likes: [],
};

const likeSlice = createSlice({
  name: "likes", // ✅ only one name
  initialState,
  reducers: {
    likelikesData: (state, action: PayloadAction<Product>) => {
      const exists = state.likes.some(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        toast.info("Product already liked!");
      } else {
        state.likes.push({
          ...action.payload,
          qnty: action.payload.qnty ?? 1,
        });
        toast.success("Item liked successfully!");
      }
    },

    removelikesData: (state, action: PayloadAction<{ id: Product["id"] }>) => {
      state.likes = state.likes.filter(
        (item) => item.id !== action.payload.id
      );
      toast.success("Item successfully removed from likes!");
    },
  },
});

export const {
  likelikesData,
  removelikesData
} = likeSlice.actions;

export default likeSlice.reducer;