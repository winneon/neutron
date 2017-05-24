'use strict'

import { ipcMain as ipc } from 'electron'
import Listener from '../listener'

class ReadyToShow extends Listener {
  constructor(){
    super('ready-to-show')
  }

  onEvent(app){
    if (!app.production){
      app.window.mainWindow.webContents.openDevTools({
        detach: true
      })
    }

    app.window.mainWindow.show()

    ipc.on('height', (event, change) => {
      app.window.mainWindow.setSize(app.window.mainWindow.getSize()[0], app.window.mainWindow.getSize()[1] + change)
    })

    ipc.on('skip', () => {
      app.window.mainWindow.webContents.send('location', app.journal.location, app.journal.location === 'Hyperspace' ? undefined : app.journal.coords, true)
    })
  }
}

export default ReadyToShow
