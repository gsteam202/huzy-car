import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const favoriteSchema = z.object({
  carType: z.enum(["NEW", "USED"]),
  newTrimId: z.string().optional(),
  usedListingId: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const favorites = await prisma.favoriteCar.findMany({
      where: { userId: user.id },
      include: {
        newTrim: {
          include: {
            modelYear: {
              include: {
                generation: {
                  include: {
                    model: {
                      include: { brand: true },
                    },
                  },
                },
              },
            },
          },
        },
        usedListing: {
          include: {
            brand: true,
            model: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "관심차량 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = favoriteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    const { carType, newTrimId, usedListingId } = parsed.data;

    // Check if already favorited
    const existing = await prisma.favoriteCar.findFirst({
      where: {
        userId: user.id,
        carType,
        newTrimId: newTrimId || null,
        usedListingId: usedListingId || null,
      },
    });

    if (existing) {
      // Toggle remove
      await prisma.favoriteCar.delete({ where: { id: existing.id } });
      return NextResponse.json({
        success: true,
        action: "REMOVED",
      });
    }

    const created = await prisma.favoriteCar.create({
      data: {
        userId: user.id,
        carType,
        newTrimId: newTrimId || null,
        usedListingId: usedListingId || null,
      },
    });

    return NextResponse.json({
      success: true,
      action: "ADDED",
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "관심차량 설정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
