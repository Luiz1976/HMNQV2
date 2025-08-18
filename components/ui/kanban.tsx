import * as React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'

type KanbanColumn = { id: string; title: string; cards: React.ReactNode[] }

type KanbanBoardProps = { columns: KanbanColumn[] }

export function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="flex space-x-4">
      {columns.map((column) => (
        <div key={column.id} className="flex-1">
          <h3 className="font-semibold mb-2">{column.title}</h3>
          <ScrollArea className="h-[500px] rounded-md border p-4">
            {column.cards.map((card, index) => (
              <Card key={index} className="mb-4 p-4">
                {card}
              </Card>
            ))}
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}