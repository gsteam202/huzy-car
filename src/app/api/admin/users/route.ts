import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDefaultAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const role = searchParams.get("role")?.trim() || "ALL";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { nickname: { contains: q } },
    ];
  }
  if (role && role !== "ALL") {
    where.role = role;
  }

  const [totalCount, users, roleStats] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        avatarUrl: true,
        marketingConsent: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
          },
        },
        _count: {
          select: {
            favorites: true,
            savedRecommendations: true,
            posts: true,
            comments: true,
          },
        },
      },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "MODERATOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ]),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      users: users.map((u) => ({
        ...u,
        providers: u.accounts.map((a) => a.provider),
        isProtectedAdmin: isDefaultAdmin(u.email),
      })),
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        total: roleStats[0],
        user: roleStats[1],
        moderator: roleStats[2],
        admin: roleStats[3],
      },
    },
  });
}

export async function PATCH(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, role, nickname } = body;

    if (!userId) {
      return NextResponse.json({ error: "사용자 ID가 필요합니다." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "존재하지 않는 회원입니다." }, { status: 404 });
    }

    // Protect default admin from demotion
    if (isDefaultAdmin(targetUser.email) && role && role !== "ADMIN") {
      return NextResponse.json(
        { error: "기본 최고 관리자 계정의 권한은 변경할 수 없습니다." },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (role && ["USER", "MODERATOR", "ADMIN"].includes(role)) {
      dataToUpdate.role = role;
    }
    if (nickname && nickname.trim()) {
      dataToUpdate.nickname = nickname.trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        updatedAt: true,
      },
    });

    // Record audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: currentUser.id,
        action: "UPDATE_USER_ROLE",
        targetType: "USER",
        targetId: userId,
        detailsJson: {
          oldRole: targetUser.role,
          newRole: updatedUser.role,
          targetEmail: targetUser.email,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `${updatedUser.nickname}(${updatedUser.email}) 회원의 정보가 수정되었습니다.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "회원 수정 중 오류 발생" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "사용자 ID가 필요합니다." }, { status: 400 });
    }

    if (userId === currentUser.id) {
      return NextResponse.json({ error: "본인 계정은 삭제할 수 없습니다." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "존재하지 않는 회원입니다." }, { status: 404 });
    }

    if (isDefaultAdmin(targetUser.email)) {
      return NextResponse.json(
        { error: "기본 최고 관리자 계정은 삭제할 수 없습니다." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: userId } });

    // Record audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: currentUser.id,
        action: "DELETE_USER",
        targetType: "USER",
        targetId: userId,
        detailsJson: {
          deletedEmail: targetUser.email,
          deletedNickname: targetUser.nickname,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${targetUser.nickname}(${targetUser.email}) 계정이 정상 삭제되었습니다.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "회원 삭제 중 오류 발생" }, { status: 500 });
  }
}
