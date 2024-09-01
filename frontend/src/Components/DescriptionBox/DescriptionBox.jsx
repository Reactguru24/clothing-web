import React, { useState } from 'react';
import './DescriptionBox.css';

function DescriptionBox({ description }) {
  const [activeTab, setActiveTab] = useState('description'); // State to track the active tab

  // Handler to switch tabs
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => handleTabClick('description')}
        >
          Description
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => handleTabClick('reviews')}
        >
          Reviews
        </div>
      </div>
      <div className="descriptionbox-content">
        {activeTab === 'description' ? (
          <div className="descriptionbox-description">
            <p>{description}</p>
          </div>
        ) : (
          <div className="descriptionbox-reviews">
            <p>No reviews available.</p> {/* Placeholder for reviews */}
          </div>
        )}
      </div>
    </div>
  );
}

export default DescriptionBox;
