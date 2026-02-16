# JUDGEX²

**判断の質 × 引き受ける世界** を可視化する判断インフラ

## デプロイ手順

### 1. GitHubリポジトリを作成

```bash
cd judgex2-app
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/judgex2.git
git push -u origin main
```

### 2. GitHub Pagesを有効化

1. リポジトリの **Settings** → **Pages**
2. **Source** を **GitHub Actions** に変更
3. 保存

### 3. 完了

pushすると自動でビルド＆デプロイされます。

```
https://<YOUR_USERNAME>.github.io/judgex2/
```

## ローカル開発

```bash
npm install
npm run dev
```

## 構造

```
├── src/
│   ├── App.jsx        # JUDGEX² メインアプリ
│   └── main.jsx       # エントリーポイント
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Pages 自動デプロイ
├── index.html
├── vite.config.js
└── package.json
```
