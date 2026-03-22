export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">ご近所ワイン</p>
            <p className="mt-1 text-xs text-muted-foreground">
              コンビニ・スーパーで買える手頃なワインを<br />
              コスパと話題度で厳選して紹介するサイトです。
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">参考にしているアカウント</p>
            <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
              <a href="https://x.com/winenomuhito" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                @winenomuhito — ワイン@飲み専🍷keis
              </a>
              <a href="https://x.com/tanabe_duvin" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                @tanabe_duvin — ソムリエ田辺由美
              </a>
              <a href="https://x.com/miyamoto_ryuta" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                @miyamoto_ryuta — 国際ソムリエ
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-center text-[10px] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ご近所ワイン. 価格は参考値です。最新の価格は各店舗でご確認ください。</p>
          <p className="mt-1">Vivinoスコアは各ワインのVivino公式ページの値を参照しています。</p>
        </div>
      </div>
    </footer>
  );
}
