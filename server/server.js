import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import './config/instrument.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';


 //Initialize express
 const app=express();
  //Middleware

  app.use(cors())
  app.use(express.json())

  // connect to database
  await connectDB()
  //Routes
  app.get('/',(req,res)=>res.send("API Working"))
  app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  
  app.post('/webhooks',clerkWebhooks)

  //PORT
  const PORT =process.env.PORT || 5000
  Sentry.setupExpressErrorHandler(app);
  app.listen(PORT,()=>{
   console.log(` server is running on port  ${PORT}`)
  })