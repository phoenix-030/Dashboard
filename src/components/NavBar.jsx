import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = ({ activeTab, onTabChange, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const tabs = [
    { id: 'table', label: 'Table', icon: '' },
    { id: 'add', label: 'Add Item', icon: '' },
    { id: 'chart', label: 'Chart', icon: '' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container-lg">
        <h2 className="navbar-brand mb-0">Expenses Tracker</h2>
        
        <div className="navbar-nav ms-auto d-lg-flex gap-2 flex-wrap justify-content-end align-items-center">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline-secondary'} nav-item`}>
                {tab.label}
              </button>
            ))}
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`btn ${isDarkMode ? 'btn-dark' : 'btn-outline-dark'} ms-2`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          {/* drp[down] */}
          {onLogout && (
            <div className="dropdown ms-lg-2">
              <button className="btn btn-outline-danger dropdown-toggle" type="button" onClick={() => setDropdownOpen(!dropdownOpen)} aria-expanded={dropdownOpen}>
                Account
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} style={{ minWidth: '150px' }}>
                <li>
                  <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); onTabChange('profile'); }}>
                    
                    🙎Profile
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={(e) => { e.stopPropagation(); onLogout(); }}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
