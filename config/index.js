const mongoose = require('mongoose');

console.log('testing');
(async () => {
  await mongoose.connect(process.env.DATABASE);
  const db = mongoose.connection;
  // .then((db) => console.log('DB connected ', { db }))
  // .catch((err) => console.log('Error In Connection', { err }));
  db.on('connected', () => {
    console.log('DB IS CONNEcTED');
  });

  db.on('error', () => {
    console.log('DB IS CONNEcTED');
  });

  db.on('disconnected', () => {
    console.log('DB IS CONNEcTED');
  });
})();
