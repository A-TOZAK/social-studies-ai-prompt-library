# 鹿児島小社研 社会科AIプロンプト集 引き継ぎメモ

作成日: 2026-06-16

## 目的

鹿児島小社研の先生方向けに、研修後のおみやげとして使える小学校社会科専用のAIプロンプト集サイトを整備している。単なるプロンプト一覧ではなく、先生が普段使っているAIにコピーして貼り、必要に応じて書き換えられる道具箱にする。

## 公開先

- 公開サイト: https://a-tozak.github.io/social-studies-ai-prompt-library/
- GitHub: https://github.com/A-TOZAK/social-studies-ai-prompt-library
- ローカル: `/Users/tozakiakihiro/Desktop/LiFE with/16 芭蕉先生/social-studies-ai-prompt-library`

## 現在のサイト状態

- トップ画像は鹿児島の地域教材化イメージ画像 `assets/images/card-regional-materials.png` を使用。
- LiFE withロゴをヘッダー、フッター、favicon、apple touch iconに反映済み。
- ページタイトルは「鹿児島小社研 社会科AIプロンプト集」。
- プロンプトカードと編集モーダルから「出典」表示は削除済み。
- プロンプトは24本。
- 追加済みの重要プロンプト:
  - 写真・スクショで自分の考えをブラッシュアップする
  - ここまでのやり取りをMarkdownで引き継ぐ
  - 研修発言をHTMLで見える化する
- 2026-06-16にフッター表記を `LiFE with / 外﨑顯博` へ修正済み。
- Gemini Flash実機検証を受け、未入力資料をAIが勝手に補わないようにプロンプト条件を追加済み。

## 直近のユーザーフィードバック

- Gemini Flashで24本すべてのプロンプトを実際に試してほしい。
- 学校現場ではGoogleアカウント環境が多く、Geminiで使えることが重要。
- 各プロンプトについて、実際に貼ったらどんな成果物が返るか、良かった点、修正点を記録してほしい。
- 記録はObsidianにも残したい。
- Claude Codeや別チャットに移っても文脈が続くように、詳細なコンテキストを残したい。
- Chromeのブラウザを実際に使ってGeminiを開いて検証してほしい。

## Chrome / Gemini検証の現在地

Chromeプラグインを使う方針で進めた。2026-06-16時点の確認結果:

- Google Chromeは起動中。
- Native Messaging Hostは正常。
- ユーザーがCodex Chrome Extensionを追加後、Chrome接続に成功。
- Geminiタブを取得し、画面上のモデルがFlashであることを確認。
- 24本すべてをGemini Flashに投入し、結果を取得済み。

## Gemini実機検証の結果

- 全24本の投入が完了。
- 生データ: `docs/gemini-flash-validation-raw-results.json`
- 読みやすい検証レポート: `docs/gemini-flash-validation-log.md`
- 良好だったもの:
  - 地域素材に「あたり」をつける
  - 指導と評価の一体化まで含めた単元計画
  - 社会科らしい問いに磨く
  - 対話を深める質問カードを作る
  - Google Earthで地域を探る計画
  - ここまでのやり取りをMarkdownで引き継ぐ
- 修正が必要だった傾向:
  - 資料本文、児童記述、座席表、振り返り、写真が未入力でも、Geminiが想定で補ってしまう。
  - 単元Webサイトや自己調整チェックリストで、Geminiが絵文字を入れることがある。
  - HTML見える化で、GeminiがTailwind CDNを読み込むコードを出した。
- 対応済み:
  - 未入力時は「資料を貼ってください」「児童の記述を匿名で貼ってください」など、入力を求めて止まる条件を追加。
  - 絵文字や飾り文字を控える条件を追加。
  - HTML出力は外部CDNなし、styleタグのみ、HTMLコードブロック1つに限定。

## 検証ログ

検証ログ:

- `docs/gemini-flash-validation-log.md`
- `docs/gemini-flash-validation-raw-results.json`

## Obsidian反映

候補のObsidian関連パス:

- `/Users/tozakiakihiro/Desktop/LiFE with/.obsidian`
- `/Users/tozakiakihiro/Desktop/LiFE with/01 事業計画/Obsidian精選投入`

現在の書き込み権限では、リポジトリ外への直接編集は承認が必要。まずリポジトリ内にMarkdownを作り、必要に応じてObsidian側へコピーする。

## 次にやること

1. 修正後のサイトをローカル/公開で確認する。
2. 名前表記修正、検証ログ、プロンプト改善をコミットしてpushする。
3. GitHub Pages反映を確認する。
