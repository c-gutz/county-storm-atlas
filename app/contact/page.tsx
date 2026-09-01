export default function Contact(){
    return (
        <main className="mx-auto max-w-xl px-6 py-20 sm:py-28">
        <p className="text-xs uppercase tracking-[0.16em] text-black/40">Contact</p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Get in touch
        </h1>

        <dl className="mt-12 divide-y divide-black/10 border-y border-black/10">
            <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="text-xs uppercase tracking-[0.16em] text-black/40">Name</dt>
            <dd className="text-sm sm:text-base">Christian Gutierrez</dd>
            </div>

            <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="text-xs uppercase tracking-[0.16em] text-black/40">University</dt>
            <dd className="text-right text-sm sm:text-base">
                Stanford University
            </dd>
            </div>

            <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="text-xs uppercase tracking-[0.16em] text-black/40">Email</dt>
            <dd className="text-sm sm:text-base">
                <a
                href="mailto:cgutz@stanford.edu"
                className="relative py-1 transition-colors hover:text-black
                            after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left
                            after:scale-x-0 after:bg-black after:transition-transform after:duration-300
                            after:ease-out after:content-[''] hover:after:scale-x-100"
                >
                cgutz [at] stanford [dot] edu
                </a>
            </dd>
            </div>
        </dl>
        </main>
    )
}