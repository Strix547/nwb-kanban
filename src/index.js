import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'

import { Board } from './components/Board'

import 'reset-css'
import './styles/index.css'

const useStyles = makeStyles({
  root: {
    minHeight: '100%'
  }
})

export default () => {
  const classes = useStyles()

  const onCardClick = (id) => {
    console.log(id)
  }

  const onAddCard = () => {
    console.log('add card')
  }

  const onMove = (from, to, cardId) => {
    console.log(from, to, cardId)
  }

  return (
    <Container classes={classes}>
      <Board onMove={onMove} onAddCard={onAddCard} onCardClick={onCardClick} />
    </Container>
  )
}
