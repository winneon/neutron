'use strict'

import electron from 'electron'
import Window from './window'
import Journal from './journal'

class App {
  constructor(){
    this.electron = electron
    this.app = electron.app

    this.window = new Window()
    this.journal = new Journal()

    this.journal.watch((location) => {
      if (this.window.ready){
        this.window.mainWindow.webContents.send('location', this.journal.location, this.journal.coords)
      }
    })
  }

  register(listener, obj){
    let listen = !obj ? this.app : obj

    listen.removeAllListeners(listener.name)

    listen.on(listener.name, (...args) => {
      listener.onEvent(this, args)
    })
  }
}

export default App
