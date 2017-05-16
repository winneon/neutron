'use strict'

import { dialog } from 'electron'
import fs from 'fs'

import Listener from '../listener'
import ReadyToShow from './ready-to-show'

class Ready extends Listener {
  constructor(){
    super('ready')
  }

  onEvent(app){
    if (!fs.existsSync(app.journal.directory)){
      let directory = dialog.showOpenDialog({
        title: 'Select your Elite: Dangerous journal folder:',
        properties: [ 'openDirectory' ]
      })[0]

      app.journal.setDirectory(directory)
    }

    app.journal.watch((location) => {
      if (app.window.ready){
        app.window.mainWindow.webContents.send('location', app.journal.location, app.journal.coords)
      }
    })

    app.window.create()
    app.window.ready = true

    app.register(new ReadyToShow(), app.window.mainWindow)
  }
}

export default Ready
