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

export const DEFAULT_ADMIN_EMAILS = [
  "didwlajfl8418@gmail.com",
  ...(process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL.toLowerCase().trim()] : []),
];

export function isDefaultAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return DEFAULT_ADMIN_EMAILS.some((admin) => admin.toLowerCase().trim() === normalized);
}

function resolveProviderFactory<T = any>(mod: any): T {
  const resolved = mod?.default?.default || mod?.default || mod;
  return typeof resolved === "function" ? resolved : mod;
}

const buildGoogleProvider = resolveProviderFactory(GoogleProvider);
const buildCredentialsProvider = resolveProviderFactory(CredentialsProvider);

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
          buildGoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    buildCredentialsProvider({
      name: "이메일 로그인",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
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

        const isAdmin = isDefaultAdmin(user.email);
        if (isAdmin && user.role !== "ADMIN") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
          user.role = "ADMIN";
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nickname,
          image: user.avatarUrl,
          role: isAdmin ? "ADMIN" : user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const normalizedEmail = user.email.toLowerCase().trim();
        const isAdmin = isDefaultAdmin(normalizedEmail);

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
              role: isAdmin ? "ADMIN" : "USER",
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
          // If default admin, always guarantee role is ADMIN in DB
          if (isAdmin && existingUser.role !== "ADMIN") {
            existingUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: { role: "ADMIN" },
              include: { accounts: true },
            });
          }

          // Sync avatar if user image provided
          if (user.image && user.image !== existingUser.avatarUrl) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { avatarUrl: user.image },
            });
          }

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
        (user as any).role = isAdmin ? "ADMIN" : existingUser.role;
        user.name = existingUser.nickname || user.name;
        user.image = existingUser.avatarUrl || user.image;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        const normalizedEmail = (user.email || "").toLowerCase().trim();
        token.role = isDefaultAdmin(normalizedEmail) ? "ADMIN" : (user as any).role || "USER";
      }
      const tokenEmail = ((token.email as string) || "").toLowerCase().trim();
      if (isDefaultAdmin(tokenEmail)) {
        token.role = "ADMIN";
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.role) token.role = isDefaultAdmin(tokenEmail) ? "ADMIN" : session.role;
        if (session.image) token.image = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        const id = typeof token.id === "string" ? token.id : token.sub;
        const current = id ? await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } }) : null;
        if (!current) { session.user = undefined as unknown as typeof session.user; return session; }
        const tokenEmail = ((token.email as string) || session.user.email || "").toLowerCase().trim();
        const role = current.role;
        (session.user as any).id = token.id as string;
        (session.user as any).role = role;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = (token.image as string) || session.user.image;
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
