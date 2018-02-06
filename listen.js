const app = require('./server');
const {PORT = 3000} = process.env;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});