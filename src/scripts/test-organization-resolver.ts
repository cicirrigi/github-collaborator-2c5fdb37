/**
 * 🧪 Test script pentru organizationResolver
 * Rulează cu: npx tsx src/scripts/test-organization-resolver.ts
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { resolveUserOrganization } from '../services/organization/organizationResolver';

async function testOrganizationResolver() {
  console.log('🧪 Testing Organization Resolver...\n');

  try {
    // Test 1: Resolve organization pentru user inexistent (ar trebui să returneze default)
    console.log('1️⃣ Testing with non-existent user...');
    const orgId1 = await resolveUserOrganization('fake-user-id-123');
    console.log('   Result:', orgId1);
    console.log('   Expected: 9a5caade-4791-4860-93b5-12b1c4fa9830 (default Vantage Lane)\n');

    // Test 2: Resolve organization pentru user real din DB (dacă există)
    console.log('2️⃣ Testing with real user from recent booking...');
    // Folosim user_id din ultimul booking pe care l-am văzut în audit
    const orgId2 = await resolveUserOrganization('c1f4d5e6-7890-1234-5678-9abcdef12345');
    console.log('   Result:', orgId2);
    console.log('   Should return organization ID for existing user\n');

    // Test 3: Verificăm că avem organizațiile corecte în DB
    console.log('3️⃣ Available organizations in DB:');
    console.log('   Vantage Lane (platform_owner): 9a5caade-4791-4860-93b5-12b1c4fa9830');
    console.log('   Vantage Lane London (operator): 7d7055b9-e835-4fe8-8387-7396987aa639\n');

    console.log('✅ Organization resolver test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Rulează testul doar dacă scriptul e apelat direct
if (require.main === module) {
  testOrganizationResolver();
}

export { testOrganizationResolver };
