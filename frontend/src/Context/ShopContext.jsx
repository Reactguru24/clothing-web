import React, { createContext, useEffect, useState } from 'react';

// Create the ShopContext with default values
export const ShopContext = createContext(null);

// Function to initialize the cart with default values
const getDefaultCart = () => {
  let cart = {};
  // Assuming 300+ is the maximum number of items; adjust if needed
  for (let i = 0; i < 300 + 1; i++) {
    cart[i] = 0;
  }
  return cart;
};

// The ShopContextProvider component
const ShopContextProvider = (props) => {
  const [allProduct, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch products and cart data on component mount
  useEffect(() => {
    // Fetch all products
    fetch("http://localhost:4001/allproducts")
      
      .then((response) => response.json())
      .then((data) => setAllProduct(data))
      .catch((error) => console.error("Error fetching products:", error));

    // Fetch cart data if a token is present
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4001/getcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      .then((response) => response.json())
      .then((data) => setCartItems(data))
      .catch((error) => console.error("Error fetching cart data:", error));

      // Check if the user is an admin
      fetch('http://localhost:4001/checkadmin', {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      })
      .then(response => response.json())
      .then(data => setIsAdmin(data.isAdmin))
      .catch(error => console.error("Error checking admin status:", error));
    }
  }, []);

  // Function to add an item to the cart
  const addToCart = async (itemId) => {
    // Optimistically update cart state
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  
    if (localStorage.getItem('auth-token')) {
      try {
        const response = await fetch("http://localhost:4001/addtocart", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId })
        });

        const data = await response.json();
        console.log("Server Response:", data);

        // Fetch updated cart data here to ensure UI reflects the latest state
        fetch('http://localhost:4001/getcart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
        .then((response) => response.json())
        .then((data) => setCartItems(data))
        .catch((error) => console.error("Error fetching updated cart data:", error));
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (itemId) => {
    // Optimistically update cart state
    setCartItems(prev => {
      const newQuantity = Math.max((prev[itemId] || 0) - 1, 0);
      return { ...prev, [itemId]: newQuantity };
    });
    
    if (localStorage.getItem('auth-token')) {
      try {
        const response = await fetch("http://localhost:4001/removefromcart", {
          method: "POST",
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId })
        });

        const data = await response.json();
        console.log("Server Response:", data);

        // Fetch updated cart data here to ensure UI reflects the latest state
        fetch('http://localhost:4001/getcart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
        .then((response) => response.json())
        .then((data) => setCartItems(data))
        .catch((error) => console.error("Error fetching updated cart data:", error));
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Function to get the total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = allProduct.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Function to get the total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((acc, count) => acc + count, 0);
  };

  // Provide context values
  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    allProduct,
    cartItems,
    addToCart,
    removeFromCart,
    isAdmin,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
