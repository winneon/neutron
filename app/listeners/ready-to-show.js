'use strict'

import Listener from '../listener'
import { ipcMain as ipc } from 'electron'

class ReadyToShow extends Listener {
  constructor(){
    super('ready-to-show')
  }

  onEvent(app){
    app.window.mainWindow.show()

    ipc.on('height', (event, change) => {
      app.window.mainWindow.setSize(app.window.mainWindow.getSize()[0], app.window.mainWindow.getSize()[1] + change)
    })
  }
}

export default ReadyToShow
