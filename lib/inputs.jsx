'use strict'

import React from 'react'
import Utils from './utils'

class Inputs extends React.Component {
  render (){
    return (
      <div className="box">
        <form id="route" onSubmit={ this.props.onSubmit }>
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
        <span className="version">{ this.props.version }</span>
      </div>
    )
  }
}

export default Inputs
