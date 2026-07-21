# 🪃 Bumerán

> **Lo que das, vuelve.** — What you give, comes back.
> A neighborhood favor-exchange app: offer help, ask for it, or give things away — filtered by GPS and category.

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/Expo_SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 54">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind">
</p>

---

## 📖 The idea

In any neighborhood, one person's unused drill is another's weekend-saver, and skills like language tutoring or furniture assembly sit idle just a few blocks away — but there's no local platform built around this. Facebook groups are noisy, Marketplace is for selling, and no one reads community boards. **Bumerán fills that gap.**

The app opens with a single question: **do you need help, or do you want to give it?** That answer shapes the entire feed. Posts come in three types:

- 🙋 **`necesito`** — I need something
- 🤝 **`ofrezco`** — I'm offering help
- 🎁 **`regalo`** — I'm giving something away, for free

Each type maps to complementary content — someone who needs help only sees offers and gifts; someone who wants to help only sees requests. **No noise.**

---

## ✨ Features

- 🗺️ **GPS-filtered discovery** — real-time device location via `expo-location`; a map plus a swipeable bottom-sheet list of favors nearby. Includes a re-center button to snap back to the user's current position.
- 🔎 **Search & filters** — by keyword, by type, and across **13 categories** (tools, gardening, pets, transport, moving, languages, cleaning, paperwork, repairs, assembly, tech, urgent…).
- ⭐ **Favorites** — save the posts you care about.
- ⏳ **Expiration** — favors have a configurable lifespan (24 h / 48 h / 7 d / 30 d) so the feed stays fresh.
- 🔐 **Safety-first connections** — connecting opens a safety-tips modal before redirecting to **WhatsApp**; exact location is only shared in chat once both parties agree.
- 🔄 **Connection lifecycle** — `pending → accepted → completed / cancelled`, tracked in a Connections screen with separate tabs for received and sent requests.
- 🌟 **Reviews & reputation** — rate each other (1–5 stars + optional comment) after a completed exchange, building local trust over time.
- 📱 **Mandatory phone verification** — two-step SMS flow (number input → 6-digit code via Twilio). Verification is required before a user can connect with neighbors. A badge and prompt are shown in the profile screen, and the connection gate enforces it at the API level too.
- 🔑 **Google Sign-In** — passwordless auth; an OAuth 2.0 ID token is verified server-side. Session is persisted in AsyncStorage and restored on app launch.
- 🌍 **Multilingual** — Spanish, English and German (ES / EN / DE) from day one, via `expo-localization`.
- ⚖️ **GDPR / RGPD compliant footer** — a reusable `FooterLegal` component appears on all main screens with data sources, full GDPR rights section (access, rectify, export, delete), Privacy Policy and Terms of Use links, and an EU Digital Services Act compliance badge.
- 🔔 **Real push notifications** — via the **Expo Push API** (`expo-notifications`). The app registers a device token on login and receives native push notifications for key connection events: new connection request, accepted, completed, cancelled. A full Notifications screen shows the history with relative timestamps and marks all as read on open.
- 📸 **Photo upload** — up to 4 photos per favor, picked from camera or gallery via `expo-image-picker` and uploaded to **Cloudinary** (unsigned preset). Detail screen shows a horizontal swipeable gallery with pagination dots.

---

## 🛠️ Tech Stack

| Area | Technology |
|------|------------|
| Framework | React Native 0.76 + Expo SDK 54 |
| Language | TypeScript |
| Styling | NativeWind (Tailwind for React Native) + StyleSheet |
| Navigation | React Navigation (native-stack) |
| Maps | `react-native-maps` |
| Location | `expo-location` |
| Bottom sheet | `@gorhom/bottom-sheet` |
| Auth | `@react-native-google-signin/google-signin` |
| Push notifications | `expo-notifications` + Expo Push API |
| Image picker | `expo-image-picker` |
| Image hosting | Cloudinary (unsigned upload, REST API) |
| i18n | `expo-localization` + custom translation layer (ES/EN/DE) |
| Storage | AsyncStorage |
| API | `fetch` against the Bumerán NestJS backend |

---

## 📁 Project Structure

```
src/
├── api/            # Backend clients (favores, conexiones, reviews, usuarios, verificacion, notificaciones)
├── components/     # Shared components (FooterLegal, …)
├── context/        # AuthContext (JWT + session restore + push token registration), FavoritosContext, LanguageContext
├── screens/
│   ├── auth/       # WelcomeScreen, LoginScreen, VerificacionTelefonoScreen
│   ├── favores/    # MainScreenFavores (map + list), DetailScreen, PedirFavorScreen
│   ├── conexiones/ # ConexionesScreen
│   ├── favoritos/  # FavoritosScreen
│   ├── notifications/ # NotificationsScreen
│   ├── profile/    # ProfileScreen
│   └── reviews/    # ReviewScreen
├── i18n/           # Translations (es / en / de) + formatting helpers
├── data/           # Categories and mock/seed data
├── types/          # Shared TypeScript types
└── utils/          # Helpers (favorHelpers, cloudinary upload)
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **18+**
- A **development build** — this app uses native modules (Google Sign-In, maps), so it does **not** run in plain Expo Go. Use `expo-dev-client` / `expo run:android` / an EAS dev build.
- The [Bumerán backend](https://github.com/Dual-Stack-Studio/bumeran-backend) running (locally or the deployed Railway URL).

### 1. Install
```bash
npm install
```

### 2. Environment variables
Create a `.env` file in the project root:

```env
# Backend API base URL (defaults to the Railway deployment if unset)
EXPO_PUBLIC_API_URL=https://bumeran-backend-production.up.railway.app

# Android Google Maps key (injected into the native config at build time)
GOOGLE_MAPS_API_KEY=your_android_google_maps_api_key
```

> The API clients fall back to the production Railway URL when `EXPO_PUBLIC_API_URL` is not set.

### 3. Run
```bash
npm start          # Metro bundler (dev client)
npm run android    # build & run on Android
npm run ios        # build & run on iOS
```

---

## 🔗 Related repositories

| Repo | Description |
|------|-------------|
| [bumeran-backend](https://github.com/Dual-Stack-Studio/bumeran-backend) | Bumerán API — NestJS 11, Prisma, PostgreSQL, Twilio (Railway) |

---

## 🏗️ About

Solo project under **Dual-Stack Studio**, currently in **active development**. Built with Claude Sonnet 4.6 (Anthropic) as an engineering partner throughout — architecture, API design, navigation flows, i18n strategy and component structure.
