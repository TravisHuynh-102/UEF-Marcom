import { createClient } from '@supabase/supabase-js';

// Cung cấp URL placeholder giả để khi Netlify chạy pre-render (SSG) không bị văng lỗi.
// Trong thực tế, bạn PHẢI cấu hình các biến này trong tab Environment Variables của Netlify.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
