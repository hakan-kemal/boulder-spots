const ejs-mate = require('ejs-mate')
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const server = express();
const PORT = 4000 || process.env.PORT;

const BoulderSpot = require('./models/boulder-spot');

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

server.engine('ejs', ejs-mate)
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(morgan('tiny'));

server.get('/', (req, res) => {
  console.log('root route connected');
  res.render('root');
});

server.get('/boulder-spots', async (req, res) => {
  const spots = await BoulderSpot.find({});
  console.log('boulder-spots route connected');
  res.render('boulder-spots/index', { spots });
});

server.get('/boulder-spots/new', (req, res) => {
  console.log('create get route connected');
  res.render('boulder-spots/create');
});

server.post('/boulder-spots', async (req, res) => {
  const spot = new BoulderSpot(req.body.boulderSpot);
  await spot.save();
  res.redirect(`/boulder-spots/${spot._id}`);
  console.log('create post route connected');
});

server.get('/boulder-spots/:id', async (req, res) => {
  const { id } = req.params;
  const spot = await BoulderSpot.findById(id);
  res.render('boulder-spots/details', { spot });
});

server.get('/boulder-spots/:id/edit', async (req, res) => {
  const { id } = req.params;
  const spot = await BoulderSpot.findById(id);
  res.render('boulder-spots/edit', { spot });
});

server.put('/boulder-spots/:id', async (req, res) => {
  const { id } = req.params;
  const { boulderSpot } = req.body;
  const spot = await BoulderSpot.findByIdAndUpdate(id, { ...boulderSpot });
  res.redirect(`/boulder-spots/${spot._id}`);
});

server.delete('/boulder-spots/:id', async (req, res) => {
  const { id } = req.params;
  await BoulderSpot.findByIdAndDelete(id);
  res.redirect('/boulder-spots');
});

server.listen(PORT, () => {
  console.log(`Servering on port: ${PORT} 🛸`);
});
