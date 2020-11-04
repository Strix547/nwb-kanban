import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card as MUICard,
  CardContent,
  Avatar,
  Typography,
  Box
} from '@material-ui/core'
import { Warning, ArrowUpward, ChatBubbleOutline } from '@material-ui/icons'

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10
  },
  infoListItem: {
    display: 'flex',
    alignItems: 'flex-end',
    marginRight: 8,
    '&:last-child': {
      marginRight: 0
    }
  },
  iconBlock: {
    display: 'flex',
    alignItems: 'flex-end'
  }
})

export const Card = ({
  id,
  title,
  priority = null,
  messages,
  warning,
  days,
  avatar,
  onCardClick
}) => {
  const classes = useStyles()

  const havePriorityArrow = priority && (
    <div className={classes.iconBlock}>
      <ArrowUpward htmlColor={priority.color} />
      <Typography>{priority.number}</Typography>
    </div>
  )

  const haveMessages = messages && (
    <div className={classes.iconBlock}>
      <ChatBubbleOutline htmlColor="gray" />
      <Typography>{messages}</Typography>
    </div>
  )

  const haveDays = days && <Typography>{days}д</Typography>

  const haveWarningIcon = warning && <Warning htmlColor="orange" />

  const info = [havePriorityArrow, haveMessages, haveDays, haveWarningIcon]

  const infoList = info
    .filter((item) => item)
    .map((item, i) => (
      <li key={i} className={classes.infoListItem}>
        {item}
      </li>
    ))

  return (
    <MUICard onClick={() => onCardClick(id)}>
      <CardContent className={classes.content}>
        <Typography variant="h6" style={{ lineHeight: 1 }}>
          {title}
        </Typography>

        <div className={classes.info}>
          <Box display="flex" alignItems="flex-end" component="ul">
            {infoList}
          </Box>

          <Avatar>{avatar}</Avatar>
        </div>
      </CardContent>
    </MUICard>
  )
}
