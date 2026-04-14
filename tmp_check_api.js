import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const testSchema = async () => {
    try {
        const response = await axios.post(
            'https://api.freepik.com/v1/ai/text-to-image/flux-dev',
            { 
               prompt: "a test",
               // Pass something slightly wrong to see if it gives a schema error
               ratio: "16:9" 
            },
            { 
               headers: { 
                   'x-freepik-api-key': process.env.FREEPIK_API_KEY,
                   'Content-Type': 'application/json' 
               } 
            }
        )
        console.log("Success:", JSON.stringify(response.data, null, 2))
    } catch(err) {
        console.log("Error status:", err.response?.status)
        console.log("Error details:", JSON.stringify(err.response?.data, null, 2))
    }
}

testSchema();
