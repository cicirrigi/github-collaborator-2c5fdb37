/**
 * Test Pricing API - Heathrow to Mayfair
 * 4 vehicle types: E-Class (executive), S-Class (luxury), V-Class (van/mpv), Range Rover (suv)
 */

const PRICING_API = 'https://pricing.vantage-lane.com/api/pricing/calculate';

async function testPricing() {
  console.log('🧪 TESTING PRICING API - Heathrow to Mayfair\n');

  const baseRequest = {
    pickup: 'London Heathrow Airport, Longford, UK',
    dropoff: 'Mayfair, London, UK',
    bookingType: 'one_way',
    dateTime: new Date().toISOString(),
    distance: 15, // miles (approximate)
    duration: 35, // minutes (approximate)
  };

  const vehicles = [
    { name: 'Mercedes E-Class', type: 'executive' },
    { name: 'Mercedes S-Class', type: 'luxury' },
    { name: 'Mercedes V-Class', type: 'van' },
    { name: 'Range Rover', type: 'suv' },
  ];

  for (const vehicle of vehicles) {
    try {
      const request = {
        ...baseRequest,
        vehicleType: vehicle.type,
      };

      console.log(`\n📞 Calling API for ${vehicle.name} (${vehicle.type})...`);

      const response = await fetch(PRICING_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✅ ${vehicle.name}:`);
        console.log(`   Final Price: £${data.finalPrice}`);
        console.log(`   Base Fare: £${data.breakdown.baseFare}`);
        console.log(`   Distance Fee: £${data.breakdown.distanceFee}`);
        console.log(`   Subtotal: £${data.breakdown.subtotal}`);
      } else {
        console.log(`❌ ${vehicle.name}: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ ${vehicle.name}: ${error.message}`);
    }
  }

  console.log('\n✅ Test complete!');
}

testPricing();
