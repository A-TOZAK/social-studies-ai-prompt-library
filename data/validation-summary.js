window.GEMINI_VALIDATION_NOTES = {
  "find-social-studies-hatena": {
    verdict: "良好",
    summary: "先生の困り感を整理し、AIに任せる作業と教師が判断する作業、次に投げる具体プロンプトまで生成。",
    strength: "桜島の文脈を反映し、「社会科のねらいが先」という軸が残る。",
    concern: "GASなど技術寄りの言葉が少し出る。",
    revision: "GASは「必要なら」に寄せ、Googleフォーム/スプレッドシートを基本表現にする。"
  },
  "local-material-deep-research": {
    verdict: "良好",
    summary: "桜島教材の地域素材候補を8つ提示。克灰袋、降灰、避難、観光、特産物などが出た。",
    strength: "地域素材のあたり付けとしてかなり実用的。",
    concern: "公式確認が必要なものを先生が見落とす可能性。",
    revision: "「公式資料で確認してから使う」をカード上でも強める。"
  },
  "interview-question-design": {
    verdict: "良好",
    summary: "地域の人への取材目的、質問、記録したい資料を生成。",
    strength: "工夫・願い・課題へ向かう質問になっている。",
    concern: "取材相手が未設定でもある程度進む。",
    revision: "取材相手が未定なら候補別に出す条件を追加するとよい。"
  },
  "child-friendly-source": {
    verdict: "要修正",
    summary: "自治体・企業資料風の児童向け本文を作成。",
    strength: "4年生向けの言葉に直す力は高い。",
    concern: "資料本文を貼っていなくても内容を補ってしまう。",
    revision: "資料未貼付の場合は、先に資料本文の貼付を求める条件を追加。"
  },
  "unit-website-plan": {
    verdict: "軽微修正",
    summary: "単元Webサイトの構成案、ページ構成、児童の活動導線を生成。",
    strength: "サイト化する発想として使いやすい。",
    concern: "絵文字入りでややポップになる。",
    revision: "学校配布・教材サイト向けに、絵文字や装飾を控える条件を追加。"
  },
  "unit-plan-assessment": {
    verdict: "良好",
    summary: "指導と評価の一体化を含む単元計画案を生成。",
    strength: "単元計画としてそのまま叩き台になる。",
    concern: "長めなので編集が必要。",
    revision: "「表形式」「時数指定」などの書き換えポイントを強化してもよい。"
  },
  "learning-question-review": {
    verdict: "良好",
    summary: "中心となる問いを社会科らしい問いへ磨く提案を生成。",
    strength: "問いの良さと改善案が明確。",
    concern: "大きな問題なし。",
    revision: "現状維持でよい。"
  },
  "rubric-social-context": {
    verdict: "良好",
    summary: "3段階ルーブリックを生成。",
    strength: "点数化ではなく次の支援につながる形。",
    concern: "Gemini出力に軽微な重複表現あり。",
    revision: "プロンプト側は大きな修正不要。"
  },
  "individual-feedback-draft": {
    verdict: "要修正",
    summary: "個別フィードバック案を生成。",
    strength: "児童に返す言葉はやさしい。",
    concern: "児童記述が未入力でもGeminiが想定記述を作る。",
    revision: "児童記述がない場合は入力を求め、架空で作らない条件を追加。"
  },
  "feedback-simplifier": {
    verdict: "良好",
    summary: "長いフィードバックを80字以内、次の一手、教師メモへ短く整理。",
    strength: "実用性が高く、貼って使いやすい。",
    concern: "大きな問題なし。",
    revision: "現状維持でよい。"
  },
  "conversation-cards": {
    verdict: "良好",
    summary: "対話を深める質問カード12枚を生成。",
    strength: "根拠・比較・立場を促すカードとして使える。",
    concern: "少し枚数が多くなる。",
    revision: "必要なら「6枚版」も出せる条件を追加。"
  },
  "intentional-nomination-map": {
    verdict: "要修正",
    summary: "意図的指名プランを生成。",
    strength: "全体交流の流れとしては良い。",
    concern: "座席表や児童の考えが未入力でも想定で作る。",
    revision: "座席表/発言一覧がない場合は、先に入力テンプレートを返す条件を追加。"
  },
  "reconstruction-fukidashi": {
    verdict: "良好",
    summary: "ふきだしくん等の振り返り入力文を生成。",
    strength: "再考察を促す文型として使いやすい。",
    concern: "大きな問題なし。",
    revision: "現状維持でよい。"
  },
  "reflection-analysis": {
    verdict: "要修正",
    summary: "振り返り分析と次時の支援案を生成。",
    strength: "支援に結びつける視点は良い。",
    concern: "実際の振り返りが未入力でも一般論で分析する。",
    revision: "振り返り一覧がない場合は、まず貼付を求める条件を追加。"
  },
  "self-regulated-checklist": {
    verdict: "軽微修正",
    summary: "自己調整チェックリストを生成。",
    strength: "児童が次の一歩を選ぶ形式として良い。",
    concern: "絵文字が入りやすい。",
    revision: "学校配布用は絵文字控えめ条件を追加。"
  },
  "student-source-reading": {
    verdict: "要修正",
    summary: "資料読解の児童用支援を生成。",
    strength: "3つの気づき、問い、確かめたいことの型は良い。",
    concern: "資料未添付でも内容を推測して答える。",
    revision: "資料がない場合は「写真や資料を送って」と返す条件を追加。"
  },
  "student-compare-two-sources": {
    verdict: "要修正",
    summary: "2資料比較の児童用支援を生成。",
    strength: "比較の観点は良い。",
    concern: "2つの資料をGeminiが勝手に用意した。",
    revision: "資料A/Bがない場合は先に資料提示を求める条件を追加。"
  },
  "student-argument-support": {
    verdict: "要修正",
    summary: "自分の考えに足りない根拠を探す支援を生成。",
    strength: "根拠を探す観点は良い。",
    concern: "児童の考えが未入力でも想定で進む。",
    revision: "考え本文がない場合は、まず考えを貼るよう求める条件を追加。"
  },
  "google-earth-project": {
    verdict: "良好",
    summary: "Google Earth活動案を生成。",
    strength: "眺めて終わらず空間的視点につながる。",
    concern: "大きな問題なし。",
    revision: "現状維持でよい。"
  },
  "learning-log-minimum": {
    verdict: "良好",
    summary: "最小限の学習ログ項目を設計。",
    strength: "取りすぎない思想が守られている。",
    concern: "大きな問題なし。",
    revision: "現状維持でよい。"
  },
  "research-to-note": {
    verdict: "軽微修正",
    summary: "同僚・研究部向け共有文を生成。",
    strength: "研究構想とのつながりと実践報告の形が良い。",
    concern: "実践メモが薄いと良い話として補われる。",
    revision: "未入力部分は「分からない」と明記する条件を追加してもよい。"
  },
  "student-photo-feedback": {
    verdict: "要修正",
    summary: "写真・スクショへのフィードバックを生成。",
    strength: "フィードバックの方向性は良い。",
    concern: "画像未添付でも「あるものとして」進む。",
    revision: "画像がない場合は、まず写真/スクショ送信を求める条件を追加。"
  },
  "context-markdown-handoff": {
    verdict: "良好",
    summary: "Markdown引き継ぎメモを生成。",
    strength: "次チャット/NotebookLM用として非常に使いやすい。",
    concern: "大きな問題なし。",
    revision: "現状維持でよい。"
  },
  "workshop-fukidashi-html": {
    verdict: "要修正",
    summary: "研修発言のHTMLコードを生成。",
    strength: "見える化の方向性は合っている。",
    concern: "Tailwind CDNを読み込むコードになり、1ファイル完結ではない。出力も長い。",
    revision: "外部CDNなし、styleタグ内CSSのみ、コードブロック1つだけを条件に追加。"
  }
};
