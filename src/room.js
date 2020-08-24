const { remote, ipcRenderer } = require('electron');
const mainProcces = remote.require('./index');

const tableBody = document.getElementById('room-table-body');
const createRoom = document.getElementById('create-room');

ipcRenderer.on('loaded-rooms', (event, rooms)=>{
    rooms.forEach(room => {
        let tr = document.createElement('tr');
        let tdRoomName = document.createElement('td');
        tdRoomName.textContent = room.dataValues.room_name;
        let tdRoomID = document.createElement('td');
        tdRoomID.textContent = room.dataValues.room_id;
        let tdRoomDevices = document.createElement('td');
        let buttonRoomDevices = document.createElement('button');
        buttonRoomDevices.textContent = "Devices";
        buttonRoomDevices.addEventListener('click',() => {
            ipcRenderer.send('clicked-room', room.dataValues.room_id);
        })
        let tdButtonDeleteRoom = document.createElement('td');
        let buttonDeleteRoom  = document.createElement('button');
        buttonDeleteRoom.textContent = "Delete";
        buttonDeleteRoom.addEventListener('click',()=>{
            ipcRenderer.send('delete-room', room.dataValues.room_id);
        })
        tdButtonDeleteRoom.appendChild(buttonDeleteRoom);
        tdRoomDevices.appendChild(buttonRoomDevices);
        tr.appendChild(tdRoomID);
        tr.appendChild(tdRoomName);
        tr.appendChild(tdRoomDevices);
        tr.appendChild(tdButtonDeleteRoom);
        tableBody.appendChild(tr);
    });
})

createRoom.addEventListener('click', ()=>{
    console.log("click");
    ipcRenderer.send('create-room');
})
