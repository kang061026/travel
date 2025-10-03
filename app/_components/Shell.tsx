export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-sm md:max-w-3xl lg:max-w-4xl px-4 py-4">
      {children}
    </div>
  )
}
