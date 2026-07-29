# Onyx Stack Labs — Enterprise Testing & Quality Certification Strategy
## Overview
This document defines the production testing matrix, verification standards, and quality gate protocols for `student.onyxstacklabs.com`. All subsystems must pass these execution standards prior to production release.
---
## 1. Quality Gates Thresholds

| Quality Gate | Standard / Metric | Verification Tool / Method |
| :--- | :--- | :--- |
| **Build Integrity** | Clean compilation with zero warnings/errors | `next build` / Vercel Build Logs |
| **TypeScript** | Strict Mode compliance (Zero `any` or untyped signatures) | `tsc --noEmit` |
| **ESLint** | Zero lint errors or style violations | `next lint` |
| **Lighthouse Performance** | **95+** Score | Chrome DevTools Lighthouse / Vercel Speed Insights |
| **Lighthouse Accessibility** | **100** Score | Chrome DevTools Lighthouse / Axe Core |
| **Lighthouse SEO** | **100** Score | Chrome DevTools Lighthouse |
| **Lighthouse Best Practices** | **100** Score | Chrome DevTools Lighthouse |
| **Security Audit** | Zero vulnerable dependencies / Clean Firebase Rules | Firebase Emulator / Environment Guard |
| **PWA Compliance** | Valid manifest, service worker registration & offline fallback | Lighthouse PWA Audit / WebApp Manifest Inspector |

---
## 2. Testing Execution Matrix
### A. Route Verification Matrix
* **Marketing & Public**: `/`, `/blog`, `/blog/[slug]`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`
* **Student/Tenant Routes**: `/dashboard`, `/dashboard/student`, `/dashboard/admin`
* **Resilience Routes**: `/_not-found` (404), `/offline` (PWA Fallback), `/error` (Global Runtime Boundary)
### B. Component Testing Scope
* **UI Components**: Layout containers, navigation bars, telemetry cards, rich text components, action controls.
* **SEO & PWA Components**: `JsonLd`, `SeoManagerCard`, `PwaRegister`, `ShareButton`.
### C. Security & Firebase Testing Scope
* **Authentication**: Session state management, protected dashboard route guards, fallback redirects.
* **Environment Guards**: `envValidator.ts` schema checks in production runtime.
* **Firebase Security Rules**: Verification of Firestore and Realtime Database read/write restrictions.
### D. Cross-Browser & Responsive QA Matrix
* **Browsers**: Chrome, Safari, Firefox, Edge, Samsung Internet.
* **Devices / Viewports**:
  * Mobile Portrait: 375px (iPhone SE/13 Mini)
  * Mobile Standard: 390px - 412px (iPhone 13/14, Pixel 7)
  * Tablet: 768px - 820px (iPad Air/Pro)
  * Desktop / Ultra-wide: 1280px - 1920px+
---
## 3. Maintenance & Audit Protocols
1. Every step in Phase 17 must be audited against this file.
2. Any detected anomaly or test failure must be logged in `KNOWN_ISSUES.md` and resolved during the Final Bug Fix Sprint (Step 17.14).
