const { remote, app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Room = require('./models/room');
const Device = require('./models/device');
const Action = require('./models/action');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './views/index.html'));

  // Open the DevTools.

  mainWindow.webContents.on('did-finish-load', async () => {
    rooms = await getRooms();
  //  console.log(rooms);
    mainWindow.webContents.send('loaded-rooms', rooms);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('see-room-devices', async (event, idRoom) => {
  console.log("En ipcMain clicked: "+idRoom);
   const devicesWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  devicesWindow.loadFile(path.join(__dirname, './views/devices-list.html'));

  // Open the DevTools.

  devicesWindow.webContents.on('did-finish-load', async () => {
    devices = await getDevices(idRoom);
    devicesWindow.webContents.send('loaded-devices', devices, idRoom);
  });
});

ipcMain.on('see-device-actions', async (event, idDevice) => {
  console.log("En ipcMain clicked: "+idDevice);
   actionsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  actionsWindow.loadFile(path.join(__dirname, './views/actions-list.html'));

  // Open the DevTools.

  actionsWindow.webContents.on('did-finish-load', async () => {
    actions = await getActions(idDevice);
    actionsWindow.webContents.send('loaded-actions', actions, idDevice);
  });
});

ipcMain.on('delete-room',async (event, idRoom, win) => {
  console.log("Gonna delete room: "+idRoom);
  await deleteRoom(idRoom);
  win.reload();
});

ipcMain.on('delete-device',async (event, idDevice) => {
  console.log("Gonna delete device: "+idDevice);
  await deleteDevice(idDevice);
});

ipcMain.on('delete-action',async (event, idAction) => {
  console.log("Gonna delete Action: "+idAction);
  await deleteAction(idAction);
});

ipcMain.on('create-room',async (event, room_name) => {
  console.log("room name is: "+room_name);
 await createRoom(room_name);

})

ipcMain.on('create-device',async (event, device_name, room_id) => {
  console.log("device name is: "+device_name+" rooom id is: "+room_id);
  await createDevice(device_name, room_id);

})

ipcMain.on('create-action',async (event, action_name, device_id) => {
  console.log("action name is: "+action_name+" rooom id is: "+device_id);
  await createAction(action_name, device_id);

})

async function createRoom(room_name){
  await Room.create({ room_name: room_name });
}

async function createDevice(device_name, room_id){
  await Device.create({ device_name: device_name, room_id: room_id});
}

async function createAction(action_name, device_id){
  await Action.create({ action_name: action_name, device_id: device_id });
}

async function deleteAction(action_id){
  action = await getActionById(action_id);
  action.destroy();
}
async function deleteRoom(room_id){
  await deleteRoomDevices(room_id);
  room = await getRoomById(room_id);
  room.destroy();
}

async function deleteRoomDevices(room_id){
  let devices = await getDevices(room_id);
  if(devices.length != 0){
    devices.forEach(async device => {
      await deleteDeviceActions(device.dataValues.device_id) ;
      device.destroy();
    });
  }
}

async function deleteDeviceActions(device_id){
  actions = await getActions(device_id);
    if(actions.length != 0){
      actions.forEach(async action => {
        action.destroy();
      });
    } 
}

async function deleteDevice(device_id){
  await deleteDeviceActions(device_id);  
  let device = await getDeviceById(device_id);
  device.destroy();  
}

async function getDeviceById(device_id){
  device = await Device.findOne(
    {
      where: {device_id: device_id}
    });
  return device;
}

async function getActionById(action_id){
  action = await Action.findOne(
    {
      where: {action_id: action_id}
    });
  return action;
}


async function getRoomById(room_id){
  room = await Room.findOne(
    {
      where: {room_id: room_id}
    });
  return room;
}

async function getRooms(){
  let rooms = [];
  try {
  //  console.log('In get rooms');
    rooms = await Room.findAll({attributes: ['room_id', 'room_name']});
    return rooms;
  } catch (error) {
    return [];
  }
}


async function getDevices (room_id) {
  let devices = [];
  try {
    devices = await Device.findAll(
      {
        where: {room_id: room_id}
      });
  //  console.log(devices);
    return devices;
  } catch (error) {
    return [];
  }
}

async function getActions(device_id){
  try {
    //console.log('In get actions');
    actions = await Action.findAll(
      {
        where: {device_id: device_id}
      });
   // console.log(actions);
    return actions;
  } catch (error) {
    return [];
  }
}