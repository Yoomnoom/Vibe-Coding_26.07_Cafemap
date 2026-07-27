import * as XLSX from 'xlsx'

// 첫 줄이 "이름", "주소", "카테고리" 헤더인 엑셀을 읽어
// { name, address, category } 배열로 변환한다.
export async function parseCafeExcelFile(file) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  return rows
    .map((row) => ({
      name: String(row['이름'] ?? '').trim(),
      address: String(row['주소'] ?? '').trim(),
      category: String(row['카테고리'] ?? '').trim(),
    }))
    .filter((row) => row.name && row.address)
}
