# LocalConnect - IndiaMART & Justdial Style Marketplace for Local Businesses

LocalConnect is a modern, full-stack SaaS marketplace connecting local businesses (restaurants, doctors, electricians, CCTV shops, etc.) with customers. It incorporates AI-powered business tools (Description & SEO copywriting), an AI lead scoring pipeline, verified badge credentials (GST & OTP check simulations), and Leaflet OpenStreetMap integrations.

---

## Technical Architecture

* **Frontend (`/client`)**: React 19, Vite, Tailwind CSS, Lucide Icons, Leaflet Maps, Framer Motion
* **Backend (`/server`)**: Express, Node.js, TypeScript, Prisma ORM
* **Database**: SQLite (built-in file database, zero-install required; ready for PostgreSQL)

---

## Getting Started

Follow these steps to run the application locally on your machine.

### Step 1: Install Dependencies
Open your terminal and run `npm install` inside both directories:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install --legacy-peer-deps
```

### Step 2: Initialize Database and Seed Data
In the `/server` folder, use Prisma to create the SQLite database file, generate the database client, run migrations, and seed the database with initial categories and local business records:

```bash
cd ../server

# Create database and apply migrations
npx prisma migrate dev --name init

# Generate the type-safe client
npm run prisma:generate

# Populate the database with mock entries
npm run prisma:seed
```

This seeds the database with:
* Categories (Restaurants, Electricians, Clinics, CCTV, etc.)
* Test Users (Business Owners and Customers)
* Sample listings (e.g. Spice Garden Restaurant in Hyderabad, Sparky Electricians in Mumbai)
* Initial reviews and incoming customer requirements (Leads) with pre-analyzed AI lead scores.

### Step 3: Run the Express Server
Start the backend Express server on port `5000`:

```bash
# Starts hot-reloading dev server
npm run dev
```

### Step 4: Run the Vite React Frontend
In a new terminal window, navigate to the `/client` directory and start the Vite dev server on port `3000`:

```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## User accounts to test with (pre-seeded):

You can sign in using these mock credentials to explore Owner dashboards and Customer review writing:

### 1. Rajesh Kumar (Owner Account)
* **Email**: `rajesh@example.com`
* **Password**: `password123`
* **Features**: Owns *Spice Garden Restaurant* (Hyderabad) and *SafeHome CCTV Solutions* (Hyderabad). Check his **Lead Pipeline** column board to view AI lead scores (HOT/COLD/WARM), run the **AI Generator** inside the Profile editor, upgrade to the **PRO subscription** plan, and complete the GST verification.

### 2. Anjali Sharma (Owner Account)
* **Email**: `anjali@example.com`
* **Password**: `password123`
* **Features**: Owns *Sparky Electricians* (Mumbai).

### 3. Vikram Singh (Customer Account)
* **Email**: `vikram@example.com`
* **Password**: `password123`
* **Features**: Write reviews on listed business detail pages, submit new inquiries (leads), and browse search results.
