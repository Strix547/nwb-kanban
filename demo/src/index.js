import React, { Component } from 'react'
import { render } from 'react-dom'

import Example from '../../src'

export default class Demo extends Component {
  render() {
    return <Example />
  }
}

render(<Demo />, document.querySelector('#demo'))
