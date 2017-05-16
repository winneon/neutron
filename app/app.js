'use strict'

import electron from 'electron'
import Window from './window'
import Journal from './journal'

class App {
  constructor(){
    this.electron = electron
    this.app = electron.app

    this.journal = new Journal()
    this.window = new Window()
  }

  register(listener, obj){
    let listen = !obj ? this.app : obj

    //listen.removeAllListeners(listener.name)

    listen.on(listener.name, (...args) => {
      listener.onEvent(this, args)
    })
  }
}

export default App
