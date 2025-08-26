# Human Detection Web

A Progressive Web Application for human detection built with Vue 3, Tailwind CSS, Pinia, and Supabase.

## Features

- **Vue 3** - Modern JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Pinia** - State management for Vue 3
- **Supabase** - Backend as a Service
- **PWA Ready** - Installable as a mobile/desktop app
- **Live Data** - Real-time data without caching

## Setup

### Prerequisites

- Node.js >=20.17.0 (see `.nvmrc`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Code Formatting

Format code with Prettier:
```bash
npm run format
```

## Project Structure

```
src/
├── components/     # Vue components
├── lib/           # Utilities and configurations
│   └── supabase.js # Supabase client configuration
├── router/        # Vue Router configuration
├── stores/        # Pinia stores
├── style.css      # Tailwind CSS imports
├── App.vue        # Main application component
└── main.js        # Application entry point
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## PWA Features

This application is configured as a Progressive Web App with:
- Service Worker for offline functionality
- Web App Manifest for installation
- Auto-update capabilities

## Contributing

1. Follow the existing code style
2. Use Prettier for code formatting
3. Ensure PWA functionality works correctly
4. Test with real-time data scenarios

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).
