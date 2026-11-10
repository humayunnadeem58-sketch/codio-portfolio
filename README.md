# Software Engineer Portfolio Website

A clean, responsive, accessible (WCAG 2.2 AA compliant), high-performance personal portfolio website built from scratch for a software engineer.

All personal details, employment histories, metrics, and project titles are currently configured as clearly identifiable placeholders (e.g., `[Your Name]`, `[Project Title]`, `[Add verified metric]`). This ensures no false or fabricated claims exist on the site out of the box.

---

## 🚀 Technology Stack & Architecture

- **Semantic HTML5**: Native semantic landmark elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) with strict heading hierarchies, logical tab ordering, ARIA live regions, and an off-screen keyboard skip link.
- **Modern CSS (Custom Properties / Design Tokens)**:
  - System font stack (`system-ui`, `-apple-system`, `Segoe UI`, `Roboto`) for instantaneous loading with zero web font latency.
  - Strict WCAG 2.2 AA color contrast ratios in both Dark (default) and Light themes.
  - Full support for `prefers-reduced-motion` and visible high-contrast keyboard `:focus-visible` states.
  - Print stylesheet (`css/print.css`) allowing clean CV / resume printing or PDF generation directly via `window.print()` or `Ctrl+P`.
- **Vanilla ES6+ JavaScript Modules**:
  - Zero heavy external dependencies or bundler lock-in.
  - Dark/Light theme manager with `localStorage` persistence and OS preference synchronization.
  - Fully accessible mobile drawer navigation with keyboard focus trapping, Escape-key dismissal, and ARIA state announcements.
  - Dynamic project filter with tablist accessibility and assistive technology announcements.
  - Real-time contact form validation and an **honest delivery fallback engine** (no fake submissions).
- **SEO & Social Sharing Ready**: Open Graph vector card, Twitter card tags, SVG favicon, `robots.txt`, and `sitemap.xml`.

---

## 📁 Project Structure

```text
portfolio/
├── index.html              # Main HTML document with accessible landmarks & placeholders
├── site.webmanifest        # PWA & mobile browser manifest
├── robots.txt              # Search engine crawler instructions
├── sitemap.xml             # XML sitemap template
├── .env.example            # Example environment configuration
├── .gitignore              # Ignores local environment files & caches
├── README.md               # Complete setup, customization, and deployment guide
├── AGENTS.md               # Project development rules and criteria
├── css/
│   ├── reset.css           # Modern CSS reset with reduced-motion rules
│   ├── variables.css       # Design tokens (colors, typography, spacing, focus rings)
│   ├── style.css           # Layouts, components, responsive styles, animations
│   └── print.css           # Print-friendly resume view
├── js/
│   ├── config.js           # Central configuration (contact endpoint, owner email, links)
│   ├── theme.js            # Theme toggle (dark / light) & system preference sync
│   ├── navigation.js       # Mobile drawer, keyboard trap & active section observer
│   ├── projects-filter.js  # Category filter tabs for project cards
│   ├── contact.js          # Accessible validation & honest email fallback
│   └── main.js             # Core orchestrator and toast notifications
├── assets/
│   ├── favicon.svg         # SVG code brackets monogram icon
│   └── og-image.svg        # Open Graph 1200x630 social preview image
└── scripts/
    └── verify.ps1          # Automated project verification & accessibility test suite
```

---

## 🛠️ Local Development & Quick Start

Because this website uses native web standards, it requires **no package installation or compilation step** to preview locally.

### Option 1: Direct Browser Launch
Double-click `index.html` or open it directly in Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.

### Option 2: Local Static Web Server
To test ES module loading and avoid any browser file-protocol sandbox restrictions, launch with any local static server:

```powershell
# Using Python 3 (if installed)
python -m http.server 3000

# Using Node.js npx (if installed)
npx serve .

# Using PHP (if installed)
php -S localhost:3000
```
Open your browser at `http://localhost:3000`.

---

## ✍️ Content Customization Guide

All placeholders are indicated with square brackets `[...]`. Follow the guide below to replace placeholders with your actual details:

### 1. Identity, Name, and Role
- **File**: `index.html`
  - Line 9: `<title>[Your Name] | Software Engineer Portfolio</title>`
  - Lines 10–23: Meta description and social preview tags.
  - Line 48: Monogram brand name: `<span class="brand-name">[Your Name]</span>`.
  - Line 122: Hero greeting and headline `[Your Name]`.
  - Line 130: Hero role statement `[Your Primary Tech Focus / Distributed Systems / Web Architecture]`.
  - Line 134: Hero value proposition paragraph.
- **File**: `js/config.js`
  - Update `ownerName` and `ownerRole`.

### 2. About Me Biography
- **File**: `index.html` (`#about` section)
  - Replace the 3 biography paragraphs with your actual engineering background, problem-solving philosophy, and current technical interests.
  - Update the 3 engineering pillar cards (`Clean Architecture`, `Performance & Resilience`, `Collaborative Mindset`) to match your strengths.

