import React from 'react';
import '../Nav/Nav.scss';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaClipboardList, FaUser,FaSearch } from 'react-icons/fa'; // Importing the FaUser icon

const Nav = ({ user, login }) => {

  return (
    <div className="navbar">
      <nav>
        <div className="left">
          <Link to="/"><h1 className='bebas-neue-regular'>LIBRARY.COM</h1></Link>
        </div>
        <div className="right">
          <div className="profile"> 
            {/* Conditionally render user profile only if login is 'seller' */}
            
                
                <div className="name">
                <div className='logo'>
                  <Link to="/profile">
                    <FaUser size={24} color="white" /> {/* Profile Icon with white color */}
                  </Link>
                </div>
                  <h2 className='bebas-neue-regular'>{user}</h2> {/* Show the user's name */}
                </div>
          </div>
          <div className="im">
            <div className="names3">
              <Link to="/borrowed">
                <FaClipboardList size={24} color="white" />{/* My Orders Icon with white color */}
              </Link>
             
            </div>
            {login === 'Admin' && (
               <>
            <div className="login">
              <Link to="/admin"><h2>{login}</h2></Link>
            </div>
            </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;