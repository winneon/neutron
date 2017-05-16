'use strict'

import App from './app'
import Ready from './listeners/ready'
import WindowAllClosed from './listeners/window-all-closed'

class Main {
  constructor(){
    this.app = new App()

    this.app.register(new Ready())
    this.app.register(new WindowAllClosed())
  }
}

export default Main
