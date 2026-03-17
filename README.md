# MedTech Virtual Laboratory

Interactive STEM virtual lab platform for SMU (Mediterranean Institution of Technology), built with Next.js App Router, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15.4.7-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-06B6D4?logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success)

## Overview

This project delivers a modern virtual physics lab experience with:

- dynamic lab pages and assessments
- interactive graph/table input components
- responsive pages (`/`, `/about`, `/labs`, `/contact`, `/dashboard`, `/grades`, `/evaluation`)
- contact form submission via API route (`/api/contact`)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Font Awesome
- **Math Rendering**: KaTeX + `react-katex`
- **Email**: Nodemailer (contact form API)

## Project Structure

```text
src/
    app/
        api/contact/route.ts      # Contact email endpoint
        page.tsx                  # Home
        about/page.tsx
        labs/page.tsx
        labs/[id]/page.tsx        # Lab simulation + assessment
        contact/page.tsx
        dashboard/page.tsx
        grades/page.tsx
        evaluation/page.tsx
        layout.tsx
        globals.css
    components/
        Navigation.tsx
        Footer.tsx
        QuestionComponent.tsx
        MathText.tsx
        DynamicIcon.tsx
        UserMenu.tsx
    lib/
        labs.json                 # Lab content + metadata
        data.ts                   # Lab data loader/helpers
        types.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` and configure SMTP for contact form delivery:

```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

The contact API currently sends submissions to:

- `hamdaouijesser2004@gmail.com`

## Scripts

- `npm run dev` — start development server (Turbopack)
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint

## Notes

- Lab content is maintained in `src/lib/labs.json`.
- Lab thumbnails are served from `public/images` and wired through `thumbnail` fields.
- If you introduce additional simulations locally (instead of external links), prefer isolated routes/components per lab for maintainability.

## Contact

- General: `rim.gharbi@medtech.tn`
- Technical: `jesser.hamdaoui@medtech.tn`
- Academic: `rim.gouia@medtech.tn`
