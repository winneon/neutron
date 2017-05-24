'use strict'

import React from 'react'

class Header extends React.Component {
  render (){
    return (
      <h1>
        <i className="material-icons back">arrow_upward</i>
        <span className="title">{ this.props.title }</span>
        <span className="location">Unknown</span>
        <i className="material-icons close">clear</i>
      </h1>
    )
  }
}

export default Header
