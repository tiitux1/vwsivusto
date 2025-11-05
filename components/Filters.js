import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    fuel: '',
    maxPrice: '',
    minYear: '',
    sortBy: ''
  })

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-vw p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Filter size={20} className="text-vw-blue" />
        <h2 className="text-xl font-semibold text-vw-blue">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by model..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <select
          value={filters.fuel}
          onChange={(e) => handleChange('fuel', e.target.value)}
          className="input-field"
        >
          <option value="">All Fuels</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>

        <input
          type="number"
          placeholder="Max Price (€)"
          value={filters.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          className="input-field"
        />

        <input
          type="number"
          placeholder="Min Year"
          value={filters.minYear}
          onChange={(e) => handleChange('minYear', e.target.value)}
          className="input-field"
        />

        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="input-field"
        >
          <option value="">Sort by...</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="year-desc">Newest First</option>
          <option value="year-asc">Oldest First</option>
          <option value="horsepower-desc">Most Powerful</option>
          <option value="horsepower-asc">Least Powerful</option>
        </select>
      </div>
    </div>
  )
}

export default Filters
