// arduino.js
const SerialPort = require('serialport');
let port;

function listPorts() {
    return SerialPort.list();
}

function connect(portPath) {
    port = new SerialPort(portPath, {
        baudRate: 9600,
        autoOpen: false
    });

    port.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message);
        }
        // Port opened successfully
        console.log('Port opened successfully!');
    });

    // Open errors will be emitted as an error event
    port.on('error', function(err) {
        console.log('Error: ', err.message);
    });
}

function disconnect() {
    if (port && port.isOpen) {
        port.close();
        console.log('Port closed successfully');
    }
}

module.exports = {
    listPorts,
    connect,
    disconnect
};
