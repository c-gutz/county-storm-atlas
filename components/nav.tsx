const link = "relative py-1 text-xs uppercase tracking-[0.12em] text-black/60 transition-colors hover:text-black " +
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 " +
  "after:bg-black after:transition-transform after:duration-300 after:ease-out after:content-[''] " +
  "hover:after:scale-x-100 sm:text-sm sm:tracking-[0.16em]";

export default function Nav(){
    return (
    <header className="w-full border-b border-black/10 bg-white">
      <nav
        aria-label="Main"
        className="flex h-14 items-center justify-center gap-5 px-4 text-xs sm:h-20 sm:gap-14 sm:px-6"
      >
        <a href="/" className={link}>
          Map
        </a>
        <a href="/analog" className={link}>
          Analog
        </a>
        <a href="/about" className={link}>
          About
        </a>
        <a href="/contact" className={link}>
          Contact
        </a>
      </nav>
    </header>
    )
}