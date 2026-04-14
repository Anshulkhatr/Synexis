import axios from "axios";

// Assume FREEPIK_API_KEY is available in environment or use a dummy request
// Actually we can just hit the API with a test key and see the 400 Bad Request error message! usually it tells you the schema!

const testOptions = async () => {
    try {
        const response = await axios.post(
            'https://api.freepik.com/v1/ai/text-to-image/flux-dev',
            { 
               prompt: "a cat", 
               aspect_ratio: "16:9",
               styling: { style: "realistic" },
               image: { size: "landscape" }
            },
            { 
               headers: { 
                   'x-freepik-api-key': 'INVALID_KEY',
                   'Content-Type': 'application/json' 
               } 
            }
        )
        console.log("Success:", response.data)
    } catch(err) {
        console.log("Error status:", err.response?.status)
        console.log("Error data:", JSON.stringify(err.response?.data, null, 2))
    }
}

testOptions();
