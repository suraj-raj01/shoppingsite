import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
    id: number | string;
    qnty?: number;
    [key: string]: any;
}

interface CartState {
    view: Product[];
}

const initialState: CartState = {
    view: [],
};

const recentViewSlice = createSlice({
    name: "view", // ✅ only one name
    initialState,
    reducers: {
        addRecentView: (state, action: PayloadAction<Product>) => {
            const exists = state.view.some(
                (item) => item.id === action.payload.id
            );

            if (exists) {
                
            } else {
                state.view.push({
                    ...action.payload,
                    qnty: action.payload.qnty ?? 1,
                });
            }
        },
    },
});

export const {
    addRecentView,
} = recentViewSlice.actions;

export default recentViewSlice.reducer;