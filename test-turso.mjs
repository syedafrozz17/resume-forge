import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

// Explicitly set env vars
process.env.DATABASE_URL = 'libsql://resume-forge-syedafrozz17.aws-us-east-2.turso.io';
process.env.TURSO_DATABASE_URL = 'libsql://resume-forge-syedafrozz17.aws-us-east-2.turso.io';
process.env.TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA4MjIyODAsImlkIjoiMDE5ZWExNDYtYTEwMS03MWRlLWJkMzQtZjlhNmQxYjNiZDNjIiwicmlkIjoiODI4MWYyOTgtY2ExYi00YjhmLWE2ZDktZGY5NmE2ZjQ1Mjg0In0.YB8iByecpcIcviSgKUVYdVfmj1RmvECVmBohtBBxAudt_0vteTgfqLxCunIjoIG-hsLqM-Glb8OwXv7zn0ElDA';

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSql(libsql);

const db = new PrismaClient({
  adapter,
  log: ['query'],
});

async function main() {
  console.log('1. Testing Turso DB connection...');
  
  // Test raw query first
  console.log('\n=== Raw SQL Test ===');
  const result = await libsql.execute('SELECT 1 as test');
  console.log('Raw query result:', result.rows[0]);
  
  // Test 1: List all users
  console.log('\n=== Users ===');
  const users = await db.user.findMany();
  console.log(`Found ${users.length} users:`);
  for (const u of users) {
    console.log(`  - ${u.name} (${u.email}) [id: ${u.id}]`);
  }
  
  // Test 2: List all resumes
  console.log('\n=== Resumes ===');
  const resumes = await db.resume.findMany();
  console.log(`Found ${resumes.length} resumes:`);
  for (const r of resumes) {
    console.log(`  - "${r.title}" [id: ${r.id}, userId: ${r.userId}]`);
    console.log(`    Data preview: ${r.data.substring(0, 200)}...`);
  }
  
  // Test 3: Find specific user
  console.log('\n=== Find syedafroz7492@gmail.com ===');
  const targetUser = await db.user.findUnique({
    where: { email: 'syedafroz7492@gmail.com' }
  });
  if (targetUser) {
    console.log(`Found: ${targetUser.name} (${targetUser.email})`);
    const userResumes = await db.resume.findMany({
      where: { userId: targetUser.id }
    });
    console.log(`Has ${userResumes.length} resumes`);
    for (const r of userResumes) {
      console.log(`  - "${r.title}"`);
    }
  } else {
    console.log('User not found');
  }
  
  // Test 4: Create a test user
  console.log('\n=== Create test user ===');
  const hashedPw = await bcrypt.hash('test123456', 12);
  
  try {
    const testUser = await db.user.create({
      data: {
        name: 'Turso Test',
        email: 'turso-test@example.com',
        password: hashedPw,
      },
      select: { id: true, email: true, name: true },
    });
    console.log(`Created user: ${testUser.name} (${testUser.email}) [id: ${testUser.id}]`);
    
    // Create a test resume for the new user
    const testResume = await db.resume.create({
      data: {
        title: 'Test Resume - Turso Integration',
        data: JSON.stringify({
          personalInfo: { name: 'Turso Test', email: 'turso-test@example.com', phone: '', location: '', summary: '' },
          experience: [],
          education: [],
          skills: [],
        }),
        userId: testUser.id,
      },
    });
    console.log(`Created resume: "${testResume.title}" [id: ${testResume.id}]`);
    
  } catch (e) {
    if (e.code === 'P2002') {
      console.log('User turso-test@example.com already exists, skipping creation');
      const existingUser = await db.user.findUnique({ where: { email: 'turso-test@example.com' } });
      console.log(`Existing user: ${existingUser.name} [id: ${existingUser.id}]`);
      const existingResumes = await db.resume.findMany({ where: { userId: existingUser.id } });
      console.log(`Has ${existingResumes.length} resumes`);
      for (const r of existingResumes) {
        console.log(`  - "${r.title}" [id: ${r.id}]`);
      }
    } else {
      throw e;
    }
  }
  
  await db.$disconnect();
  console.log('\n✅ All Turso DB tests passed!');
}

main().catch(e => {
  console.error('❌ Error:', e.message || e);
  console.error(e.stack);
  process.exit(1);
});
