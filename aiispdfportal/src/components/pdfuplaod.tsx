'use client'

import { useState, useRef } from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { UploadForm } from "./uploadform";


export default function Pdfupload() {
    const fileInputRef = useRef(null);

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDialogChange = (open) => {
        setDialogOpen(open)
    }

    const handleUploadComplete = () => {
        setDialogOpen(false)
    }

    return (
        <Dialog modal={true} open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <button className="w-4/5 lg:w-6/12 h-48 bg-slate-200 rounded-lg hover:brightness-95 duration-200 transition-all grid place-items-center group ease-in-out">
                    <UploadIcon className="w-16 h-16 text-slate-400 group-hover:text-black duration-200 transition-all ease-in-out" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>File Upload</DialogTitle>
                <DialogDescription>
                    Please provide additional details for the uploaded file.
                </DialogDescription>
                <UploadForm onUploadComplete={handleUploadComplete}></UploadForm>
                
            </DialogContent>
        </Dialog>
    );
}
