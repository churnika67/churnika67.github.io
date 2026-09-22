# Churnika Marappa Reddy · Portfolio

A 3D, animated portfolio built with **React + Vite**, **Three.js** (React Three Fiber + drei), **GSAP ScrollTrigger**, **Lenis** smooth scrolling and **cobe** (globe).
It deploys automatically to **https://churnika67.github.io**.

## Edit your content (no coding needed)

Almost everything lives in **`src/data/content.js`**:

| What | Where in `content.js` |
|---|---|
| Name, email, phone, links, tagline | `profile` |
| About text, stats, scroll statement | `about` |
| Skills (these become the 3D keys) | `skills` |
| Jobs & education (timeline) | `experience` |
| Projects (cards + pop-up case studies) | `projects` |

| Contact form email, analytics, site URL | `site` |

Files: replace **`public/photo.jpg`** (your photo) and **`public/resume.pdf`** (your resume). Keep the same names.
Project screenshots live in **`public/projects/`**; list them in each project's `images` (the first is the card cover).
The link-preview image is **`public/og-image.jpg`** (1200×630).

## Contact form (one-time activation)

The form sends messages to your inbox through FormSubmit (free, no account).
The **first** message anyone sends triggers an email from FormSubmit to `site.formEmail`: open it and click **Activate Form**.
After that, every message lands in your inbox. Check spam the first time.

## Visitor analytics (optional)

1. Create a free account at https://www.goatcounter.com and choose a code, e.g. `churnika`.
2. Put it in `content.js` → `site.goatcounter: 'churnika'` and commit.
3. See visits at `https://churnika.goatcounter.com`. Resume downloads, project opens and contact-form sends show up as events.

After you commit a change on GitHub, the site rebuilds by itself in about 1 to 2 minutes (see the **Actions** tab).

## Run it on your computer (optional)

Needs Node.js 18+.

```bash
npm install
npm run dev      # opens http://localhost:5173 with live reload
npm run build    # production build into /dist
```

## Where things are

```
src/
  data/content.js        <- your content
  components/            <- page sections (Hero, About, TechStack, Experience, Projects, Socials, Contact, Nav...)
  three/                 <- 3D scenes (Studio = hero room, Keyboard3D = tech stack, SocialTokens, DataSphere)
  styles.css             <- colors, fonts, layout (colors are at the top in :root)
.github/workflows/deploy.yml  <- auto-deploy to GitHub Pages
```

## One-time GitHub setup

Repo **Settings → Pages → Build and deployment → Source: “GitHub Actions”**.
