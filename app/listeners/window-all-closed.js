'use strict'

import Listener from '../listener'

class WindowAllClosed extends Listener {
  constructor(){
    super('window-all-closed')
  }

  onEvent(app){
    app.quit()
  }
}

export default WindowAllClosed
