import { google } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';

// Thiết lập thời gian tối đa cho API (30s)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    console.log('--- STARTING CHAT REQUEST ---');

    let coreMessages: CoreMessage[] = [...messages];

    // Check if there is attachment data from the client
    if (data && data.length > 0) {
      const attachmentData = data.find((d: any) => d && d.attachment)?.attachment;
      if (attachmentData) {
        const { url, type } = attachmentData;
        
        // Find the last user message to attach the file to
        const lastUserMessageIndex = coreMessages.map(m => m.role).lastIndexOf('user');
        
        if (lastUserMessageIndex !== -1) {
          const lastMessage = coreMessages[lastUserMessageIndex];
          
          // url is a data URI: "data:image/png;base64,iVBORw..."
          // Extract the base64 part
          const base64Data = url.split(',')[1];
          
          if (type.startsWith('image/')) {
            coreMessages[lastUserMessageIndex] = {
              role: 'user',
              content: [
                { type: 'text', text: typeof lastMessage.content === 'string' ? lastMessage.content : '' },
                { type: 'image', image: base64Data }
              ]
            };
          } else if (type.startsWith('audio/')) {
             coreMessages[lastUserMessageIndex] = {
              role: 'user',
              content: [
                { type: 'text', text: typeof lastMessage.content === 'string' ? lastMessage.content : '' },
                { type: 'file', data: base64Data, mimeType: type }
              ]
            };
          }
        }
      }
    }

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: `Bạn là một 'AI Chief of Staff' (Giám đốc Vận hành AI) siêu việt, làm việc trong nền tảng quản lý dự án nội bộ.
Bạn là cánh tay phải đắc lực của người dùng, hỗ trợ họ theo dõi dự án, tối ưu hóa công việc, báo cáo tiến độ và giảm thiểu rủi ro.
Hãy xưng hô chuyên nghiệp, thân thiện. 
Dùng văn bản Markdown (định dạng in đậm, danh sách gạch đầu dòng, emoji) để làm nổi bật thông tin quan trọng.
Trả lời ngắn gọn, đi thẳng vào vấn đề và luôn đưa ra các đề xuất hành động cụ thể (Actionable recommendations).`,
      messages: coreMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Error processing chat', { status: 500 });
  }
}
