import { useEffect, useState } from "react";
import { columns } from "./datacolumns";
import { DataTable } from "./datatablepdf";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api_fetchrows_url } from "../../../SUPER_SECRET_KEYS";

async function fetchAllRows(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
    }
    const data = await response.json();
    return data
}

export default function QueryDatabase() {

    const [allRowsData, setAllRowsData] = useState()

    const queryClient = useQueryClient()

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['FetchTableData'],
        queryFn: async () => {
            const data = await fetchAllRows(api_fetchrows_url)
            setAllRowsData(data)
            return data
        }
    })

    if (isPending) {
        return (
            <div className="flex flex-row items-center justify-center">
                <ReloadIcon className="h-6 w-6 animate-spin"></ReloadIcon>
            </div>
        );
    }

    if (isError) {
        return <h1>Error Loading Database. Error: {error.message} </h1>
    }

    return (
        <DataTable columns={columns} data={allRowsData.data} />
    );
}