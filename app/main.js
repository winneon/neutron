'use strict'

import App from './app'
import Ready from './listeners/ready'

class Main {
  constructor(){
    this.app = new App()

    this.app.register(new Ready())
  }
}

export default Main
