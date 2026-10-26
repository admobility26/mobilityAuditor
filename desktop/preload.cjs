const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('adMobility',{openModule:key=>['audit','training'].includes(key)?ipcRenderer.invoke('open-module',key):Promise.resolve(false)});
