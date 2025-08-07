// Test script for Ollama functionality
async function testOllamaAvailability() {
  try {
    console.log('Testing Ollama availability...');
    
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Ollama is available!');
      console.log('Available models:', data.models);
      return data.models || [];
    } else {
      console.log('Ollama responded with error:', response.status);
      return null;
    }
  } catch (error) {
    console.log('Ollama not available:', error.message);
    return null;
  }
}

// Test Ollama API call
async function testOllamaAPI() {
  try {
    console.log('Testing Ollama API call...');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: 'Hello, how are you?',
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 100
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Ollama API test successful!');
      console.log('Response:', data.response);
      return true;
    } else {
      console.log('Ollama API test failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('Ollama API test error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('=== Ollama Integration Tests ===');
  
  const models = await testOllamaAvailability();
  if (models && models.length > 0) {
    console.log('✅ Ollama is available with models:', models.map(m => m.name));
    
    // Test API call if we have models
    const apiTest = await testOllamaAPI();
    if (apiTest) {
      console.log('✅ Ollama API is working correctly');
    } else {
      console.log('❌ Ollama API test failed');
    }
  } else {
    console.log('❌ Ollama is not available');
  }
  
  console.log('=== Tests Complete ===');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runTests();
} else {
  // Browser environment
  window.testOllama = runTests;
}
