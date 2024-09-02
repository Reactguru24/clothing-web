import React, { useRef, useState, useEffect, useContext } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_iconn from '../Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown_icon from '../Assets/nav_dropdown.png';
import axios from 'axios'; // Import axios for making API requests

export const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { getTotalCartItems } = useContext(ShopContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const [message, setMessage] = useState(''); // State for the success message
    const menuRef = useRef(null);

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem('auth-token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:4001/api/user', {
                        headers: {
                            'auth-token': token
                        }
                    });
                    console.log('API Response:', response.data); // Debug line

                    if (response.data && response.data.username) {
                        setUsername(response.data.username);

                        // Show success message
                        setMessage('Successfully logged in');
                        setTimeout(() => {
                            setMessage('');
                        }, 3000); // Hide message after 3 seconds
                    } else {
                        setUsername(null);
                    }
                } catch (error) {
                    console.error('Error fetching username:', error);
                    setUsername(null); // Clear username on error
                }
            } else {
                setUsername(null); // Ensure username is cleared if no token
            }
        };

        fetchUsername();
    }, []);

    const dropdown_toggle = (e) => {
        setMenuOpen(prevMenuOpen => {
            const newMenuOpen = !prevMenuOpen;
            if (menuRef.current) {
                menuRef.current.classList.toggle('nav-menu-visible', newMenuOpen);
            }
            e.target.classList.toggle('open', newMenuOpen);
            return newMenuOpen;
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("username"); // Remove username on logout
        setUsername(null); // Clear username state
        setMessage('Successfully logged out');
        setTimeout(() => {
            setMessage('');
            window.location.replace("/"); // Redirect after showing the logout message
        }, 3000); // Show logout message for 3 seconds
    };

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={logo} alt='navbar-logo'/>
                    <p>SHOPPER</p>
                </Link>
            </div>
            <img 
                className="nav-menu-toggle" 
                onClick={dropdown_toggle} 
                src={nav_dropdown_icon} 
                alt="Menu Toggle" 
            />
            <ul ref={menuRef} className={`nav-menu ${menuOpen ? 'nav-menu-visible' : ''}`}>
                <li className={`shop ${currentPath === '/' ? 'active' : ''}`}>
                    <Link to='/' style={{ textDecoration: 'none' }}>
                        Shop
                    </Link>
                </li>
                <li className={currentPath === '/men' ? 'active' : ''}>
                    <Link to='/men' style={{ textDecoration: 'none' }}>
                        Men
                    </Link>
                </li>
                <li className={currentPath === '/women' ? 'active' : ''}>
                    <Link to='/women' style={{ textDecoration: 'none' }}>
                        Women
                    </Link>
                </li>
                <li className={currentPath === '/kids' ? 'active' : ''}>
                    <Link to='/kids' style={{ textDecoration: 'none' }}>
                        Kids
                    </Link>
                </li>
            </ul>
            <div className="nav-login-cart">
                {username ? (
                    <div className="user-info">
                        <span className="nav-username">Hello, {username}</span>
                        <button onClick={handleLogout} className="login-btn">Logout</button>
                    </div>
                ) : (
                    <Link to='/login'><button className="login-btn">Login</button></Link>
                )}
                <Link to='/cart'><img src={cart_iconn} alt="Cart Icon" /></Link>
                <div className="nav-cart-count">
                    {getTotalCartItems()}
                </div>
            </div>
            {message && <div className="success-message">{message}</div>}
        </div>
    );
}
