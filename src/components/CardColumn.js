import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FiberManualRecord, Add } from '@material-ui/icons'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 310,
    height: '100%'
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#bfc1e94f',
    borderRadius: 10
  },
  content: {
    height: '100%',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#bfc1e94f',
    borderRadius: 10
  },
  addBtn: {
    marginLeft: 'auto',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    outline: 'none'
  }
})

export const CardColumn = ({
  name,
  circleColor = 'gray',
  allowAddNew = false,
  children,
  onAddCard
}) => {
  const classes = useStyles()

  const addNewCardBlock = allowAddNew ? (
    <button className={classes.addBtn} onClick={() => onAddCard()}>
      <Add />
    </button>
  ) : null

  return (
    <div className={classes.root}>
      <div className={classes.head}>
        <FiberManualRecord htmlColor={circleColor} />
        <Typography variant="h6" style={{ paddingLeft: 10 }}>
          {name}
        </Typography>
        {addNewCardBlock}
      </div>

      <div className={classes.content}>{children}</div>
    </div>
  )
}
