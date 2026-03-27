# 🩺 Dr. App - User Setup & User Guide

This application is designed specifically for medical practitioners to store patient information locally and securely without an internet-connected database.

## 📁 Installation & Initialization
Before using the app, you need to set it up once:
1. Open a terminal (PowerShell or Command Prompt).
2. Go into this folder (`f:\Personal Projects\Dr app`).
3. Run the following command (requires internet only the first time):
   ```bash
   npm install
   ```
4. This will download and install the Necessary components for the app to run.

## 🚀 How to Start the App
To use the app daily, you don't need to open any terminal. Simply:
1. Double-click the `start.bat` file in this folder.
2. Wait a few seconds for the app to initialize.
3. Open your browser and go to: `http://localhost:3000`.

## 💊 Managing the Medicine Dropdown
- All medicines shown in the dropdown are stored in `data/medicines.json`.
- You can open this file in **Notepad** to add or remove medicines.
- **Rules**: Please keep the list inside the brackets `[]` and each medicine inside double quotes `"`.

## 🛡️ Backup Your Data
- Your data is **NOT** stored online. It resides only on this computer.
- Regularly copy the `data/` folder to a USB drive or cloud storage to prevent data loss.
- To restore data, simply paste your backed-up `data/` folder back into this project.

## ⚡ Quick Guide
- **Search**: Use the search bar on the landing page to find patients by ID or Name.
- **Onboard**: Click "+ New Patient" to register someone.
- **Follow-up**: Click "View / Follow-up" on any patient record to view history and record a new visit.
