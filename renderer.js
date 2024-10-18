const { ipcRenderer } = require('electron');

// Function to load available serial ports
function loadPorts() {
    ipcRenderer.invoke('list-ports').then((ports) => {
        const portSelector = document.getElementById('port-selector');
        portSelector.innerHTML = ''; // Clear existing options
        ports.forEach(port => {
            const option = new Option(port.path, port.path);
            portSelector.appendChild(option);
        });
        if (ports.length === 0) {
            const noPortsOption = new Option('No ports found', '');
            portSelector.appendChild(noPortsOption);
        }
    }).catch(err => {
        console.error('Error listing ports:', err);
    });
}

// Function to connect to the selected Arduino
function connectToArduino() {
    const portPath = document.getElementById('port-selector').value;
    if (!portPath) {
        alert('Please select a port first!');
        return;
    }
    ipcRenderer.invoke('connect-arduino', portPath).then(() => {
        document.getElementById('connection-status').textContent = 'Connected';
    }).catch(err => {
        console.error('Failed to connect:', err);
        document.getElementById('connection-status').textContent = 'Failed to connect';
    });
}

// Function to disconnect from Arduino
function disconnectArduino() {
    ipcRenderer.invoke('disconnect-arduino').then(() => {
        document.getElementById('connection-status').textContent = 'Disconnected';
    }).catch(err => {
        console.error('Failed to disconnect:', err);
        document.getElementById('connection-status').textContent = 'Failed to disconnect';
    });
}
