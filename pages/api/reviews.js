import connectToDatabase, { Review, Car } from '../../models'

export default async function handler(req, res) {
  await connectToDatabase()

  if (req.method === 'POST') {
    try {
      const { carId, rating, comment, userId = 'anonymous' } = req.body

      const review = new Review({
        carId,
        userId,
        rating,
        comment
      })

      await review.save()

      // Update car's average rating
      const reviews = await Review.find({ carId })
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      const reviewCount = reviews.length

      await Car.findOneAndUpdate(
        { id: carId },
        { averageRating: averageRating.toFixed(1), reviewCount }
      )

      res.status(201).json({ success: true, review })
    } catch (error) {
      console.error('Error creating review:', error)
      res.status(500).json({ error: 'Failed to create review' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
