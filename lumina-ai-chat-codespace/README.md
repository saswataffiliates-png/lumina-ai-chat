# Lumina AI Chat

A polished AI chatbot starter designed to run easily in **GitHub Codespaces**.

## Stack

- Next.js
- TypeScript
- React
- OpenAI Responses API
- Lucide icons
- Custom responsive CSS (no UI framework required)

## Run in GitHub Codespaces

### 1. Create a repository

Upload these files to a new GitHub repository, then open the repository in **Codespaces**.

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.6-luna
```

Never commit `.env.local` or your API key.

### 4. Start the app

```bash
npm run dev
```

Open the forwarded port shown by Codespaces.

## Change the model

Set `OPENAI_MODEL` in `.env.local` to a model available to your API account.

## Project structure

```text
app/
  api/chat/route.ts    # Server-side AI endpoint
  globals.css          # UI styling
  layout.tsx
  page.tsx
components/
  chat-app.tsx         # Main chatbot UI
.env.example
package.json
tsconfig.json
README.md
```

## Notes

The API key stays on the server because the OpenAI call is made from `app/api/chat/route.ts`. The browser sends conversation messages to your own `/api/chat` route.

For production, consider adding authentication, rate limiting, persistent chat storage, abuse protection, and streaming responses.
