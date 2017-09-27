const app = require('./server');
const PORT = require('./config').PORT;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});