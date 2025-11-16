// hooks
import { useUser } from "@/features/authentication/useUser";

const Settings = () => {
    const { user } = useUser();

    return (
        <div className="flex-1">
            <h1>Settings:</h1>
            <p>{user.name}</p>
            <p>{user.email}</p>

        </div>
    )
}

export default Settings;