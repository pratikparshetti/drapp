# 🩺 Dr. App - Developer Setup Guide

This app is built with **Next.js 15+** and uses local JSON file storage for patient records and medicines.

## Pre-requisites
- **Node.js (LTS)**: Installed on this machine.
- **npm**: Installed alongside Node.js.

## Initial Setup
If you are setting this up for the first time or on a new machine:

1. Open a terminal in this directory.
2. Run the following command to install dependencies:
   ```bash
   npm install
   ```

## Local Development
To start the development server:
```bash
npm run dev
```
- The app will be available at `http://localhost:3000`.
- Fast Refresh will update the page as you edit code in `src/`.

## Data Management
- All patient visit history is stored in `data/patients.json`.
- The list of medicines for the dropdown is in `data/medicines.json`.
- These files are human-readable and can be backed up simply by copying them.

## File Structure
- `src/lib/storage.ts`: Handles file I/O for JSON storage.
- `src/app/api/`: Server-side API routes for data access.
- `src/app/page.tsx`: Patient List screen.
- `src/app/patient/page.tsx`: Onboarding and Follow-up Dashboard.
- `src/app/globals.css`: Design system and styling tokens.
