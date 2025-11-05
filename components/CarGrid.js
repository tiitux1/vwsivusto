import { Heart, GitCompare, Eye } from 'lucide-react'
import { useCarContext } from '../contexts/CarContext'

const CarCard = ({ car, onCarClick }) => {
  const { favorites, compareList, toggleFavorite, toggleCompare } = useCarContext()

  const isFavorite = favorites.includes(car.id)
  const isInCompare = compareList.includes(car.id)

  return (
    <div className="card animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={car.image}
          alt={car.model}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(car.id)
            }}
            className={`p-2 rounded-full transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleCompare(car.id)
            }}
            className={`p-2 rounded-full transition-all duration-200 ${
              isInCompare
                ? 'bg-green-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <GitCompare size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-vw-blue">{car.model}</h3>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>Year: {car.year}</p>
          <p>Engine: {car.engine}</p>
          <p>Horsepower: {car.horsepower} hp</p>
          <p>Fuel: {car.fuel}</p>
          {car.averageRating && (
            <p>Rating: ⭐ {car.averageRating} ({car.reviewCount} reviews)</p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-vw-blue">
            €{car.price.toLocaleString()}
          </span>
          <button
            onClick={() => onCarClick(car)}
            className="btn-primary flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const CarGrid = ({ cars, onCarClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} onCarClick={onCarClick} />
      ))}
    </div>
  )
}

export default CarGrid
