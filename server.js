// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;  // Set the port for the server, defaulting to 3000

// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());

// Connect to MongoDB database
const MONGODB_URI = 'mongodb+srv://bilesanmioluwafayokunmi:DZgBxzkiPBHh7F0p@flashcard.r9ictel.mongodb.net/flashcard';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for flashcards in MongoDB
const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

// Middleware to parse JSON in request bodies
app.use(bodyParser.json());

// Endpoint to add new flashcards to the database
app.post('/api/flashcard', async (req, res) => {
  const { question, answer } = req.body;

  try {
    // Create a new Flashcard instance and save it to the database
    const newFlashcard = new Flashcard({ question, answer });
    await newFlashcard.save();
    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error('Error adding flashcard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve static HTML files from the 'public' directory
app.use(express.static('public'));

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});

// Endpoint to get a random flashcard from the database
app.get('/api/flashcards', async (req, res) => {
  try {
    // Use aggregation to retrieve a random flashcard from the database
    const flashcards = await Flashcard.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get the history of answered questions
app.get('/api/history', async (req, res) => {
  try {
    // Retrieve all flashcards where the 'answer' field exists
    const answeredFlashcards = await Flashcard.find({ answer: { $exists: true } });
    res.status(200).json(answeredFlashcards);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
