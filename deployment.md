# 🚀 KARIO Deployment Guide: Vercel Security

Your website is now configured for a **Public GitHub** with 100% private security. Follow these steps to launch on Vercel.

## Step 1: Push to GitHub
1.  Create a **Public** repository on GitHub.
2.  Push your code (the `.gitignore` will automatically hide your `config.js`).

## Step 2: Import to Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"New Project"** and import your GitHub repository.

## Step 3: Secure Your Keys (The "Bridge")
Before you click "Deploy", go to the **"Environment Variables"** section in Vercel settings and add these two EXACT names:

| Variable Name | Value |
| :--- | :--- |
| `TELEGRAM_TOKEN` | *Your Bot Token* (Example: `12345:ABC...`) |
| `TELEGRAM_CHAT_ID` | *Your Chat ID* (Example: `5031791214`) |

## Step 4: Deploy 🏁
Click **Deploy**. Your site will now:
- Run with zero keys visible in the browser source code.
- Successfully send leads to your Telegram through the secure bridge.
- Work perfectly on the public web!

> [!TIP]
> **Need a Domain?** You can link your custom agency domain (e.g., `kario.agency`) directly in the Vercel "Domains" settings.
