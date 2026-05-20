const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Place future secure IPC methods here if the desktop app needs native bindings.
});
