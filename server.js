require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const mongoose = require('mongoose');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// ROUTES
const projectsRouter = require('./routes/projects');
const contactRouter  = require('./routes/contact');

app.use('/api/projects', projectsRouter);
app.use('/api/contact',  contactRouter);

// CONNECT TO MONGODB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
});