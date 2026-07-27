import * as XLSX from 'xlsx'

const rows = [
  { 이름: '시청 앞 커피', 주소: '서울 중구 태평로1가 31', 카테고리: '커피' },
  { 이름: '정동길 베이커리 카페', 주소: '서울 중구 정동길 30', 카테고리: '디저트' },
  { 이름: '을지로 브루잉', 주소: '서울 중구 을지로 20', 카테고리: '커피' },
  { 이름: '덕수궁 옆 브런치', 주소: '서울 중구 세종대로 99', 카테고리: '브런치' },
  { 이름: '있을 리 없는 카페', 주소: '지구 어딘가 상상의 거리 999-9', 카테고리: '커피' },
]

const worksheet = XLSX.utils.json_to_sheet(rows)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'cafes')
XLSX.writeFile(workbook, process.argv[2])
