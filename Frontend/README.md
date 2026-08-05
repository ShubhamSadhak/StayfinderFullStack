# Stayfinder Frontend

This frontend is a standalone Vite + React application for the Stayfinder MERN project.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Axios

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `Frontend/.env` with:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

This assumes the real backend in `Backend/` is running on port `3000`.

### 3. Start the frontend

```bash
npm run dev
```

The React app will run on `http://localhost:5173`.

## Scripts

- `npm run dev` starts the Vite development server on port `5173`
- `npm run build` creates a production frontend build
- `npm run preview` serves the production build on port `4173`
- `npm run lint` runs TypeScript type-checking

## Notes

- `server.ts` is an older mock/full-demo server and is no longer used by the frontend dev script.
- For the real full-stack setup, run the backend from `Backend/` and the frontend from `Frontend/` separately.
