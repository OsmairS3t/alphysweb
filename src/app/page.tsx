import Menu from "@aw/components/menu";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <main className=" h-screen flex flex-row">
      <Menu />
      <aside className="bg-slate-950 h-full flex-1 text-gray-300 p-4">
        <Dashboard />
      </aside>
    </main>
  );
}
