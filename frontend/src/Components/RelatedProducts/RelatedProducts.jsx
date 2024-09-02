import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import './RelatedProducts.css';

const RelatedProducts = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { allProduct } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch 4 random products from the server
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('http://localhost:4001/relatedproducts');
        const data = await response.json();
        // Filter out the current product from the related products
        setRelatedProducts(data.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // Navigate to the product detail page
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
  };

  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-products-list">
        {relatedProducts.length > 0 ? (
          relatedProducts.map(product => (
            <div 
              key={product.id}
              className="related-product-item"
              onClick={() => handleProductClick(product.id)}
            >
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <p className="product-price">
                ${product.new_price} {product.old_price && <span className="old-price">${product.old_price}</span>}
              </p>
            </div>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
