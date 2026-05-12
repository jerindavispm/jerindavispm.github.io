import { profile } from "../lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-[12.5px] font-mono text-zinc-500">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </div>
        <div className="text-[12.5px] font-mono text-zinc-600">
          Crafted with care. Built in Bangalore.
        </div>
      </div>
    </footer>
  );
}
