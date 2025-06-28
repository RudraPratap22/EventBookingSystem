import React, { useState } from 'react';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your actual key

const UnsplashImagePicker = ({ onSelect, currentImageUrl }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(currentImageUrl || '');

  const searchImages = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=12&orientation=landscape`
      );
      setImages(response.data.results);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Error fetching images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    onSelect(imageUrl);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchImages();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for images (e.g., music, concert, conference)"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={searchImages}
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Searching for images...</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Select an image:</h4>
          <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                  selectedImage === img.urls.regular
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleImageSelect(img.urls.regular)}
              >
                <img
                  src={img.urls.thumb}
                  alt={img.alt_description || 'Event image'}
                  className="w-full h-24 object-cover"
                />
                {selectedImage === img.urls.regular && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Selected Image:</h4>
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected event image"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedImage('');
                onSelect('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnsplashImagePicker; 