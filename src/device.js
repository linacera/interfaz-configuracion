const { remote, ipcRenderer } = require('electron');
const mainProcces = remote.require('./index');

const tableBody = document.getElementById('device-table-body');
const createDevice = document.getElementById('create-device');
const idRoom = document.getElementById('room-id');

ipcRenderer.on('loaded-devices', (event, devices, room_id)=>{
    idRoom.id = room_id;
    devices.forEach(device => {
        let tr = document.createElement('tr');
        let tdDeviceName = document.createElement('td');
        tdDeviceName.textContent = device.dataValues.device_name;
        let tdDeviceID = document.createElement('td');
        tdDeviceID.textContent = device.dataValues.device_id;
        let tdDeviceActions = document.createElement('td');
        let buttonDeviceActions = document.createElement('button');
        buttonDeviceActions.className = "no-background-button";
        buttonDeviceActions.addEventListener('click',() => {
            ipcRenderer.send('see-device-actions', device.dataValues.device_id);
        });
        let imgOpen = document.createElement('img');
        imgOpen.src="../icons/box-arrow-right.svg";  
        buttonDeviceActions.append(imgOpen);
        let tdButtonDeleteDevice = document.createElement('td');
        let buttonDeleteDevice  = document.createElement('button');
        buttonDeleteDevice.className="no-background-button";
        buttonDeleteDevice.addEventListener('click',() => {
            ipcRenderer.send('delete-device', device.dataValues.device_id);
        })
        let img = document.createElement('img');
        img.src="../icons/trash.svg";
        buttonDeleteDevice.appendChild(img);
        tdButtonDeleteDevice.appendChild(buttonDeleteDevice);
        tdDeviceActions.appendChild(buttonDeviceActions);
        tr.appendChild(tdDeviceID);
        tr.appendChild(tdDeviceName);
        tr.appendChild(tdDeviceActions);
        tr.appendChild(tdButtonDeleteDevice);
        tableBody.appendChild(tr);
    });
})

createDevice.addEventListener('click', ()=>{
    let deviceNameInput = document.getElementById('device_name');
    if(deviceNameInput.value != ""){
        ipcRenderer.send('create-device',deviceNameInput.value, idRoom.id);
        var window = remote.getCurrentWindow();
        window.reload();
    }
})
