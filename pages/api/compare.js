import connectToDatabase, { UserPreferences } from '../../models'

export default async function handler(req, res) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const prefs = await UserPreferences.findOne({ userId: 'default' })
      res.status(200).json(prefs?.compare || [])
    } catch (error) {
      console.error('Error fetching compare list:', error)
      res.status(500).json({ error: 'Failed to fetch compare list' })
    }
  } else if (req.method === 'POST') {
    try {
      const { compare } = req.body
      await UserPreferences.findOneAndUpdate(
        { userId: 'default' },
        { compare },
        { upsert: true, new: true }
      )
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error saving compare list:', error)
      res.status(500).json({ error: 'Failed to save compare list' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
