'use strict'

import { ipcRenderer as ipc, clipboard, remote } from 'electron'
import React from 'react'
import AutoComplete from 'autocomplete-js'
import jQuery from 'jquery'

import Utils from './utils'
import Header from './header.jsx'
import Inputs from './inputs.jsx'
import Info from './info.jsx'

class Container extends React.Component {
  constructor(){
    super()

    this.cont = {
      source: true,
      dest: true
    }

    this.route = undefined
  }

  _runAutoComplete(data, element){
    if (this.cont[element.id]){
      let placeholder = element.previousSibling
      let ipt = element.value
      let text = ''

      if (data && data.length > 0){
        for (let i = 0; i < data.length; i++){
          let value = data[i].Value

          if (ipt.toLowerCase() === value.toLowerCase()){
            text = value
          }
        }

        if (text === ''){
          text = data[0].Value
        }
      }

      if (text.toLowerCase().indexOf(ipt.toLowerCase()) === 0){
        element.fullValue = text
        text = text.replace(/ /g, '\u00A0')

        placeholder.innerHTML = text.substr(ipt.length, text.length)
        placeholder.style.textIndent = ipt.length + 'ch'
      } else {
        element.fullValue = undefined
        placeholder.innerHTML = ''
      }
    }
  }

  componentDidMount(){
    AutoComplete({
      Url: 'https://www.spansh.co.uk/api/systems',
      QueryArg: 'q',
      _Render: (data) => {
        if (document.querySelector('#source') === document.activeElement){
          this._runAutoComplete(data, document.querySelector('#source'))
        }
      }
    }, 'input#source')

    AutoComplete({
      Url: 'https://www.spansh.co.uk/api/systems',
      QueryArg: 'q',
      _Render: (data) => {
        if (document.querySelector('#dest') === document.activeElement){
          this._runAutoComplete(data, document.querySelector('#dest'))
        }
      }
    }, 'input#dest')

    document.querySelector('span.location').onclick = (event) => {
      let element = event.target

      if (element.innerHTML !== 'Unknown'){
        document.querySelector('input#source').value = element.innerHTML
      }
    }

    document.querySelector('i.back').onclick = (event) => {
      let element = event.target

      if (this.route && element.parentNode.classList.contains('routing')){
        this.route = undefined

        document.querySelector('div.box').style.top = "0px"
        document.querySelector('div.info').style.top = "0px"
        document.querySelector('h1').classList.remove('routing')

        setTimeout(() => {
          document.querySelector('div.box').style.zIndex = '1'
          Utils.toggleInputs(false)

          ipc.send('height', 55)
        }, 1000)
      }
    }

    document.querySelector('i.close').onclick = event => remote.getCurrentWindow().close()

    document.querySelectorAll('input').forEach((element) => {
      let placeholder = element.previousSibling

      element.oninput = () => {
        if (element.value.length > 0 &&
            placeholder.innerHTML.length > 0 &&
            (element.value[element.value.length - 1] === placeholder.innerHTML[0] ||
            (element.value.charCodeAt(element.value.length - 1) === 32 &&
            placeholder.innerHTML.charCodeAt(0) === 38))){
          placeholder.innerHTML = placeholder.innerHTML.substr(placeholder.innerHTML.charCodeAt(0) === 38 ? 6 : 1)
          placeholder.style.textIndent = element.value.length + 'ch'
          this.cont[element.id] = false

          return
        }

        placeholder.innerHTML = ''
        this.cont[element.id] = true
      }

      element.onblur = () => {
        if (placeholder.innerHTML.length > 0){
          let first = element.value
          let second = placeholder.innerHTML
          let dummy = document.createElement('textarea')

          dummy.innerHTML = second
          second = dummy.value

          element.value = first + second
          placeholder.innerHTML = ''
        } else {
          element.fullValue = ''
        }

        element.value = element.fullValue ? element.fullValue : element.value
        this.cont[element.id] = true
      }
    })

    let that = this

    document.querySelector('div.destSystem').onclick = event => clipboard.writeText(event.target.innerHTML)
    document.querySelector('div.nextSystem').onclick = event => clipboard.writeText(event.target.innerHTML)
    document.querySelector('button.replot').onclick = event => Utils.replot(document.querySelector('span.location').innerHTML)
    document.querySelector('button.skip').onclick = event => ipc.send('skip')

    document.querySelector('button.toggle').onclick = function(event){
      let element = this
      let skip = document.querySelector('button.skip')

      element.classList.toggle('off')
      skip.disabled = !element.classList.contains('off')

      document.querySelector('button.toggle > i').innerHTML = element.classList.contains('off') ? 'not_interested' : 'done'

      if (!element.classList.contains('off') && that.route.skipped){
        Utils.replot(document.querySelector('span.location').innerHTML)
      }
    }

    ipc.on('location', (event, location, coords, skip) => {
      let element = document.querySelector('span.location')

      if (location === 'Hyperspace'){
        element.innerHTML = 'Entering Hyperspace'

        setTimeout(() => {
          element.innerHTML = location
        }, 5000)
      } else {
        element.innerHTML = location
        element.coordX = coords.x
        element.coordY = coords.y
        element.coordZ = coords.z
      }

      if (this.route && (location !== 'Hyperspace' || skip)){
        let left = -1
        let totalLeft = -1

        if (!isNaN(document.querySelector('div.jumpsLeft').innerHTML)){
          left = document.querySelector('div.jumpsLeft').innerHTML - 1
          totalLeft = document.querySelector('div.totalJumpsLeft').innerHTML - 1

          if (left < 0 || totalLeft < 0){
            return
          }

          document.querySelector('div.jumpsLeft').innerHTML = left
          document.querySelector('div.totalJumpsLeft').innerHTML = totalLeft
        }

        if (totalLeft === 0 && (document.querySelector('div.nextSystem').innerHTML === location || skip)){
          document.querySelector('i.back').click()
          return
        }

        if (skip){
          this.route.skipped = true
        }

        if (left === 0 &&
            document.querySelector('div.nextSystem').innerHTML !== location &&
            !document.querySelector('button.toggle').classList.contains('off')){
          Utils.replot(location)
        } else if (document.querySelector('div.nextSystem').innerHTML === location ||
                   (document.querySelector('button.toggle').classList.contains('off') && left === 0)){
          this.route.pos++

          document.querySelector('div.nextSystem').innerHTML = this.route.systems[this.route.pos].system
          document.querySelector('div.jumpsLeft').innerHTML = this.route.systems[this.route.pos].jumps

          if (this.route.systems[this.route.pos].neutron_star === '???'){
            document.querySelector('div.isNeutron').innerHTML = this.route.systems[this.route.pos].neutron_star
          } else {
            document.querySelector('div.isNeutron').innerHTML = this.route.systems[this.route.pos].neutron_star ? 'Yes' : 'No'
          }

          if (isNaN(document.querySelector('div.totalJumpsLeft').innerHTML)){
            let html = document.querySelector('div.totalJumpsLeft').innerHTML
            document.querySelector('div.totalJumpsLeft').innerHTML = html.substring(5, html.length - 1)
          } else {
            let jumps = 0

            for (let i = this.route.pos; i < this.route.systems.length; i++){
              if (!isNaN(this.route.systems[i].jumps)){
                jumps = jumps + this.route.systems[i].jumps
              }
            }

            document.querySelector('div.totalJumpsLeft').innerHTML = jumps
          }

          clipboard.clear()
          clipboard.writeText(this.route.systems[this.route.pos].system)
        }
      }
    })
  }

