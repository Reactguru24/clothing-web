import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

function Product() {
  const { allProduct } = useContext(ShopContext); // Fetch context value
  const { productId } = useParams(); // Get productId from URL
  const product = allProduct.find((e) => e.id === Number(productId)); // Find the product

  if (!product) {
    return <div>Product not found</div>; // Handle case where product isn't found
  }

  return (
    <div className='product'>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox description={product.description} />
      <RelatedProducts />
    </div>
  );
}

export default Product;
