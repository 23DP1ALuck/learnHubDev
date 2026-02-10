# learnHubDev

## Project Overview
This is a Laravel 12 application using Inertia.js with a React (TypeScript) frontend.
It includes a Fortify-based authentication flow, user settings pages, and an onboarding request submission flow.
The UI uses role-based navigation (admin vs user) and supports appearance (light/dark/system) via cookies.

## Features (Current)
- Inertia pages for landing (`/`), dashboards (`/dashboard`), settings, and admin views.
- Authentication via Laravel Fortify: login, password reset, email verification, two-factor auth, and password confirmation.
- Role-based access:
  - `users.role` enum (`admin` | `user`) and `CheckIsAdmin` middleware for admin-only routes.
  - Role-based sidebar/layout selection on the frontend.
- Onboarding requests:
  - Public POST endpoint to create an `onboarding_requests` record.
  - Admin-only page route for viewing onboarding requests (UI currently scaffolded).
- Settings:
  - Profile update and account deletion.
  - Password update.
  - Appearance settings page.
  - Two-factor authentication settings page (Fortify feature-gated).
- Flash success messages shared via Inertia and displayed in the frontend.

## Project Structure
- `app/Http/Controllers/` — dashboards, onboarding requests, and settings controllers.
- `app/Http/Middleware/` — Inertia shared props, appearance cookie handling, admin checks.
- `routes/web.php` and `routes/settings.php` — application routes.
- `resources/views/app.blade.php` — Inertia root view + early theme application.
- `resources/js/` — React app entry (`app.tsx`), pages (`pages/`), layouts (`layouts/`), components (`components/`).
- `database/migrations/` — schema for users/sessions, cache, jobs, onboarding requests, and roles.
- `tests/` — Pest feature tests for auth, dashboard, and settings.

## Getting Started

### Prerequisites
- PHP `^8.2` (see `composer.json`).
- Composer (see `composer.json`).
- Node.js + npm (see `package.json`).
- Database: defaults to SQLite (see `.env.example`).

### Setup
Quick setup (uses the repo’s Composer script):
```sh
composer run setup
```

Manual setup:
```sh
composer install
cp .env.example .env
php artisan key:generate

# If using SQLite (default), ensure the database file exists
touch database/database.sqlite

php artisan migrate
npm install
```

### Run the project (development)
Runs the PHP dev server, queue listener, log viewer, and Vite dev server:
```sh
composer run dev
```



### Common commands
Composer scripts (from `composer.json`):
- `composer run setup`
- `composer run dev`
- `composer run lint`
- `composer run test`

Frontend scripts (from `package.json`):
- `npm run dev`
- `npm run build`
- `npm run build:ssr`
- `npm run types`
- `npm run lint`
- `npm run format`
- `npm run format:check`

## Configuration

### Environment variables
An example env file is provided at `.env.example`.
Key variables used/configured in the repo include:
- `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`
- `DB_CONNECTION` (defaults to `sqlite`), plus optional `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `SESSION_DRIVER`, `QUEUE_CONNECTION`, `CACHE_STORE` (default to `database` in `.env.example`)
- `MAIL_*` (defaults to logging mail in `.env.example`)
- `VITE_APP_NAME` (used by the frontend app title)

### Database
- Default configuration in `.env.example` uses SQLite (`DB_CONNECTION=sqlite`).
- The repo includes `database/database.sqlite`.
- Migrations include tables for `users`, `sessions`, `password_reset_tokens`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, and `onboarding_requests`, plus a `role` field on `users`.

### Inertia SSR
- SSR is enabled in `config/inertia.php` and configured to use `ssr.url` (defaults to `http://127.0.0.1:13714`).
- Use `composer run dev:ssr` to run the SSR server expected by that config.

## Notes / Limitations
- The admin onboarding requests page is currently scaffolded; `OnboardingRequestController@index` does not yet load data into the page props.
- `DatabaseSeeder` creates `test@example.com` using the user factory; role defaults to `user` (no admin user is seeded by default).
- `database/factories/OnboardingRequestFactory.php` and `database/seeders/OnboardingRequestSeeder.php` are currently empty.
- The migration `database/migrations/2026_02_02_114321_add_role_field_to_user.php` has an incomplete `down()` implementation (rollbacks may not remove the `role` column).
