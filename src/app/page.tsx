export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-muted">VOGGSMEDIA</p>
        <h1 className="mt-4 text-4xl font-semibold">Salespage scaffold ready</h1>
        <p className="mt-3 text-muted max-w-md mx-auto">
          Sections are wired in subsequent commits. Run{" "}
          <code className="text-accent">pnpm dev</code> to verify.
        </p>
      </div>
    </main>
  );
}
