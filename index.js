'use strict';

const Alexa = require('alexa-app');
const path = require('path');
const fs = require('fs-extra');
const { Device, Detector } = require('ps4-waker');

const app = new Alexa.app('playstation4');

app.launch((request, response) => {
  console.log(request);
  response.say('Hello. To connect a PlayStation say: "alexa, ask playstation to find a new device"');
});

app.intent('Find', { utterances: ['to find a new device'] }, (request, response) => {
  response.say('searching');
  Detector.findAny({ timeout: 5000, bindAddress: '', bindPort: '' }, (err, devices) => {
    console.error(err);
    console.log(devices);
  });
});

module.exports = app;
