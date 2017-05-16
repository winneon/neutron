'use strict'

import { BrowserWindow, app } from 'electron'
import path from 'path'

class Window {
  constructor(){
    this.ready = false
  }

  create(){
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

    this.mainWindow.on('focus', () => this.mainWindow.webContents.send('focus', true))
    this.mainWindow.on('blur', () => this.mainWindow.webContents.send('focus', false))
    this.mainWindow.on('close', () => app.quit())

    if (process.env.NODE_ENV === 'development'){
      this.mainWindow.webContents.openDevTools({
        detach: true
      })
    }
  }
}

export default Window
