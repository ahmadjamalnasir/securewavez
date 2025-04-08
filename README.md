
# SecureVPN Frontend

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- Axios (for API calls)
- React Query (for data fetching and caching)

## API Integration

The frontend is designed to communicate with a backend API for:

- User authentication (login, signup, password reset)
- VPN server management
- VPN connection status
- Subscription management

### Environment Variables

To connect to your backend API, set the following environment variable:

```
VITE_API_URL=https://your-api-url.com
```

### API Client

The application uses Axios for API communication. The client is configured in `src/api/axiosClient.ts` and includes:

- Automatic token handling
- Error interceptors
- Loading state management

## Authentication Flow

The authentication flow includes:

1. Login/Signup
2. OTP verification
3. Password reset

All authentication state is managed through the AuthContext provider.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your API URL
4. Run the development server with `npm run dev`

## Production Build

```
npm run build
```

