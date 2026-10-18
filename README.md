# Kevin + Nica Wedding Invitation (`nk-wedding`)

Interactive beachfront wedding invitation for **Kevin & Nica** (**Saturday, January 9, 2027** at **Villa Elisa Botolan, Zambales**), built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **Framer Motion (`motion/react`)** using 100% of the original high-resolution Canva assets and fonts.

---

## 🌐 Live Access Points (Simultaneous Local & Cloudflare Tunnel)

Both `localhost` and the public Cloudflare tunnel (`*.japs.dev`) work **at the exact same time**:

| Service | Local URL | Public Tunnel URL (`*.japs.dev`) | Host Port |
| :--- | :--- | :--- | :--- |
| **Wedding Invitation Web App** | `http://localhost:3040` | `https://nk-wedding.japs.dev` / `https://wedding.japs.dev` | `3040` |

---

## 🚀 Quick Start Commands

```bash
# Start Next.js dev server on http://localhost:3040
npm run dev

# Start the Cloudflare tunnel (https://nk-wedding.japs.dev)
npm run tunnel
```

---

## 🗂️ Asset Structure (`/public/assets/`)
- `/public/assets/fonts/` - Original Canva `.woff2` font files (`Campground`, `Aileron`, `Courier Prime`, `League Spartan`, `Arimo`).
- `/public/assets/canva/` - 115 extracted Canva graphics, stickers, polaroids, couple portraits, and paper textures.
- `/public/assets/pages/` - Full 7-page reference snapshots (`page_1.png` .. `page_7.png`).
