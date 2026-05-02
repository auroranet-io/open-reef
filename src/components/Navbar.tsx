import Link from "next/link";
import { auth } from "@/lib/auth";
import { signIn, signOut } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden="true"
            className="text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-400 dark:group-hover:text-emerald-300 transition-colors flex-shrink-0">
            {/* Legs */}
            <path d="M8 16.5L4 14.5M7.5 18L4 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M18 16.5L22 14.5M18.5 18L22 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Body */}
            <ellipse cx="13" cy="16" rx="5.5" ry="3.5" fill="currentColor"/>
            {/* Eye stalks */}
            <line x1="11" y1="13" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10.5" cy="9.5" r="1.5" fill="currentColor"/>
            <line x1="15" y1="13" x2="15.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor"/>
            {/* Left claw arm */}
            <path d="M8 14C6 12.5 4 10.5 4.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            {/* Left pincer */}
            <path d="M4.5 8C3.5 6.5 3.5 5 5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <path d="M4.5 8C4.5 6.5 5.5 5.5 6.5 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            {/* Right claw arm */}
            <path d="M18 14C20 12.5 22 10.5 21.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            {/* Right pincer */}
            <path d="M21.5 8C22.5 6.5 22.5 5 21 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <path d="M21.5 8C21.5 6.5 20.5 5.5 19.5 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
          <span className="font-mono text-base tracking-tight">
            <span className="font-normal text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-400 dark:group-hover:text-zinc-300 transition-colors">Open</span><span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">R</span><span className="font-normal text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-400 dark:group-hover:text-zinc-300 transition-colors">ee</span><span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">f</span>          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/search" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Search</Link>
          <Link href="/collections" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Collections</Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                Submit
              </Link>
              <form action={async () => { "use server"; await signOut(); }}>
                <button type="submit" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <form action={async () => { "use server"; await signIn("github"); }}>
              <button type="submit" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Sign in with GitHub
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
