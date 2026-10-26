const {app,BrowserWindow,ipcMain,shell,Menu}=require('electron');
const path=require('node:path');const {pathToFileURL}=require('node:url');
const destinations=Object.freeze({audit:'https://ad-movilidad-auditoria-aitor.aitor-dlgd.chatgpt.site/',training:'https://formacion.admobility26.com/'});
let win;
app.enableSandbox();
if(!app.requestSingleInstanceLock())app.quit();else{
 app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});
 app.whenReady().then(()=>{ipcMain.handle('open-module',async(event,key)=>{if(!win||event.sender!==win.webContents||event.senderFrame.url!==pathToFileURL(path.join(__dirname,'index.html')).href||!Object.hasOwn(destinations,key))return false;await shell.openExternal(destinations[key]);return true;});create();app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)create();});});
}
function create(){win=new BrowserWindow({width:1050,height:760,minWidth:700,minHeight:620,title:'AD Mobility',backgroundColor:'#f3f5ef',icon:path.join(__dirname,'assets/logo.png'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});win.webContents.session.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',event=>event.preventDefault());win.loadFile('index.html');Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'AD Mobility',submenu:[{role:'about'},{role:'quit'}]},{label:'Edición',submenu:[{role:'copy'},{role:'paste'},{role:'selectAll'}]},{label:'Vista',submenu:[{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{role:'togglefullscreen'}]}]));}
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
