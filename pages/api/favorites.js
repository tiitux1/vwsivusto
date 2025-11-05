import connectToDatabase, { UserPreferences } from '../../models'

export default async function handler(req, res) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const prefs = await UserPreferences.findOne({ userId: 'default' })
      res.status(200).json(prefs?.favorites || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
      res.status(500).json({ error: 'Failed to fetch favorites' })
    }
  } else if (req.method === 'POST') {
    try {
      const { favorites } = req.body
      await UserPreferences.findOneAndUpdate(
        { userId: 'default' },
        { favorites },
        { upsert: true, new: true }
      )
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error saving favorites:', error)
      res.status(500).json({ error: 'Failed to save favorites' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
