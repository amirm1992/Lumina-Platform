import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DocHubClient } from "@/components/dochub/DocHubClient";

export default async function DocHubPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return <DocHubClient user={user} />;
}
