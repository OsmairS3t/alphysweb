import Menu from "@aw/components/menu";
import Dashboard from "./dashboard/page";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default async function Home() {
  let loggedIn = false;

  try {
    const supabase = createServerComponentClient({cookies})
    const {data: {session}} = await supabase.auth.getSession()
    if (session) loggedIn = false  //mudar para true
  } catch (error) {
    console.log('Home', error)
  } finally{
    if (loggedIn) {
      redirect('/signin', RedirectType.replace)
    }
  }

  return (
    <main className=" h-screen flex flex-row">
      <Menu />
      <aside className="h-full flex-1 p-4 z-20 bg-white">
        <Dashboard />
      </aside>
    </main>
  );
}
