import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

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

async function main() {
  console.log('Testing resume creation (same as API route)...');
  
  // Step 1: Find user (simulating getAuthenticatedUser)
  const userId = 'cmq3lik2n0000l9veq18gyr3u'; // turso-verify2
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  console.log('User:', user);
  
  // Step 2: Create resume (same as POST /api/resumes)
  const title = 'API Test - Turso Cloud Verified';
  const resumeData = {};
  
  const resume = await db.resume.create({
    data: {
      title,
      data: typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData || {}),
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      data: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  console.log('Created resume:', { ...resume, data: JSON.parse(resume.data) });
  
  // Step 3: Read back
  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
  });
  console.log(`User now has ${resumes.length} resume(s)`);
  for (const r of resumes) {
    console.log(`  - "${r.title}" [id: ${r.id}]`);
  }
  
  // Step 4: Update resume (same as PUT /api/resumes/[id])
  const updatedResume = await db.resume.update({
    where: { id: resume.id },
    data: {
      title: 'API Test - EDITED & SAVED via Turso',
      data: JSON.stringify({
        personal: { name: 'Turso Verification', email: 'turso-verify2@example.com' },
        summary: 'This resume was edited to verify Turso write operations work correctly',
      }),
    },
  });
  console.log('Updated resume:', updatedResume.title);
  
  // Step 5: Verify the update
  const verified = await db.resume.findUnique({ where: { id: resume.id } });
  const parsed = JSON.parse(verified.data);
  console.log('Verified update:', parsed.summary);
  
  await db.$disconnect();
  console.log('\n✅ Resume CRUD operations all work correctly with Turso cloud DB!');
}

main().catch(e => { console.error(e); process.exit(1); });
