# CircuitRush ⚡ — Hyperlocal Electronics Quick-Commerce

CircuitRush is a quick-commerce concept for **electronics components, robotics parts, and project kits**, built around the idea of 15–30 minute delivery from local dark stores in Mysuru. It's a single-page React app covering the full shopping journey — browse, plan a build, cart, checkout, and live order tracking — plus an admin dashboard, running entirely client-side.

## Features

- **Hyperlocal delivery model** — a location selector lets shoppers pick their area; the app matches them to the nearest of 3 Mysuru dark stores (Saraswathipuram, Hebbal, Vidyaranyapura) and shows a live delivery-time estimate per product/store.
- **Full components catalog** — 38 seeded products across 27 categories (Arduino, ESP32, Raspberry Pi, sensors, motors & drivers, displays, relays, communication modules, IoT, robotics, LEDs, passives, ICs, breadboards, jumper wires, connectors, batteries, power supplies, PCBs, tools, and school/college project components).
- **Ready-made project kits** — 8 all-inclusive kits bundling every component needed for a build, with difficulty level, estimated build time, guide steps, and skills learned.
- **"What Can I Build?"** — mark which components you already own and the app matches you against a library of 9 project ideas, showing what's fully buildable vs. what's still missing.
- **"Build My Project"** — a dedicated flow for assembling a custom parts list/project.
- **Product detail modal** — specs, pinout info, compatible boards, recommended projects, "frequently bought together," ratings, and reviews.
- **Cart & checkout** — add multiple items at once (e.g. a whole kit in one click), saved addresses (Hostel, College Lab, Home, Office, PG, etc.), and payment via UPI, card, or COD.
- **Live order tracking** — order status flow (Placed → Confirmed/Store Confirmed → Packing → Out for Delivery → Delivered) with assigned store and rider/delivery-partner info.
- **User profile** — saved addresses and basic account info, with a customer/admin role distinction.
- **Admin dashboard** — manage products, stores, and orders from the UI.
- **Toast notifications** and a mobile bottom nav for a native-app feel on phones.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for the dev server and build
- **Tailwind CSS 4** (via `@tailwindcss/vite`) for styling
- **lucide-react** for icons, **motion** for animations, **canvas-confetti** for celebratory UI moments
- React Context (`AppContext`) for global state — no external state library or backend

> Note: this project was scaffolded in Google AI Studio and lists `@google/genai` as a dependency along with a `GEMINI_API_KEY` in `.env.example` (and requests geolocation permission in `metadata.json`), but nothing in the current source calls the Gemini API. The "What Can I Build?" matching logic is plain component-ID matching against `projectIdeas`, not an AI feature. You can ignore the Gemini key unless you plan to add an AI feature yourself, and geolocation isn't currently wired up either (location is chosen manually via `LocationSelectorModal`).

## Project Structure

```
src/
├── components/            # Views (catalog, kits, build flows, tracking, admin) and modals
├── context/
│   └── AppContext.tsx     # Global state: view routing, cart, orders, stores, user profile
├── data/
│   └── database.ts        # Seed data: categories, stores, products, kits, ideas, reviews, orders
├── types/
│   └── index.ts            # Shared TypeScript types (Product, Store, Order, ProjectKit, etc.)
├── App.tsx                 # View routing and layout
└── main.tsx                 # Entry point
```

## Getting Started

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Set up environment variables — copy `.env.example` to `.env.local` and fill in `GEMINI_API_KEY` if you plan to add an AI-powered feature. Not required to run the app as-is.
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:3000`.

Other scripts:
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — type-check with `tsc --noEmit`

## Status

This is a front-end demo/prototype: there's no real payment processing, live rider dispatch, or persistent database — all data (products, stores, orders, addresses) is seeded in `src/data/database.ts` and held in React state. It's a solid foundation for exploring UX for a hyperlocal electronics delivery service, or for wiring up to a real backend, maps/geolocation, and payment provider.

## License

Add a license of your choice (e.g. MIT) if you plan to make this repository public.
