# LearnHub

LearnHub is a learning management platform for organizations, teachers, and
students. It provides course content management, assignments, submissions,
grading, organization administration, invitations, and real-time
communication in a single application.

## Features

- Organization workspaces with owner, teacher, and student roles
- School and individual-course organization types
- Student and teacher invitations, including CSV imports
- Groups with assigned students, teachers, and learning modules
- Modules, topics, materials, assignments, and task management
- Student assignment submissions and file uploads
- Teacher submission review, grading, and marks filtering
- Student progress and marks views
- Real-time chat and application notifications
- Admin organization and user management
- Authentication, email verification, password reset, and two-factor
  authentication
- Responsive interface with light and dark themes

## Technologies

### Backend

- PHP 8.2+
- Laravel 12
- Laravel Fortify for authentication
- Laravel Reverb and Echo for real-time features
- Inertia.js Laravel adapter
- Eloquent ORM and Compoships (composite primary keys)
- Ziggy and Laravel Wayfinder for typed application routes

### Frontend

- React 19
- TypeScript
- Inertia.js
- Tailwind CSS 4
- Vite 7
- Radix UI and Headless UI primitives
- Lucide React icons
- jsPDF and html2canvas for document generation

### Development and Testing

- Pest 4
- PHPUnit
- Laravel Pint
- ESLint
- Prettier
- React Compiler

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- SQLite, MySQL, PostgreSQL, or another Laravel-supported database

## Installation

The project includes a setup script that installs backend and frontend
dependencies, creates the environment file, generates the application key,
runs migrations, and builds the frontend:

```bash
composer run setup
```

For manual setup:

```bash
composer install
cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate

npm install
npm run build
```

Update `.env` before running migrations when using a database other than
SQLite.

## Development

Start the Laravel server, queue listener, log viewer, and Vite development
server:

```bash
composer run dev
```

On Windows, please use:

```bash
composer run dev:windows
```

To run the application with Inertia server-side rendering:

```bash
composer run dev:ssr
```

## Testing and Quality

Run the backend test suite and PHP formatting checks:

```bash
composer run test
```

Other useful commands:

```bash
php artisan test
composer run lint
npm run types
npm run lint
npm run format:check
```

## Project Structure

```text
app/                 Laravel application code
database/            Migrations, factories, and seeders
resources/js/        React pages, layouts, components, hooks, and types
resources/css/       Application styles
resources/views/     Inertia root Blade view
routes/              Web, authentication, and settings routes
tests/               Pest unit and feature tests
```

## Configuration

The available environment settings are documented in `.env.example`. Important
configuration includes:

- `APP_*` for application name, URL, environment, and debug mode
- `DB_*` for database access
- `MAIL_*` for email delivery
- `QUEUE_CONNECTION` for background jobs
- `BROADCAST_CONNECTION` and Reverb settings for real-time features
- `SESSION_DRIVER` and `CACHE_STORE`
- `VITE_APP_NAME` for the frontend application name

## License

This project is licensed under the MIT License.
