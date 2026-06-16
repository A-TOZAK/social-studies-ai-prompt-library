# 小学校社会科AIプロンプト集

鹿児島小社研オンライン研修「社会科における生成AIの活用」のおみやげとして配布する、GitHub Pages向けの静的サイトです。

## 公開想定URL

`https://a-tozak.github.io/social-studies-ai-prompt-library/`

## 構成

- `index.html`: サイト本体
- `styles.css`: レイアウトとデザイン
- `app.js`: 検索、コピー、編集モーダル、いいね、端末内保存
- `data/prompts.js`: プロンプト本文データ
- `data/resources.js`: note、PDF、フォーム、公開教材などのリンク
- `data/results.js`: Gemini Flash出力例の補足メモ
- `docs/gemini-flash-validation-log.md`: Gemini Flash出力例の確認メモ
- `docs/gemini-flash-validation-raw-results.json`: Gemini Flashの出力本文を含むrawデータ
- `assets/docs/`: 研修スライドPDF
- `assets/slides/`: スライド画像

## いいね機能について

GitHub Pagesは静的サイトなので、サーバーを使わずに全参加者分のいいね数を自動集計することはできません。

このサイトでは、まず次の形で実装しています。

- いいねしたプロンプトを各端末の `localStorage` に保存
- 編集したプロンプトも各端末の `localStorage` に保存
- 「いいね一覧をコピー」して研修後アンケートに貼れる

全体集計が必要な場合は、GoogleフォームやGAS、Firebaseなどの外部保存先を追加します。

## 更新メモ

プロンプトを追加する場合は `data/prompts.js` にオブジェクトを追加します。
カテゴリは `inquiry`, `prep`, `feedback`, `dialogue`, `self`, `student`, `share` のいずれかを使います。

Geminiの出力例を更新する場合は、原本を `docs/` に残し、モーダルに表示する短い概要や注意点は `data/results.js` に反映します。
