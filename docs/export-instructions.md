# Step-by-Step Instructions: Exporting Your GEDCOM Files

Follow these step-by-step guides to download your family tree from both **Ancestry** and **FamilySearch**. Once you have both `.ged` files, place them in the project folder (or in a dedicated `data/` folder), and I will run a comparative analysis to see which platform provides richer data (occupations, notes, dates, and life events).

---

## Part 1: How to Download Your GEDCOM from Ancestry.com (Quickest — ~2 mins)

Ancestry makes exporting your tree very straightforward via the web browser:

1. **Log in** to your account at [ancestry.com](https://www.ancestry.com).
2. In the top navigation bar, click on **Trees** and select the tree you want to export.
3. At the top-left of your tree (next to the tree name), click the **dropdown arrow** and select **Tree Settings** (or find **Tree Settings** in the left sidebar menu).
4. On the **Tree Info** tab, look at the bottom-right under the section labeled **Manage your tree**.
5. Click the green button labeled **Export tree**.
6. Ancestry will package your tree (this usually takes 15–45 seconds). When finished, a green button labeled **Download your GEDCOM file** will appear.
7. Click the button to save the file.
8. Rename the file to: `ancestry-export.ged`.

---

## Part 2: How to Download Your GEDCOM from FamilySearch

Because FamilySearch is a shared public tree rather than a private one, FamilySearch does not have a direct web-export button on familysearch.org. Instead, FamilySearch partners with free certified desktop tools to allow users to download their ancestral branch.

### Option A: Using RootsMagic Essentials (Recommended — Free & Easiest)
RootsMagic is an official FamilySearch certified partner. The free "Essentials" version has a direct FamilySearch downloader:

1. **Download & Install:** Download the free **RootsMagic 10 Essentials** installer from [rootsmagic.com/download](https://www.rootsmagic.com/download/).
2. **Open RootsMagic** and click **Create a New File** (name it something like `FamilySearchDownload`).
3. Click on the **File** menu at the top-left, then select **FamilySearch** $\rightarrow$ **FamilySearch Central** (or choose *Import from FamilySearch* during new file setup).
4. Click **Sign In** and enter your FamilySearch username and password.
5. In the import wizard:
   - Select **Import Ancestors**.
   - Choose **6** or **7** generations.
   - (Optional) Check the box to include notes and sources.
6. Click **Import**. RootsMagic will download your ancestors directly from FamilySearch into your local file (takes about 1–3 minutes).
7. Once finished, click **File** $\rightarrow$ **Export Data** $\rightarrow$ **GEDCOM**.
8. Keep the default settings (GEDCOM 5.5.1 / UTF-8) and click **Export**.
9. Save the file as: `familysearch-export.ged`.

---

### Option B: Using Ancestry's Free FamilySearch Sync (No Extra Software!)
If your Ancestry account is connected to FamilySearch (common with partner or student accounts), you can pull FamilySearch data directly into Ancestry and export it:

1. Log into **Ancestry.com**.
2. Click **Trees** $\rightarrow$ **Create & Manage Trees**.
3. Click **Start a new tree** $\rightarrow$ Select **Import tree from FamilySearch**.
4. Authorize your FamilySearch account. Ancestry will automatically import 4 to 6 generations from FamilySearch into a brand new Ancestry tree!
5. Once imported into Ancestry, follow **Part 1** above to export that tree as a `.ged` file.

---

## Part 3: Placing the Files for Analysis

Once you have downloaded the files:

1. Create a `data/` folder in this repository if it doesn't already exist.
2. Place both files in the repository:
   - `data/ancestry-export.ged`
   - `data/familysearch-export.ged`
3. Let me know when you've placed them here, and I will parse and compare:
   - Total number of individuals and generations.
   - Count of recorded occupations (`OCCU`).
   - Count of biographical stories and notes (`NOTE`).
   - Life events and milestones (`BIRT`, `MARR`, `RESI`, `EVEN`).
   - Presence of FamilySearch IDs for deep-linking.
