---
title: IBO 生奧知識庫（Obsidian Vault）
tags: [ibo, vault, readme]
created: 2026-06-23
---

# 🧬 IBO 生奧知識庫 — Obsidian Vault

這是一個為 **中華民國生物奧林匹亞（IBO 國家代表隊選拔）** 整理的 Obsidian 知識庫。
內容包含：官方建議**書單與合法取得方式**、**考試範圍與計分分析**、**題庫趨勢分析**，
以及依七大領域撰寫的**原創讀書筆記**，並以 Obsidian 的**雙向連結**串接成可互相跳轉的網狀知識庫。

## 📂 如何在 Obsidian 開啟

1. 下載並安裝 [Obsidian](https://obsidian.md)。
2. 開啟 Obsidian →「Open folder as vault」→ 選擇本資料夾 `obsidian-vault/`。
3. 從 [[00-IBO-總索引-MOC]] 開始瀏覽（這是整個庫的地圖 / Map of Content）。
4. 建議開啟 **Graph view（關係圖）** 觀察各筆記之間的連結。

> Obsidian 第一次開啟時會自動建立 `.obsidian/` 設定資料夾（個人化設定，不需納入版本控制）。

## 🗂️ 資料夾結構

| 資料夾 | 內容 |
| --- | --- |
| `00-IBO-總索引-MOC.md` | 全庫地圖，連到所有筆記 |
| `01-書單/` | 官方建議書單，每本書一則筆記（定位、合法取得、對應領域與章節） |
| `02-考試分析/` | 官方考試範圍、計分規則、題庫趨勢、高頻考點與書本對照 |
| `03-領域筆記/` | 七大領域的原創統整筆記（白話＋機制＋必背） |
| `04-範本/` | 可重複使用的「考題分析」「讀書筆記」範本 |

## ⚖️ 版權與內容原則（重要）

- **本庫不含任何書籍的盜版電子檔。** 受版權保護的教科書（Campbell、Alberts、Lehninger…）
  僅提供**書目資訊與合法取得管道**（出版社、圖書館借閱、WorldCat 查詢、合法免費來源）。
- **所有筆記皆為原創**：以自己的話撰寫的學習摘要、機制解析與考試策略，**非書本原文**。
- 標示 `free: true` 的書（如 [[OpenStax-Biology-2e]]）為**合法開放授權**（CC BY / CC BY-NC-SA），
  可自由線上閱讀。

## 🔗 與本專案 App 的關係

本 repo（`闖進IBO大作戰` / IBO Prep Simulator）內已有 App 用的資料：
- 七領域定義與權重：`src/data/domains.ts`
- 題庫：`src/data/questions.ts`
- 各書 App 內筆記：`src/data/textbooks.ts`、`src/data/bookSections.ts`
- 競賽規則與計分：`docs/競賽規則與計分.md`

本 Obsidian 庫**獨立於 App**，是給人「網狀閱讀／自由連結」用的知識庫，
分析數據與這些資料對齊（見 [[題庫趨勢分析]]）。

## 📚 資料來源

- 官方考試範圍與簡章：[中華民國生物奧林匹亞 tpmso.org/ibo](https://tpmso.org/ibo/index.php/exam-scope/)
- 國際 IBO 建議書單參考：[Biolympiads Book List](https://biolympiads.com/book-list-2/)
- 合法免費教科書：[OpenStax Biology 2e](https://openstax.org/details/books/biology-2e)、[Biology LibreTexts](https://bio.libretexts.org)

> ⚠️ 名額、分數線與考試範圍**逐年微調**，正式規定一律以**當年官方簡章**為準。