  _runInterval(data, name){
    let endpoint = 'https://www.spansh.co.uk'
    let times = 0

    let interval = () => {
      jQuery.getJSON(endpoint + '/api/results/' + data.job, (data) => {
        if (data.status === 'ok'){
          console.log(data.result)

          if (name || document.querySelector('span.location').innerHTML !== data.result.source_system){
            if (document.querySelector('span.location').innerHTML !== data.result.source_system){
              name = data.result.source_system
            }

            data.result.system_jumps.splice(1, 0, {
              system: name,
              jumps: '???',
              neutron_star: '???'
            })
          }

          document.querySelector('div.destSystem').innerHTML = data.result.destination_system
          document.querySelector('div.nextSystem').innerHTML = data.result.system_jumps[1].system

          if (data.result.system_jumps[1].neutron_star === '???'){
            document.querySelector('div.isNeutron').innerHTML = data.result.system_jumps[1].neutron_star
          } else {
            document.querySelector('div.isNeutron').innerHTML = data.result.system_jumps[1].neutron_star ? 'Yes' : 'No'
          }

          document.querySelector('div.jumpsLeft').innerHTML = data.result.system_jumps[1].jumps

          let jumps = 0

          for (let i = 0; i < data.result.system_jumps.length; i++){
            if (!isNaN(data.result.system_jumps[i].jumps)){
              jumps = jumps + data.result.system_jumps[i].jumps
            }
          }

          document.querySelector('div.totalJumpsLeft').innerHTML = name ? ('??? (' + jumps + ')') : jumps

          document.querySelector('button.skip').disabled = true
          document.querySelector('button.toggle').classList.remove('off')
          document.querySelector('button.toggle > i').innerHTML = 'done'

          document.querySelector('div.box').style.zIndex = '-1'
          document.querySelector('div.box').style.top = "-288px"
          document.querySelector('div.info').style.top = "-288px"
          document.querySelector('h1').classList.add('routing')

          clipboard.writeText(data.result.system_jumps[1].system)

          ipc.send('height', -55)

          this.route = {
            pos: 1,
            systems: data.result.system_jumps,
            skipped: false
          }

          return
        } else if (times === 1000) {
          remote.dialog.showErrorBox('Error', 'Timed out.')
          console.log("Timed out.")
        } else {
          times++
          interval()

          return
        }

        Utils.toggleInputs(false)
      }).fail((error) => {
        remote.dialog.showErrorBox('Error', error)
        console.log(error)

        Utils.toggleInputs(false)
      })
    }

    interval()
  }

