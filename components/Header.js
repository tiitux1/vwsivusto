import { useState } from 'react'
import { Heart, GitCompare, Building, Globe, Gamepad2, Moon, Sun, Calculator } from 'lucide-react'
import { useCarContext } from '../contexts/CarContext'

const Header = () => {
  const {
    favorites,
    compareList,
    currentLanguage,
    isDarkMode,
    setCurrentLanguage,
    setIsDarkMode
  } = useCarContext()

  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showDealerships, setShowDealerships] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)

  const languages = {
    en: 'English',
    fi: 'Suomi',
    sv: 'Svenska'
  }

  return (
    <header className="bg-gradient-to-r from-vw-blue to-vw-light-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold">Volkswagen Model Finder</h1>
              <p className="text-sm opacity-90">Find your perfect Volkswagen</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDealerships(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Building size={18} />
              <span className="hidden md:inline">Dealerships</span>
            </button>

            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors relative"
            >
              <Globe size={18} />
              <span className="hidden md:inline">Language</span>
              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white text-gray-900 rounded-lg shadow-lg py-2 min-w-[120px] z-50">
                  {Object.entries(languages).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrentLanguage(code)
                        setShowLanguageMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        currentLanguage === code ? 'bg-vw-light-blue text-white' : ''
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </button>

            <button
              onClick={() => setShowQuiz(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Gamepad2 size={18} />
              <span className="hidden md:inline">Quiz</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="hidden md:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={() => setShowCalculator(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Calculator size={18} />
              <span className="hidden md:inline">Calculator</span>
            </button>

            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors relative">
              <Heart size={18} />
              <span className="hidden md:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors relative">
              <GitCompare size={18} />
              <span className="hidden md:inline">Compare</span>
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
