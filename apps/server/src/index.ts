import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "./auth";

const betterAuthPlugin = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401);
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

const app = new Elysia()
  .use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }))
  .use(betterAuthPlugin)
  .get("/", () => "Nexus API is running")
  .get("/me", ({ user }) => user, { auth: true })
  .listen(8000);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);
