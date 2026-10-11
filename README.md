# StayFinder 🏡

StayFinder is a full-stack PG (paying guest) discovery and booking platform. It helps customers explore PG accommodations, manage bookings, and review properties, while PG owners can create and manage their listings.

## Features

### For customers
- Browse PG listings and view property details
- Book a PG for a selected date range and room type
- View and cancel personal bookings
- Submit, update, and delete PG reviews
- Manage account details and change password
- Verify phone number with OTP before registration

### For PG owners
- Create PG listings
- Update or delete their own listings
- Manage property information such as location, price, food and Wi-Fi availability, room-sharing type, and availability status

### Platform
- JWT access/refresh-token authentication
- Role-based authorization for customers and PG owners
- MongoDB persistence with Mongoose
- OTP verification through Twilio Verify
- Cloudinary integration utilities for media
- React-based responsive interface
- API security middleware with Helmet, CORS, request logging, and rate limiting
- Health-check endpoint

## Tech Stack

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS
- Axios
- Lucide React
- Google Maps React integration
- Google GenAI SDK

**Backend**
- Node.js, Express 5
- MongoDB, Mongoose
- JWT, bcrypt, cookie-parser
- Twilio Verify
- Cloudinary utilities
- Helmet, CORS, Morgan, express-rate-limit

## Project Structure

```text
StayfinderFullStack/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── db/              # Database connection
│   │   ├── middlewares/     # Authentication middleware
│   │   ├── models/          # User, PG, booking, review models
│   │   ├── routes/          # REST API routes
│   │   ├── utils/           # API responses, errors, helpers
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── api/             # API client and service modules
│   │   ├── components/      # UI components
│   │   └── App.tsx
│   ├── package.json
│   └── index.html
└── README.md
```

## Prerequisites

- Node.js (a current LTS version is recommended)
- npm
- A MongoDB database (local or MongoDB Atlas)
- Credentials for any integrations you use, such as Twilio Verify, Cloudinary, or Google Maps/GenAI

## Getting Started

Run the backend and frontend in separate terminals.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd StayfinderFullStack
```

### 2. Configure the backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory. Add your own credentials:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173

MONGODB_URI=<your-mongodb-connection-string>

ACCESS_TOKEN_SECRET=<your-access-token-secret>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
REFRESH_TOKEN_EXPIRY=7d

TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_VERIFY_SERVICE_SID=<your-twilio-verify-service-sid>

CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

Use strong, unique secrets and adjust token expiry values to match the backend's expected format. Configure only integrations you need. Never commit real credentials.

Start the backend:

```bash
npm run dev
```

The backend defaults to port `3000`. The health-check endpoint is:

```text
GET http://localhost:3000/api/v1/health/healthCheck
```

### 3. Configure the frontend

Open a second terminal:

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

If you use Google Maps or Gemini-powered UI features, configure the relevant client-side key expected by the implementation. Any variable prefixed with `VITE_` is exposed to the browser, so do not put private server credentials in it.

Start the frontend:

```bash
npm run dev
```

Vite will serve the app at [http://localhost:5173](http://localhost:5173).

## Available Scripts

### Backend (`Backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the API with Node's watch mode |
| `npm start` | Start the API |

### Frontend (`Frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run the configured TypeScript check |

## API Overview

All API routes use the `/api/v1` prefix.

| Area | Method | Endpoint | Purpose |
|---|---|---|---|
| Health | GET | `/health/healthCheck` | Check API status |
| Users | POST | `/users/register` | Register an account after phone verification |
| Users | POST | `/users/login` | Log in |
| Users | POST | `/users/logout` | Log out |
| Users | POST | `/users/change-password` | Change password |
| Users | PATCH | `/users/update-account` | Update account details |
| Users | GET | `/users/current-user` | Get the authenticated user |
| OTP | POST | `/otp/send-otp` | Send verification OTP |
| OTP | POST | `/otp/verify-otp` | Verify phone number |
| PG | POST | `/pg/addpg` | Create a PG listing (owner) |
| PG | GET | `/pg/getpg` | List PGs |
| PG | GET | `/pg/getpg/:pgId` | Get a PG by ID |
| PG | PUT | `/pg/updatepg/:pgId` | Update an owned PG listing |
| PG | DELETE | `/pg/deletepg/:pgId` | Delete an owned PG listing |
| Booking | POST | `/booking/bookpg` | Create a booking (customer) |
| Booking | GET | `/booking/getbookings` | Get the customer's bookings |
| Booking | PATCH | `/booking/cancelbooking/:bookingId` | Cancel an owned booking |

Review-related endpoints are also implemented under the user route group:
- `POST /api/v1/users/review`
- `PUT /api/v1/users/updatereview`
- `DELETE /api/v1/users/deletereview`

Authentication and role requirements apply to protected endpoints. Check the route/controller implementation for request body fields and response formats.

## Data Models

- **User** — account information, role, and authentication data
- **PG** — accommodation details and owner reference
- **Booking** — customer, PG, date range, room type, and booking status
- **Review** — customer feedback and rating for a PG
- **VerifiedPhone** — phone verification records

## Security Notes

- Keep `.env` files and all API secrets out of version control.
- Use HTTPS and production-specific CORS origins when deploying.
- Store strong, unique JWT secrets and rotate them if exposed.
- Do not expose private Twilio or Cloudinary credentials in frontend variables.
- Review rate limits and authentication settings before production deployment.
- The frontend may include demo/fallback listings; connect the backend to use persisted data and verify the UI's fallback behavior.

## Troubleshooting

- **MongoDB connection fails:** verify `MONGODB_URI`, network access rules, and database availability.
- **Frontend cannot reach the API:** confirm the backend is running, `VITE_API_URL` is correct, and `CORS_ORIGIN` matches the frontend origin.
- **OTP does not send or verify:** check Twilio Verify credentials, service SID, and account configuration.
- **Changes to frontend environment variables do not appear:** restart the Vite dev server after editing `.env`.
- **Port already in use:** change `PORT` for the backend or adjust the Vite script/port configuration.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request describing the changes.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project under a particular license.

---

Built as a full-stack accommodation discovery and booking project.
