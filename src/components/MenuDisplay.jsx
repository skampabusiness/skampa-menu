import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { checkIfOpen, formatDateTime, getBusinessHoursDisplay } from '../utils/businessHoursUtils';

const MenuDisplay = () => {
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

  // Close dropdown when clicking outside
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
        
        // Fetch menu data
        const menuResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`
        );
        
        // Fetch business hours
        const hoursResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/BusinessHours?key=${API_KEY}`
        );
        
        // Fetch special dates
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
        const processedSpecialDates = specialRows.map(row => ({
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
        
        // Check if currently open
        const open = checkIfOpen(processedHours, processedSpecialDates);
        setIsOpen(open);

        // Find next closed period
        const nextClosed = processedSpecialDates
          .find(date => new Date(date.startDate) > new Date());
        setNextClosedPeriod(nextClosed);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error loading data. Please try again later.');
        setLoading(false);
      }
    };

    loadAllData();

    // Update open/closed status every minute
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with Open/Closed Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Skampa Menu</h1>
        <div className="flex flex-col items-center sm:items-end mt-2 sm:mt-0">
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${
            isOpen ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              isOpen ? 'bg-blue-500' : 'bg-red-500'
            }`}></span>
            <span className="font-semibold">
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <div className="text-sm mt-1">
            {getBusinessHoursDisplay(businessHours)}
          </div>
          {nextClosedPeriod && (
            <div className="text-sm text-gray-600 mt-1">
              Closed {formatDateTime(nextClosedPeriod.startDate)} - {formatDateTime(nextClosedPeriod.endDate)}
              {nextClosedPeriod.reason && (
                <span className="text-red-600 ml-1">({nextClosedPeriod.reason})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search and Category Selection */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search menu..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {/* Categories Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedCategory === 'all' ? 'Categories' : selectedCategory}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20 border">
              <button
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

      {/* Menu Items */}
      {filteredMenu.map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
          <div className="grid gap-4">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <span className="text-gray-700">${item.price}</span>
                </div>
                {item.description && (
                  <p className="text-gray-600 mt-2">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuDisplay;