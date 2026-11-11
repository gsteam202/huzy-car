import { prisma } from "@/lib/db";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const dynamic = "force-dynamic";

export async function GET() {
  const base = "https://car.huzy.net";
  try {
    const [models, posts] = await Promise.all([
      prisma.carModel.findMany({
        take: 30,
        orderBy: { updatedAt: "desc" },
        include: { brand: true },
      }),
      prisma.post.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { board: true },
      }),
    ]);

    const modelItems = models.map((m) => {
      const url = `${base}/new-cars/${m.brand.slug}/${m.slug}`;
      const title = `[${m.brand.nameKo}] ${m.nameKo} 신차 가격표 및 상세 사양`;
      const desc = `${m.brand.nameKo} ${m.nameKo}의 공식 출고가, 트림별 옵션 가격, 복합 연비 및 월 예상 할부금 비교 정보입니다.`;
      const pubDate = m.updatedAt ? new Date(m.updatedAt).toUTCString() : new Date().toUTCString();
      return `<item>
    <title>${escapeXml(title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(desc)}</description>
    <category>${escapeXml(m.brand.nameKo)}</category>
    <pubDate>${pubDate}</pubDate>
  </item>`;
    });

    const postItems = posts.map((p) => {
      const url = `${base}/community/${p.id}`;
      const title = `[${p.board.name}] ${p.title}`;
      const desc = escapeXml(p.content.slice(0, 200));
      const pubDate = new Date(p.createdAt).toUTCString();
      return `<item>
    <title>${escapeXml(title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${desc}</description>
    <category>${escapeXml(p.board.name)}</category>
    <pubDate>${pubDate}</pubDate>
  </item>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CAR HUZY | 대한민국 신차·중고차 가격 비교 &amp; 견적 RSS</title>
    <link>${base}</link>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
    <description>국산 및 수입 신차 공식 가격표, 트림별 옵션 시세 및 자동차 커뮤니티 최신 업데이트 RSS 피드</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${[...modelItems, ...postItems].join("\n")}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new Response("Error generating RSS", { status: 500 });
  }
}
