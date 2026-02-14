import React from "react";
import { createClient } from "@/prismicio";
import NavBar from "@/components/NavBar";

export default async function Header() {
    const client = createClient();
    const settings = await client.getSingle("settings");
    return (
        <header className="sticky top-0 md:top-4 z-50 mx-auto max-w-7xl">
            <NavBar settings={settings} />
        </header>
    );
}
