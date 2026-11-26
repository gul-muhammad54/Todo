# Todo App (React + Vite + Supabase)

Login / Logout, 2 users, har user ke apne alag todos (add, edit, delete, done). Data Supabase mein save hota hai.

## Setup

1. supabase.com par naya project banayein.
2. SQL Editor mein `supabase.sql` ka poora code run karein (table + RLS).
3. Authentication > Providers > Email: "Confirm email" band kar dein (testing ke liye).
4. Authentication > Users > "Add user" se 2 users banayein (email + password, kam az kam 6 characters).
5. `.env.example` ko copy karke `.env` banayein aur Project Settings > API se URL aur anon key paste karein.

## Run (Node 18+)

    npm install
    npm run dev

Open http://localhost:5173
