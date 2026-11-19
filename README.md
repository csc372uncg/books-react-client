# Getting Started

- Clone the repository
```
git clone <repo url>
```
- Run `npm install` to install dependencies
- Add a `.env` file in the root directory with the following content:

```
VITE_API_URL=http://localhost:3000
```

The Express server must allow the client origin in `CLIENT_ORIGIN` (default: `http://localhost:5173`) and support credentialed CORS requests for session-based authentication. For deployment, serve the client and API from the same site so the backend's `SameSite=Lax` session cookie can be sent securely.

Run `npm run dev` to start the development server. Create an account or log in to add and delete books.
