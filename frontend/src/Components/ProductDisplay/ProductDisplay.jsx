import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

function ProductDisplay({ product }) {
    const { addToCart } = useContext(ShopContext);

    const [selectedSize, setSelectedSize] = useState('');
    const [clickCount, setClickCount] = useState(0);
    const [message, setMessage] = useState('');

    if (!product || !product.id || !product.image || !product.name || !product.old_price || !product.new_price) {
        return <p>Product information is missing.</p>;
    }

    const tags = Array.isArray(product.tag) ? product.tag : product.tag ? [product.tag] : [];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL']; // Updated sizes

    const handleAddToCart = () => {
        if (addToCart) {
            addToCart(product.id, selectedSize);
            setClickCount(prevCount => prevCount + 1);
            setMessage(`Item has been successfully added to the cart (${clickCount + 1} times)`);

            setTimeout(() => {
                setMessage('');
            }, 3000);
        } else {
            console.error('addToCart function is not defined.');
        }
    };

    return (
        <div className='productdisplay'>
            <div className='productdisplay-left'>
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="product info"/>
                    <img src={product.image} alt="product info"/>
                    <img src={product.image} alt="product info"/>
                    <img src={product.image} alt="product info"/>
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="product info"/>
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt='' />
                    <img src={star_icon} alt='' />
                    <img src={star_icon} alt='' />
                    <img src={star_icon} alt='' />
                    <img src={star_dull_icon} alt='' />
                    <p>{122}</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        $ {product.old_price.toFixed(2)}
                    </div>
                    <div className="productdisplay-right-price-new">
                        $ {product.new_price.toFixed(2)}
                    </div>
                </div>
                <div className="productdisplay-right-description">
                    {product.description || 'No description available.'}
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-sizes">
                        {sizes.length > 0 ? (
                            sizes.map((size, index) => (
                                <label key={index} className={`productdisplay-size-checkbox ${selectedSize === size ? 'selected' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSize === size}
                                        onChange={() => setSelectedSize(size)}
                                    />
                                    {size}
                                </label>
                            ))
                        ) : (
                            <p>No sizes available</p>
                        )}
                    </div>
                </div>
                <button onClick={handleAddToCart}>ADD TO CART</button>
                {message && (
                    <p className='success-message'>{message}</p>
                )}
                <p className='productdisplay-right-category'><span>Category:</span> {product.category || 'N/A'}</p>
                <p className='productdisplay-right-category'><span>Tag:</span> {tags.length > 0 ? tags.join(', ') : 'No tags available'}</p>
                <p className='productdisplay-right-category'><span>Brand:</span> {product.brand || 'N/A'}</p>
            </div>
        </div>
    );
}

export default ProductDisplay;
