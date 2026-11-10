"use client";

import { useState, useEffect } from "react";
import {
  Car,
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag,
} from "lucide-react";

interface CarItem {
  id: string;
  brandId: string;
  brandNameKo: string;
  brandNameEn: string;
  brandSlug: string;
  nameKo: string;
  nameEn: string;
  slug: string;
  vehicleType: string;
  releaseYear: number;
  minPrice: number;
  maxPrice: number;
  imageUrl: string | null;
  isDiscontinued: boolean;
  trimCount: number;
  usedCarCount: number;
  trims: Array<{
    id: string;
    nameKo: string;
    price: number;
    fuelType: string;
    maxPower: number | null;
  }>;
}

interface BrandItem {
  id: string;
  nameKo: string;
  nameEn: string;
  slug: string;
}

export function CarManager() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [stats, setStats] = useState({ totalModels: 0, totalTrims: 0, totalBrands: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [expandedCarId, setExpandedCarId] = useState<string | null>(null);

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    brandId: "",
    nameKo: "",
    nameEn: "",
    slug: "",
    vehicleType: "SEDAN",
    releaseYear: 2024,
    minPrice: 30000000,
    maxPrice: 45000000,
    imageUrl: "",
  });

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarItem | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        brandId: selectedBrand,
        vehicleType: selectedType,
        q: searchQuery,
      });
      const res = await fetch(`/api/admin/cars?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCars(json.data.cars);
        setBrands(json.data.brands);
        setTotalPages(json.data.pagination.totalPages || 1);
        if (json.data.stats) {
          setStats(json.data.stats);
        }
      }
    } catch (e: any) {
      setMessage({ text: "차량 목록 조회 실패: " + e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [page, selectedBrand, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCars();
  };

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: json.message, type: "success" });
        setCreateModalOpen(false);
        setCreateForm({
          brandId: "",
          nameKo: "",
          nameEn: "",
          slug: "",
          vehicleType: "SEDAN",
          releaseYear: 2024,
          minPrice: 30000000,
          maxPrice: 45000000,
          imageUrl: "",
        });
        fetchCars();
      } else {
        setMessage({ text: json.error || "차량 등록 실패", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "오류: " + e.message, type: "error" });
    }
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    setMessage(null);
    try {
      const res = await fetch("/api/admin/cars", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: editingCar.id,
          nameKo: editingCar.nameKo,
          nameEn: editingCar.nameEn,
          vehicleType: editingCar.vehicleType,
          releaseYear: editingCar.releaseYear,
          minPrice: editingCar.minPrice,
          maxPrice: editingCar.maxPrice,
          isDiscontinued: editingCar.isDiscontinued,
          imageUrl: editingCar.imageUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: json.message, type: "success" });
        setEditModalOpen(false);
        setEditingCar(null);
        fetchCars();
      } else {
        setMessage({ text: json.error || "수정 실패", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "오류: " + e.message, type: "error" });
    }
  };

  const handleDeleteCar = async (car: CarItem) => {
    if (!confirm(`정말로 ${car.brandNameKo} ${car.nameKo} 모델을 삭제하시겠습니까? 연결된 트림 정보도 함께 삭제됩니다.`)) {
      return;
    }
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/cars?modelId=${car.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: json.message, type: "success" });
        fetchCars();
      } else {
        setMessage({ text: json.error || "삭제 실패", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "오류: " + e.message, type: "error" });
    }
  };

  const formatPrice = (p: number) => {
    if (!p) return "가격 미정";
    const man = Math.round(p / 10000);
    return `${man.toLocaleString()}만원`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">등록 모델수</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalModels}개</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">등록 트림수</span>
            <div className="text-2xl font-black text-indigo-600 mt-0.5">{stats.totalTrims}개</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">제조사 브랜드</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{stats.totalBrands}개</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">전체 제조사</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nameKo} ({b.nameEn})
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">전체 차종</option>
            <option value="SEDAN">세단 (SEDAN)</option>
            <option value="SUV">SUV</option>
            <option value="RV">RV / 미니밴</option>
            <option value="COMPACT">경차 / 소형</option>
            <option value="HATCHBACK">해치백</option>
            <option value="COUPE">쿠페 / 스포츠카</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="모델명, 브랜드 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          {/* New Car Button */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>차량 신규 등록</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 3. Car Models Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="py-3 px-4">차량 모델 정보</th>
                <th className="py-3 px-4">차종 / 연식</th>
                <th className="py-3 px-4">신차 가격 범위</th>
                <th className="py-3 px-4">트림 정보</th>
                <th className="py-3 px-4">상태</th>
                <th className="py-3 px-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-300" />
                    차량 데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    조회된 차량 모델이 없습니다.
                  </td>
                </tr>
              ) : (
                cars.map((car) => {
                  const isExpanded = expandedCarId === car.id;
                  return (
                    <tr key={car.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Car Thumbnail & Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-11 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                            {car.imageUrl ? (
                              <img
                                src={car.imageUrl}
                                alt={car.nameKo}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Car className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 block">
                              {car.brandNameKo} ({car.brandNameEn})
                            </span>
                            <span className="font-bold text-slate-900 text-sm block">
                              {car.nameKo}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              /{car.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle Type & Year */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 inline-block mb-1">
                          {car.vehicleType}
                        </span>
                        <div className="text-[11px] text-slate-500 font-semibold">
                          {car.releaseYear}년형
                        </div>
                      </td>

                      {/* Price Range */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 text-xs">
                          {formatPrice(car.minPrice)}
                          {car.maxPrice > car.minPrice && ` ~ ${formatPrice(car.maxPrice)}`}
                        </div>
                      </td>

                      {/* Trims Summary */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setExpandedCarId(isExpanded ? null : car.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        >
                          <span>{car.trimCount}개 트림</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {car.isDiscontinued ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-600">
                            단종
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                            판매중
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingCar(car);
                              setEditModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="차량 정보 수정"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="차량 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              페이지 {page} / {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors font-bold"
              >
                이전
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors font-bold"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Car Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                <span>신규 차량 모델 등록</span>
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCar} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">제조사 브랜드 *</label>
                <select
                  required
                  value={createForm.brandId}
                  onChange={(e) => setCreateForm({ ...createForm, brandId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="">브랜드 선택</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameKo} ({b.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">모델명 (한글) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 디 올 뉴 싼타페"
                    value={createForm.nameKo}
                    onChange={(e) => setCreateForm({ ...createForm, nameKo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">모델명 (영문) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: SANTA FE"
                    value={createForm.nameEn}
                    onChange={(e) => setCreateForm({ ...createForm, nameEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">고유 슬러그 (URL 식별자) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: santa-fe-mx5"
                    value={createForm.slug}
                    onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value.toLowerCase().trim() })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">차종 분류 *</label>
                  <select
                    value={createForm.vehicleType}
                    onChange={(e) => setCreateForm({ ...createForm, vehicleType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="SEDAN">세단 (SEDAN)</option>
                    <option value="SUV">SUV</option>
                    <option value="RV">RV / 미니밴</option>
                    <option value="COMPACT">경차 / 소형</option>
                    <option value="HATCHBACK">해치백</option>
                    <option value="COUPE">쿠페 / 스포츠카</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">출시연도</label>
                  <input
                    type="number"
                    value={createForm.releaseYear}
                    onChange={(e) => setCreateForm({ ...createForm, releaseYear: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">최저 가격(원)</label>
                  <input
                    type="number"
                    step={100000}
                    value={createForm.minPrice}
                    onChange={(e) => setCreateForm({ ...createForm, minPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">최고 가격(원)</label>
                  <input
                    type="number"
                    step={100000}
                    value={createForm.maxPrice}
                    onChange={(e) => setCreateForm({ ...createForm, maxPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">대표 차량 이미지 URL</label>
                <input
                  type="url"
                  placeholder="https://... 또는 /images/cars/santafe.jpg"
                  value={createForm.imageUrl}
                  onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  차량 모델 등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {editModalOpen && editingCar && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <span>{editingCar.brandNameKo} {editingCar.nameKo} 수정</span>
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCar} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">모델명 (한글)</label>
                  <input
                    type="text"
                    required
                    value={editingCar.nameKo}
                    onChange={(e) => setEditingCar({ ...editingCar, nameKo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">모델명 (영문)</label>
                  <input
                    type="text"
                    required
                    value={editingCar.nameEn}
                    onChange={(e) => setEditingCar({ ...editingCar, nameEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">차종 분류</label>
                  <select
                    value={editingCar.vehicleType}
                    onChange={(e) => setEditingCar({ ...editingCar, vehicleType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="SEDAN">세단 (SEDAN)</option>
                    <option value="SUV">SUV</option>
                    <option value="RV">RV / 미니밴</option>
                    <option value="COMPACT">경차 / 소형</option>
                    <option value="HATCHBACK">해치백</option>
                    <option value="COUPE">쿠페 / 스포츠카</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">출시연도</label>
                  <input
                    type="number"
                    value={editingCar.releaseYear}
                    onChange={(e) => setEditingCar({ ...editingCar, releaseYear: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">최저 가격 (원)</label>
                  <input
                    type="number"
                    step={100000}
                    value={editingCar.minPrice}
                    onChange={(e) => setEditingCar({ ...editingCar, minPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">최고 가격 (원)</label>
                  <input
                    type="number"
                    step={100000}
                    value={editingCar.maxPrice}
                    onChange={(e) => setEditingCar({ ...editingCar, maxPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">대표 차량 이미지 URL</label>
                <input
                  type="text"
                  value={editingCar.imageUrl || ""}
                  onChange={(e) => setEditingCar({ ...editingCar, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingCar.isDiscontinued}
                    onChange={(e) => setEditingCar({ ...editingCar, isDiscontinued: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-800">단종된 차량으로 표시</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  수정 사항 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
