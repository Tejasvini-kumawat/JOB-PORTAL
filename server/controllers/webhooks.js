import pkg from 'svix';
const {webhook} = pkg;
import User from '../models/User.js'

//API controller function to manages Clerk user with databases

 export const clerkWebhooks =async (req,res)=>{
try {
    //create a svix instance with clerk webhooks secret
    const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    //Verfying errors
    await whook.verify(JSON.stringify(req.body),{
        "svix-id":req.headers["svix-id"],
        "svix-timestamp":req.headers["svix-timestamp"],
        "svix-signature":req.headers["svix-signature"]
    })

    //Getting data from request body
    const {dats,type}=req.body

    //switch case for different events
    switch (type) {
        case 'user.created':{
            const userData={
                 _id:data.id,
                 email:data.email_addresses[0].email_address,
                 name:data.first_name+" "+data.last_name,
                 image:data.image_url,
                 resume:' '

            }
            await User.create(userData);
            res.json({})
            break;
        }
          
        case 'user.updated':{
            const userData={
                
                email:data.email_addresses[0].email_address,
                name:data.first_name+" "+data.last_name,
                image:data.image_url,
              }
              await User.findByIdAndUpdate(data.id,userData)
              res.json({})
              break;
        }
          
        case 'user.deleted':{
            await User.findByIdAndDelete(data.id)
            res.json({})
            break;
        }
          
          
        default:
            break;
    }
    
} catch (error) {
   
    console.log(error.message);
    res.json({success:false,message:'webhooks Error'})
}
}