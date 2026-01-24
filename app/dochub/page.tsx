import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DocHubClient } from "@/components/dochub/DocHubClient";
import { DocFile } from "@/components/dochub/types";

export default async function DocHubPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Fetch documents
    const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Map to DocFile type
    const initialFiles: DocFile[] = (documents || []).map(doc => ({
        id: doc.id,
        name: doc.file_name,
        category: doc.category as any,
        uploadDate: new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
        type: doc.file_type === 'pdf' ? 'pdf' : 'image',
        status: doc.status as any,
        downloadUrl: doc.file_path // We'll handle signing this URL in the client or generating a signed URL here
    }));

    return <DocHubClient user={user} initialFiles={initialFiles} />;
}
