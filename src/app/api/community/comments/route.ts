import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const createCommentSchema = z.object({
  postId: z.string(),
  parentId: z.string().optional(),
  content: z.string().min(1).max(2000),
});

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
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "댓글 내용을 확인해주세요." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId: parsed.data.postId,
        parentId: parsed.data.parentId,
        authorId: user.id,
        content: parsed.data.content,
      },
      include: {
        author: {
          select: { id: true, nickname: true, avatarUrl: true },
        },
      },
    });

    await prisma.post.update({
      where: { id: parsed.data.postId },
      data: { commentCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "댓글 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
