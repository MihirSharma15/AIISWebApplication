"use client"
import Image from "next/image";
import aiislogo from "/public/aiis-logo.png";
import Navbar from "@/components/navbar";
import Pdfuploadbutton from "@/components/pdfuplaod";
import { DataTable } from "@/components/datatable/datatablepdf";
import { columns } from "@/components/datatable/datacolumns";
import { useEffect,useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import QueryDatabase from "@/components/datatable/queryDatabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@radix-ui/react-toast";

const queryClient = new QueryClient()

export default function Home() {

  return (
    <div className="flex flex-col min-w-full min-h-screen bg-slate-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
          Upload Your PDFs
        </h1>
        <h3 className="scroll-m-20 text-md tracking-tight text-gray-400 pb-2 shadow-none hover:shadow-lg">
          Easily share and manage your AIIS documents.
        </h3>
        <QueryClientProvider client={queryClient}>
        <Pdfuploadbutton />
          <div className="my-4 group w-4/5 lg:w-8/12">
              <QueryDatabase />
          </div>
        </QueryClientProvider>
        <Toaster />
      </div>
    </div>

  );
}