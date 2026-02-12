export const metadata = {
  title: 'Big Corp Tracker',
  description: 'Global stock rankings and revenue segment analysis for the Magnificent 8, GRANOLA 11, and Terrific 10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
