# スマホ完結型・脱出ゲームプロトタイプ

このフォルダには、スマートフォンだけで遊べるように作り直した脱出ゲームのプロトタイプが入っています。追加アプリや PC は不要で、タップ操作だけですぐにテストできます。

## 今すぐ遊ぶ
- ▶️ **プレイ用リンク**: [https://htmlpreview.github.io/?https://raw.githubusercontent.com/openai/codex-testproject/main/prototype/mobile.html](https://htmlpreview.github.io/?https://raw.githubusercontent.com/openai/codex-testproject/main/prototype/mobile.html)
  - リンクをタップすると、そのままゲーム画面が開きます。通信が不安定な場合でも一度読み込めばキャッシュが効くので、再読み込みが素早くなります。
  - ご自身のリポジトリで運用する場合は、URL 中の `openai/codex-testproject` を該当の GitHub 組織名／ユーザー名とリポジトリ名に置き換えてください。
- 🔖 ホーム画面に追加するとフルスクリーン表示で遊べます。
  - **iOS (Safari)**: 共有ボタン → 「ホーム画面に追加」。
  - **Android (Chrome)**: メニュー → 「ホーム画面に追加」。

## オフラインで遊ぶ（通信圏外でも可）
1. 上記のリンクを開き、ブラウザのメニューから「共有」「ダウンロード」などで `mobile.html` を端末に保存します。
2. 保存したファイルをタップするとブラウザが起動し、インターネット接続なしでも同じ体験ができます。
   - iOS の場合は「ファイル」アプリから `mobile.html` を選択 → 共有シート → 「Safari で開く」。
   - Android の場合は「ファイル」アプリで `mobile.html` をタップするだけで Chrome が開きます。

## 仕様と実装のポイント
- 画面全体が 1 つの HTML ファイル（`mobile.html`）にまとまっています。CSS や JavaScript、部屋のイラストもすべてインライン化してあるので、単体で完結します。
- ホットスポットは SVG の座標をもとにパーセント指定で描画され、画面サイズに合わせて自動でリサイズされます。
- タップイベントは `click` と `touchstart` の両方に対応させ、スマホのダブルタップ誤認識を防ぐために `touchstart` では `preventDefault()` を呼び出しています。
- アクセシビリティ向上のため、ホットスポットは透明なボタン要素として生成し、`aria-label` を付与しています。また `aria-live` によってテキストが読み上げやすい構造になっています。

## 編集したいとき（スマホのみで完結）
- `mobile.html` をテキストエディタアプリ（iOS: Textastic, Android: QuickEdit など）で開き、保存後にブラウザをリロードするだけで変更を確認できます。
- GitHub モバイルアプリやブラウザ版の Web エディタからも直接編集・保存が可能です。編集後すぐに上記のプレイリンクを開き直せば変更が反映されます。

---

# Escape Room Prototype (English Summary)

Open [the mobile-ready single HTML](https://htmlpreview.github.io/?https://raw.githubusercontent.com/openai/codex-testproject/main/prototype/mobile.html) on any phone and start testing instantly—no computer or native apps required. Everything (layout, hotspots, assets, and logic) is bundled inside `mobile.html`, so you can even download the file and run it offline. To tweak the prototype on a phone, edit `mobile.html` with any text editor and reload the page.
