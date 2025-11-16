// utils
import { cn } from "@/lib/utils";

const Loader = ({ className }: { className?: string }) => {
    return (
        <div className={cn('size-10 mx-auto animate-spin rounded-full border-b-4 border-blue-600', className)}></div>
    )
}

export default Loader;