const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect db
connectDB();

//Init middleware or same as bodyparser now included in express
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API running');
});

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
