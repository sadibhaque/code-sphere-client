import { Loader2 } from "lucide-react";
import React from "react";

// Optional props allow size customization without breaking existing usage
const Loading = ({ className, iconClassName }) => {
    const containerClass =
        className ||
        "flex w-full col-span-full items-center justify-center h-[400px]";
    const iconClass =
        iconClassName || "mx-auto h-12 w-12 animate-spin text-primary";

    return (
        <div className={containerClass}>
            <Loader2 className={iconClass} />
        </div>
    );
};

export default Loading;
