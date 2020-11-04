import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button
} from '@material-ui/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { Card } from './Card'
import { CardColumn } from './CardColumn'

const useStyles = makeStyles({
  root: {
    height: '100%',
    padding: '10px 0'
  },
  columnList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gridGap: 10,
    height: '100%'
  },
  cardListItem: {
    marginBottom: 10
  }
})

export const Board = ({ onMove, onAddCard, onCardClick }) => {
  const classes = useStyles()

  const orders = {
    id: 1,
    name: 'Наряды',
    allowAddNew: true,
    cards: [
      {
        id: 1,
        title: 'Установка плит под фундамент',
        priority: { color: 'orange' },
        messages: 1,
        warning: true,
        avatar: 'A'
      },
      {
        id: 2,
        title:
          'Земельные работы по подготовке площадки по установке плит для несущей стены',
        priority: { color: 'green' },
        avatar: 'A'
      }
    ]
  }

  const inWork = {
    id: 2,
    name: 'В работе',
    circleColor: 'green',
    cards: [
      {
        id: 3,
        title: 'Установка плит под фундамент',
        priority: { color: 'orange' },
        avatar: 'A'
      },
      {
        id: 4,
        title: 'Установка плит под фундамент',
        priority: { color: 'green', number: 1 },
        days: 12,
        avatar: 'B'
      }
    ]
  }

  const acceptance = {
    id: 3,
    name: 'Приемка',
    circleColor: 'orange',
    cards: [
      {
        id: 5,
        title:
          'Земельные работы по подготовке площадки по установке плит для несущей стены',
        avatar: 'A'
      },
      {
        id: 6,
        title: 'Установка плит под фундамент',
        avatar: 'B'
      }
    ]
  }

  const completed = {
    id: 4,
    name: 'Завершено',
    circleColor: 'blue',
    cards: [
      {
        id: 7,
        title: 'Установка плит под фундамент',
        priority: { color: 'orange' },
        avatar: 'A'
      },
      {
        id: 8,
        title: 'Установка плит под фундамент',
        avatar: 'A'
      }
    ]
  }

  const [currDraggableSourceId, setCurrDraggableSourceId] = useState(null)
  const [isAddDialogOpen, setAddDialogOpen] = useState(false)
  const [columnAddId, setColumnAddId] = useState(null)
  const [newCardTitle, setNewCardTitle] = useState(null)
  const [columns, setColumns] = useState([
    orders,
    inWork,
    acceptance,
    completed
  ])

  const onAddDialogClose = () => {
    setAddDialogOpen(false)
    setColumnAddId(null)
    setNewCardTitle(null)
  }

  const onCreateNewCard = () => {
    const currColumndId = columns.findIndex(({ id }) => columnAddId === id)
    const currColumn = columns[currColumndId]

    const allCards = columns.reduce(
      (prev, curr) => [...prev, ...curr.cards],
      []
    )
    const maxCardId = Math.max(...allCards.map(({ id }) => id))

    const columnWithNewCard = {
      ...currColumn,
      cards: [
        {
          id: maxCardId + 1,
          title: newCardTitle,
          priority: { color: 'green' },
          avatar: 'A'
        },
        ...currColumn.cards
      ]
    }

    setColumns([
      ...columns.slice(0, currColumndId),
      columnWithNewCard,
      ...columns.slice(currColumndId + 1)
    ])

    setAddDialogOpen(false)
    onAddCard()
  }

  const reorderList = (list, fromIdx, toIdx) => {
    const result = [...list]
    const [movedItem] = result.splice(fromIdx, 1)
    result.splice(toIdx, 0, movedItem)
    return result
  }

  const moveItem = (
    columns,
    sourceIdx,
    destIdx,
    droppableSource,
    droppableDestination
  ) => {
    // deep copy for cards
    const newColumns = [
      ...columns.map((item) => JSON.parse(JSON.stringify(item)))
    ]

    const [movedItem] = newColumns[sourceIdx].cards.splice(
      droppableSource.index,
      1
    )

    newColumns[destIdx].cards.splice(droppableDestination.index, 0, movedItem)

    return newColumns
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    const sourceId = parseInt(source.droppableId)
    const destId = parseInt(destination.droppableId)
    const cardId = parseInt(draggableId)

    const isSameColumn = sourceId === destId

    const columnSourceIdx = columns.findIndex(({ id }) => sourceId === id)
    const columnDestIdx = columns.findIndex(({ id }) => destId === id)

    if (isSameColumn) {
      const column = columns[columnSourceIdx]

      const reorderedCards = reorderList(
        column.cards,
        source.index,
        destination.index
      )

      const newColumn = {
        ...column,
        cards: reorderedCards
      }

      setColumns([
        ...columns.slice(0, columnSourceIdx),
        newColumn,
        ...columns.slice(columnSourceIdx + 1)
      ])
    } else {
      const columnsWithMovedCard = moveItem(
        columns,
        columnSourceIdx,
        columnDestIdx,
        source,
        destination
      )

      setColumns(columnsWithMovedCard)
    }

    onMove(sourceId, destId, cardId)
  }

  const onDragUpdate = (result) => {
    const {
      source: { droppableId }
    } = result

    const sourceId = parseInt(droppableId)

    if (currDraggableSourceId !== sourceId) {
      setCurrDraggableSourceId(parseInt(sourceId))
    }
  }

  const columnList = columns.map(({ id, cards, ...columnProps }) => {
    const notAdjacentColumn =
      currDraggableSourceId + 1 !== id && currDraggableSourceId - 1 !== id

    const notSameColumn = id !== currDraggableSourceId
    const isDropDisable = notAdjacentColumn && notSameColumn

    const cardList = cards.map(({ id, ...cardProps }, i) => (
      <Draggable key={id} draggableId={String(id)} index={i}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            style={{ ...provided.draggableProps.style }}
            className={classes.cardListItem}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card {...cardProps} id={id} onCardClick={onCardClick} />
          </li>
        )}
      </Draggable>
    ))

    const onAddCard = (id) => {
      setColumnAddId(id)
      setAddDialogOpen(true)
    }

    return (
      <li key={id}>
        <CardColumn {...columnProps} id={id} onAddCard={() => onAddCard(id)}>
          <Droppable droppableId={String(id)} isDropDisabled={isDropDisable}>
            {(provided) => (
              <ul
                ref={provided.innerRef}
                style={{ height: '100%' }}
                {...provided.droppableProps}
              >
                {cardList}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </CardColumn>
      </li>
    )
  })

  return (
    <div className={classes.root}>
      <DragDropContext
        onDragUpdate={onDragUpdate}
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <ul className={classes.columnList}>{columnList}</ul>

        <Dialog
          open={isAddDialogOpen}
          onClose={onAddDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Создать новую карточку
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Название"
              onChange={(e) => setNewCardTitle(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onAddDialogClose} color="primary">
              Закрыть
            </Button>
            <Button onClick={onCreateNewCard} color="primary">
              Создать
            </Button>
          </DialogActions>
        </Dialog>
      </DragDropContext>
    </div>
  )
}
