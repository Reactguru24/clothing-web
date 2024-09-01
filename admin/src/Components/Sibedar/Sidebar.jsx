import React from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Confirm the action with the user
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (confirmLogout) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('username'); // Remove username from localStorage
      navigate('/login');
    }
  };

  // Fetch the username from local storage
  const username = localStorage.getItem('username');

  return (
    <div className='sidebar'>
      {username && (
        <div className='sidebar-username'>
          <p>Welcome, {username}</p>
        </div>
      )}
      <Link to='/admin/addproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <ShoppingCartIcon fontSize="large" color="secondary" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to='/admin/listproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <ListAltIcon fontSize="large" color="secondary" />
          <p>Product List</p>
        </div>
      </Link>
      <div className="sidebar-item logout-button" onClick={handleLogout}>
        <ExitToAppIcon fontSize="large" color="secondary" />
        <p>Log Out</p>
      </div>
    </div>
  );
}

export default Sidebar;
