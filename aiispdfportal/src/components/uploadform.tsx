"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import { SymbolIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createClient } from "@supabase/supabase-js"



import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "./ui/use-toast"
import { ToastProvider } from "@radix-ui/react-toast"
import { api_uploadmetadata_url, supabase_publickey, supabase_url } from "../../SUPER_SECRET_KEYS"

const formSchema = z.object({
    nickname: z.string().min(3).max(30),
    priority: z.string(),
    file: z.any().refine(file => {
        if (file instanceof File) {
            const fileName = file.name;
            return fileName.endsWith(".docx") || fileName.endsWith(".pdf") || fileName.endsWith(".doc") || fileName.endsWith(".pptx");
        }
        return false;
    }, {
        message: "File must end with .docx, .pdf, .pptx, or .doc"
    })
})

const supabase = createClient(supabase_url, supabase_publickey)


async function uploadFile(file: File) {


    const { data, error } = await supabase.storage.from("PDF_Files_Bucket").upload(file.name, file)
    if (error) {
        console.log("error")
        console.log(error)
    }
    else {
        console.log("Sucessfully Uploaded!")
    }
}

async function uploadMetadata(url: string, filename: string, nickname: string, priority: string) {

    const metadata = {
        filename: filename,
        nickname: nickname,
        priority: priority
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(metadata)

        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log("Success!", result)
    } catch (error) {
        console.log(error)
    }

}

export function UploadForm( {onUploadComplete} ) {

    const [isLoading, setLoading] = useState(false)
    const [isFinishedUploaded, setFinishedUploading] = useState(false)
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nickname: "",
            priority: "",
            file: ""
        },
    })

    

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setFinishedUploading(false)
        setLoading(true)

        await uploadFile(values.file)
        await uploadMetadata(api_uploadmetadata_url, values.file.name, values.nickname, values.priority)
       
        setFinishedUploading(true)
        setLoading(false)

        if (onUploadComplete) {
            onUploadComplete();
        }
        queryClient.invalidateQueries({ queryKey: ['FetchTableData'] })
        toast({
            title: "Uploaded File!",
            description: `${values.file.name} has been uploaded to the database.`,
        })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control} 
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Input File</FormLabel>
                            <FormControl>
                                <input
                                    type="file"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={event => field.onChange(event.target.files?.[0] ?? null)}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload the file here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                                <Input placeholder="XYZ Grammer Notes" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name of the file.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Priority (Optional)</FormLabel>
                            <Controller
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormDescription>
                                This is the priority of the file.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isLoading ? 
                    (<Button disabled>
                        <SymbolIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </Button>)
                :
                        (<Button type = "submit">Submit</Button>)

                }
                
            </form>
        </Form>
    );
}