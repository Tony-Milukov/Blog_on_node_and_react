const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const messages = require('./messages.json');
const articlesRouter = require('./routes/articleRoutes');
const generalRouter = require('./routes/generalRoutes');
const app = express();
require("dotenv").config()
app.use(cors());

// default route
app.all('', (req:any, res:any) => {
  res.status(messages.default.status).json(messages.default);
});
app.use('/user', userRouter);
app.use('/articles', articlesRouter);
app.use(generalRouter);
app.use(express.static('static/avatars'));
const startServer = (PORT:any) => {
  try {
    app.listen(PORT);
    console.log(`Server was started, and is running on PORT: ${PORT}`);
  } catch (e) {
    console.log(e);
  }
};
startServer(process.env.PORT);
