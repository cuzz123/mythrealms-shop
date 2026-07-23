export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div data-studio-shell>{children}</div>;
}
