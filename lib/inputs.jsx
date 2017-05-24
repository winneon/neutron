'use strict'

import React from 'react'
import Utils from './utils'

import Input from './input.jsx'

class Inputs extends React.Component {
  render (){
    return (
      <div className="box">
        <form id="route" onSubmit={ this.props.onSubmit }>
          <Input id="source" name="from" placeholder="Source System" />
          <Input id="dest" name="to" placeholder="Destination System" />
          <Input id="range" name="range" placeholder="Range (LY)" />
          <Input id="efficiency" name="efficiency" placeholder="Efficiency (%, Default 100)" />
          <button className="search" type="submit" style={{ width: '88px' }}>Submit</button>
        </form>
      </div>
    )
  }
}

export default Inputs
