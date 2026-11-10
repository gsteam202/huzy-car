import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const brandId = searchParams.get("brandId")?.trim() || "";
  const vehicleType = searchParams.get("vehicleType")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "15", 10)));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (q) {
    where.OR = [
      { nameKo: { contains: q } },
      { nameEn: { contains: q } },
      { slug: { contains: q } },
      { brand: { nameKo: { contains: q } } },
    ];
  }
  if (brandId && brandId !== "ALL") {
    where.brandId = brandId;
  }
  if (vehicleType && vehicleType !== "ALL") {
    where.vehicleType = vehicleType;
  }

  const [totalCount, cars, brands, stats] = await Promise.all([
    prisma.carModel.count({ where }),
    prisma.carModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ brand: { nameKo: "asc" } }, { nameKo: "asc" }],
      include: {
        brand: {
          select: {
            id: true,
            nameKo: true,
            nameEn: true,
            slug: true,
            logoUrl: true,
            country: true,
          },
        },
        generations: {
          include: {
            modelYears: {
              include: {
                trims: {
                  select: {
                    id: true,
                    nameKo: true,
                    price: true,
                    fuelType: true,
                    maxPower: true,
                    fuelEfficiencyCombined: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            usedCars: true,
          },
        },
      },
    }),
    prisma.carBrand.findMany({
      orderBy: { orderIndex: "asc" },
      select: { id: true, nameKo: true, nameEn: true, slug: true },
    }),
    Promise.all([
      prisma.carModel.count(),
      prisma.carTrim.count(),
      prisma.carBrand.count(),
    ]),
  ]);

  // Flatten trims per car model
  const formattedCars = cars.map((car) => {
    const allTrims = car.generations.flatMap((g) =>
      g.modelYears.flatMap((my) => my.trims)
    );
    return {
      id: car.id,
      brandId: car.brandId,
      brandNameKo: car.brand.nameKo,
      brandNameEn: car.brand.nameEn,
      brandSlug: car.brand.slug,
      nameKo: car.nameKo,
      nameEn: car.nameEn,
      slug: car.slug,
      vehicleType: car.vehicleType,
      releaseYear: car.releaseYear,
      minPrice: car.minPrice,
      maxPrice: car.maxPrice,
      imageUrl: car.imageUrl,
      isDiscontinued: car.isDiscontinued,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
      trimCount: allTrims.length,
      usedCarCount: car._count.usedCars,
      trims: allTrims,
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      cars: formattedCars,
      brands,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        totalModels: stats[0],
        totalTrims: stats[1],
        totalBrands: stats[2],
      },
    },
  });
}

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      brandId,
      nameKo,
      nameEn,
      slug,
      vehicleType = "SEDAN",
      releaseYear = new Date().getFullYear(),
      minPrice = 0,
      maxPrice = 0,
      imageUrl,
    } = body;

    if (!brandId || !nameKo || !nameEn || !slug) {
      return NextResponse.json(
        { error: "브랜드, 모델명(한글/영문), 고유 슬러그(slug)는 필수입니다." },
        { status: 400 }
      );
    }

    const existing = await prisma.carModel.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `이미 존재하는 슬러그('${slug}')입니다. 다른 슬러그를 사용해주세요.` },
        { status: 400 }
      );
    }

    const car = await prisma.carModel.create({
      data: {
        brandId,
        nameKo,
        nameEn,
        slug,
        vehicleType,
        releaseYear: Number(releaseYear),
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        imageUrl: imageUrl || null,
        generations: {
          create: {
            nameKo: `${nameKo} 1세대`,
            startYear: Number(releaseYear),
            modelYears: {
              create: {
                year: Number(releaseYear),
                basePrice: Number(minPrice),
                trims: {
                  create: {
                    nameKo: "기본 트림",
                    price: Number(minPrice),
                    fuelType: "GASOLINE",
                  },
                },
              },
            },
          },
        },
      },
      include: { brand: true },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: currentUser.id,
        action: "CREATE_CAR_MODEL",
        targetType: "CAR_MODEL",
        targetId: car.id,
        detailsJson: { nameKo: car.nameKo, brand: car.brand.nameKo, price: car.minPrice },
      },
    });

    return NextResponse.json({
      success: true,
      data: car,
      message: `${car.brand.nameKo} ${car.nameKo} 모델이 성공적으로 등록되었습니다.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "차량 등록 오류" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { modelId, nameKo, nameEn, vehicleType, releaseYear, minPrice, maxPrice, isDiscontinued, imageUrl } = body;

    if (!modelId) {
      return NextResponse.json({ error: "모델 ID가 필요합니다." }, { status: 400 });
    }

    const updateData: any = {};
    if (nameKo) updateData.nameKo = nameKo;
    if (nameEn) updateData.nameEn = nameEn;
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (releaseYear !== undefined) updateData.releaseYear = Number(releaseYear);
    if (minPrice !== undefined) updateData.minPrice = Number(minPrice);
    if (maxPrice !== undefined) updateData.maxPrice = Number(maxPrice);
    if (isDiscontinued !== undefined) updateData.isDiscontinued = Boolean(isDiscontinued);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updated = await prisma.carModel.update({
      where: { id: modelId },
      data: updateData,
      include: { brand: true },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: currentUser.id,
        action: "UPDATE_CAR_MODEL",
        targetType: "CAR_MODEL",
        targetId: modelId,
        detailsJson: updateData,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `${updated.brand.nameKo} ${updated.nameKo} 정보가 수정되었습니다.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "차량 수정 오류" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const modelId = searchParams.get("modelId");

    if (!modelId) {
      return NextResponse.json({ error: "모델 ID가 필요합니다." }, { status: 400 });
    }

    const targetCar = await prisma.carModel.findUnique({
      where: { id: modelId },
      include: { brand: true },
    });
    if (!targetCar) {
      return NextResponse.json({ error: "존재하지 않는 차량 모델입니다." }, { status: 404 });
    }

    await prisma.carModel.delete({ where: { id: modelId } });

    await prisma.adminAuditLog.create({
      data: {
        adminId: currentUser.id,
        action: "DELETE_CAR_MODEL",
        targetType: "CAR_MODEL",
        targetId: modelId,
        detailsJson: { deletedName: targetCar.nameKo, brand: targetCar.brand.nameKo },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${targetCar.brand.nameKo} ${targetCar.nameKo} 모델이 삭제되었습니다.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "차량 삭제 오류" }, { status: 500 });
  }
}
