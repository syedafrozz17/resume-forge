import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Set env vars before anything else
process.env.TURSO_DATABASE_URL = 'libsql://resume-forge-syedafrozz17.aws-us-east-2.turso.io';
process.env.TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA4MjIyODAsImlkIjoiMDE5ZWExNDYtYTEwMS03MWRlLWJkMzQtZjlhNmQxYjNiZDNjIiwicmlkIjoiODI4MWYyOTgtY2ExYi00YjhmLWE2ZDktZGY5NmE2ZjQ1Mjg0In0.YB8iByecpcIcviSgKUVYdVfmj1RmvECVmBohtBBxAudt_0vteTgfqLxCunIjoIG-hsLqM-Glb8OwXv7zn0ElDA';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = new PrismaClient({
  adapter,
  log: ['query'],
});

const results = {};

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('TURSO CLOUD DB - FULL VERIFICATION TEST');
  console.log('Database: ' + process.env.TURSO_DATABASE_URL);
  console.log('='.repeat(60));
  
  // STEP 1: Basic connectivity
  console.log('\n--- STEP 1: Basic Connectivity ---');
  try {
    const users = await db.user.findMany({ take: 1 });
    console.log('✅ Connected to Turso cloud DB successfully');
    console.log(`   Found ${users.length} user(s) in sample query`);
    results['connectivity'] = 'PASS';
  } catch (e) {
    console.log(`❌ Failed to connect: ${e.message}`);
    results['connectivity'] = `FAIL: ${e.message}`;
    process.exit(1);
  }
  
  // STEP 2: Read existing users (test@example.com)
  console.log('\n--- STEP 2: Read Existing User (test@example.com) ---');
  try {
    const testUser = await db.user.findUnique({ where: { email: 'test@example.com' } });
    if (testUser) {
      console.log(`✅ Found user: ${testUser.name} (${testUser.email}) [id: ${testUser.id}]`);
      results['read_test_user'] = 'PASS';
    } else {
      console.log('⚠️ User test@example.com not found');
      results['read_test_user'] = 'NOT FOUND';
    }
  } catch (e) {
    console.log(`❌ Error reading user: ${e.message}`);
    results['read_test_user'] = `FAIL: ${e.message}`;
  }
  
  // STEP 3: Register/login test - verify password hashing works with Turso
  console.log('\n--- STEP 3: Verify Password Hashing (Auth with Turso) ---');
  try {
    const testUser = await db.user.findUnique({ where: { email: 'test@example.com' } });
    if (testUser) {
      const validPw = await bcrypt.compare('test123456', testUser.password);
      const wrongPw = await bcrypt.compare('wrongpassword', testUser.password);
      console.log(`   Password "test123456" matches: ${validPw}`);
      console.log(`   Password "wrongpassword" matches: ${wrongPw}`);
      if (!validPw) {
        console.log('   Note: test@example.com was registered with a different password');
      }
      results['password_verify'] = validPw ? 'PASS' : 'DIFFERENT_PASSWORD';
    }
  } catch (e) {
    console.log(`❌ Error verifying password: ${e.message}`);
    results['password_verify'] = `FAIL: ${e.message}`;
  }
  
  // STEP 4: Read existing resumes
  console.log('\n--- STEP 4: Read Existing Resumes ---');
  try {
    const resumes = await db.resume.findMany();
    console.log(`✅ Found ${resumes.length} resume(s) in the database`);
    for (const r of resumes) {
      const user = await db.user.findUnique({ where: { id: r.userId } });
      console.log(`   - "${r.title}" by ${user?.name || 'unknown'} [id: ${r.id}]`);
      try {
        const data = JSON.parse(r.data);
        console.log(`     Data keys: ${Object.keys(data).join(', ')}`);
      } catch {}
    }
    results['read_resumes'] = 'PASS';
  } catch (e) {
    console.log(`❌ Error reading resumes: ${e.message}`);
    results['read_resumes'] = `FAIL: ${e.message}`;
  }
  
  // STEP 5: Create a new user (WRITE test)
  console.log('\n--- STEP 5: Create New User (WRITE Test) ---');
  const testEmail = `turso-verify-${Date.now()}@example.com`;
  try {
    const hashedPw = await bcrypt.hash('test123456', 12);
    const newUser = await db.user.create({
      data: {
        name: 'Turso Verification',
        email: testEmail,
        password: hashedPw,
      },
      select: { id: true, email: true, name: true },
    });
    console.log(`✅ Created user: ${newUser.name} (${newUser.email}) [id: ${newUser.id}]`);
    results['create_user'] = 'PASS';
    
    // STEP 6: Verify the user was actually written
    console.log('\n--- STEP 6: Verify User Write (READ-back Test) ---');
    const readBack = await db.user.findUnique({ where: { id: newUser.id } });
    if (readBack && readBack.email === testEmail) {
      console.log(`✅ User write confirmed: read back ${readBack.name} (${readBack.email})`);
      results['verify_user_write'] = 'PASS';
    } else {
      console.log('❌ User not found after write');
      results['verify_user_write'] = 'FAIL';
    }
    
    // STEP 7: Login simulation - verify password for new user
    console.log('\n--- STEP 7: Simulate Login (Password Verify) ---');
    const pwValid = await bcrypt.compare('test123456', readBack.password);
    console.log(`   Password "test123456" for ${testEmail}: ${pwValid ? 'VALID ✅' : 'INVALID ❌'}`);
    results['login_simulation'] = pwValid ? 'PASS' : 'FAIL';
    
    // STEP 8: Create a resume for the new user (WRITE test)
    console.log('\n--- STEP 8: Create Resume (WRITE Test) ---');
    const resumeData = {
      personal: { name: 'Turso Verification', email: testEmail, phone: '555-0123', location: 'Cloud City', summary: 'Testing Turso cloud database integration' },
      summary: 'Experienced tester verifying Turso cloud database connectivity',
      experience: [{ 
        company: 'Cloud Corp', 
        position: 'Database Tester', 
        startDate: '2024-01', 
        endDate: 'present', 
        description: 'Testing the Turso database integration for ResumeForge' 
      }],
      education: [{ institution: 'Cloud University', degree: 'BS Cloud Testing', startDate: '2020', endDate: '2024' }],
      skills: ['Turso', 'LibSQL', 'Prisma', 'Cloud Databases', 'Integration Testing'],
    };
    
    const newResume = await db.resume.create({
      data: {
        title: 'Turso Cloud Verification Resume',
        data: JSON.stringify(resumeData),
        userId: newUser.id,
      },
    });
    console.log(`✅ Created resume: "${newResume.title}" [id: ${newResume.id}]`);
    results['create_resume'] = 'PASS';
    
    // STEP 9: Read back the resume
    console.log('\n--- STEP 9: Read Back Resume (READ Test) ---');
    const readResume = await db.resume.findUnique({ where: { id: newResume.id } });
    if (readResume) {
      const parsed = JSON.parse(readResume.data);
      console.log(`✅ Read back resume: "${readResume.title}"`);
      console.log(`   Personal: ${parsed.personal.name} (${parsed.personal.email})`);
      console.log(`   Skills: ${parsed.skills.join(', ')}`);
      results['read_resume'] = 'PASS';
    } else {
      console.log('❌ Resume not found after creation');
      results['read_resume'] = 'FAIL';
    }
    
    // STEP 10: Update the resume (UPDATE test)
    console.log('\n--- STEP 10: Update Resume (UPDATE Test) ---');
    const updatedData = JSON.parse(readResume.data);
    updatedData.personal.summary = 'UPDATED: Turso cloud database write verification successful!';
    updatedData.skills.push('Write Verification');
    
    const updatedResume = await db.resume.update({
      where: { id: newResume.id },
      data: {
        title: 'Turso Cloud Verification Resume - UPDATED',
        data: JSON.stringify(updatedData),
      },
    });
    console.log(`✅ Updated resume: "${updatedResume.title}"`);
    results['update_resume'] = 'PASS';
    
    // STEP 11: Verify the update
    console.log('\n--- STEP 11: Verify Resume Update ---');
    const verifyUpdate = await db.resume.findUnique({ where: { id: newResume.id } });
    const verifyData = JSON.parse(verifyUpdate.data);
    if (verifyData.personal.summary.startsWith('UPDATED:') && verifyData.skills.includes('Write Verification')) {
      console.log(`✅ Update verified: "${verifyData.personal.summary}"`);
      console.log(`   Skills now: ${verifyData.skills.join(', ')}`);
      results['verify_update'] = 'PASS';
    } else {
      console.log('❌ Update not reflected in database');
      results['verify_update'] = 'FAIL';
    }
    
    // STEP 12: Get all resumes for the user (simulating dashboard)
    console.log('\n--- STEP 12: Get All User Resumes (Dashboard Simulation) ---');
    const userResumes = await db.resume.findMany({
      where: { userId: newUser.id },
      orderBy: { updatedAt: 'desc' },
    });
    console.log(`✅ User has ${userResumes.length} resume(s):`);
    for (const r of userResumes) {
      console.log(`   - "${r.title}" [updated: ${r.updatedAt}]`);
    }
    results['dashboard_simulation'] = 'PASS';
    
  } catch (e) {
    console.log(`❌ Error during write tests: ${e.message}`);
    console.log(e.stack);
    results['create_user'] = `FAIL: ${e.message}`;
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('FINAL SUMMARY - TURSO CLOUD DB VERIFICATION');
  console.log('='.repeat(60));
  let passCount = 0;
  let failCount = 0;
  for (const [step, result] of Object.entries(results)) {
    const icon = result === 'PASS' ? '✅' : (result.includes('FAIL') ? '❌' : '⚠️');
    console.log(`  ${icon} ${step}: ${result}`);
    if (result === 'PASS') passCount++;
    else if (result.includes('FAIL')) failCount++;
  }
  console.log(`\n  Total: ${passCount} passed, ${failCount} failed, ${Object.keys(results).length - passCount - failCount} warnings`);
  console.log('='.repeat(60));
  
  await db.$disconnect();
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  console.error(e.stack);
  process.exit(1);
});
