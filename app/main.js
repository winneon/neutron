'use strict'

import App from './app'
import Ready from './listeners/ready'
import BeforeQuit from './listeners/before-quit'
import WillQuit from './listeners/will-quit'
import WindowAllClosed from './listeners/window-all-closed'

class Main {
  constructor(){
    this.app = new App()

    this.app.register(new Ready())
    this.app.register(new BeforeQuit())
    this.app.register(new WillQuit())
    this.app.register(new WindowAllClosed())
  }
}

export default Main
