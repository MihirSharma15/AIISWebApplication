"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Cross1Icon, ExclamationTriangleIcon, SymbolIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "../ui/input";
import { useState } from "react";
import { ADMINPASSWORD, api_delete_url_bucket, api_delete_url_table, supabase_publickey, supabase_url } from "../../../SUPER_SECRET_KEYS";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";


export function ConfirmDeleteDialog({ row }) {

    const [isCorrectPassword, setCorrectPasword] = useState(false)
    const [isLoadingDone, setLoading] = useState(false)
    const [isDialogOpen, setDialogOpen] = useState(false)
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const formSchema = z.object({

        password: z.string().refine(password => {
            if (password == ADMINPASSWORD) {
                setCorrectPasword(true)
                return true
            }
            else {
                setCorrectPasword(false)
                return false
            }
        }, {
            message: "Admin Password is incorrect. Please try again."
        })
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })

    async function deleteFromTable(pdf_id) {

        const metadata = {
            pdf_id: pdf_id
        }

        
        const url = api_delete_url_table
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
    async function deleteFromBucket(filename: string) {

        const metadata = {
            filename: filename
        }

        const url = api_delete_url_bucket
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


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        await deleteFromBucket(row.filename);
        await deleteFromTable(row.pdf_id);
        setLoading(false)
        setDialogOpen(false)
        queryClient.invalidateQueries({ queryKey: ['FetchTableData'] })
        toast({
            variant: "destructive",
            title: "Deleted File!",
            description: `${row.filename} has been deleted from the servers.`,
        })
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="opacity-20 scale-100 hover:opacity-100 hover:scale-125 hover:text-red-600 transition-all ease-in-out duration-200" variant="ghost" size="icon" onClick={() => setDialogOpen(true)}>
                    <Cross1Icon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-red-600 flex flex-row items-center">
                        Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription>
                        This cannot be undone. <span className="font-semibold">{row.filename}</span> will be deleted.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field}></Input>
                                        </FormControl>
                                        <FormDescription>
                                            Enter the Admin Password.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!isCorrectPassword ? (
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Button type="submit" variant="ghost">Delete File</Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        Please enter the correct password! Press Enter to verify.
                                    </HoverCardContent>
                                </HoverCard>
                            ) : (
                                <Button type="submit" variant="destructive" disabled={isLoadingDone}>
                                    {isLoadingDone ? (
                                        <>
                                            <SymbolIcon className="mr-2 h-4 w-4 animate-spin" />
                                            Please wait
                                        </>
                                    ) : (
                                        "Delete File"
                                    )}
                                </Button>
                            )}
                            
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}