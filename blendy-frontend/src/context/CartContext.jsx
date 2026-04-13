import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, []);

    // Guardar en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(item => item.idProducto === product.idProducto);
            if (exists) {
                return prev.map(item => 
                    item.idProducto === product.idProducto 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
                );
            }
            return [...prev, { ...product, cantidad: 1 }];
        });
        setIsCartOpen(true); // Abrimos el carrito lateral automáticamente
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.idProducto !== id));
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.idProducto === id) {
                const newQty = item.cantidad + delta;
                return { ...item, cantidad: newQty > 0 ? newQty : 1 };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, 
            updateQuantity, isCartOpen, setIsCartOpen, clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
