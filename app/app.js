'use strict'

import electron from 'electron'
import Window from './window'
import Journal from './journal'
import path from 'path'

class App {
  constructor(){
    this.electron = electron
    this.app = electron.app

    this.journal = new Journal()
    this.window = new Window()

    let pkg = require(path.join(__dirname, 'package.json'))

    this.production = pkg.production
  }

  register(listener, obj){
    let listen = !obj ? this.app : obj

    listen.on(listener.name, (...args) => {
      listener.onEvent(this, args)
    })
  }
}

export default App
