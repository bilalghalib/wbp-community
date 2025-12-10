#!/usr/bin/env node

/**
 * Test script to verify Supabase admin client configuration
 * 
 * Run with: node scripts/test-admin-client.js
 * 
 * This script reads from .env.local file directly
 */

const fs = require('fs')
const path = require('path')

// Load .env.local manually
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}

  envContent.split('\n').forEach((line) => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        // Remove quotes if present
        envVars[key.trim()] = value.replace(/^["']|["']$/g, '')
      }
    }
  })

  // Set environment variables
  Object.assign(process.env, envVars)
}

loadEnvFile()

const { createClient } = require('@supabase/supabase-js')

async function testAdminClient() {
  console.log('🔍 Testing Supabase Admin Client Configuration\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('📋 Environment Variables:')
  console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.log(`  SUPABASE_SECRET_KEY: ${secretKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅ Set (legacy)' : '⚠️  Not set (using new format)'}`)
  console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '✅ Set' : '❌ Missing'}`)
  console.log('')

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local')
    process.exit(1)
  }

  // Use secret key (new format) or service role key (legacy)
  const adminKey = secretKey || serviceRoleKey

  if (!adminKey) {
    console.error('❌ Neither SUPABASE_SECRET_KEY nor SUPABASE_SERVICE_ROLE_KEY is set in .env.local')
    console.error('   Please add SUPABASE_SECRET_KEY to your .env.local file')
    console.error('   Get it from: Supabase Dashboard → Settings → API → Secret key')
    process.exit(1)
  }

  // Validate key format
  console.log('🔑 Key Format Validation:')
  if (adminKey.startsWith('sb_secret_')) {
    console.log('  ✅ Using new Supabase API key format (sb_secret_...)')
    console.log(`  Key length: ${adminKey.length} characters`)
  } else if (adminKey.startsWith('eyJ')) {
    console.log('  ✅ Using legacy JWT format (eyJ...)')
    console.log(`  Key length: ${adminKey.length} characters`)
  } else {
    console.log('  ⚠️  Key format is unusual')
    console.log(`  Key starts with: ${adminKey.substring(0, 20)}...`)
    console.log(`  Key length: ${adminKey.length} characters`)
  }
  console.log('')

  // Create admin client
  console.log('🔧 Creating admin client...')
  let adminClient
  try {
    adminClient = createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log('  ✅ Admin client created successfully\n')
  } catch (error) {
    console.error('  ❌ Failed to create admin client:', error.message)
    process.exit(1)
  }

  // Test 1: List users (requires admin privileges)
  console.log('🧪 Test 1: Listing users (admin operation)...')
  try {
    const { data, error } = await adminClient.auth.admin.listUsers({ limit: 1 })
    
    if (error) {
      console.error('  ❌ Failed to list users:', error.message)
      console.error('  Error code:', error.status)
      console.error('  This indicates the secret key is invalid or lacks admin privileges')
      process.exit(1)
    }
    
    console.log(`  ✅ Success! Found ${data?.users?.length || 0} user(s)`)
    if (data?.users && data.users.length > 0) {
      console.log(`  Sample user: ${data.users[0].email}`)
    }
  } catch (error) {
    console.error('  ❌ Unexpected error:', error.message)
    process.exit(1)
  }
  console.log('')

  // Test 2: Check database access (optional - might have RLS restrictions)
  console.log('🧪 Test 2: Database access (admin operation)...')
  try {
    const { data, error } = await adminClient
      .from('organizations')
      .select('id, name')
      .limit(1)
    
    if (error) {
      console.log('  ⚠️  Database access restricted (this is OK for invite functionality)')
      console.log(`  Note: ${error.message}`)
      console.log('  This won\'t affect user invitation - auth operations work fine')
    } else {
      console.log(`  ✅ Success! Can access database`)
      if (data && data.length > 0) {
        console.log(`  Sample organization: ${data[0].name}`)
      }
    }
  } catch (error) {
    console.log('  ⚠️  Database access error (this is OK for invite functionality)')
    console.log(`  Note: ${error.message}`)
  }
  console.log('')

  // Test 3: Try to create a test user (this will fail but shows if we have the right permissions)
  console.log('🧪 Test 3: Testing user creation permissions...')
  const testEmail = `test-${Date.now()}@example.com`
  try {
    const { data, error } = await adminClient.auth.admin.createUser({
      email: testEmail,
      email_confirm: true,
      user_metadata: { test: true },
    })
    
    if (error) {
      if (error.status === 401) {
        console.error('  ❌ Authentication failed - Invalid API key')
        console.error('  Please verify your SUPABASE_SECRET_KEY is correct')
      } else {
        console.error('  ⚠️  User creation failed (this might be expected):', error.message)
        console.error('  Error code:', error.status)
      }
      process.exit(1)
    }
    
    console.log(`  ✅ Success! Can create users`)
    console.log(`  Created test user: ${data.user.email}`)
    
    // Clean up - delete the test user
    if (data.user.id) {
      await adminClient.auth.admin.deleteUser(data.user.id)
      console.log('  🧹 Cleaned up test user')
    }
  } catch (error) {
    console.error('  ❌ Unexpected error:', error.message)
    process.exit(1)
  }
  console.log('')

  console.log('✅ All critical tests passed! Your admin client is configured correctly.')
  console.log('')
  console.log('📝 Summary:')
  console.log('  ✅ Environment variables are set correctly')
  console.log('  ✅ Admin client can be created')
  console.log('  ✅ Auth admin operations work (list users, create user)')
  console.log('  ✅ Your SUPABASE_SECRET_KEY is valid and has admin privileges')
  console.log('')
  console.log('🎉 You can now use the invite member feature!')
}

// Run the test
testAdminClient().catch((error) => {
  console.error('\n❌ Test script failed:', error)
  process.exit(1)
})

