'use strict'

import { ipcRenderer as ipc, clipboard, remote } from 'electron'
import React from 'React'
import jQuery from 'jquery'
import AutoComplete from 'autocomplete-js'

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

  _toggleInputs(bool){
    document.querySelectorAll('form input').forEach(input => input.disabled = bool)
    document.querySelector('button').disabled = bool

    if (bool){
      document.querySelector('button').innerHTML = '<i class="material-icons turn" style="font-size: 18px;">sync</i>'
    } else {
      document.querySelector('button').innerHTML = 'Submit'
    }
  }

  componentDidMount(){
    AutoComplete({
      Url: 'https://www.spansh.co.uk/api/systems',
      QueryArg: 'q',
      _Render: (data) => { this._runAutoComplete(data, document.querySelector('#source')) }
    }, 'input#source')

    AutoComplete({
      Url: 'https://www.spansh.co.uk/api/systems',
      QueryArg: 'q',
      _Render: (data) => { this._runAutoComplete(data, document.querySelector('#dest')) }
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
        this._toggleInputs(false)

        document.querySelector('div.box').style.top = "0px"
        document.querySelector('div.info').style.top = "0px"
        document.querySelector('h1').classList.remove('routing')

        setTimeout(() => {
          document.querySelector('div.box').style.zIndex = '1'
          ipc.send('height', 111)
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

    document.querySelector('div.destSystem').onclick = event => clipboard.writeText(event.target.innerHTML)
    document.querySelector('div.nextSystem').onclick = event => clipboard.writeText(event.target.innerHTML)

    ipc.on('location', (event, location, coords) => {
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

      if (this.route && location !== 'Hyperspace'){
        let left = -1
        let totalLeft = -1

        if (!isNaN(document.querySelector('div.jumpsLeft').innerHTML)){
          left = document.querySelector('div.jumpsLeft').innerHTML - 1
          totalLeft = document.querySelector('div.totalJumpsLeft').innerHTML - 1

          document.querySelector('div.jumpsLeft').innerHTML = left
          document.querySelector('div.totalJumpsLeft').innerHTML = totalLeft
        }

        if (totalLeft === 0 && document.querySelector('div.nextSystem').innerHTML === location){
          return
        }

        if (left === 0 && document.querySelector('div.nextSystem').innerHTML !== location){
          document.querySelector('i.back').click()

          setTimeout(() => {
            document.querySelector('input#source').value = location
            document.querySelector('button').click()
          }, 1250)
        } else if (document.querySelector('div.nextSystem').innerHTML === location){
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

            for (let i = this.route.pos; i < this.route.system_jumps.length; i++){
              if (!isNaN(this.route.system_jumps[i].jumps)){
                jumps = jumps + this.route.system_jumps[i].jumps
              }
            }

            document.querySelector('div.totalJumpsLeft').innerHTML = jumps
          }

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
          document.querySelector('div.box').style.zIndex = '-1'
          document.querySelector('div.box').style.top = "-288px"
          document.querySelector('div.info').style.top = "-288px"
          document.querySelector('h1').classList.add('routing')

          clipboard.writeText(data.result.system_jumps[1].system)

          ipc.send('height', -111)

          this.route = {
            pos: 1,
            systems: data.result.system_jumps
          }

          return
        } else if (times === 1000) {
          console.log("Timed out.")
        } else {
          times++
          interval()

          return
        }

        this._toggleInputs(false)
      }).fail((error) => {
        console.log(error)
        this._toggleInputs(false)
      })
    }

    interval()
  }

  submitForm(event){
    let endpoint = 'https://www.spansh.co.uk'

    jQuery.getJSON(endpoint + '/api/route?' + jQuery('form').serialize(), (data) => {
      this._runInterval(data)
    }).fail((error) => {
      if (JSON.parse(error.responseText).error === 'Could not find starting system'){
        let element = document.querySelector('span.location')

        let coords = {
          x: element.coordX,
          y: element.coordY,
          z: element.coordZ
        }

        jQuery.getJSON(endpoint + '/api/nearest?x=' + coords.x + '&y=' + coords.y + '&z=' + coords.z, (data) => {
          let name = data.system.name

          document.querySelector('input#source').value = name
          this._toggleInputs(false)

          jQuery.getJSON(endpoint + '/api/route?' + jQuery('form').serialize(), (data) => {
            this._runInterval(data, name)
          })

          this._toggleInputs(true)
        }).fail((error) => {
          console.log(error)
          this._toggleInputs(false)
        })
      } else {
        console.log(error)
        this._toggleInputs(false)
      }
    })

    this._toggleInputs(true)
    if (event) event.preventDefault()
  }

  render(){
    return (
      <div>
        <h1>
          <i className="material-icons back">arrow_upward</i>
          <span className="title">Neutron Router</span>
          <span className="location">Unknown</span>
          <i className="material-icons close">clear</i>
        </h1>
        <div className="box">
          <form id="route" onSubmit={ (event) => this.submitForm(event) }>
            <div className="wrapper">
              <span className="remaining"></span>
              <input id="source" name="from" type="text" placeholder="Source System" />
            </div>
            <div className="wrapper">
              <span className="remaining"></span>
              <input id="dest" name="to" type="text" placeholder="Destination System" />
            </div>
            <div className="wrapper">
              <span className="remaining"></span>
              <input id="range" name="range" type="number" step="any" min="0" placeholder="Range (LY)" />
            </div>
            <div className="wrapper">
              <span className="remaining"></span>
              <input id="efficiency" name="efficiency" type="number" step="any" min="0" max="100" placeholder="Efficiency (%, Default 100)" />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="info">
          <div className="destSystem">Unknown</div>
          <div className="nextSystem">Unknown</div>
          <div className="isNeutron">No</div>
          <div className="jumpsLeft">0</div>
          <div className="totalJumpsLeft">0</div>
        </div>
      </div>
    )
  }
}

export default Container
