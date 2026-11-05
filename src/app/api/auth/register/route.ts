import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "@node-rs/argon2";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .regex(/[0-9]/, "비밀번호에 숫자가 1개 이상 포함되어야 합니다.")
    .regex(/[^a-zA-Z0-9]/, "비밀번호에 특수문자가 1개 이상 포함되어야 합니다."),
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(20, "닉네임은 20자 이하여야 합니다.")
    .regex(/^[가-힣a-zA-Z0-9_-]+$/, "닉네임은 한글, 영문, 숫자, 밑줄, 대시만 사용 가능합니다."),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "이용약관 동의가 필요합니다." }),
  }),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: "개인정보 수집 및 이용 동의가 필요합니다." }),
  }),
  marketingConsent: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message || "입력값을 다시 확인해주세요.",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, password, nickname, marketingConsent } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check email uniqueness
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "이미 가입된 이메일 주소입니다." },
        { status: 409 }
      );
    }

    // Check nickname uniqueness
    const existingNickname = await prisma.user.findUnique({
      where: { nickname: nickname.trim() },
    });
    if (existingNickname) {
      return NextResponse.json(
        { success: false, error: "이미 사용 중인 닉네임입니다." },
        { status: 409 }
      );
    }

    // Argon2id hashing
    const passwordHash = await hash(password);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        nickname: nickname.trim(),
        role: "USER",
        marketingConsent: Boolean(marketingConsent),
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "회원가입이 성공적으로 완료되었습니다.",
      data: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
