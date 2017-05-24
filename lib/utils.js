'use strict'

class Utils {
  static toggleInputs(disabled){
    document.querySelectorAll('form input').forEach(input => input.disabled = disabled)
    document.querySelector('button.search').disabled = disabled

    if (disabled){
      document.querySelector('button.search').innerHTML = '<i class="material-icons turn">sync</i>'
    } else {
      document.querySelector('button.search').innerHTML = 'Submit'
    }
  }

  static replot(location){
    document.querySelector('i.back').click()

    setTimeout(() => {
      document.querySelector('input#source').value = location
      document.querySelector('button.search').click()
    }, 1000)
  }
}

export default Utils