### 3. Technical Skills
- **File**: `index.html` (`#skills` section)
  - Edit the skill items in each of the 4 categories:
    - *Languages & Core*: e.g., TypeScript, Python, Go, SQL.
    - *Frameworks & Libraries*: e.g., Node.js, Express, React, Next.js, FastAPI.
    - *Systems & Databases*: e.g., PostgreSQL, Redis, Docker, AWS.
    - *Practices & Tooling*: e.g., CI/CD, Automated Testing, Web Accessibility.

### 4. Projects & Work Showcase
- **File**: `index.html` (`#projects` section)
  - Each project card is an `<article class="project-card" data-category="...">`.
  - Update:
    - `project-category`: `fullstack`, `backend`, or `tooling`.
    - `project-title`: e.g., `Distributed Analytics Dashboard`.
    - `project-desc`: 1–2 sentence problem and architecture description.
    - Highlights: your role and verified metrics (e.g., *handled 20k req/sec*).
    - Links: Update the GitHub and Demo links to your real repository and live deployment URLs.
  - To add more projects, copy and paste one of the `<article class="project-card">` blocks.

### 5. Career Experience Timeline
- **File**: `index.html` (`#experience` section)
  - Replace role titles, company names, dates, locations, and responsibility bullet points.
  - Update the Education card at the bottom of the timeline with your verified degree or certifications.

### 6. Services Offered
- **File**: `index.html` (`#services` section)
  - Adjust or remove the 3 service offerings based on what you provide (e.g., Full-Stack Development, API Architecture, Code Audits).

### 7. Direct Contact Details & Social Profiles
- **File**: `js/config.js`
  - Update `receiverEmail` with your real email address.
  - Update `socialLinks` (`github`, `linkedin`, `twitter`).
- **File**: `index.html` (`#contact` section)
  - Update `[your.email@example.com]`, location, and response time.

---

## 📬 Contact Form Configuration & Behavior

The contact form is built with full accessibility validation and an **honest delivery architecture**:

### Out-of-the-Box Behavior (Unconfigured Fallback)
When no backend delivery service is configured:
1. The form validates all inputs client-side (Name, valid Email, Subject, Message min 10 chars).
2. It **does NOT fake a successful transmission**.
3. It displays an honest message informing the visitor that no direct form backend is connected yet.
4. It provides two one-click options:
   - **Open in Email Client**: Generates an encoded `mailto:` link prefilling recipient, subject, and the visitor's message.
   - **Copy Message**: Copies the complete formatted message to the user's clipboard.

### Connecting an Email Delivery Service
To receive submissions directly without opening an email client, configure any standard form endpoint (such as Formspree, FormSubmit, Web3Forms, or your own server endpoint):

1. Sign up for a free form endpoint (e.g., [Formspree](https://formspree.io) or [FormSubmit](https://formsubmit.co)).
2. Open `js/config.js` and paste your endpoint into `contactEndpoint`:
   ```javascript
   export const siteConfig = {
     contactEndpoint: "https://formspree.io/f/your_form_id",
     receiverEmail: "you@example.com"
   };
   ```
3. Once configured, the form automatically submits via async `fetch` POST, displays accessible inline loading indicators, prevents double submissions, and displays a success notification upon completion.

---

## 🌐 Deployment Guide

This static website can be deployed to any modern hosting platform in minutes.

### 1. GitHub Pages
1. Push this repository to a GitHub repository.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Select `main` (or `master`) branch and `/ (root)` folder, then click **Save**.
5. Your portfolio will be live at `https://<username>.github.io/<repo-name>/`.

### 2. Cloudflare Pages
1. In the Cloudflare dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository.
3. In **Build settings**:
   - Framework preset: `None`
   - Build command: *(leave empty)*
   - Build output directory: `.` (or `/`)
4. Click **Save and Deploy**.

### 3. Netlify
1. Log in to Netlify and select **Add new site** > **Import an existing project**.
2. Connect your repository.
3. Build command: *(leave empty)*.
4. Publish directory: `.` (or `/`).
5. Click **Deploy Site**.

### 4. Vercel
1. In Vercel, select **Add New Project** and import the repository.
2. Framework Preset: `Other`.
3. Root Directory: `./`.
4. Click **Deploy**.

### Post-Deployment Verification Checklist
- [ ] Verify that your production domain is updated in `sitemap.xml` and `robots.txt`.
- [ ] Test the contact form and verify that email notifications arrive or that the fallback action opens your email client.
- [ ] Verify that dark and light theme switching works and persists across page reloads.
- [ ] Test on a mobile screen to confirm hamburger menu drawer navigation and touch responsiveness.

---

## 🧪 Automated Verification & Testing

An automated verification test script is included in `scripts/verify.ps1`. It verifies:
- Existence of all required assets, stylesheets, scripts, and documentation.
- HTML structure, landmark roles (`<header>`, `<nav>`, `<main>`, `<footer>`), and skip link.
- Exactly one `<h1>` tag and no broken/dead internal anchor links (`href="#"`).
- Form controls accessibility (`<label for="...">`, `aria-required`, `aria-describedby`, live error regions).
- CSS tokens, dark/light theme definitions, `prefers-reduced-motion` compliance, and `:focus-visible` styles.

To run the verification suite:

```powershell
pwsh -File .\scripts\verify.ps1
# or
powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```
