import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

async function main() {
  try {
    console.log('Bắt đầu gửi yêu cầu lên Gemini...');
    const { text } = await generateText({
      model: google('gemini-flash-latest'),
      prompt: 'Xin chào, bạn có hoạt động bình thường không? Hãy trả lời ngắn gọn trong 1 câu.',
    });
    console.log('\n✅ [Kết quả từ Gemini]:', text);
    console.log('\n🎉 Test kết nối API thành công!');
  } catch (error) {
    console.error('❌ Lỗi kết nối API:', error.message || error);
  }
}

main();
