import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MessagesClient } from "@/components/messages/MessagesClient";

export default async function MessagesPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return <MessagesClient user={user} />;
}
