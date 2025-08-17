import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
    return (
        <div className="flex w-full col-span-full items-center justify-center h-[400px]">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        </div>
    );
};

export default Loading;
