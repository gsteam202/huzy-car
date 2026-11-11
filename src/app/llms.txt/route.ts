export function GET() {
  return new Response(`# Huzy Car (휴지카)

Huzy Car는 국산차 및 수입차의 신차 제원, 중고차 실거래 시세, 취등록세 및 자동차세 계산기, 유류비 및 유지비 비교 시뮬레이션을 제공하는 스마트 자동차 포털입니다.

## 주요 기능
- 국산차·수입차 브랜드별·모델별 신차 가격표 및 상세 제원 비교
- 연식별·주행거리별 중고차 실거래 감가 시세 트렌드 분석
- 취득세, 공채 매입비, 탁송료 등 자동차 구입 부대비용 정밀 계산기
- 배기량 및 차종별 연간 자동차세 및 교육세 계산기
- 유류비, 자동차 보험료, 정비 비용을 포함한 연간 총 소유비용(TCO) 계산

## 공식 URL
- 홈: https://car.huzy.net/
- 계산기: https://car.huzy.net/calculator
- 신차 정보: https://car.huzy.net/new-cars
- 중고차 시세: https://car.huzy.net/used-cars
- 사이트맵: https://car.huzy.net/sitemap.xml
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
