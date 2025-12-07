import fetch from 'node-fetch';

async function testRegistration() {
    try {
        console.log('Testing registration endpoint...');

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: '123456'
            }),
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const text = await response.text();
        console.log('Response:', text);

        try {
            const json = JSON.parse(text);
            console.log('Parsed JSON:', json);
        } catch {
            console.log('Response is not JSON');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRegistration();