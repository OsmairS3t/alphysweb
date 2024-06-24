import Menu from "@aw/components/menu";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <main className=" h-screen flex flex-row">
      <Menu />
      <aside className="h-full flex-1 p-4 z-20 bg-white">
        <Dashboard />
      </aside>
    </main>
  );
}
