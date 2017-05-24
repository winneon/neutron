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
        <button className="replot" title="Replot from Location">
          <i className="material-icons">replay</i>
        </button>
        <button className="skip" title="Skip Jump" disabled>
          <i className="material-icons">skip_next</i>
        </button>
        <button className="toggle" title="Toggle Auto-Replot">
          <i className="material-icons">done</i>
        </button>
      </div>
    )
  }
}

export default Info
