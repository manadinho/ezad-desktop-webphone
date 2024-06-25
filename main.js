const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;
let store;

// Dynamically import electron-store and initialize the store after import
import("electron-store")
  .then((ElectronStore) => {
    store = new ElectronStore.default(); // Ensure that you are accessing the default export correctly

    app.whenReady().then(createWindow);
  })
  .catch((e) => {
    console.error("Failed to load electron-store:", e);
  });

function createWindow() {
  app.setName("EZ AD Webphone");

  mainWindow = new BrowserWindow({
    width: 345,
    height: 605,
    icon: __dirname + "/assets/images/pbx.icns",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    fullscreenable: false,
  });

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  ipcMain.on("onIncomingCall", (event, phoneNumber) => {
    mainWindow.show();
  });
}

// Ensure the app is the default client for 'tel' links
app.setAsDefaultProtocolClient("tel");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  const phoneNumber = url.split(":")[1];
  mainWindow.webContents.send("phone-number", phoneNumber);
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
});
