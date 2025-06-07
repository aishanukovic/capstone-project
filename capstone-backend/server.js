const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

console.log("MONGO_URI:", process.env.MONGO_URI);

console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const questionnaireRoutes = require('./routes/questionnaireRoutes');
const fileUploadRoutes = require('./routes/fileUploadRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

app.get('/api/users/test', (req, res) => {
  res.send('User route is active');
});

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/uploads', fileUploadRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
  res.send('API is running and connected to MongoDB!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));