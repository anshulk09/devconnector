import React from 'react'
import spinner from './spinner.gif'

export const Spinner= () => {
  return (
    <div>
      <img src={spinner} alt="Loading..." style={{width: '200px', margin: 'auto', display: 'block'}}/>
    </div>
  )
}
