# Complete Guide: Resend SMTP + Cloudflare Setup

This guide will walk you through setting up professional email delivery (Resend) and bot protection (Cloudflare Turnstile) for your SolveMate application - all for **FREE**.

---

## Part 1: Resend Setup (The "Hybrid" Subdomain Strategy)

**Goal:**
*   **Receive** emails on your main domain (e.g., `support@solvemate.com`) via Cloudflare.
*   **Send** emails from a subdomain (e.g., `noreply@auth.solvemate.com`) via Resend.
*   **Benefit**: This avoids the "Locked Records" issue in Cloudflare!

### Step 1: Create Resend Account
1.  Go to [Resend.com](https://resend.com) and sign up.

### Step 2: Add Your SUBDOMAIN
1.  Click **"Domains"** -> **"Add Domain"**.
2.  **Crucial Step**: Enter `auth.yourdomain.com` (e.g., `auth.solvemate.com`).
    *   *Do NOT use just `solvemate.com`.*
3.  Select your region (US East).
4.  Click **"Add"**.

### Step 3: Configure DNS in Cloudflare
Resend will show you DNS records. Since you used `auth.`, these records will look slightly different (e.g., `auth` instead of `@`).

1.  Go to **Cloudflare Dashboard** -> **DNS** -> **Records**.
2.  **Add the records exactly as Resend shows.**
    *   **MX Record**: Name will be `auth`.
    *   **TXT (SPF)**: Name will be `auth`.
    *   **TXT (DKIM)**: Name will be `resend._domainkey.auth`.
3.  **Important**: Ensure **Proxy Status** is **OFF** (Grey Cloud) for all these new records.
    *   *Note: Your existing "Locked" records for the main domain are fine. Leave them alone.*

### Step 4: Verify
1.  Click **"Verify DNS Records"** in Resend.
2.  It should verify quickly because there are no conflicts!

### Step 5: Create API Key
1.  **API Keys** -> **Create API Key**.
2.  Name: `Supabase Auth`.
3.  Permission: **Sending access** -> Select `auth.yourdomain.com`.
4.  Copy the Key (`re_...`).

### Step 6: Configure Supabase
1.  **Supabase Dashboard** -> **Settings** -> **Authentication** -> **SMTP Settings**.
2.  **Enable Custom SMTP**.
3.  **Sender Email**: `noreply@auth.yourdomain.com` (Must match the subdomain!).
4.  **Sender Name**: `SolveMate`.
5.  **Host**: `smtp.resend.com`.
6.  **Port**: `465`.
7.  **Username**: `resend`.
8.  **Password**: (Your API Key).
9.  **Save**.

---

### Step 7: Test Email Delivery

1. **Test Forgot Password**
   - Go to your app: `https://solvemate.pages.dev`
   - Click **"Login"**
   - Click **"Forgot Password"**
   - Enter your email
   - Click submit

2. **Check Your Email**
   - You should receive an email within seconds
   - **From**: `SolveMate <noreply@yourdomain.com>` ✓
   - **Subject**: "Reset your password"
   - **Contains**: Your OTP code

3. **Success Indicators**
   - Email arrives from your domain
   - No "via supabase.co" or "via resend.com"
   - Professional sender name

---

## Part 2: Cloudflare Turnstile (CAPTCHA Protection)

### What You'll Achieve
Protect your login/signup forms from bots without annoying real users (no "Select all traffic lights" puzzles).

---

### Step 1: Access Cloudflare Turnstile

1. **Open Cloudflare Dashboard**
   - Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - Log in to your account

2. **Navigate to Turnstile**
   - In the left sidebar, click **"Turnstile"**
   - Or go directly to [https://dash.cloudflare.com/?to=/:account/turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)

---

### Step 2: Create a Turnstile Widget

1. **Click "Add Widget"**
   - Click the **"Add Site"** or **"Add Widget"** button

2. **Configure Widget**

   - **Widget name**: `SolveMate Login Protection`
   
   - **Domain**: `solvemate.pages.dev`
     - Add your Cloudflare Pages domain
     - You can add multiple domains (one per line)
     - Add both:
       - `solvemate.pages.dev`
       - `localhost` (for testing)
   
   - **Widget Mode**: 
     - Select **"Managed"** (Recommended - adapts based on risk)
     - Or **"Non-Interactive"** (invisible unless suspicious)
   
   - **Widget Type**: `Invisible` or `Visible`
     - **Invisible** is recommended for best UX

3. **Click "Create"**
   - Your widget will be created
   - You'll see two keys:

---

### Step 3: Copy Your Turnstile Keys

1. **Site Key** (Public)
   - Starts with something like `0x4AAA...`
   - This is safe to use in your frontend code
   - **Copy and save it**

2. **Secret Key** (Private)
   - Longer key, keep this secret
   - Only use on backend/Supabase
   - **Copy and save it**

---

### Step 4: Configure Supabase Captcha

1. **Open Supabase Dashboard**
   - Go to your project settings

2. **Navigate to Security**
   - Click **⚙️ Settings** → **"Authentication"**
   - Scroll to **"Security and Protection"**

3. **Enable Captcha**
   - Toggle **"Enable Captcha protection"** to **ON**

4. **Select Provider**
   - **Captcha Provider**: Select **"Cloudflare Turnstile"**
   
5. **Enter Secret Key**
   - **Captcha Secret**: Paste your **Turnstile Secret Key**
   
6. **Save**
   - Click **"Save"**

---

### Step 5: Update Frontend Code (Optional - Tell me if you want this)

> **Note**: For Turnstile to work on login/signup, you need to update the React code to include the Turnstile widget. Let me know if you want me to implement this, as it requires code changes.

---

## Part 3: Verification Checklist

### ✅ Resend Verification

- [ ] Domain shows "Verified" in Resend
- [ ] API key created and saved
- [ ] Supabase SMTP configured with correct credentials
- [ ] Test email received from your domain
- [ ] Email shows your app name, not "Supabase"

### ✅ Cloudflare Turnstile Verification

- [ ] Turnstile widget created
- [ ] Site key and secret key saved
- [ ] Supabase captcha configured with secret key
- [ ] (Optional) Frontend code updated with site key

---

## Troubleshooting

### Resend Issues

**Problem**: Domain won't verify
- **Solution**: 
  - Wait 15-30 minutes for DNS propagation
  - Check DNS records are exact matches
  - Ensure grey cloud (DNS only) in Cloudflare
  - Use [https://dnschecker.org](https://dnschecker.org) to verify records globally

**Problem**: Emails not sending
- **Solution**:
  - Check API key is correct (starts with `re_`)
  - Verify sender email matches verified domain
  - Check Resend dashboard for error logs
  - Ensure port is `465` (not `587`)

**Problem**: Emails go to spam
- **Solution**:
  - Wait 24-48 hours for domain reputation to build
  - Ensure all DNS records are correct (SPF, DKIM)
  - Add DMARC record (optional but recommended)

### Cloudflare Turnstile Issues

**Problem**: Captcha not showing
- **Solution**:
  - Check domain is added to Turnstile widget
  - Verify secret key in Supabase is correct
  - Frontend code must include Turnstile component (tell me if you need help)

---

## Cost Summary

- **Resend**: FREE up to 3,000 emails/month
- **Cloudflare Turnstile**: FREE unlimited requests
- **Total**: $0/month

---

## Next Steps

1. Complete Resend setup and test email delivery
2. Set up Cloudflare Turnstile
3. (Optional) Request me to add Turnstile widget to login page
4. Update Google OAuth consent screen with your app logo
5. Deploy and test!

---

## Need Help?

If you get stuck on any step, just ask! Common questions:
- "DNS records aren't verifying"
- "Emails not arriving"
- "How do I add Turnstile to login page"
- "How do I get my own domain"
