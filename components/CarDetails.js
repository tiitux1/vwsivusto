import { useState, useEffect } from 'react'
import { Star, MessageSquare } from 'lucide-react'

const CarDetails = ({ car }) => {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: '', comment: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [car.id])

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${car.id}`)
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!newReview.rating || !newReview.comment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          rating: parseInt(newReview.rating),
          comment: newReview.comment
        })
      })

      if (response.ok) {
        setNewReview({ rating: '', comment: '' })
        loadReviews()
        alert('Review submitted successfully!')
      } else {
        alert('Failed to submit review. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <img
            src={car.image}
            alt={car.model}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold text-vw-blue mb-2">{car.model}</h2>
          <p className="text-gray-600 mb-4">{car.description}</p>
        </div>

        <div>
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <tbody>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">Year</td>
                <td className="border border-gray-300 p-3">{car.year}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Price</td>
                <td className="border border-gray-300 p-3">€{car.price.toLocaleString()}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">Engine</td>
                <td className="border border-gray-300 p-3">{car.engine}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Horsepower</td>
                <td className="border border-gray-300 p-3">{car.horsepower} hp</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">Transmission</td>
                <td className="border border-gray-300 p-3">{car.transmission}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Fuel</td>
                <td className="border border-gray-300 p-3">{car.fuel}</td>
              </tr>
              {car.averageRating && (
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Rating</td>
                  <td className="border border-gray-300 p-3">
                    ⭐ {car.averageRating} ({car.reviewCount} reviews)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-vw-blue mb-4 flex items-center">
          <MessageSquare size={20} className="mr-2" />
          Customer Reviews
        </h3>

        <div className="space-y-4 mb-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">By: {review.userId}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-vw-blue mb-4">Add Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview(prev => ({ ...prev, rating: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your thoughts about this car..."
                className="input-field resize-none"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CarDetails
