import https from "https";
import fs from "fs";
import customerRoutes from "./routes/customer.mjs";
import employeeRoutes from "./routes/employee.mjs"
import users from "./routes/user.mjs";
import express from "express"
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import cors from "cors"

const PORT = 3001;
const app = express();

const options = {
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
}

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req,res,next)=>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
})
 
app.use("/customer", customerRoutes);
app.use("/user", users);
app.use("/employee", employeeRoutes);

let server = https.createServer(options,app)
console.log(`Server is running on https://localhost:${PORT}`);
server.listen(PORT);