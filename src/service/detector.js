'use strict';

const { Detector } = require('ps4-waker');

class DetectorService {

  constructor() {
    this.deviceList = [];
  }

  clearDeviceList() {
    this.deviceList = [];
  }

  hasPreviouslyFoundDevices() {
    return (this.deviceList.length > 0);
  }

  findDevice() {
    return new Promise((resolve, reject) => {
      Detector.findFirst(((device, rinfo) => {
        return (this.deviceList.length > 0) 
        ? (!this.deviceList.reduce((result, existingDev) => {
          return result || (existingDev.device['host-id'] === device['host-id']);
        }, false) && (device['host-type'] === 'PS4'))
        : true; 
      }).bind(this), {
        timeout: 5000,
        bindAddress: '192.168.1.2',
        bindPort: '3001'
      }, (err, device, rinfo) => {
        if (err) {
          reject(err);
        } else {
          this.deviceList.push({ device, rinfo });
          resolve({ device, rinfo });
        }
        console.error(err);
        console.log(device);
      });
    });
  }

}

module.exports = new DetectorService();
