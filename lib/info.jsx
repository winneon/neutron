'use strict'

import React from 'react'

class Info extends React.Component {
  render(){
    return (
      <div className="info">
        <div className="destSystem">Unknown</div>
        <div className="nextSystem">Unknown</div>
        <div className="isNeutron">No</div>
        <div className="jumpsLeft">0</div>
        <div className="totalJumpsLeft">0</div>
      </div>
    )
  }
}

export default Info
