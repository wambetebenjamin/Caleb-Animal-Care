import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getJson, setJson } from "./store";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  salt: string;
  hash: string;
  createdAt: string;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

/**
 * Pet-portal accounts. Credentials provider over the app store.
 * Demo provisioning: a first sign-in with an unknown email creates the owner
 * account with that password (documented behaviour; replace with an invite
 * flow for production multi-user deployments).
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Falls back to a clearly-labelled dev secret so previews without env
  // still work; always set NEXTAUTH_SECRET in production (.env.example).
  secret: process.env.NEXTAUTH_SECRET ?? "cac-dev-preview-secret-not-for-production",
  providers: [
    CredentialsProvider({
      name: "Owner account",
      credentials: {
        name: { label: "Full name (new accounts)", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || password.length < 6) return null;
        const key = `user:${email}`;
        const existing = await getJson<StoredUser>(key);
        if (!existing) {
          const salt = randomBytes(16).toString("hex");
          const user: StoredUser = {
            id: email,
            name: credentials?.name?.trim() || email.split("@")[0],
            email,
            salt,
            hash: hashPassword(password, salt),
            createdAt: new Date().toISOString(),
          };
          await setJson(key, user);
          return { id: user.id, email: user.email, name: user.name };
        }
        const candidate = Buffer.from(hashPassword(password, existing.salt), "hex");
        const expected = Buffer.from(existing.hash, "hex");
        if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) {
          return null;
        }
        return { id: existing.id, email: existing.email, name: existing.name };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      if (user?.name) token.name = user.name;
      return token;
    },
  },
};
