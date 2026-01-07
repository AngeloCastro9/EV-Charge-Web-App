# EV Charge Manager Web App

A high-end, modern, and tech-focused dashboard for EV charging management. Built with Next.js 15 and featuring a fintech-modern design with dark mode, subtle glassmorphism effects, and neon green/blue accents.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![React Query](https://img.shields.io/badge/React%20Query-5.90-ff4154)

## 🚀 Features

- **🌐 Internationalization (i18n)**: Full support for English and Portuguese with seamless language switching
- **🔐 Authentication**: Secure login/signup with JWT token management
- **📊 Dashboard**: Real-time view of charging stations with availability status
- **📅 Booking System**: Book charging sessions with live price calculation
- **📱 Responsive Design**: Fully optimized for mobile and desktop devices
- **🎨 Modern UI/UX**: Dark mode with glassmorphism effects and energy-themed accents
- **⚡ Real-time Updates**: Live status indicators and charging animations

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/) (Icons) + [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (for Auth session)
- **API Client**: [Axios](https://axios-http.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000` (NestJS default port)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AngeloCastro9/EV-Charge-Web-App.git
cd EV-Charge-Web-App
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📁 Project Structure

```
EV-Charge-Web-App/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── bookings/      # Bookings history page
│   │   ├── layout.tsx     # Dashboard layout
│   │   └── page.tsx        # Stations grid page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx       # React Query provider
├── components/            # React components
│   ├── booking/           # Booking modal
│   ├── layout/            # Sidebar and Topbar
│   ├── ui/                # Shadcn/UI components
│   └── language-selector.tsx
├── lib/                   # Utilities
│   ├── axios.ts           # API client configuration
│   └── utils.ts           # Helper functions
├── store/                 # Zustand stores
│   └── auth-store.ts      # Authentication state
├── messages/              # i18n translation files
│   ├── en.json            # English translations
│   └── pt.json            # Portuguese translations
├── i18n/                  # i18n configuration
│   └── request.ts
└── middleware.ts         # Next.js middleware for i18n
```

## 🔌 API Integration

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Stations
- `GET /stations` - Get all charging stations

### Bookings
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create a new booking

### API Response Formats

**Login/Signup Response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Station Response:**
```json
[
  {
    "id": "station-id",
    "name": "Station Name",
    "location": "Station Location",
    "powerKw": 50,
    "isAvailable": true
  }
]
```

**Booking Response:**
```json
[
  {
    "id": "booking-id",
    "stationId": "station-id",
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": "2024-01-01T12:00:00.000Z",
    "durationMinutes": 120,
    "powerKw": 50,
    "totalPrice": 100,
    "status": "ACTIVE"
  }
]
```

## 🌍 Internationalization

The app supports two languages:
- **English (en)** - Default
- **Portuguese (pt)** - Brazilian Portuguese

Language selection is stored in cookies and persists across sessions. The language selector is available in the topbar.

### Adding New Translations

1. Add translations to `messages/en.json` and `messages/pt.json`
2. Use the `useTranslations` hook in your components:
```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("dashboard");
return <h1>{t("title")}</h1>;
```

## 🎨 UI/UX Features

- **Dark Mode**: Default dark theme with custom color palette
- **Glassmorphism**: Subtle backdrop blur effects on cards and modals
- **Energy Accents**: Neon green/blue colors for "energy" vibes
- **Animations**: Smooth transitions and pulse effects for active charging sessions
- **Responsive Grid**: Adaptive layout for mobile, tablet, and desktop

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Authentication Flow

1. User logs in or signs up
2. JWT token is stored in localStorage and Zustand store
3. Token is automatically attached to API requests via Axios interceptor
4. On 401 errors, user is automatically logged out and redirected to login

## 🚧 Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📦 Dependencies

### Core
- `next@^16.1.1` - React framework
- `react@^19.2.3` - UI library
- `typescript@^5.9.3` - Type safety

### UI & Styling
- `tailwindcss@^3.4.19` - Utility-first CSS
- `framer-motion@^12.24.10` - Animation library
- `lucide-react@^0.562.0` - Icon library
- `class-variance-authority@^0.7.1` - Component variants

### Data & State
- `@tanstack/react-query@^5.90.16` - Server state management
- `zustand@^5.0.9` - Client state management
- `axios@^1.13.2` - HTTP client

### Internationalization
- `next-intl@^4.7.0` - i18n for Next.js

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 👤 Author

Angelo Castro

## 🔗 Links

- [Repository](https://github.com/AngeloCastro9/EV-Charge-Web-App)
- [Issues](https://github.com/AngeloCastro9/EV-Charge-Web-App/issues)
