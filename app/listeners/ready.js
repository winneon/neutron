'use strict'

import Listener from '../listener'
import ReadyToShow from './ready-to-show'

class Ready extends Listener {
  constructor(){
    super('ready')
  }

  onEvent(app){
    app.window.create()
    app.register(new ReadyToShow(), app.window.mainWindow)

    app.window.ready = true
  }
}

export default Ready
