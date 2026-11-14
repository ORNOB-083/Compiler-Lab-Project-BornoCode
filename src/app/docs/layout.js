import DocsNav from "@/components/docs/DocsNav";

export default function DocsLayout({ children }) {
    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
                <DocsNav />
                <div className="min-w-0 max-w-3xl">{children}</div>
            </div>
        </div>
    );
}