  submitForm(event){
    let endpoint = 'https://www.spansh.co.uk'

    if (document.querySelector('input#efficiency').value === ''){
      document.querySelector('input#efficiency').value = 100
    }

    jQuery.getJSON(endpoint + '/api/route?' + jQuery('form').serialize(), (data) => {
      this._runInterval(data)
    }).fail((error) => {
      let parsed = JSON.parse(error.responseText)

      if (parsed.error === 'Could not find starting system'){
        let element = document.querySelector('span.location')

        let coords = {
          x: element.coordX,
          y: element.coordY,
          z: element.coordZ
        }

        jQuery.getJSON(endpoint + '/api/nearest?x=' + coords.x + '&y=' + coords.y + '&z=' + coords.z, (data) => {
          let name = data.system.name

          document.querySelector('input#source').value = name
          Utils.toggleInputs(false)

          jQuery.getJSON(endpoint + '/api/route?' + jQuery('form').serialize(), (data) => {
            this._runInterval(data, name)
          })

          Utils.toggleInputs(true)
        }).fail((error) => {
          parsed = JSON.parse(error.responseText)
          remote.dialog.showErrorBox(error.statusText, parsed.error)

          console.log(error)
          Utils.toggleInputs(false)
        })
      } else {
        if (parsed.error === 'from, to and range are required'){
          remote.dialog.showErrorBox(error.statusText, 'Source System, Destination System, and Range are required values.')
        } else if (parsed.error === 'Could not find finishing system'){
          remote.dialog.showErrorBox(error.statusText, 'Destination System is invalid.')
        } else {
          remote.dialog.showErrorBox(error.statusText, parsed.error)
        }

        console.log(error)
        Utils.toggleInputs(false)
      }
    })

    Utils.toggleInputs(true)
    if (event) event.preventDefault()
  }

  render(){
    return (
      <div>
        <span className="version">(v{ require('../package.json').version })</span>
        <Header title="Neutron Router" />
        <Inputs onSubmit={ (event) => this.submitForm(event) } />
        <Info />
      </div>
    )
  }
}

export default Container
