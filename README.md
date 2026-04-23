# Cloudflare AI Chat Agent

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/astroforge-ai-native-headless-cms-for-astro)]](https://deploy.workers.cloudflare.com)

A production-ready, full-stack AI chat application built on Cloudflare Workers. Features multi-session conversations, streaming responses, tool calling (web search, weather, MCP integration), and a modern React UI with shadcn/ui components.

## ✨ Features

- **Multi-Session Chat**: Persistent conversations across sessions with automatic title generation and session management.
- **AI Integration**: Powered by Cloudflare AI Gateway with support for Gemini models (Flash, Pro).
- **Streaming Responses**: Real-time message streaming for natural chat experience.
- **Tool Calling**: Built-in tools for web search (SerpAPI), weather, and extensible MCP (Model Context Protocol) support.
- **Modern UI**: Responsive design with Tailwind CSS, shadcn/ui, dark mode, and smooth animations.
- **Durable Objects**: Stateful chat agents and app controller for reliable session handling.
- **Type-Safe**: Full TypeScript support across frontend and backend.
- **Production-Ready**: CORS, error handling, logging, and Cloudflare observability.

## 🛠️ Tech Stack

- **Backend**: Cloudflare Workers, Hono, Agents SDK, Durable Objects, OpenAI SDK
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, Lucide Icons
- **AI/ML**: Cloudflare AI Gateway, Gemini models, SerpAPI, MCP
- **State**: Zustand, Immer
- **Build Tools**: Bun, Wrangler, Vite
- **UI Utils**: Framer Motion, Sonner (toasts), Headless UI

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers enabled
- Cloudflare AI Gateway credentials (Account ID, Gateway ID, API Key)
- Optional: SerpAPI key for web search, OpenRouter/SerpAPI keys in `wrangler.jsonc`

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd astroforge-cms-bvh4t_jgaef_cjidx8ook
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables in `wrangler.jsonc`:
   ```json
   {
     "vars": {
       "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{YOUR_ACCOUNT_ID}/{YOUR_GATEWAY_ID}/openai",
       "CF_AI_API_KEY": "{YOUR_AI_API_KEY}",
       "SERPAPI_KEY": "{OPTIONAL_SERPAPI_KEY}",
       "OPENROUTER_API_KEY": "{OPTIONAL_OPENROUTER_KEY}"
     }
   }
   ```

4. Generate Worker types:
   ```bash
   bun run cf-typegen
   ```

## 💻 Development

Start the development server:
```bash
bun dev
```

- Frontend: http://localhost:3000 (Vite dev server)
- Backend: Automatically proxied via Vite + Cloudflare Vite plugin
- Hot reload enabled for both FE/BE

### Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server (FE + BE) |
| `bun build` | Build for production |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |
| `bun deploy` | Build + deploy to Cloudflare |

## 🌐 Usage

### Chat Sessions

- **New Chat**: Automatically creates a session with optional first message for auto-titling.
- **Switch Sessions**: Use `/api/sessions` to list/manage sessions.
- **Streaming**: Send messages with `stream: true` for real-time responses.
- **Tools**: Ask about weather (`get_weather`), search (`web_search`), or MCP tools.
- **Models**: Switch between Gemini models via API or UI.

### API Endpoints

- `POST /api/chat/:sessionId/chat` - Send message
- `GET /api/chat/:sessionId/messages` - Get chat state
- `DELETE /api/chat/:sessionId/clear` - Clear messages
- `GET/POST/DELETE /api/sessions` - Session management

See `worker/userRoutes.ts` for custom routes.

## 🚀 Deployment

1. Build the project:
   ```bash
   bun build
   ```

2. Deploy to Cloudflare Workers:
   ```bash
   bun deploy
   ```
   
   Or use Wrangler directly:
   ```bash
   npx wrangler deploy
   ```

3. Configure secrets (required for production):
   ```bash
   wrangler secret put CF_AI_API_KEY
   wrangler secret put SERPAPI_KEY  # Optional
   ```

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/astroforge-ai-native-headless-cms-for-astro)]](https://deploy.workers.cloudflare.com)

**Custom Domain**: Bind via Cloudflare Dashboard > Workers > Triggers.

## 🔧 Customization

- **Add Tools**: Extend `worker/tools.ts` and `mcp-client.ts`.
- **UI Changes**: Edit `src/pages/HomePage.tsx` and shadcn components.
- **Routes**: Add to `worker/userRoutes.ts`.
- **Models**: Update `src/lib/chat.ts` MODELS array.
- **Sidebar**: Customize `src/components/app-sidebar.tsx`.

## 📚 Documentation

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Agents SDK](https://developers.cloudflare.com/agents/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`bun dev`)
3. Commit changes (`git commit -m 'feat: ...'`)
4. Push and open PR

## ⚠️ License

This project is MIT licensed. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Discord](https://discord.cloudflare.com/)
- [Workers GitHub Discussions](https://github.com/cloudflare/workers-sdk/discussions)

Built with ❤️ by Cloudflare Templates.