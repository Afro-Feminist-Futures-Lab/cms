// Test script to call the join-requests API
const testData = {
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
};

async function testApi() {
  try {
    const response = await fetch('http://localhost:3000/api/join-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (!response.ok) {
      console.error('Error response:', data);
    } else {
      console.log('Success!');
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

testApi();
