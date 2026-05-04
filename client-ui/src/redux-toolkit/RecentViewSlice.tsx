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

const recentViewSlice = createSlice({
    name: "recent-view", // ✅ only one name
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
    itemDel,
} = recentViewSlice.actions;

export default recentViewSlice.reducer;