'use strict'

class Utils {
  static toggleInputs(bool){
    document.querySelectorAll('form input').forEach(input => input.disabled = bool)
    document.querySelector('button').disabled = bool

    if (bool){
      document.querySelector('button').innerHTML = '<i class="material-icons turn" style="font-size: 18px;">sync</i>'
    } else {
      document.querySelector('button').innerHTML = 'Submit'
    }
  }
}

export default Utils
