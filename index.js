'use strict';

const Alexa = require('alexa-app');
const path = require('path');
const fs = require('fs-extra');
const { Device, Detector } = require('ps4-waker');

const detectorService = require('./src/service/detector');
const deviceService = require('./src/service/device');

const app = new Alexa.app('playstation4');

function findDevice(response, session) {
  return new Promise((resolve, reject) => {
    detectorService.findDevice().then((device) => {
      session.set('previous', 'find');
      session.set('device', device);
      response.say(`I found the ${device.device['host-name']} playstation. do you want to add this one or would you like to find another?`);
      resolve();
    }).catch((err) => {
      if (detectorService.hasPreviouslyFoundDevices()) {
        session.set('previous', 'startagain');
        response.say('I was unable to find any more playstations. would you like to start again?');
      } else {
        response.shouldEndSession(true);
        response.say('Sorry, i was unable to find any playstations on the network');
      }
      resolve();
    });
  });
}

app.launch((request, response) => {
  response.say('Hello. To connect a PlayStation say: "alexa, ask playstation to find a new device"');
});

app.intent('Find', { utterances: ['to find a new device'] }, (request, response) => {
  const session = request.getSession();
  detectorService.clearDeviceList();
  response.shouldEndSession(false);
  return findDevice(response, session);
});

app.intent('ResponseYes', {}, (request, response) => {
  if (request.hasSession()) {
    const session = request.getSession();
    switch (session.get('previous')) {
      case 'startagain':
        detectorService.clearDeviceList();
        response.shouldEndSession(false);
        return findDevice(response, session);
      case 'find':
        console.log('attempt connection to playstation');
        const device = session.get('device');
        deviceService.connectToDevice(device);
        console.log(device);
        return response.say('connecting');
      default:
        response.shouldEndSession(true);
        return response.say('Sorry, i lost my train of thought');
    }
  } else {
    console.log(request);
    return response.say('Sorry, i dont know what you are saying');
  }
});

app.intent('ResponseNo', {}, (request, response) => {
  if (request.hasSession()) {
    const session = request.getSession();
    switch (session.get('previous')) {
    case 'startagain':
      response.shouldEndSession(true);
      return response.say('bye');
    case 'find':
      response.shouldEndSession(false);
      return findDevice(response, session);
    default:
      response.shouldEndSession(true);
      return response.say('Sorry, i lost my train of thought');
    }
  } else {
    console.log(request);
    return response.say('Sorry, i dont know what you are saying');
  }
});

module.exports = app;
