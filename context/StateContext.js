import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    useEffect(() => {
        if (localStorage.getItem('cartProducts') !== null) {
            setCartItems(JSON.parse(localStorage.getItem('cartProducts')));
            setTotalPrice(JSON.parse(localStorage.getItem('total')));
            setTotalQuantities(JSON.parse(localStorage.getItem('quantities')));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('total', totalPrice);
        localStorage.setItem('quantities', totalQuantities);
    }, [totalPrice]);


    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id)
                    return { ...cartProduct, quantity: cartProduct.quantity + quantity };
            });

            setCartItems(updatedCartItems);
            localStorage.setItem('cartProducts', JSON.stringify(updatedCartItems));
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
            localStorage.setItem('cartProducts', JSON.stringify([...cartItems, { ...product }]));
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    };

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    };

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems1 = cartItems.slice(0, index);
        const newCartItems2 = cartItems.slice(index + 1, cartItems.length);

        if (value === 'inc') {
            setCartItems([...newCartItems1, { ...foundProduct, quantity: foundProduct.quantity + 1 }, ...newCartItems2]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1);
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([...newCartItems1, { ...foundProduct, quantity: foundProduct.quantity - 1 }, ...newCartItems2]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1);
            }
        }
    };

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    };

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1)
                return 1;
            return prevQty - 1;
        });
    };


    return (
        <Context.Provider value={{
            showCart,
            setShowCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            onRemove
        }}>
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);