export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 相談ヨウ
        </p>
        <p className="text-xs text-muted-foreground">
          ※ 価格・在庫情報はモックデータです
        </p>
      </div>
    </footer>
  );
}
