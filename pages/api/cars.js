import connectToDatabase, { Car } from '../../models'

export default async function handler(req, res) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const cars = await Car.find({})
      res.status(200).json(cars)
    } catch (error) {
      console.error('Error fetching cars:', error)
      res.status(500).json({ error: 'Failed to fetch cars' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
