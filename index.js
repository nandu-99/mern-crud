const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const dotenv = require("dotenv");
const port = 3003;
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection string (replace with your own)
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

// Database Name
const dbName = 'myDatabase';
let db, collection;

async function connectDB() {
  await client.connect();
  console.log('Connected successfully to MongoDB Atlas');
  db = client.db(dbName);
  collection = db.collection('users');
}

connectDB().catch(console.error);

// API Routes

// Create (POST)
app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    const result = await collection.insertOne(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Read (GET)
app.get('/users', async (req, res) => {
  try {
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update (PUT)
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateUser = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateUser }
    );
    if (result.matchedCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete (DELETE)
app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
