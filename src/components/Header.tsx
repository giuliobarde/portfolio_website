import React from "react";
import { createClient } from "@/prismicio";
import NavBar from "@/components/NavBar";


export default async function Header() {
    const client = createClient();
    const settings = await client.getSingle("settings");
    /* <Link href="/" aria-label="Home Page">
                        {settings.data.name}
                    </Link>*/
    return (
        <header className="sticky top-0 md:top-4 z-50 mx-auto max-w-7xl">
            <NavBar settings={settings} />
        </header>
)
}
