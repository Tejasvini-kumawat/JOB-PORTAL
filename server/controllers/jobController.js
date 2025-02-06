
import Job from "../models/Job.js";


//Get all jobs
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ visible: true })
            .populate({ path: 'companyId', select: '-password' });

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//Get a single job by id

export const getJobById=async (req,res)=>{
try {
    const id=req.params
    const job=await Job.findById(id).populate({path:'companyId',select:'-password'})
    if(!job){
       return res.json({success:false,message:"job not found"}) 
       
    }
    res.json({sucess:true,job})
      
} catch (error) {
    res.json({success:false,message:error.message})
}
}