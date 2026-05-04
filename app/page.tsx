export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-6"
        style={{ color: 'var(--color-muted)', letterSpacing: '0.2em' }}
      >
        system / initializing
      </p>
      <h1
        className="text-5xl md:text-7xl text-center leading-tight mb-4"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-white)', fontWeight: 300 }}
      >
        Müjgan Armağan<br />Türközü
      </h1>
      <p
        className="text-sm tracking-widest uppercase mt-4"
        style={{ color: 'var(--color-green)', letterSpacing: '0.2em' }}
      >
        Clinical Precision · Creative Fluidity
      </p>
    </div>
  )
}
