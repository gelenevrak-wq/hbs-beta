This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## HBS — security & deployment notes

### Environment
Copy `.env.example` to `.env.local` (dev) or `.env.production.local` (prod). `.env*` is git-ignored — secrets are never committed.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project.
- `NEXT_PUBLIC_COOKIE_SECRET` — **>= 16 chars, unique**. Used to sign session cookies. Do NOT reuse the Supabase anon key.

### Row Level Security (critical)
Data access is enforced by Supabase RLS, not by the app layer. Apply the policies in `supabase/migrations/0001_rls_policies.sql`:
```bash
supabase db push
```
Before applying, confirm table/column names against your live schema (`supabase db dump --schema public`). The anon key is safe in the browser **only** because RLS limits anonymous access to public-read policies.

### Session cookies
Real sign-ins issue cookies via `app/api/auth/session/route.ts` (server-side signing). Demo/local fallback signs client-side. `lib/security.ts` requires `NEXT_PUBLIC_COOKIE_SECRET` in production.

### Build & deploy
```bash
npm install
npm run build   # next build --webpack
npm start
```
Deploy on Vercel (framework preset: Next.js) or any Node host. Set the same env vars in the deploy target.
