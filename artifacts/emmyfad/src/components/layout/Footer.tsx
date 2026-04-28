export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EMMYFAD Global Enterprise. All rights reserved.</p>
      </div>
    </footer>
  );
}