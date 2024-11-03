import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { checkIfOpen, formatDateTime, getBusinessHoursDisplay } from '../utils/businessHoursUtils';

const MenuDisplay = () => {
  // ... all state definitions remain the same ...
  const [menuData, setMenuData] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [specialDates, setSpecialDates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [nextClosedPeriod, setNextClosedPeriod] = useState(null);
  const dropdownRef = useRef(null);

  // All useEffect hooks remain the same...
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const SHEET_ID = '1VX-i0LIFaHrlR-grOZRgWeSNARxBm93ni1o3fyeVOw0';
        const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
        
        // ... rest of the data loading code remains exactly the same ...
        const menuResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`
        );
        
        const hoursResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/BusinessHours?key=${API_KEY}`
        );
        
        const specialResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/SpecialDates?key=${API_KEY}`
        );

        if (!menuResponse.ok || !hoursResponse.ok || !specialResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [menuData, hoursData, specialData] = await Promise.all([
          menuResponse.json(),
          hoursResponse.json(),
          specialResponse.json()
        ]);

        // Process menu data
        const [menuHeaders, ...menuRows] = menuData.values;
        const processedMenu = menuRows.map(row => ({
          Category: row[0] || '',
          Name: row[1] || '',
          Price: row[2] || '0.00',
          Description: row[3] || ''
        }));

        // Process business hours
        const [hoursHeaders, ...hoursRows] = hoursData.values;
        const processedHours = hoursRows.map(row => ({
          day: row[0],
          openTime: row[1],
          closeTime: row[2]
        }));

        // Process special dates
        const [specialHeaders, ...specialRows] = specialData.values;
        const processedSpecialDates = specialRows
          .filter(row => row[0] && row[1])
          .map(row => ({
            startDate: row[0],
            endDate: row[1],
            status: row[2],
            reason: row[3]
          }));

        // Group menu by category
        const categories = [...new Set(processedMenu.map(item => item.Category))];
        const formattedMenu = categories.map(category => ({
          category,
          items: processedMenu
            .filter(item => item.Category === category)
            .map(item => ({
              name: item.Name,
              price: parseFloat(item.Price || 0).toFixed(2),
              description: item.Description
            }))
        }));

        setMenuData(formattedMenu);
        setBusinessHours(processedHours);
        setSpecialDates(processedSpecialDates);
        
        const open = checkIfOpen(processedHours, processedSpecialDates);
        setIsOpen(open);

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const nextClosed = processedSpecialDates
          .find(date => {
            const startDate = new Date(date.startDate + 'T00:00:00');
            return startDate >= now;
          });
        setNextClosedPeriod(nextClosed);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error loading data. Please try again later.');
        setLoading(false);
      }
    };

    loadAllData();

    const interval = setInterval(() => {
      if (businessHours.length && specialDates.length) {
        setIsOpen(checkIfOpen(businessHours, specialDates));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const filteredMenu = menuData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    selectedCategory === 'all' || 
    category.category === selectedCategory
  ).filter(category => 
    searchQuery === '' || category.items.length > 0
  );

  if (loading) {
    return (
      <div className="min-h-[600px] flex justify-center items-center">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with Status and Contact Info */}
      <header className="mb-8 min-h-[150px]" role="banner">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-3xl font-bold">Skampa Restaurant</h1>
            <h2 className="text-xl mt-1">Mediterranean Cuisine & Best Roast Beef</h2>
            <p className="text-sm text-gray-600 mt-1">Cambridge's Premier Mediterranean Restaurant</p>
          </div>
          <div className="flex flex-col items-center sm:items-end mt-2 sm:mt-0 min-w-[200px]">
            {/* Status indicator with reserved space */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full min-w-[120px] justify-center ${
              isOpen ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                isOpen ? 'bg-blue-500' : 'bg-red-500'
              }`}></span>
              <span className="font-semibold">
                {isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
            
            <div className="text-sm mt-1 min-h-[20px]">
              {getBusinessHoursDisplay(businessHours)}
            </div>

            {nextClosedPeriod && (
              <div className="text-sm text-gray-600 mt-1 min-h-[20px]">
                Closed {formatDateTime(nextClosedPeriod.startDate)} - {formatDateTime(nextClosedPeriod.endDate)}
                {nextClosedPeriod.reason && (
                  <span className="text-red-600 ml-1">({nextClosedPeriod.reason})</span>
                )}
              </div>
            )}

            <address className="text-sm text-gray-600 mt-2 not-italic text-center sm:text-right">
              <a href="tel:+16173540009" className="hover:text-blue-600 block">617-354-0009</a>
              <a href="https://maps.google.com/?q=424+Cambridge+St,+Cambridge+MA+02141" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-blue-600 block">
                424 Cambridge St, Cambridge, MA
              </a>
            </address>
          </div>
        </div>
      </header>

      {/* Search and Categories with reserved space */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 min-h-[48px]">
        <input
          type="text"
          placeholder="Search our Mediterranean menu & famous roast beef..."
          aria-label="Search menu items"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="relative" ref={dropdownRef}>
          <button
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedCategory === 'all' ? 'Categories' : selectedCategory}
          </button>
          
          {isDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20 border"
              role="menu"
              aria-orientation="vertical"
            >
              <button
                role="menuitem"
                onClick={() => handleCategorySelect('all')}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedCategory === 'all' ? 'bg-blue-50 text-blue-500' : ''
                }`}
              >
                All Categories
              </button>
              {menuData.map((category, index) => (
                <button
                  key={index}
                  role="menuitem"
                  onClick={() => handleCategorySelect(category.category)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedCategory === category.category ? 'bg-blue-50 text-blue-500' : ''
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Items with reserved space */}
      <main role="main" aria-label="Restaurant Menu" className="min-h-[400px]">
        {filteredMenu.map((category, index) => (
          <section 
            key={index} 
            className="mb-8"
            aria-labelledby={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <h2 
              className="text-2xl font-bold mb-4" 
              id={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category.category}
            </h2>
            <div className="grid gap-4">
              {category.items.map((item, itemIndex) => (
                <article 
                  key={itemIndex} 
                  className="border p-4 rounded-lg"
                  itemScope 
                  itemType="https://schema.org/MenuItem"
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold" itemProp="name">{item.name}</h3>
                    <span className="text-gray-700" itemProp="price">${item.price}</span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 mt-2" itemProp="description">{item.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default MenuDisplay;