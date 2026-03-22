export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-foreground">ご近所ワイン</p>
          <p className="mt-1 text-xs text-muted-foreground">
            コンビニ・スーパーで買える手頃なワインを<br />
            コスパと話題度で厳選して紹介するサイトです。
          </p>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-center text-[10px] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ご近所ワイン. 価格は参考値です。最新の価格は各店舗でご確認ください。</p>
          <p className="mt-1">Vivinoスコアは各ワインのVivino公式ページの値を参照しています。</p>
        </div>
      </div>
    </footer>
  );
}
