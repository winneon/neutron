'use strict'

import React from 'react'

class Input extends React.Component {
  render(){
    return (
      <div className="wrapper">
        <span className="remaining"></span>
        <input id={ this.props.id } name={ this.props.name } type="text" placeholder={ this.props.placeholder } />
      </div>
    )
  }
}

export default Input