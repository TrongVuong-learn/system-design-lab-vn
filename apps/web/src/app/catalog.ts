import data from '../generated/catalog.json';
import { lessonSchema, moduleSchema, reviewSchema } from '@sdl/content-schema';
export const lessons = data.lessons.map((l) => lessonSchema.parse(l));
export const modules = data.modules.map((m) => moduleSchema.parse(m));
export const levels = [
  {
    id: 'L0',
    name: 'Bắt đầu từ số 0',
    subtitle: 'Hiểu một lần bấm, một tin nhắn và một hàng chờ.',
    label: 'Nhập môn',
    number: '00',
    icon: 'book',
  },
  {
    id: 'L1',
    name: 'Thiết kế một dịch vụ',
    subtitle: 'Từ ý tưởng đến API, dữ liệu và những điều cần đúng.',
    label: 'Nền tảng',
    number: '01',
    icon: 'grid',
  },
  {
    id: 'L2',
    name: 'Khi nhiều người cùng dùng',
    subtitle: 'Chia tải, cache, queue và mở rộng hệ thống.',
    label: 'Mở rộng',
    number: '02',
    icon: 'chart',
  },
  {
    id: 'L3',
    name: 'Khi hệ thống ở nhiều nơi',
    subtitle: 'Bản sao, đồng thuận và tính đúng đắn khi có lỗi.',
    label: 'Phân tán',
    number: '03',
    icon: 'grid',
  },
  {
    id: 'L4',
    name: 'Đưa hệ thống vào thực tế',
    subtitle: 'Quan sát, bảo mật, khôi phục và kiểm soát chi phí.',
    label: 'Production',
    number: '04',
    icon: 'chart',
  },
  {
    id: 'L5',
    name: 'Nhìn toàn bộ kiến trúc',
    subtitle: 'Thiết kế, đánh đổi và tiến hóa theo nhu cầu.',
    label: 'Chuyên sâu',
    number: '05',
    icon: 'book',
  },
];
export const tracks = [
  'AI / ML Systems',
  'Data Engineering',
  'Search & Recommendation',
  'Realtime & Collaboration',
  'Media & Streaming',
  'Cloud & Platform',
  'Hệ thống nghiệp vụ',
];

export const editorial = data.editorial;

export const reviews = data.reviews.map((r) => reviewSchema.parse(r));
