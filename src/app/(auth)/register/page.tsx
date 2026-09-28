import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
    const session= await auth();
    if(session?.user) redirect("/dashboard");

    return(
        <AuthShell mode="register">
            <RegisterForm/>
        </AuthShell>
    );
};