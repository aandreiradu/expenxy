const express = require('express');
const app = express();

app.use('/', (req, res, next) => {
  return res.status(200).json({
    message: 'OK',
  });
});

app.listen(5050, () => {
  console.log('server listening on port 5050');
});
