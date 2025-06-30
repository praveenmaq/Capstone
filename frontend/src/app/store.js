import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import productReducer from "../feature/product/productSlice";
import adminReducer from "../feature/admin/adminSlice";
import cartReducer from "../feature/cart/cartSlice";
import orderReducer from "../feature/order/orderSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    admin: adminReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});
