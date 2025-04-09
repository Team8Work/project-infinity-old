import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

async function testConnection() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    console.log('Testing Supabase connection...');
    
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      throw new Error(`Auth test failed: ${authError.message}`);
    }
    console.log('✅ Auth connection successful');

    // Test database
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (dbError) {
      throw new Error(`Database test failed: ${dbError.message}`);
    }
    console.log('✅ Database connection successful');
    console.log('First user (if any):', dbData);

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection(); 