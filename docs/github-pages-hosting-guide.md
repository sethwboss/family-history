# Beginner's Guide: Hosting Your Website on GitHub Pages

This guide walks you through every single step to publish your **MemoryLink** website to the internet for free using **GitHub Pages**.

> [!NOTE]
> **What We Already Prepared for You:**
> 1. Configured [`vite.config.js`](file:///c:/dev/family-history/vite.config.js) with your repository path (`/family-history/`).
> 2. Created the automated build workflow in [`.github/workflows/deploy.yml`](file:///c:/dev/family-history/.github/workflows/deploy.yml).
> 3. Your future live website address will be:  
>    👉 **`https://sethwboss.github.io/family-history/`**

---

## Overview: The 4 Simple Steps

```
[ Step 1: Make Repo Public ] ──> [ Step 2: Push Your Code ] ──> [ Step 3: Enable Pages ] ──> [ Step 4: Visit Your Live Site! ]
```

---

## Step 1: Check If Your Repository is Public or Private

GitHub gives **100% free website hosting** for **Public** repositories. If your repository is currently **Private**, GitHub Pages will ask you to upgrade to GitHub Pro unless you make the repository Public.

### How to check & make it Public:
1. Open your web browser and go to your repository on GitHub:  
   🔗 **[https://github.com/sethwboss/family-history](https://github.com/sethwboss/family-history)**
2. Look at the top left next to `sethwboss / family-history`:
   - If it says **`Public`**, you are ready! Skip to **Step 2**.
   - If it says **`Private`**, follow these 4 quick clicks to change it to Public:
     1. Click the **Settings** tab (the gear icon on the far right of the top menu bar):  
        🔗 **[https://github.com/sethwboss/family-history/settings](https://github.com/sethwboss/family-history/settings)**
     2. Scroll all the way down to the bottom to the section called **"Danger Zone"**.
     3. Next to **"Change repository visibility"**, click the button: **`Change visibility`** (or **`Change to public`**).
     4. Select **`Make public`**, then type `sethwboss/family-history` in the confirmation box and click **`I understand, make this repository public`**.

*(Note: If you need to keep your repository strictly private, see the **Alternative: Free Hosting for Private Repos (Vercel)** section at the very bottom of this guide!)*

---

## Step 2: Push Your Latest Code to GitHub

We need to send the new files and GitHub Actions deployment scripts up to your GitHub repository.

Open your terminal in VS Code (or PowerShell in `c:\dev\family-history`) and run these 3 standard Git commands one after another:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

> [!TIP]
> If you prefer using VS Code's visual Git tool instead of terminal commands:
> 1. Click the **Source Control** icon on the left sidebar (the branching icon).
> 2. Type `Configure GitHub Pages` in the message box.
> 3. Click **Commit**, then click **Sync Changes** (or **Push**).

---

## Step 3: Turn On GitHub Pages in Repository Settings

Now tell GitHub to use the automated build workflow we set up:

1. In your browser, go to your repository settings page:  
   🔗 **[https://github.com/sethwboss/family-history/settings/pages](https://github.com/sethwboss/family-history/settings/pages)**
2. Look for the section titled **"Build and deployment"**.
3. Under **"Source"**, you will see a dropdown menu that currently says **`Deploy from a branch`**.
4. Click that dropdown and change it to:  
   👉 **`GitHub Actions`**

*(You don't need to configure anything else on that page—GitHub will automatically detect the `.github/workflows/deploy.yml` file we built for you!)*

---

## Step 4: Watch Your Site Build & Go Live!

1. At the top of your GitHub repository, click the **Actions** tab:  
   🔗 **[https://github.com/sethwboss/family-history/actions](https://github.com/sethwboss/family-history/actions)**
2. You will see a workflow running titled **`Deploy to GitHub Pages`** with a yellow spinning circle.
3. Wait about 45 to 60 seconds.
4. When it finishes, the yellow circle will turn into a **green checkmark** ✅!
5. Click on that workflow run, and GitHub will display your live website link:  
   🌟 **`https://sethwboss.github.io/family-history/`**

Click the link, and your MemoryLink app is now live on the world wide web for anyone to use!

---

## How Updating Your Site Works in the Future

Once this is set up, **you never have to do these settings again**!

Whenever you make improvements or changes in the future:
1. Test your changes locally (`npm run dev`).
2. Push your changes to GitHub (`git add .`, `git commit -m "My update"`, `git push origin main`).
3. GitHub automatically runs the build and updates your live website in under a minute!

---

## Alternative: If You Want to Keep the Repository Private for Free

If you prefer to keep your GitHub repository **Private** and do not want to make it public, you can use **Vercel** instead. Vercel provides 100% free hosting even for private GitHub repositories:

1. Go to **[https://vercel.com](https://vercel.com)** and click **Sign Up** (choose **Continue with GitHub**).
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Find your `sethwboss/family-history` repository and click **Import**.
4. Vercel automatically detects that it is a **Vite** project.
5. In `vite.config.js`, change `base: '/family-history/'` back to `base: '/'`.
6. Click **Deploy**. In ~30 seconds, Vercel gives you a free live URL (e.g. `https://family-history-seth.vercel.app`) that updates on every git push while keeping your source code 100% private!
