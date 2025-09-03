import './globals.css'

export const metadata = {
  title: 'Todo App',
  description: 'Simple Next.js Todo List',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
