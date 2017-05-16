'use strict'

import electron from 'electron'
import path from 'path'
import fs from 'fs'
import readline from 'readline'

class Journal {
  constructor(){
    this.directory = path.join(process.env.USERPROFILE, 'Saved Games', 'Frontier Developments', 'Elite Dangerous')
    this.location = undefined
    this.coords = {
      x: -1,
      y: -1,
      z: -1
    }
  }

  _checkLocation(callback){
    fs.readdir(this.directory, (err, files) => {
      let reader = readline.createInterface({
        input: fs.createReadStream(path.join(this.directory, files[files.length - 1]))
      })

      let array = []

      reader.on('line', (line) => {
        array.push(JSON.parse(line))
      })

      reader.on('close', () => {
        let oldLocation = this.location

        for (let i = array.length - 1; i >= 0; --i) {
          let item = array[i]

          if (item.event === 'FSDJump' || item.event === 'Location'){
            this.location = item.StarSystem
            
            this.coords.x = item.StarPos[0]
            this.coords.y = item.StarPos[1]
            this.coords.z = item.StarPos[2]

            break
          }
        }

        callback(oldLocation !== this.location)
      })
    })
  }

  watch(callback){
    let interval = setInterval(() => {
      this._checkLocation((changed) => {
        if (changed){
          callback(this.location)
        }
      })
    }, 1000)
  }
}

export default Journal
