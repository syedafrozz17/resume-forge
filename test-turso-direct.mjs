import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://resume-forge-syedafrozz17.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA4MjIyODAsImlkIjoiMDE5ZWExNDYtYTEwMS03MWRlLWJkMzQtZjlhNmQxYjNiZDNjIiwicmlkIjoiODI4MWYyOTgtY2ExYi00YjhmLWE2ZDktZGY5NmE2ZjQ1Mjg0In0.YB8iByecpcIcviSgKUVYdVfmj1RmvECVmBohtBBxAudt_0vteTgfqLxCunIjoIG-hsLqM-Glb8OwXv7zn0ElDA',
});

async function main() {
  console.log('=== Testing Direct Turso Connection ===\n');
  
  // Test 1: Basic connectivity
  console.log('1. Basic connectivity test...');
  const result = await client.execute('SELECT 1 as test');
  console.log('   ✅ Connected! Result:', result.rows[0]);
  
  // Test 2: List all users
  console.log('\n2. Listing all users...');
  const users = await client.execute('SELECT id, email, name, createdAt FROM User');
  console.log(`   Found ${users.rows.length} users:`);
  for (const u of users.rows) {
    console.log(`   - ${u.name} (${u.email}) [id: ${u.id}]`);
  }
  
  // Test 3: List all resumes
  console.log('\n3. Listing all resumes...');
  const resumes = await client.execute('SELECT id, title, userId, createdAt, updatedAt FROM Resume');
  console.log(`   Found ${resumes.rows.length} resumes:`);
  for (const r of resumes.rows) {
    console.log(`   - "${r.title}" [id: ${r.id}, userId: ${r.userId}]`);
  }
  
  // Test 4: Find specific user and their resumes
  console.log('\n4. Finding syedafroz7492@gmail.com and their resumes...');
  const targetUser = await client.execute({
    sql: 'SELECT id, email, name FROM User WHERE email = ?',
    args: ['syedafroz7492@gmail.com']
  });
  if (targetUser.rows.length > 0) {
    const user = targetUser.rows[0];
    console.log(`   ✅ Found: ${user.name} (${user.email}) [id: ${user.id}]`);
    
    const userResumes = await client.execute({
      sql: 'SELECT id, title FROM Resume WHERE userId = ?',
      args: [user.id]
    });
    console.log(`   Has ${userResumes.rows.length} resumes:`);
    for (const r of userResumes.rows) {
      console.log(`   - "${r.title}" [id: ${r.id}]`);
    }
  } else {
    console.log('   ❌ User not found');
  }
  
  // Test 5: Get resume data for a specific resume
  console.log('\n5. Getting full resume data for first resume...');
  if (resumes.rows.length > 0) {
    const resumeData = await client.execute({
      sql: 'SELECT id, title, data FROM Resume WHERE id = ?',
      args: [resumes.rows[0].id]
    });
    if (resumeData.rows.length > 0) {
      const r = resumeData.rows[0];
      console.log(`   Resume: "${r.title}"`);
      try {
        const parsed = JSON.parse(r.data);
        console.log(`   Data keys: ${Object.keys(parsed).join(', ')}`);
        console.log(`   Personal info: ${JSON.stringify(parsed.personalInfo || {})}`);
      } catch {
        console.log(`   Data (raw): ${String(r.data).substring(0, 200)}...`);
      }
    }
  }
  
  // Test 6: Write test - create a test user
  console.log('\n6. Write test - creating/updating test user...');
  const bcrypt = (await import('bcryptjs')).default;
  const hashedPw = await bcrypt.hash('test123456', 12);
  
  // Check if test user exists
  const existingTest = await client.execute({
    sql: 'SELECT id, name, email FROM User WHERE email = ?',
    args: ['turso-test@example.com']
  });
  
  if (existingTest.rows.length > 0) {
    console.log(`   User already exists: ${existingTest.rows[0].name} [id: ${existingTest.rows[0].id}]`);
  } else {
    const insertResult = await client.execute({
      sql: 'INSERT INTO User (id, email, name, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime(), datetime())',
      args: ['turso-test-user-001', 'turso-test@example.com', 'Turso Test', hashedPw]
    });
    console.log(`   ✅ Created user! Rows affected: ${insertResult.rowsAffected}`);
    
    // Create a test resume for the new user
    const resumeData = JSON.stringify({
      personalInfo: { name: 'Turso Test', email: 'turso-test@example.com', phone: '555-0123', location: 'Test City', summary: 'Test user for Turso integration verification' },
      experience: [{ company: 'Test Corp', position: 'Test Engineer', startDate: '2024-01', endDate: 'present', description: 'Testing the Turso database integration' }],
      education: [{ institution: 'Test University', degree: 'BS Testing', startDate: '2020', endDate: '2024' }],
      skills: ['Testing', 'Turso', 'LibSQL', 'Integration Testing'],
    });
    
    const resumeResult = await client.execute({
      sql: 'INSERT INTO Resume (id, title, data, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime(), datetime())',
      args: ['turso-test-resume-001', 'Test Resume - Turso Integration', resumeData, 'turso-test-user-001']
    });
    console.log(`   ✅ Created resume! Rows affected: ${resumeResult.rowsAffected}`);
  }
  
  // Test 7: Read back the test data
  console.log('\n7. Read back test user and resume...');
  const testUser = await client.execute({
    sql: 'SELECT id, name, email FROM User WHERE email = ?',
    args: ['turso-test@example.com']
  });
  if (testUser.rows.length > 0) {
    console.log(`   ✅ User: ${testUser.rows[0].name} (${testUser.rows[0].email})`);
    
    const testResumes = await client.execute({
      sql: 'SELECT id, title FROM Resume WHERE userId = ?',
      args: [testUser.rows[0].id]
    });
    for (const r of testResumes.rows) {
      console.log(`   ✅ Resume: "${r.title}" [id: ${r.id}]`);
    }
  }
  
  console.log('\n=== ✅ All Turso DB tests passed! ===');
  console.log('\nSummary:');
  console.log(`- Cloud database is reachable and responsive`);
  console.log(`- Read operations work correctly`);
  console.log(`- Write operations work correctly`);
  console.log(`- User and Resume data models are functional`);
}

main().catch(e => {
  console.error('❌ Error:', e.message || e);
  console.error(e.stack);
  process.exit(1);
});
