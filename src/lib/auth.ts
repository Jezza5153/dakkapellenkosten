/**
 * NextAuth v5 Configuration — DakkapellenKosten.nl
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await db.query.users.findFirst({
                    where: eq(schema.users.email, email.toLowerCase()),
                });

                if (!user) return null;

                const isValid = await compare(password, user.passwordHash);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        newUser: "/signup",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = (user as any).role;
            }
            // Always refresh role from DB to pick up role changes
            if (token.id) {
                try {
                    const dbUser = await db.query.users.findFirst({
                        where: eq(schema.users.id, token.id as string),
                        columns: { role: true, name: true },
                    });
                    if (dbUser) {
                        token.role = dbUser.role;
                        token.name = dbUser.name;
                    }
                } catch {
                    // Silently fall back to cached role
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                if (token.id) session.user.id = token.id as string;
                if (token.email) session.user.email = token.email as string;
                (session.user as any).role = token.role;
                (session.user as any).name = token.name;
            }
            return session;
        },
    },
});
