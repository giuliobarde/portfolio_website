import { redirect } from "next/navigation";
import { createClient } from "@/prismicio";

export default async function Page() {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const version = settings.data.version;

  redirect(version === "v3" ? "/v3" : "/v4");
}
