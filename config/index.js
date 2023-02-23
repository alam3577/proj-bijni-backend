const mongoose = require('mongoose');
const DB = process.env.DATABASE;

mongoose.set('strictQuery', false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('ERROR', err));
