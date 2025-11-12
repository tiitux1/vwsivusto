let currentLanguage = localStorage.getItem('vwLanguage') || 'en';

// Language switching function
window.switchLanguage = function(lang) {
  currentLanguage = lang;
  localStorage.setItem('vwLanguage', lang);
  updateLanguage();
  const modal = document.getElementById('carModal');
  modal.style.display = 'none'; // Close the modal after switching language
};

// Update all text elements with current language
function updateLanguage() {
  const lang = languages[currentLanguage];
  if (!lang) {
    console.error('Language not found:', currentLanguage);
    currentLanguage = 'en'; // Fallback to English
    return updateLanguage();
  }

  // Update header
  document.querySelector('.logo h1').textContent = lang.title;
  document.querySelector('.logo p').textContent = lang.subtitle;

  // Update buttons
  document.getElementById('languageBtn').textContent = lang.language;
  document.getElementById('quizBtn').textContent = lang.carQuiz;
  document.getElementById('darkModeBtn').innerHTML = document.body.classList.contains('dark-mode') ? lang.lightMode : lang.darkMode;
  document.getElementById('calculatorBtn').textContent = lang.calculator;
  document.querySelector('#favoritesBtn .btn-text').textContent = lang.favorites;
  document.getElementById('clearFavoritesBtn').textContent = lang.clearFavorites;
  document.querySelector('#compareBtn .btn-text').textContent = lang.compare;
  document.getElementById('clearCompareBtn').textContent = lang.clearCompare;

  // Update filters
  document.getElementById('search').placeholder = lang.searchPlaceholder;
  document.querySelector('#fuelFilter option[value=""]').textContent = lang.allFuels;
  document.getElementById('priceFilter').placeholder = lang.maxPrice;
  document.getElementById('yearFilter').placeholder = lang.minYear;
  document.querySelector('#sortFilter option[value=""]').textContent = lang.sortBy;
  document.querySelector('#sortFilter option[value="price-asc"]').textContent = lang.priceLowToHigh;
  document.querySelector('#sortFilter option[value="price-desc"]').textContent = lang.priceHighToLow;
  document.querySelector('#sortFilter option[value="year-desc"]').textContent = lang.newestFirst;
  document.querySelector('#sortFilter option[value="year-asc"]').textContent = lang.oldestFirst;
  document.querySelector('#sortFilter option[value="horsepower-desc"]').textContent = lang.mostPowerful;
  document.querySelector('#sortFilter option[value="horsepower-asc"]').textContent = lang.leastPowerful;

  // Re-render cars to update button text
  const filteredCars = window.filteredCars || [];
  renderCars(filteredCars);
}

