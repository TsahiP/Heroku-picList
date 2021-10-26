const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
const picList = [
  { id: 1, itemName: 'paper' },
  { id: 2, itemName: 'chili' },
  { id: 3, itemName: 'salt' },
];
app.get('/', (req, res) => {
  res.send('hello ');
});
//get list
app.get('/api/pic_list', (req, res) => {
  res.send(picList);
});
//get pic details
app.get('/api/pic_list/:id', (req, res) => {
  const pic = picList.find(c => c.id === parseInt(req.params.id));
  if (!pic) return res.status(400).send('error id not found');
  else res.send(pic);
});

//add new pic
app.post('/api/pic_list', (req, res) => {
  const { error } = validatePic(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //   create new object
  const pic = {
    id: picList.length + 1,
    itemName: req.body.itemName,
  };
  //   push to list
  picList.push(pic);
  //   send the new object
  res.send(pic);
});

// Delete pic from list
app.delete('/api/pic_list/:id', (req, res) => {
  const pic = picList.find(c => c.id === parseInt(req.params.id));
  //   send error if not exist
  if (!pic) return res.status(404).send('id not found');
  //   delete from list
  const index = picList.indexOf(pic);
  //   console.log(index, 1);
  picList.splice(index, 1);
  res.send(pic);
});
// update
app.put('/api/pic_list/:id', (req, res) => {
  const pic = picList.find(c => c.id === parseInt(req.params.id));
  if (!pic) return res.status(404).send('id not found');
  const { error } = validatePic(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  pic.itemName = req.body.itemName;
  res.send(pic);
});
//validation function
function validatePic(pic) {
  const schema = Joi.object({
    itemName: Joi.string().min(3).required(),
  });
  return schema.validate(pic);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
