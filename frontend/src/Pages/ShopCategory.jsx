import React, { useContext, useState } from 'react';
import './ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdownIcon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Items/Item';

function ShopCategory(props) {
  const { allProduct = [] } = useContext(ShopContext); // Default to an empty array if undefined

  // Filter products based on the category prop
  const filteredProducts = allProduct.filter(item => item.category === props.category);
 


  // State to manage the number of visible products
  const [visibleCount, setVisibleCount] = useState(8);
  // State to manage dropdown visibility and sorting
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState('default');

  // Handle "Load More" button click
  const loadMore = () => {
    // Save the current scroll position
    const scrollPosition = window.scrollY;

    setVisibleCount(prevCount => prevCount + 10); // Increase the visible count by 10

    // Restore the scroll position after a slight delay to ensure the DOM updates
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  // Sort products based on the selected option
  const sortedProducts = (() => {
    switch (sortOption) {
      case 'price-low-to-high':
        return [...filteredProducts].sort((a, b) => a.new_price - b.new_price);
      case 'price-high-to-low':
        return [...filteredProducts].sort((a, b) => b.new_price - a.new_price);
      default:
        return filteredProducts;
    }
  })();

  return (
    <div className='shop-category'> 
      <img className='shopcategory-banner' src={props.banner} alt={`${props.category} banner`} />
      <div className="shopcategory-indexsort">
        <p>
          <span>
            Showing {sortedProducts.length > 0 ? `1-${Math.min(visibleCount, sortedProducts.length)}` : '0'} 
          </span>
          out of {sortedProducts.length} products
        </p>
        <div className="shopcategory-sort">
          <p onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            Sort by {sortOption === 'default' ? 'Select' : sortOption.replace('-', ' ')}
            <img src={dropdownIcon} alt="Sort" />
          </p>
          {isDropdownOpen && (
            <div className="shopcategory-dropdown">
              <p onClick={() => handleSort('price-low-to-high')}>Price: Lowest to Highest</p>
              <p onClick={() => handleSort('price-high-to-low')}>Price: Highest to Lowest</p>
            </div>
          )}
        </div>
      </div>
      <div className="shopcategory-products">
        {sortedProducts.length > 0 ? (
          sortedProducts.slice(0, visibleCount).map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        ) : (
          <p>No products available</p> // Display this message if no products match the filter
        )}
      </div>
      {sortedProducts.length > visibleCount && (
        <div className="shopcategory-loadmore">
          <button onClick={loadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}

export default ShopCategory;
