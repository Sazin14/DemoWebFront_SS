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

## Products & cart (frontend-only, temporary)

- `/products`, `/products/[slug]`, `/cart` and a placeholder `/checkout` use **mock data** from `lib/products/mock-data.ts`, accessed only through `lib/products/product-service.ts`. Replace the service bodies with Product API calls later; components don't change.
- Prices, stock, ratings and reviews are **sample data**. The cart (`ecomms_cart` in localStorage) stores snapshots and is **not authoritative**: a backend must re-validate prices and stock at checkout.
- Product images in `public/products/` are generated placeholder illustrations.

## Theme & design tokens

- Light/dark theme with a no-flash init script; the choice is stored in `localStorage` (`ecomms_theme`) and falls back to the system preference.
- Colors, shadows and component classes (`.btn`, `.field`, `.card`, `.badge`) are semantic tokens defined in `app/globals.css`; use them instead of hardcoded colors.
- Everything in the storefront (products, prices, ratings, stock, cart, accounts) is **demo data** and is labelled as such in the UI.
