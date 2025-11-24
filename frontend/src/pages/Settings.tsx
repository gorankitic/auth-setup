// components
import UpdatePasswordForm from "@/features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "@/features/user/UpdateUserDataForm";
import Sessions from "@/features/authentication/Sessions";
import UserAvatar from "@/features/user/UserAvatar";

const Settings = () => {

    return (
        <main className="flex flex-1 flex-col mx-auto w-full max-w-lg text-gray-700 space-y-5">
            <section>
                <UserAvatar />
            </section>
            <section>
                <h2 className="text-xl font-medium mb-2">Update profile:</h2>
                <UpdateUserDataForm />
            </section>
            <section>
                <h1 className="text-xl font-medium mb-2">Update password:</h1>
                <UpdatePasswordForm />
            </section>
            <section>
                <h1 className="text-xl font-medium">Active devices:</h1>
                <p className="text-sm mb-2">These are the devices currently signed in to your account.</p>
                <Sessions />
            </section>
        </main>
    )
}

export default Settings;