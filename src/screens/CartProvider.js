import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItemsCount, setCartItemsCount] = useState(0);

    const updateCartItemsCount = (count) => {
        setCartItemsCount(count);
    };

    return (
        <CartContext.Provider value={{ cartItemsCount, updateCartItemsCount }}>
            {children}
        </CartContext.Provider>
    );
};
