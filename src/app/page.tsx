/**
 * Root page — redirects to the public site or dashboard
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const session = await auth();

    if (session?.user) {
        redirect("/dashboard");
    }

    // For non-logged-in users, show a simple redirect to the static site
    // The static index.html is served at /index.html 
    redirect("/index.html");
}
