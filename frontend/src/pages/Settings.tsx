// components
import UpdatePasswordForm from "@/features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "@/features/user/UpdateUserDataForm";
import Sessions from "@/features/authentication/Sessions";
import UserAvatar from "@/features/user/UserAvatar";

const Settings = () => {

    return (
        <main className="flex flex-1 flex-col mx-auto mt-5 w-lg text-gray-800">
            <section>
                <UserAvatar />
            </section>
            <section className="my-5">
                <h2 className="text-lg font-medium mb-2">Update profile:</h2>
                <UpdateUserDataForm />
            </section>
            <section className="mb-5">
                <h1 className="text-lg font-medium mb-2">Update password:</h1>
                <UpdatePasswordForm />
            </section>
            <section className="mb-5">
                <h1 className="text-lg font-medium">Active devices:</h1>
                <p className="text-sm mb-2">These are the devices currently signed in to your account.</p>
                <Sessions />
            </section>
        </main>
    )
}

export default Settings;