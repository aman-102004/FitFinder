const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/gyms',    require('./routes/gyms'));
app.use('/api/chat',    require('./routes/chat'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/tracker', require('./routes/tracker'));



app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FitFinder backend is running!' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Backend running at http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