document.addEventListener('DOMContentLoaded', function() {
  const carGrid = document.getElementById('carGrid');
  const searchInput = document.getElementById('search');
  const fuelFilter = document.getElementById('fuelFilter');
  const priceFilter = document.getElementById('priceFilter');
  const yearFilter = document.getElementById('yearFilter');
  const sortFilter = document.getElementById('sortFilter');
  const modal = document.getElementById('carModal');
  const modalDetails = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.close');

  let cars = [];
  let filteredCars = [];
  let favorites = [];
  let compareList = [];

  window.filteredCars = filteredCars; // Make it global for updateLanguage

  // Load data from server
  async function loadData() {
    try {
      const [carsResponse, favoritesResponse, compareResponse] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/favorites'),
        fetch('/api/compare')
      ]);

      cars = await carsResponse.json();
      favorites = await favoritesResponse.json();
      compareList = await compareResponse.json();

      filteredCars = [...cars];
      window.filteredCars = filteredCars;
      renderCars(filteredCars);
      updateFavoritesCount();
      updateCompareCount();
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to localStorage if server is down
      favorites = JSON.parse(localStorage.getItem('vwFavorites')) || [];
      compareList = JSON.parse(localStorage.getItem('vwCompare')) || [];

      // Fallback car data (embedded in script for offline use)
      cars = [
        { id: 1, model: "Golf GTI", year: 2023, price: 38990, engine: "2.0L Turbo", horsepower: 245, transmission: "Automatic DSG", fuel: "Petrol", image: "images/golf-gti.jpg", description: "Iconic sporty hatchback combining performance and style." },
        { id: 2, model: "Passat", year: 2023, price: 32990, engine: "1.5L Turbo", horsepower: 150, transmission: "Manual", fuel: "Petrol", image: "images/passat-lol.jpg", description: "Comfortable family sedan with modern features." },
        { id: 3, model: "ID.4", year: 2023, price: 45990, engine: "Electric Motor", horsepower: 201, transmission: "Automatic", fuel: "Electric", image: "images/id4.jpg", description: "All-electric SUV with impressive range and tech." },
        { id: 4, model: "Polo", year: 2023, price: 19990, engine: "1.0L Turbo", horsepower: 95, transmission: "Manual", fuel: "Petrol", image: "images/polo.jpg", description: "Compact and efficient city car." },
        { id: 5, model: "Tiguan", year: 2023, price: 35990, engine: "2.0L Diesel", horsepower: 150, transmission: "Automatic", fuel: "Diesel", image: "images/tiguan.jpg", description: "Versatile SUV for family adventures." },
        { id: 6, model: "Arteon", year: 2023, price: 41990, engine: "2.0L Turbo", horsepower: 190, transmission: "Automatic DSG", fuel: "Petrol", image: "images/arteon.jpg", description: "Elegant fastback with premium interior." },
        { id: 7, model: "Touareg", year: 2023, price: 69990, engine: "3.0L V6 Diesel", horsepower: 286, transmission: "Automatic", fuel: "Diesel", image: "images/touareg.jpg", description: "Luxury SUV with off-road capabilities and premium comfort." },
        { id: 8, model: "Golf R", year: 2023, price: 52990, engine: "2.0L Turbo", horsepower: 320, transmission: "Automatic DSG", fuel: "Petrol", image: "images/golf-r.jpg", description: "High-performance version of the Golf with all-wheel drive." },
        { id: 9, model: "ID.3", year: 2023, price: 39990, engine: "Electric Motor", horsepower: 204, transmission: "Automatic", fuel: "Electric", image: "images/id3.jpg", description: "Compact electric hatchback with modern design." },
        { id: 10, model: "T-Roc", year: 2023, price: 28990, engine: "1.5L Turbo", horsepower: 150, transmission: "Manual", fuel: "Petrol", image: "images/t-roc.jpg", description: "Stylish compact SUV with urban appeal." },
        { id: 11, model: "Sharan", year: 2023, price: 44990, engine: "2.0L Diesel", horsepower: 150, transmission: "Automatic DSG", fuel: "Diesel", image: "images/sharan.jpg", description: "Spacious family MPV with sliding doors." },
        { id: 12, model: "Caddy", year: 2023, price: 31990, engine: "2.0L Diesel", horsepower: 122, transmission: "Manual", fuel: "Diesel", image: "images/caddy.jpg", description: "Versatile commercial vehicle perfect for business use." },
        { id: 13, model: "Amarok", year: 2023, price: 49990, engine: "3.0L V6 Diesel", horsepower: 224, transmission: "Automatic", fuel: "Diesel", image: "images/amarok.jpg", description: "Robust pickup truck for work and adventure." },
        { id: 14, model: "Taos", year: 2023, price: 32990, engine: "1.5L Turbo", horsepower: 158, transmission: "Automatic", fuel: "Petrol", image: "images/taos.jpg", description: "Compact crossover SUV with modern features." },
        { id: 15, model: "Atlas", year: 2023, price: 41990, engine: "2.0L Turbo", horsepower: 235, transmission: "Automatic", fuel: "Petrol", image: "images/atlas.jpg", description: "Large family SUV with three rows of seating." }
      ];

      filteredCars = [...cars];
      window.filteredCars = filteredCars;
      renderCars(filteredCars);
      updateFavoritesCount();
      updateCompareCount();
    }
  }



  // Save favorites to server
  async function saveFavorites() {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites })
      });
    } catch (error) {
      console.error('Error saving favorites:', error);
      // Fallback to localStorage
      localStorage.setItem('vwFavorites', JSON.stringify(favorites));
    }
  }

  // Save compare list to server
  async function saveCompare() {
    try {
      await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compare: compareList })
      });
    } catch (error) {
      console.error('Error saving compare list:', error);
      // Fallback to localStorage
      localStorage.setItem('vwCompare', JSON.stringify(compareList));
    }
  }

  function renderCars(carsToRender) {
    const lang = languages[currentLanguage];
    carGrid.innerHTML = '';
    carsToRender.forEach(car => {
      const isFavorite = favorites.includes(car.id);
      const isInCompare = compareList.includes(car.id);
      const carCard = document.createElement('div');
      carCard.className = 'car-card';
      carCard.innerHTML = `
        <img src="${car.image}" alt="${car.model}">
        <div class="car-card-content">
          <div class="car-header">
            <h3>${car.model}</h3>
            <div class="car-actions">
              <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${car.id})">
                ${isFavorite ? '❤️' : '🤍'}
              </button>
              <button class="compare-btn ${isInCompare ? 'active' : ''}" onclick="toggleCompare(${car.id})">
                ${isInCompare ? '✅' : '➕'}
              </button>
            </div>
          </div>
          <p class="price">€${car.price.toLocaleString()}</p>
          <p>${lang ? lang.year : 'Year'}: ${car.year}</p>
          <p>${lang ? lang.engine : 'Engine'}: ${car.engine}</p>
          <p>${lang ? lang.horsepower : 'Horsepower'}: ${car.horsepower} hp</p>
          <p>${lang ? lang.fuel : 'Fuel'}: ${car.fuel}</p>
          ${car.averageRating ? `<p>${lang ? lang.rating : 'Rating'}: ⭐ ${car.averageRating} (${car.reviewCount} ${lang ? lang.reviews : 'reviews'})</p>` : ''}
          <button onclick="showCarDetails(${car.id})">${lang ? lang.viewDetails : 'View Details'}</button>
        </div>
      `;
      carGrid.appendChild(carCard);
    });
  }

  function sortCars(carsToSort, sortBy) {
    const sorted = [...carsToSort];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'year-desc':
        return sorted.sort((a, b) => b.year - a.year);
      case 'year-asc':
        return sorted.sort((a, b) => a.year - b.year);
      case 'horsepower-desc':
        return sorted.sort((a, b) => b.horsepower - a.horsepower);
      case 'horsepower-asc':
        return sorted.sort((a, b) => a.horsepower - b.horsepower);
      default:
        return sorted;
    }
  }

  function filterAndSortCars() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedFuel = fuelFilter.value;
    const maxPrice = parseInt(priceFilter.value) || Infinity;
    const minYear = parseInt(yearFilter.value) || 0;
    const sortBy = sortFilter.value;

    filteredCars = cars.filter(car => {
      const matchesSearch = car.model.toLowerCase().includes(searchTerm);
      const matchesFuel = !selectedFuel || car.fuel === selectedFuel;
      const matchesPrice = car.price <= maxPrice;
      const matchesYear = car.year >= minYear;

      return matchesSearch && matchesFuel && matchesPrice && matchesYear;
    });

    filteredCars = sortCars(filteredCars, sortBy);
    renderCars(filteredCars);
  }

  window.showCarDetails = async function(carId) {
    const car = cars.find(c => c.id === carId);
    if (car) {
      const lang = languages[currentLanguage];
      // Load reviews for this car
      let reviews = [];
      try {
        const response = await fetch(`/api/reviews/${carId}`);
        reviews = await response.json();
      } catch (error) {
        console.error('Error loading reviews:', error);
      }

      modalDetails.innerHTML = `
        <div class="modal-details">
          <img src="${car.image}" alt="${car.model}">
          <h2>${car.model}</h2>
          <p>${car.description}</p>
          <table class="specs-table">
            <tr><th>${lang ? lang.year : 'Year'}</th><td>${car.year}</td></tr>
            <tr><th>${lang ? lang.price : 'Price'}</th><td>€${car.price.toLocaleString()}</td></tr>
            <tr><th>${lang ? lang.engine : 'Engine'}</th><td>${car.engine}</td></tr>
            <tr><th>${lang ? lang.horsepower : 'Horsepower'}</th><td>${car.horsepower} hp</td></tr>
            <tr><th>${lang ? lang.transmission : 'Transmission'}</th><td>${car.transmission}</td></tr>
            <tr><th>${lang ? lang.fuel : 'Fuel'}</th><td>${car.fuel}</td></tr>
            ${car.averageRating ? `<tr><th>${lang ? lang.rating : 'Rating'}</th><td>⭐ ${car.averageRating} (${car.reviewCount} ${lang ? lang.reviews : 'reviews'})</td></tr>` : ''}
          </table>

          <div class="reviews-section">
            <h3>${lang ? lang.customerReviews : 'Customer Reviews'}</h3>
            <div id="reviewsList">
              ${reviews.length > 0 ? reviews.map(review => `
                <div class="review-item">
                  <div class="review-header">
                    <span class="review-rating">⭐ ${review.rating}/5</span>
                    <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p class="review-comment">${review.comment}</p>
                  <small class="review-user">By: ${review.userId}</small>
                </div>
              `).join('') : `<p>${lang ? lang.noReviews : 'No reviews yet. Be the first to review!'}</p>`}
            </div>

            <div class="add-review">
              <h4>${lang ? lang.addReview : 'Add Your Review'}</h4>
              <form id="reviewForm" onsubmit="submitReview(event, ${carId})">
                <div class="rating-input">
                  <label>${lang ? lang.selectRating : 'Select rating'}:</label>
                  <select id="reviewRating" required>
                    <option value="">${lang ? lang.selectRating : 'Select rating'}</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>
                <div class="comment-input">
                  <label>${lang ? lang.shareThoughts : 'Share your thoughts about this car...'}:</label>
                  <textarea id="reviewComment" placeholder="${lang ? lang.shareThoughts : 'Share your thoughts about this car...'}" required></textarea>
                </div>
                <button type="submit" class="submit-review-btn">${lang ? lang.submitReview : 'Submit Review'}</button>
              </form>
            </div>
          </div>
        </div>
      `;
      modal.style.display = 'block';
    }
  };

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  window.toggleFavorite = function(carId) {
    const index = favorites.indexOf(carId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(carId);
    }
    saveFavorites();
    updateFavoritesCount();
    filterAndSortCars();
  };

  window.toggleCompare = function(carId) {
    const index = compareList.indexOf(carId);
    if (index > -1) {
      compareList.splice(index, 1);
    } else if (compareList.length < 2) {
      compareList.push(carId);
    } else {
      alert(languages[currentLanguage] ? languages[currentLanguage].maxTwoCars : 'You can compare maximum 2 cars at a time.');
      return;
    }
    saveCompare();
    updateCompareCount();
    filterAndSortCars();
  };

  function updateFavoritesCount() {
    document.getElementById('favoritesCount').textContent = favorites.length;
    toggleClearButtons();
  }

  function updateCompareCount() {
    document.getElementById('compareCount').textContent = compareList.length;
    toggleClearButtons();
  }

  function toggleClearButtons() {
    const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
    const clearCompareBtn = document.getElementById('clearCompareBtn');

    if (favorites.length > 0) {
      clearFavoritesBtn.style.display = 'inline-block';
    } else {
      clearFavoritesBtn.style.display = 'none';
    }

    if (compareList.length > 0) {
      clearCompareBtn.style.display = 'inline-block';
    } else {
      clearCompareBtn.style.display = 'none';
    }
  }

  // Event listeners for filters
  searchInput.addEventListener('input', filterAndSortCars);
  fuelFilter.addEventListener('change', filterAndSortCars);
  priceFilter.addEventListener('input', filterAndSortCars);
  yearFilter.addEventListener('input', filterAndSortCars);
  sortFilter.addEventListener('change', filterAndSortCars);



  document.getElementById('languageBtn').addEventListener('click', function() {
    showLanguageSelector();
  });

  document.getElementById('quizBtn').addEventListener('click', function() {
    startCarQuiz();
  });

  document.getElementById('darkModeBtn').addEventListener('click', function() {
    toggleDarkMode();
  });

  document.getElementById('calculatorBtn').addEventListener('click', function() {
    showCalculator();
  });

  document.getElementById('favoritesBtn').addEventListener('click', function() {
    const lang = languages[currentLanguage];
    if (favorites.length === 0) {
      alert(lang ? lang.noFavorites : 'No favorites added yet!');
      return;
    }
    const favoriteCars = cars.filter(car => favorites.includes(car.id));
    renderCars(favoriteCars);
  });

  document.getElementById('clearFavoritesBtn').addEventListener('click', function() {
    const lang = languages[currentLanguage];
    if (confirm(lang ? lang.confirmClearFavorites : 'Are you sure you want to clear all favorites?')) {
      favorites = [];
      saveFavorites();
      updateFavoritesCount();
      filterAndSortCars();
      toggleClearButtons();
    }
  });

  document.getElementById('compareBtn').addEventListener('click', function() {
    const lang = languages[currentLanguage];
    if (compareList.length < 2) {
      alert(lang ? lang.selectTwoCars : 'Please select 2 cars to compare!');
      return;
    }
    showComparison();
  });

  document.getElementById('clearCompareBtn').addEventListener('click', function() {
    const lang = languages[currentLanguage];
    if (confirm(lang ? lang.confirmClearCompare : 'Are you sure you want to clear all compared cars?')) {
      compareList = [];
      saveCompare();
      updateCompareCount();
      filterAndSortCars();
      toggleClearButtons();
    }
  });



  function showLanguageSelector() {
    const lang = languages[currentLanguage];
    modalDetails.innerHTML = `
      <div class="language-modal">
        <h2>${lang ? lang.language : '🌐 Language'}</h2>
        <div class="language-options">
          <button onclick="window.switchLanguage('en')" class="language-option ${currentLanguage === 'en' ? 'active' : ''}">
            🇺🇸 ${lang ? lang.english : 'English'}
          </button>
          <button onclick="window.switchLanguage('fi')" class="language-option ${currentLanguage === 'fi' ? 'active' : ''}">
            🇫🇮 ${lang ? lang.finnish : 'Suomi'}
          </button>
        </div>
      </div>
    `;
    modal.style.display = 'block';
  }

  function showComparison() {
    const lang = languages[currentLanguage];
    const car1 = cars.find(c => c.id === compareList[0]);
    const car2 = cars.find(c => c.id === compareList[1]);
    if (car1 && car2) {
      modalDetails.innerHTML = `
        <div class="comparison-modal">
          <h2>${lang ? lang.carComparison : 'Car Comparison'}</h2>
          <div class="comparison-container">
            <div class="comparison-car">
              <img src="${car1.image}" alt="${car1.model}">
              <h3>${car1.model}</h3>
              <table class="specs-table">
                <tr><th>${lang ? lang.year : 'Year'}</th><td>${car1.year}</td></tr>
                <tr><th>${lang ? lang.price : 'Price'}</th><td>€${car1.price.toLocaleString()}</td></tr>
                <tr><th>${lang ? lang.engine : 'Engine'}</th><td>${car1.engine}</td></tr>
                <tr><th>${lang ? lang.horsepower : 'Horsepower'}</th><td>${car1.horsepower} hp</td></tr>
                <tr><th>${lang ? lang.transmission : 'Transmission'}</th><td>${car1.transmission}</td></tr>
                <tr><th>${lang ? lang.fuel : 'Fuel'}</th><td>${car1.fuel}</td></tr>
              </table>
            </div>
            <div class="comparison-car">
              <img src="${car2.image}" alt="${car2.model}">
              <h3>${car2.model}</h3>
              <table class="specs-table">
                <tr><th>${lang ? lang.year : 'Year'}</th><td>${car2.year}</td></tr>
                <tr><th>${lang ? lang.price : 'Price'}</th><td>€${car2.price.toLocaleString()}</td></tr>
                <tr><th>${lang ? lang.engine : 'Engine'}</th><td>${car2.engine}</td></tr>
                <tr><th>${lang ? lang.horsepower : 'Horsepower'}</th><td>${car2.horsepower} hp</td></tr>
                <tr><th>${lang ? lang.transmission : 'Transmission'}</th><td>${car2.transmission}</td></tr>
                <tr><th>${lang ? lang.fuel : 'Fuel'}</th><td>${car2.fuel}</td></tr>
              </table>
            </div>
          </div>
        </div>
      `;
      modal.style.display = 'block';
    }
  }

  function startCarQuiz() {
    const lang = languages[currentLanguage];
    const quizQuestions = [
      {
        question: "Which Volkswagen model is known for its iconic 'Beetle' shape?",
        options: ["Golf", "Polo", "Beetle", "Passat"],
        correct: 2
      },
      {
        question: "What does 'VW' stand for?",
        options: ["Volkswagen", "Volks Wagon", "Volkswagen Works", "Volkswagen Group"],
        correct: 0
      },
      {
        question: "Which Volkswagen model is fully electric?",
        options: ["Golf GTI", "ID.3", "Arteon", "Tiguan"],
        correct: 1
      },
      {
        question: "What is the most powerful Volkswagen road car?",
        options: ["Golf R", "Arteon R", "Touareg R", "ID.4 GTX"],
        correct: 1
      },
      {
        question: "Which Volkswagen SUV is the largest?",
        options: ["Tiguan", "Touareg", "Atlas", "Taos"],
        correct: 2
      }
    ];

    let currentQuestion = 0;
    let score = 0;

    function showQuestion() {
      const question = quizQuestions[currentQuestion];
      modalDetails.innerHTML = `
        <div class="quiz-modal">
          <h2>${lang ? lang.carQuiz : '🚗 Car Quiz'}</h2>
          <div class="quiz-progress">Question ${currentQuestion + 1} of ${quizQuestions.length}</div>
          <div class="quiz-score">Score: ${score}/${quizQuestions.length}</div>
          <div class="quiz-question">${question.question}</div>
          <div class="quiz-options">
            ${question.options.map((option, index) =>
              `<button class="quiz-option" onclick="selectAnswer(${index})">${option}</button>`
            ).join('')}
          </div>
        </div>
      `;
      modal.style.display = 'block';
    }

    window.selectAnswer = function(selectedIndex) {
      const question = quizQuestions[currentQuestion];
      if (selectedIndex === question.correct) {
        score++;
      }
      currentQuestion++;

      if (currentQuestion < quizQuestions.length) {
        showQuestion();
      } else {
        showResults();
      }
    };

    function showResults() {
      const percentage = Math.round((score / quizQuestions.length) * 100);
      let message = "";
      if (percentage >= 80) {
        message = lang ? lang.excellent : "🏆 Excellent! You're a Volkswagen expert!";
      } else if (percentage >= 60) {
        message = lang ? lang.goodJob : "👍 Good job! You know your Volkswagens!";
      } else {
        message = lang ? lang.keepLearning : "📚 Keep learning about Volkswagen cars!";
      }

      modalDetails.innerHTML = `
        <div class="quiz-modal">
          <h2>${lang ? lang.quizComplete : 'Quiz Complete!'}</h2>
          <div class="quiz-results">
            <div class="final-score">${lang ? lang.finalScore : 'Final Score:'} ${score}/${quizQuestions.length} (${percentage}%)</div>
            <div class="quiz-message">${message}</div>
            <button onclick="startCarQuiz()" class="quiz-restart">${lang ? lang.takeQuizAgain : 'Take Quiz Again'}</button>
          </div>
        </div>
      `;
    }

    showQuestion();
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('vwDarkMode', isDarkMode);

    // Update button text
    const darkModeBtn = document.getElementById('darkModeBtn');
    darkModeBtn.innerHTML = isDarkMode ? (languages[currentLanguage] ? languages[currentLanguage].lightMode : '☀️ Light Mode') : (languages[currentLanguage] ? languages[currentLanguage].darkMode : '🌙 Dark Mode');
  }

  function showCalculator() {
    const lang = languages[currentLanguage];
    modalDetails.innerHTML = `
      <div class="calculator-modal">
        <h2>${lang ? lang.carFinancingCalculator : 'Car Financing Calculator'}</h2>
        <div class="calculator-form">
          <div class="calc-input">
            <label>${lang ? lang.carPrice : 'Car Price (€)'}</label>
            <input type="number" id="calcPrice" placeholder="50000">
          </div>
          <div class="calc-input">
            <label>${lang ? lang.downPayment : 'Down Payment (€)'}</label>
            <input type="number" id="calcDownPayment" placeholder="10000">
          </div>
          <div class="calc-input">
            <label>${lang ? lang.loanTerm : 'Loan Term (years)'}</label>
            <input type="number" id="calcYears" placeholder="5">
          </div>
          <div class="calc-input">
            <label>${lang ? lang.interestRate : 'Interest Rate (%)'}</label>
            <input type="number" id="calcRate" placeholder="5.5" step="0.1">
          </div>
          <button onclick="calculateLoan()" class="calc-btn">${lang ? lang.calculate : 'Calculate'}</button>
        </div>
        <div id="calcResults" class="calc-results" style="display: none;">
          <h3>${lang ? lang.monthlyPayment : 'Monthly Payment:'} <span id="monthlyPayment">€0</span></h3>
          <div class="calc-breakdown">
            <p>${lang ? lang.totalLoanAmount : 'Total Loan Amount:'} <span id="totalLoan">€0</span></p>
            <p>${lang ? lang.totalInterest : 'Total Interest:'} <span id="totalInterest">€0</span></p>
            <p>${lang ? lang.totalPayment : 'Total Payment:'} <span id="totalPayment">€0</span></p>
          </div>
        </div>
      </div>
    `;
    modal.style.display = 'block';
  }

  window.calculateLoan = function() {
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const downPayment = parseFloat(document.getElementById('calcDownPayment').value) || 0;
    const years = parseFloat(document.getElementById('calcYears').value) || 1;
    const rate = parseFloat(document.getElementById('calcRate').value) || 0;

    const loanAmount = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;

    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;

    document.getElementById('monthlyPayment').textContent = `€${monthlyPayment.toFixed(2)}`;
    document.getElementById('totalLoan').textContent = `€${loanAmount.toFixed(2)}`;
    document.getElementById('totalInterest').textContent = `€${totalInterest.toFixed(2)}`;
    document.getElementById('totalPayment').textContent = `€${totalPayment.toFixed(2)}`;
    document.getElementById('calcResults').style.display = 'block';
  };

  // Load dark mode preference
  if (localStorage.getItem('vwDarkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeBtn').innerHTML = languages[currentLanguage] ? languages[currentLanguage].lightMode : '☀️ Light Mode';
  }

  window.submitReview = async function(event, carId) {
    event.preventDefault();
    const lang = languages[currentLanguage];

    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, rating, comment })
      });

      if (response.ok) {
        alert(lang ? lang.reviewSubmitted : 'Review submitted successfully!');
        // Reload the car details to show the new review
        showCarDetails(carId);
        // Reload cars to update ratings
        loadData();
      } else {
        alert(lang ? lang.failedSubmitReview : 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(lang ? lang.errorSubmitReview : 'Error submitting review. Please try again.');
    }
  };

  // Initial setup
  loadData();
  updateLanguage();
});
