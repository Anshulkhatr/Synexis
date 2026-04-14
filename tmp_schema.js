import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const testOptions = async () => {
    try {
        const response = await axios.post(
            'https://api.freepik.com/v1/ai/text-to-image/flux-dev',
            { 
               prompt: 123, // intentional type error to get schema dump instead of charging credits!
               image: { size: "landscape" }
            },
            { 
               headers: { 
                   'x-freepik-api-key': process.env.FREEPIK_API_KEY,
                   'Content-Type': 'application/json' 
               } 
            }
        )
        console.log("Success:", response.data)
    } catch(err) {
        console.log("Error data:", JSON.stringify(err.response?.data, null, 2))
    }
}

testOptions();
