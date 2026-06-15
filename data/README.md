# data

`prompts.js` と `resources.js` は、サイトが読み込むデータファイルです。

## prompts.js

1つのプロンプトは次の情報を持ちます。

- `id`: 一意のID
- `category`: 絞り込みカテゴリ
- `phase`: 授業・研修の場面
- `title`: カードタイトル
- `summary`: 短い説明
- `benefit`: 先生にとってのメリット
- `source`: もとにした資料や実践
- `tags`: 検索・表示用タグ
- `customize`: 編集モーダルに出す書き換えポイント
- `body`: コピーされるプロンプト本文

## future

全参加者のいいね数を集計する場合は、静的ファイルだけではなく外部保存先が必要です。
候補はGoogleフォーム、Google Apps Script、Firebase、Supabaseなどです。
