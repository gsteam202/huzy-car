import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const createPostSchema = z.object({
  boardSlug: z.string(),
  title: z.string().min(2).max(200),
  content: z.string().min(5).max(10000),
  images: z.array(z.string().url()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const boardSlug = searchParams.get("board");
    const query = searchParams.get("q");
    const sort = searchParams.get("sort") || "latest"; // latest, popular
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(30, Math.max(1, Number(searchParams.get("limit") || 15)));

    const where: any = {};
    if (boardSlug) {
      where.board = { slug: boardSlug };
    }
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { content: { contains: query } },
      ];
    }

    const orderBy: any =
      sort === "popular"
        ? [{ likeCount: "desc" }, { createdAt: "desc" }]
        : [{ isPinned: "desc" }, { createdAt: "desc" }];

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          board: true,
          author: {
            select: { id: true, nickname: true, avatarUrl: true, role: true },
          },
          images: { take: 1 },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "게시글 목록을 불러오지 못했습니다." },
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
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "입력값 검증 실패", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const board = await prisma.board.findUnique({
      where: { slug: parsed.data.boardSlug },
    });
    if (!board) {
      return NextResponse.json(
        { success: false, error: "존재하지 않는 게시판입니다." },
        { status: 404 }
      );
    }

    const post = await prisma.post.create({
      data: {
        boardId: board.id,
        authorId: user.id,
        title: parsed.data.title,
        content: parsed.data.content,
        images: parsed.data.images
          ? {
              create: parsed.data.images.map((img, idx) => ({
                imageUrl: img,
                orderIndex: idx,
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: { id: true, nickname: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "게시글 작성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
