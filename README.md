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
