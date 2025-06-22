const express = require('express');
const path = require('path');
const { connectToDatabase } = require('./db');
const { saveTrip, getAllTrips, getTripById, updateTrip, deleteTrip } = require('./services/tripService');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

connectToDatabase();

app.get('/api/trips', async (req,res) => {
    try {
        const trips = await getAllTrips();
        res.json(trips);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch Trips"});
    }
});

app.post('/api/trips', async (req, res) => {
    try {
        const trip = await getTripById(req.params.id);
        if (!trip) {
            return res.status(404).json({error: 'Trip not found:'});
        }
        res.json(trip);

    } catch (error) {
        res.status(500).json({ error: 'Failed to update trip'});
    }
});

app.delete('/api/trips/:id', async (req, res) => {
  try {
    await deleteTrip(req.params.id);
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});