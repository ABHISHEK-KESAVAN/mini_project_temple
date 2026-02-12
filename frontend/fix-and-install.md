# Fix "Lock compromised" and install dependencies

Run these steps **in order** in a terminal (PowerShell or Command Prompt).

## 1. Go to frontend folder
```bash
cd d:\minini\mini_project\mini_project\frontend
```

## 2. Clean npm cache (optional but recommended)
```bash
npm cache clean --force
```

## 3. Remove old lock file and node_modules (if present)
- **package-lock.json** – already removed for you.
- **node_modules** – delete the folder if it exists (or run):
  ```bash
  if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
  ```

## 4. Install dependencies (this needs network)
```bash
npm install
```
When it asks to install packages or any permission, choose **Yes (y)** if you want to proceed.

## 5. Start the app
```bash
npm start
```

---

**If you still see "Lock compromised":**
- Run `npm cache clean --force` again.
- Delete both `package-lock.json` and `node_modules` in the frontend folder.
- Run `npm install` again.

**If npm asks for permissions:** Allow network access so npm can download packages.
