import React, { useRef, useState, useContext } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_iconn from '../Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown_icon from '../Assets/nav_dropdown.png';

export const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { getTotalCartItems } = useContext(ShopContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const dropdown_toggle = (e) => {
        setMenuOpen(prevMenuOpen => {
            const newMenuOpen = !prevMenuOpen;
            console.log('Menu Open State:', newMenuOpen); // Debug line
            if (menuRef.current) {
                menuRef.current.classList.toggle('nav-menu-visible', newMenuOpen);
            }
            e.target.classList.toggle('open', newMenuOpen);
            return newMenuOpen;
        });
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
                {localStorage.getItem("auth-token")
                 ? <button onClick={()=>{localStorage.removeItem("auth-token");window.location.replace("/ ")}}>Logout</button>
                 : <Link to='/login'><button className="login-btn">Login</button></Link>
                }
                
                <Link to='/cart'><img src={cart_iconn} alt="Cart Icon" /></Link>
                <div className="nav-cart-count">
                    {getTotalCartItems()}
                </div>
            </div>
        </div>
    );
}
