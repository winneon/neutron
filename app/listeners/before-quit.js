'use strict'

import Listener from '../listener'

class BeforeQuit extends Listener {
  constructor(){
    super('before-quit')
  }

  onEvent(app){
    app.window.mainWindow.close()
  }
}

export default BeforeQuit
