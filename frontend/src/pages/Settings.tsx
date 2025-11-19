// components
import Sessions from "@/features/authentication/Sessions";
import UpdatePasswordForm from "@/features/authentication/UpdatePasswordForm";

const Settings = () => {
    return (
        <main className="flex flex-1 flex-col mx-auto mt-5 w-lg text-gray-800">
            <h1 className="text-xl font-medium mb-3">Settings:</h1>
            <section className="mb-5">
                <h1 className="text-lg mb-3">Update password:</h1>
                <UpdatePasswordForm />
            </section>
            <section>
                <h1 className="text-lg">Active devices:</h1>
                <p className="text-sm mb-3">These are the devices currently signed in to your account.</p>
                <Sessions />
            </section>
        </main>
    )
}

export default Settings;