'use strict';

const { Device, Waker } = require('ps4-waker');

class DeviceService {

  constructor() {
    this.devices = [];
  }

  connectToDevice(deviceInfo) {
    const waker = new Waker();

    // waker.requestCredentials((err, creds) => {
    //   console.error(err);
    //   console.log(creds);
    // });

    // const device = new Device({
    //   address: deviceInfo.rinfo.address,
    //   timeout: 5000,
    //   bindAddress: '192.168.1.2',
    //   bindPort: '3001'
    // });

    // device.turnOff();
  }

}

module.exports = new DeviceService();
