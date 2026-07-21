# InternScout web

The Next.js frontend for InternScout.

Copy the frontend environment example before starting local development:

```bash
cp apps/web/.env.example apps/web/.env.local
```

`NEXT_PUBLIC_INTERNSCOUT_API_URL` is exposed to the browser and must contain only the public base
URL for the InternScout API. Open `http://localhost:3000/development` while both applications are
running to verify the runtime-validated health connection.

Run commands from the repository root:

```bash
npm run dev --workspace @internscout/web
npm run lint --workspace @internscout/web
npm run typecheck --workspace @internscout/web
npm run test --workspace @internscout/web
npm run build --workspace @internscout/web
```
