import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import CarGrid from '../components/CarGrid'
import Filters from '../components/Filters'
import Modal from '../components/Modal'
import CarDetails from '../components/CarDetails'
import { CarProvider } from '../contexts/CarContext'

export default function Home() {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [favorites, setFavorites] = useState([])
  const [compareList, setCompareList] = useState([])
  const [selectedCar, setSelectedCar] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    loadData()
    loadUserPreferences()
  }, [])

  const loadData = async () => {
    try {
      const response = await fetch('/api/cars')
      const data = await response.json()
      setCars(data)
      setFilteredCars(data)
    } catch (error) {
      console.error('Error loading cars:', error)
    }
  }

  const loadUserPreferences = async () => {
    try {
      const [favoritesRes, compareRes] = await Promise.all([
        fetch('/api/favorites'),
        fetch('/api/compare')
      ])
      const favoritesData = await favoritesRes.json()
      const compareData = await compareRes.json()
      setFavorites(favoritesData)
      setCompareList(compareData)
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  const handleFilterChange = (filters) => {
    let filtered = [...cars]

    if (filters.search) {
      filtered = filtered.filter(car =>
        car.model.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.fuel) {
      filtered = filtered.filter(car => car.fuel === filters.fuel)
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.price <= filters.maxPrice)
    }

    if (filters.minYear) {
      filtered = filtered.filter(car => car.year >= filters.minYear)
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc': return a.price - b.price
          case 'price-desc': return b.price - a.price
          case 'year-desc': return b.year - a.year
          case 'year-asc': return a.year - b.year
          case 'horsepower-desc': return b.horsepower - a.horsepower
          case 'horsepower-asc': return a.horsepower - b.horsepower
          default: return 0
        }
      })
    }

    setFilteredCars(filtered)
  }

  const toggleFavorite = async (carId) => {
    const newFavorites = favorites.includes(carId)
      ? favorites.filter(id => id !== carId)
      : [...favorites, carId]

    setFavorites(newFavorites)

    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites: newFavorites })
      })
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }

  const toggleCompare = async (carId) => {
    let newCompareList = [...compareList]

    if (newCompareList.includes(carId)) {
      newCompareList = newCompareList.filter(id => id !== carId)
    } else if (newCompareList.length < 2) {
      newCompareList.push(carId)
    } else {
      alert('You can compare maximum 2 cars at a time.')
      return
    }

    setCompareList(newCompareList)

    try {
      await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compare: newCompareList })
      })
    } catch (error) {
      console.error('Error saving compare list:', error)
    }
  }

  const openCarModal = (car) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCar(null)
  }

  return (
    <CarProvider value={{
      cars,
      filteredCars,
      favorites,
      compareList,
      currentLanguage,
      isDarkMode,
      toggleFavorite,
      toggleCompare,
      setCurrentLanguage,
      setIsDarkMode
    }}>
      <Head>
        <title>Volkswagen Model Finder</title>
        <meta name="description" content="Find your perfect Volkswagen car model" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Filters onFilterChange={handleFilterChange} />
          <CarGrid cars={filteredCars} onCarClick={openCarModal} />
        </main>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedCar && <CarDetails car={selectedCar} />}
        </Modal>
      </div>
    </CarProvider>
  )
}
