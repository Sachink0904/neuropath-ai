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

## Environment / Groq (LLaMA 3)

This project can optionally use Groq (LLaMA 3) via the Vercel AI SDK. To enable real model streaming in production, add the following environment variable in your local `.env.local` or in Vercel project settings:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Notes:
- The server code uses the Vercel AI SDK imports: `import { groq } from '@ai-sdk/groq'` and `streamText` from `ai`.
- If `GROQ_API_KEY` is not set or an error occurs, the app falls back to a local mock streaming response for demo purposes.
- Do not set custom Groq URLs — the SDK handles endpoint selection when `GROQ_API_KEY` is present.
