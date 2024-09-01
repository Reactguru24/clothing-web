import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

function CartItems() {
    const { getTotalCartAmount, allProduct = [], cartItems = {}, removeFromCart } = useContext(ShopContext);

    // Ensure allProduct is an array and cartItems is an object
    const hasItems = Array.isArray(allProduct) && allProduct.some(product => cartItems[product.id] > 0);

    return (
        <div className='cartitems'>
            {!hasItems ? (
                <p className='no-items-message'>There are no items selected.</p>
            ) : (
                <>
                    <div className="cartitems-format-main">
                        <p>Products</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Remove</p>
                    </div>
                    <hr />
                    {allProduct.map((product) => {
                        if (cartItems[product.id] > 0) {
                            return (
                                <div key={product.id}>
                                    <div className="cartitems-format">
                                        <img src={product.image} className='carticon-product-icon' alt={product.name} />
                                        <p>{product.name}</p>
                                        <p>$ {product.new_price.toFixed(2)}</p>
                                        <button className='cartitems-quantity'>{cartItems[product.id]}</button>
                                        <p>$ {(product.new_price * cartItems[product.id]).toFixed(2)}</p>
                                        <img 
                                            src={remove_icon} 
                                            className='remove-icon' 
                                            onClick={() => removeFromCart(product.id)} 
                                            alt="Remove" 
                                        />
                                    </div>
                                    <hr />
                                </div>
                            );
                        }
                        return null;
                    })}

                    <div className="cartitems-down">
                        <div className="cartitems-total">
                            <h1>Cart Total</h1>
                            <div>
                                <div className="cartitems-total-item">
                                    <p>Subtotal</p>
                                    <p>$ {getTotalCartAmount().toFixed(2)}</p>
                                </div>
                                <hr />
                                <div className="cartitems-total-item">
                                    <p>Shipping Fee</p>
                                    <p>Free</p>
                                </div>
                                <hr />
                                <div className="cartitems-total-item">
                                    <h3>Total</h3>
                                    <h3>$ {getTotalCartAmount().toFixed(2)}</h3>
                                </div>
                            </div>
                            <button>PROCEED TO CHECKOUT</button>
                        </div>
                        <div className="cartitems-promocode">
                            <p>If you have a promo code, enter it here</p>
                            <div className="cartitems-promobox">
                                <input type="text" placeholder='Promo code' />
                                <button>Submit</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartItems;
