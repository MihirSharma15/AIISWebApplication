import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { createClient } from "@supabase/supabase-js";
import { supabase_publickey, supabase_url } from "../../../SUPER_SECRET_KEYS";
import { useToast } from "../ui/use-toast";


export default function DownloadButton( {row} ) {

    const supabase = createClient(supabase_url, supabase_publickey)
    const { toast } = useToast()

    async function downloadFile(filename: string) {
        const { data } = await supabase.storage.from("PDF_Files_Bucket").getPublicUrl(filename)
        console.log(data)
        const url = data.publicUrl;

        // Create an anchor element and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Downloading File",
            description: `${row.filename} has started downloading...`,
        });
    }
    
    return (
        <Button className="scale-125 hover:scale-150 transition-all" variant="ghost" size="icon" onClick={async () => downloadFile(row.filename)}>
            <DownloadIcon />
        </Button>
    );
}