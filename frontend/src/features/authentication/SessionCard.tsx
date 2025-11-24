// lib
import { formatDistanceToNow } from "date-fns";
import { Laptop, Smartphone, MapPin, Clock, CheckCircle } from "lucide-react";
// utils
import { cn, parseUserAgent } from "@/lib/utils";

interface SessionCardProps {
    session: {
        _id: string;
        userAgent: string;
        lastUsedAt: string;
        location?: string;
    };
    isCurrent: boolean;
}

const SessionCard = ({ session, isCurrent }: SessionCardProps) => {
    const { browser, os, device } = parseUserAgent(session.userAgent);
    const DeviceIcon = device === "mobile" ? Smartphone : Laptop;

    const location = session.location ?? "Unknown location";
    const lastUsed = formatDistanceToNow(new Date(session.lastUsedAt), { addSuffix: true });

    return (
        <div className={cn("border rounded-lg p-4 shadow-sm", isCurrent ? "border-blue-500 bg-blue-50/50" : "border-gray-200")}>
            <div className="flex gap-1 items-center mb-1">
                <DeviceIcon className="size-6 text-gray-600" />
                <p className="font-medium text-gray-800">{browser} on {os}</p>
            </div>
            <div className="ml-1 flex flex-col gap-1 text-sm text-gray-600">
                {isCurrent && (
                    <p className="text-blue-500 font-medium flex items-center gap-1">
                        <CheckCircle className="size-4" />
                        Current device
                    </p>
                )}
                <p className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {location}
                </p>
                <p className="flex items-center gap-1">
                    <Clock className="size-4" />
                    Active {lastUsed}
                </p>
            </div>
        </div>
    )
}

export default SessionCard;