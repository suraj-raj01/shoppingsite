import UserCartItems from "@/dashboard/cart/CartItems";
import UserLikeItems from "@/dashboard/cart/LikeItems";
import { Route } from "react-router-dom";


export const CartItems = (
    <>
        <Route path="cartitems" element={<UserCartItems />} />
        <Route path="likeitems" element={<UserLikeItems />} />
    </>
);