# Jolly Jobs 

Jolly Jobs is a modern digital recruitment platform designed to connect tech and digital talents with employers.
the platform aims to centralize and simplify the recruitment process with an intuitive and responsive user experience. 


## Key Features
- **Candidates**: Profile management, advanced job search filtering (location, Location, tech stack), seamless applications, and application tracking.
- **Employers**: Company profile creation, job posting management, applicant tracking, and candidate selection.
- **Administrators**: Platform moderation, user management, and overall platform statistics.
- **Real-time Messaging**: Built-in live chat and notifications between candidates and recruiters using Laravel WebSockets (Reverb & Echo).

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router DOM, Lucide Icons
- **Backend**: Laravel (PHP)
- **Database**: PostgreSQL
- **WebSockets**: Laravel Reverb & Laravel Echo

## Getting Started

### Prerequisites
- Node.js & npm
- PHP & Composer
- PostgreSQL

### Installation

1. **Clone the repository** (or open the project directory):
   ```bash
   cd "Jolly Jobs"
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   ```
   - *Ensure you update your `.env` file with your PostgreSQL database credentials.*
   - Run migrations to set up the database structure:
   ```bash
   php artisan migrate
   ```
   - Start the Laravel development server and Reverb WebSocket server:
   ```bash
   php artisan serve
   php artisan reverb:start
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   - The application will be accessible at `http://localhost:5173` (by default).

## Design System
Jolly Jobs utilizes a modern, sleek design with a specific color scheme defined in its specification:
- **Primary Violet** (`#6366F1`) & **Deep Purple** (`#4338CA`) for energetic primary actions and distinct headers.
- **Teal / Turquoise Accent** (`#14B8A6`) for secondary actions, badges, and positive indicators.
- **Slate / Navy** for strong contrast typography and structured sidebars.

