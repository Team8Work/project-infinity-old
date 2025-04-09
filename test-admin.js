import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

async function createAdminAndTest() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    console.log('Creating admin user...');
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@logitrack.com',
      password: 'Admin123!@#',
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    console.log('✅ Auth user created');

    // 2. Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username: 'admin',
        email: 'admin@logitrack.com',
        full_name: 'System Administrator',
        role: 'admin',
        company: 'LogiTrack'
      })
      .select()
      .single();

    if (userError) throw userError;

    console.log('✅ Admin profile created:', userData);

    // 3. Test table creation by checking table structure
    const tables = ['users', 'shipments', 'tasks', 'payments', 'damages', 'complaints'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.error(`❌ Error accessing ${table} table:`, error.message);
      } else {
        console.log(`✅ ${table} table exists and is accessible`);
      }
    }

    console.log('\nAdmin credentials:');
    console.log('Email:', 'admin@logitrack.com');
    console.log('Password:', 'Admin123!@#');
    console.log('\nPlease save these credentials!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminAndTest(); 