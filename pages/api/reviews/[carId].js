import connectToDatabase, { Review } from '../../../models'

export default async function handler(req, res) {
  await connectToDatabase()

  const { carId } = req.query

  if (req.method === 'GET') {
    try {
      const reviews = await Review.find({ carId }).sort({ createdAt: -1 })
      res.status(200).json(reviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      res.status(500).json({ error: 'Failed to fetch reviews' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
