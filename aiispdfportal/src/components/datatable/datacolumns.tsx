"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Button } from "../ui/button"
import { Cross1Icon } from "@radix-ui/react-icons"
import { DownloadIcon, CaretSortIcon } from "@radix-ui/react-icons"
import { ConfirmDeleteDialog } from "./confirmdelete"
import DownloadButton from "./downloadbutton"



export type PDFDataType = {
    pdf_id: string
    filename: string
    nickname: string
    date_added: string
    priority: string
}

export const columns: ColumnDef<PDFDataType>[] = [
    {
        accessorKey: "filename",
        header: "File",
    },
    {
        accessorKey: "nickname",
        header: "Name",
    },
    {
        accessorKey: "date_added",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date Added
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({getValue}) => {
            const date = getValue<string>()
            return format(new Date(date), "MMMM d, yyyy")
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const file = row.original

            return (
                <div className="flex flex-row space-x-1">
                    <DownloadButton row = {file}/>
                    <ConfirmDeleteDialog row = {file}/>
                    
                </div>
            )
        }
    }
]