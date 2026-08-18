# Live Availability Sync — Setup Guide

This lets your team update board availability from a Google Sheet, and the website reflects it automatically. Nobody who just *visits* the site can change anything — only people you've personally given edit access to the sheet.

## Why a Google Sheet?

- No login system to build or maintain
- No database or server costs
- Your team already knows how to use a spreadsheet
- Access control is just Google's own "Share" permissions — give edit access only to whoever should be able to mark a board booked

## Setup (10 minutes, one-time)

### 1. Create the sheet
1. Go to [sheets.google.com](https://sheets.google.com) → Blank spreadsheet
2. Import `kopano-availability-template.csv` (File → Import → Upload) — this pre-fills all 27 site codes with their current availability dates
3. Rename the sheet tab if you like (doesn't matter for the app)

The sheet needs exactly these column headers in row 1 (already set up by the template):

| Code | Status | AvailableFrom | Note |
|------|--------|---------------|------|
| KOP001 | Available | 2026-09-01 | |
| KOP002 | Booked | 2026-12-15 | Confirmed — Hollywoodbets |

- **Code** — must match the site code exactly (KOP001, KOP002, etc.)
- **Status** — `Available` or `Booked`. Anything else is ignored (falls back to date logic).
- **AvailableFrom** — date format `YYYY-MM-DD`. For a booked board, this is when it frees up.
- **Note** — optional, shows on the site card (e.g. "Confirmed with client X until March")

### 2. Control who can edit it
- Click **Share** (top right of the sheet)
- Add only the people who should be able to update availability
- Everyone else — including anyone visiting the website — can never edit it, only Google account holders you've explicitly added

### 3. Publish it as a public read-only feed
1. File → **Share → Publish to web**
2. Under "Link", choose the specific sheet tab, and set format to **Comma-separated values (.csv)**
3. Click **Publish**
4. Copy the URL it gives you (looks like `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`)

This published link is read-only — it lets the website *read* the data, but doesn't grant anyone edit access. Editing still requires being on the Share list from step 2.

### 4. Connect it to the app
1. Open `data.js`
2. Find this near the top:
   ```js
   const CONFIG = {
     SHEET_CSV_URL: "",
     REFRESH_SECONDS: 45,
   };
   ```
3. Paste your published CSV URL between the quotes
4. Save, re-upload `data.js` to your hosting (GitHub, etc.)

That's it. The site now fetches the sheet on load and every 45 seconds after that — so if someone updates a row on their phone, anyone with the site open sees it update within under a minute, no refresh needed.

## Day-to-day use

To mark a board booked: open the sheet, find the row, change **Status** to `Booked`, set **AvailableFrom** to when it frees up, optionally add a **Note**. That's the whole workflow — no dev, no deploy, no login screen.

## If something looks wrong

- The panel under "Boards by area" always shows a small sync line — "Live — synced [time]" in teal means it's working, anything else (grey text) means it's showing static/cached data and why
- Most common cause of a failed sync: the sheet wasn't actually published (step 3), or the CSV URL was pasted with extra spaces
- The site never breaks if the sheet is unreachable — it just falls back to the static dates already in `data.js`
