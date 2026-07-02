import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

async function main() {
  try {
    console.log('Bắt đầu gửi yêu cầu lên OpenAI...');
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: 'Bạn là một trợ lý ngắn gọn.',
      prompt: 'Xin chào, bạn có hoạt động bình thường không? Hãy trả lời ngắn gọn trong 1 câu.',
    });
    console.log('\n✅ [Kết quả từ ChatGPT]:', text);
    console.log('\n🎉 Test kết nối API thành công!');
  } catch (error) {
    console.error('❌ Lỗi kết nối API:', error.message || error);
  }
}

main();
