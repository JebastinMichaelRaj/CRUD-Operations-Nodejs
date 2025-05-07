const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mycruddb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/items', itemRoutes);

app.use(express.static('public')); // Add this line before routes


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
