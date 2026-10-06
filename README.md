# EcomMS-WebFrontend

## Temporary frontend authentication

Authentication is currently a development-only browser prototype; it makes no
backend requests. Registered passwords are stored as plaintext in `localStorage`,
and client-side route checks are not a security boundary. Do not use real
passwords or rely on these checks to protect production data.

The temporary admin account is `admin@ecomms.local` with password
`Admin@12345`. This credential must be removed when backend authentication is
connected and must never be used as a production credential. New registrations
are customer accounts, and their accounts remain in the current browser after
logout.

## Customer storefront demo

- `/`, `/products`, `/products/[slug]`, `/cart` and `/checkout` demonstrate customer product discovery, category-specific filters/specifications, variants and a complete local demo checkout.
- The catalog contains 47 sample products across 12 departments. Category and attribute definitions live in `lib/products/categories.ts`; product data is centralized in `lib/products/mock-data.ts`.
- Product and category reads go through `lib/products/product-service.ts`. Reviews, orders and notifications also have small repository boundaries so those demo sources can later be replaced with Product, Order and Notification service clients.
- Checkout does not collect payment credentials, contact a payment provider or call an order API. A submitted sample order is saved in this browser under `ecomms_demo_orders`; it can be viewed in `/account/orders` and on its order detail page.
- The cart (`ecomms_cart` in localStorage) stores product snapshots and is **not authoritative**. A backend must re-validate prices and stock when a real order service is connected.
- Product artwork in `public/products/` is locally stored demonstration illustration, not merchant photography.

## Service boundaries

The intended transition is **UI → repository/service layer → demo data** today, and **UI → service layer → API gateway → microservices** later. The customer-facing flows map to Auth, Product, Order and Notification services. No API endpoints or backend integrations are simulated by this frontend.

## Theme & design tokens

- Light/dark theme with a no-flash init script; the choice is stored in `localStorage` (`ecomms_theme`) and falls back to the system preference.
- Colors, shadows and component classes (`.btn`, `.field`, `.card`, `.badge`) are semantic tokens defined in `app/globals.css`; use them instead of hardcoded colors.
- Everything in the storefront (products, prices, ratings, stock, cart, accounts) is **demo data** and is labelled as such in the UI.
