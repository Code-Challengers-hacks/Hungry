require('dotenv').config({ path: '.env.local' });
const express = require('express');
const { sequelize } = require('./Modals/models')

const authRoutes = require('./routes/authRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

var cors = require('cors')
const app = express();
const PORT = 4000;
 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin : 'http://localhost:3000'
}));

app.use('/api/auth',authRoutes);

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/seller',sellerRoutes);
app.use('/api/user',userRoutes);

app.use('/uploads/images', express.static('uploads/images'));

app.get('/api/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join('uploads', 'images', imageName);
  console.log(imagePath)
  res.sendFile(imagePath, { root: 'routes' });
});

(async () => {
  try {
    await sequelize.sync(); 
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();
