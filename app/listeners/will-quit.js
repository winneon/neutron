'use strict'

import Listener from '../listener'

class WillQuit extends Listener {
  constructor(){
    super('will-quit')
  }

  onEvent(app){
    app.exit(0)
  }
}

export default WillQuit
