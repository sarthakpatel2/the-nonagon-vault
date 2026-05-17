export function SiteFooter() {
  return (
    <footer className="py-20 px-8 border-t border-charcoal/10 bg-cream/40">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="size-16 bg-brand rounded-full mb-8 grid place-items-center text-white font-mono font-bold shadow-[0_8px_24px_oklch(0.68_0.21_38/0.35)]">
          CSE
        </div>
        <h4 className="font-serif text-3xl md:text-4xl italic mb-3">
          Ready to deploy to the real world.
        </h4>
        <p className="text-charcoal/40 font-mono text-xs md:text-sm mb-12">
          System.out.println(&quot;Goodbye, campus.&quot;);
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">
          <span>Est. 2022</span>
          <span>DevOps by friends</span>
          <span>Love by default</span>
        </div>
      </div>
    </footer>
  );
}
