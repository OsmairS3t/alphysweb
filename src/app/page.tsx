import Menu from "@aw/components/menu";
import Dashboard from "./dashboard/page";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@aw/utils/supabase/server";

export default async function Home() {
  let loggedIn = false;

  try {
    const supabase = createClient()
    const {data: {session}} = await supabase.auth.getSession()
    console.log(session)
    if (session) loggedIn = true 
    console.log("Sessao: ", session)
  } catch (error) {
    console.log('Home', error)
  } finally{
    if (!loggedIn) {
      redirect('/login', RedirectType.replace)
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
