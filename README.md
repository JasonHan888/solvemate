# SolveMate

SolveMate is an intelligent troubleshooting assistant that helps you diagnose and solve problems using AI.

## Features
- **AI Analysis**: Upload images of broken items or error screens to get instant solutions.
- **History**: Save your solved problems and access them anytime (requires Login).
- **Secure**: Built with Supabase for authentication and data storage.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   - Create a `.env.local` file in the root directory.
   - Add your API keys (Supabase and AI Model):
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_GEMINI_API_KEY=your_api_key
     ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Deployment

This project is ready to be deployed on **Cloudflare Pages**.
