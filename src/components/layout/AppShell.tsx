import { Link } from "react-router-dom";

export default function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <header className="border-b border-neutral-800">
                <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
                    <Link to="/" className="font-bold">TaskOps</Link>
                    <nav className="flex gap-4 text-sm">
                        <Link to="/board" className="hover:underline">Board</Link>
                        <Link to="/workflows" className="hover:underline">Workflows</Link>
                        <Link to="/reports" className="hover:underline">Reports</Link>
                        <Link to="/settings" className="hover:underline">Settings</Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto p-4">
                <h1 className="text-xl font-semibold mb-4">{title}</h1>
                {children}
            </main>
        </div>
    );
}