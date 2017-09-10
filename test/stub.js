'use strict';

const express = require('express');

const skill = require('../index.js');

const app = express();

app.listen(3000, () => {
  console.log('test stub running');
});

skill.express({ expressApp: app, endpoint: 'alexa/playstation' });
