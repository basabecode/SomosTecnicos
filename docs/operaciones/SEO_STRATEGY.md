# 🌐 SEO Strategy & Configuration

**Project:** SomosTécnicos
**Context:** This document outlines the SEO configuration, metadata strategy, and historical fixes implemented to ensure proper indexing by Google.

---

## 🏗️ Core Configuration

The SEO strategy is built on standard Next.js Metadata API and `robots.txt`/`sitemap.xml` generation.

### 1. Metadata Implementation
All public pages implement the Metadata API.
- **Title Template:** `%s | SomosTécnicos`
- **Default Title:** `SomosTécnicos - Gestión de Servicios Técnicos`
- **Description:** Optimized for conversion and relevance.
- **OpenGraph:** Complete tags for social sharing.
- **Robots:** `index: true, follow: true` (for public pages).

### 2. Sitemap (`app/sitemap.ts`)
- **Structure:** Dynamic XML sitemap listing all critical public URLs.
- **Priorities:**
  - `1.0`: Homepage (`/`)
  - `0.8`: Admin Info (`/admin-info`)
  - `0.7`: Login (`/login`), Register (`/register`)
  - `0.5`: Legal (`/terminos-y-condiciones`)
- **Frequency:** `daily` or `weekly`.

### 3. Robots.txt (`app/robots.ts`)
Controls crawler access.
```typescript
{
  userAgent: '*',
  allow: '/',
  disallow: ['/private/', '/admin/', '/technician/', '/api/', '/customer/'],
  sitemap: 'https://somostecnicos.com/sitemap.xml',
}
```

---

## 🛠️ Diagnostics & Verification

### How to Verify Indexability
1. **Check Metadata:** `curl -I https://somostecnicos.com/login` (Ensure 200 OK and headers).
2. **Check Sitemap:** `curl https://somostecnicos.com/sitemap.xml`.
3. **Check Robots:** `curl https://somostecnicos.com/robots.txt`.

### Google Search Console
- **Inspection Tool:** Use "URL Inspection" to request indexing for specific URLs.
- **Coverage Report:** Monitor "Valid" vs "Excluded" pages.
- **Rendered View:** Ensure Google sees the content, not a blank page or redirect.

---

## 📜 Incident Log: Indexing Fixes (Feb 2026)

### Issue Summary
In early Feb 2026, Google indexed only 1 of 6 public pages.
- **Missing:** `/login`, `/register`, `/admin-info`, `/terminos-y-condiciones`.
- **Critical Error:** `/register` was a redirect (no `page.tsx`), returning 404/307 to crawlers.

### Actions Taken
1. **Created `/register/page.tsx`:** Replaced the redirect with a real landing page allowing selection between Customer and Technician registration.
2. **Added Metadata Files:** Created `metadata.ts` for all public client-side pages to ensure server-side rendering of meta tags.
3. **Updated Priorities:** Adjusted sitemap priorities to reflect business importance.

### Results
- ✅ All public pages are now indexable.
- ✅ `/register` returns 200 OK.
- ✅ Sitemap correctly lists 5+ URLs.

---

## 🔗 References
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
