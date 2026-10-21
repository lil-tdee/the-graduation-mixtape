#!/usr/bin/env node
/**
 * Generate personalized invitation slugs and save the name map to src/guests.json.
 * Usage: node scripts/generate-links.mjs '$TREET POETS' 'Nguyễn Văn An'
 * Set SITE_URL to the deployed website URL before generating links.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const outputPath = resolve(root, 'src/guests.json');
const baseUrl = (process.env.SITE_URL || 'https://the-graduation-mixtape.vercel.app').replace(/\/+$/, '');
const names = process.argv.slice(2).map((name) => name.trim()).filter(Boolean);

if (!names.length) {
  console.error("Cách dùng: node scripts/generate-links.mjs '$TREET POETS' 'Nguyễn Văn An'");
  console.error('Có thể truyền nhiều tên trong cùng một lệnh.');
  process.exit(1);
}

function slugify(name) {
  return name.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (char) => char === 'đ' ? 'd' : 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Keep existing guests so adding a new batch won't erase earlier invitations.
let guests = {};
if (existsSync(outputPath)) {
  try { guests = JSON.parse(readFileSync(outputPath, 'utf8')); }
  catch { console.error('Không đọc được src/guests.json. Hãy kiểm tra file JSON.'); process.exit(1); }
}

const additions = [];
const seenInBatch = new Set();
for (const name of names) {
  const slug = slugify(name);
  if (!slug) {
    console.error(`Không tạo được slug hợp lệ cho tên: ${name}`);
    process.exitCode = 1;
    continue;
  }
  if (seenInBatch.has(slug)) {
    console.error(`Trùng slug trong danh sách hiện tại: ${slug}. Hãy phân biệt tên hoặc chỉnh slug thủ công.`);
    process.exit(1);
  }
  if (guests[slug] && guests[slug] !== name) {
    console.error(`XUNG ĐỘT SLUG: '${name}' và '${guests[slug]}' cùng tạo ra /${slug}. Không ghi đè dữ liệu.`);
    console.error('Hãy chọn slug riêng cho một người bằng cách chỉnh src/guests.json trước khi tạo link.');
    process.exit(1);
  }
  seenInBatch.add(slug);
  guests[slug] = name; // preserve exact spelling, capitalization, spaces and symbols
  additions.push({ name, slug });
}

if (process.exitCode) process.exit(process.exitCode);
writeFileSync(outputPath, JSON.stringify(guests, null, 2) + '\n', 'utf8');
console.log(`Đã cập nhật ${outputPath}`);
console.log('Link khách mời (tên hiển thị được giữ nguyên trong src/guests.json):\n');
for (const { name, slug } of additions) console.log(`${name}\n  ${baseUrl}/${slug}\n`);
if (baseUrl.includes('YOUR-PROJECT')) {
  console.log('LƯU Ý: SITE_URL chưa được đặt. Link trên là mẫu; hãy đặt SITE_URL thành domain Vercel thật.');
}
console.log('QUAN TRỌNG: Sau khi tạo khách mới, commit/push src/guests.json và deploy lại để link mới hoạt động trên website công khai.');
