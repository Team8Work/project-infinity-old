import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

async function createEmployeeAndTest() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    console.log('Creating employee user...');
    
    // 1. Create auth user with a different email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'employee2@logitrack.com',
      password: 'Employee123!@#',
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    console.log('✅ Auth user created');

    // 2. Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username: 'employee2',
        email: 'employee2@logitrack.com',
        full_name: 'Test Employee 2',
        role: 'employee',
        company: 'LogiTrack'
      })
      .select()
      .single();

    if (userError) throw userError;

    console.log('✅ Employee profile created:', userData);

    // 3. Test table access
    const tables = ['users', 'shipments', 'tasks', 'payments', 'damages', 'complaints'];
    
    console.log('\nTesting table access:');
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

    console.log('\nEmployee credentials:');
    console.log('Email:', 'employee2@logitrack.com');
    console.log('Password:', 'Employee123!@#');
    console.log('\nPlease save these credentials!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createEmployeeAndTest(); 