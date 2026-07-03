import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Thiết lập thời gian tối đa cho API (30s)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `Bạn là một 'AI Chief of Staff' (Giám đốc Vận hành AI) siêu việt, làm việc trong nền tảng quản lý dự án nội bộ.
Bạn là cánh tay phải đắc lực của người dùng, hỗ trợ họ theo dõi dự án, tối ưu hóa công việc, báo cáo tiến độ và giảm thiểu rủi ro.
Hãy xưng hô chuyên nghiệp, thân thiện. 
Dùng văn bản Markdown (định dạng in đậm, danh sách gạch đầu dòng, emoji) để làm nổi bật thông tin quan trọng.
Trả lời ngắn gọn, đi thẳng vào vấn đề và luôn đưa ra các đề xuất hành động cụ thể (Actionable recommendations).`,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Error processing chat', { status: 500 });
  }
}
