'use strict'

import { BrowserWindow, app } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import path from 'path'

class Window {
  constructor(){
    this.ready = false
  }

  create(production){
    require('electron-debug')()

    let opts = {
      maximizable: false,
      resizable: false,
      show: false,
      title: 'Neutron',
      width: 450,
      height: 372
    }

    if (process.platform === 'darwin'){
      opts.titleBarStyle = 'hidden'
    } else {
      opts.frame = false
    }

    this.mainWindow = new BrowserWindow(opts)
    this.mainWindow.loadURL(path.join(__dirname, 'index.html'))

    if (!production){
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(() => console.log('Added React Developer Tools.'))
        .catch(err => console.error('Error installing React Developer Tools: ', err))
    }

    this.mainWindow.on('focus', () => this.mainWindow.webContents.send('focus', true))
    this.mainWindow.on('blur', () => this.mainWindow.webContents.send('focus', false))
    this.mainWindow.on('close', () => app.quit())
  }
}

export default Window
