import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { verify } from "@node-rs/argon2";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: AuthOptions = {
  // We use JWT strategy for performance, low server overhead and seamless Server Components
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: false, // Strict security
          }),
        ]
      : []),
    CredentialsProvider({
      name: "이메일 로그인",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("유효하지 않은 이메일 형식 또는 비밀번호입니다.");
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("등록되지 않은 사용자이거나 비밀번호가 일치하지 않습니다.");
        }

        const isValid = await verify(user.passwordHash, parsed.data.password);
        if (!isValid) {
          throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nickname,
          image: user.avatarUrl,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const normalizedEmail = user.email.toLowerCase().trim();

        // Find or create user
        let existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { accounts: true },
        });

        if (!existingUser) {
          // Generate a clean unique nickname from name or email prefix
          const baseName = (user.name || normalizedEmail.split("@")[0] || "사용자").slice(0, 20);
          let candidate = baseName;
          let counter = 1;
          while (await prisma.user.findUnique({ where: { nickname: candidate } })) {
            candidate = `${baseName}${counter++}`;
          }

          existingUser = await prisma.user.create({
            data: {
              email: normalizedEmail,
              nickname: candidate,
              avatarUrl: user.image,
              role: "USER",
              marketingConsent: false,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                  scope: account.scope,
                  token_type: account.token_type,
                },
              },
            },
            include: { accounts: true },
          });
        } else {
          // Check if Google account already linked
          const hasGoogle = existingUser.accounts.some(
            (a) => a.provider === "google" && a.providerAccountId === account.providerAccountId
          );
          if (!hasGoogle) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                scope: account.scope,
                token_type: account.token_type,
              },
            });
          }
        }
        user.id = existingUser.id;
        (user as any).role = existingUser.role;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.name = user.name;
        token.email = user.email;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.role) token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as
    | {
        id: string;
        email: string;
        name: string;
        image?: string | null;
        role: "USER" | "MODERATOR" | "ADMIN";
      }
    | undefined;
}
