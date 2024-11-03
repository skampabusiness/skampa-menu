import React, { useState, useEffect } from 'react';
import _ from 'lodash';

const MenuDisplay = () => {
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const SHEET_ID = '1VX-i0LIFaHrlR-grOZRgWeSNARxBm93ni1o3fyeVOw0';
        const SHEET_NAME = 'Sheet1';
        const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
          throw new Error('No data found in sheet');
        }

        // Process the data
        const [headers, ...rows] = data.values;
        const processedData = rows.map(row => ({
          Category: row[0] || '',
          Name: row[1] || '',
          Price: row[2] || '0.00',
          Description: row[3] || ''
        }));

        // Group by category while maintaining sheet order
        const categories = [...new Set(processedData.map(item => item.Category))];
        const formattedMenu = categories.map(category => ({
          category,
          items: processedData
            .filter(item => item.Category === category)
            .map(item => ({
              name: item.Name,
              price: parseFloat(item.Price || 0).toFixed(2),
              description: item.Description
            }))
        }));

        setMenuData(formattedMenu);
        setLoading(false);
      } catch (error) {
        console.error('Error loading menu:', error);
        setError('Error loading menu data. Please try again later.');
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

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
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search menu..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        {menuData.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category.category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category.category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category.category}
          </button>
        ))}
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