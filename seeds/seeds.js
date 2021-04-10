const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./misc');
const BoulderSpot = require('../models/boulder-spot');

mongoose.connect('mongodb://localhost:27017/boulder-spots', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected');
});

const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await BoulderSpot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomCity = Math.floor(Math.random() * 1000);
    const boulderSpot = new BoulderSpot({
      title: `${randomElement(descriptors)} ${randomElement(places)}`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!`,
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
      image: 'https://source.unsplash.com/collection/483251',
    });
    await boulderSpot.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
