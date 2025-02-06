import Company from "../models/Company.js"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken.js"
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"

//Register a new Company
 export const registerCompany=async(req,res)=>{
const {name,email,password}=req.body

const imageFile=req.file
if(!name || !email || !password || !imageFile){
    return res.json({success:false,message:"missing Details"})

}
try {
    // Check if company already exists
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
        return res.status(400).json({ success: false, message: 'Company Already Registered' });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    
    // Create new company
    const company = await Company.create({
        name,
        email,
        password: hashPassword,
        image: imageUpload.secure_url
    });

    // Send response
    res.status(201).json({
        success: true,
        company: {
            _id: company._id,
            name: company.name,
            email: company.email,
            image: company.image
        },
        token: generateToken(company._id)
    });

} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}

}

// Company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body; // Include password

    try {
        // Check if the company exists
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Successful login response
        res.status(200).json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//Get Company Data

export const getCompanyData = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        res.status(200).json({ success: true, company: req.company });
    } catch (error) {
        console.error("Error fetching company data:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//Post a new Job

export const postJob = async(req,res)=>{
    const {title,description,location,salary,level,category}=req.body
    const companyId=req.company._id
    try {
        const newJob= new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date:Date.now(),
            level,
            category

        })
        await newJob.save()
        res.json({success:true,newJob})
        
    } catch (error) {
        res.json({success:false,message:error.message})
    }


}

//Get a company Job applicant
export const getCompanyJobApplicants =async (req,res)=>{

    try {
        const companyId=req.company._id
        //Find job applications for the user and populate related data

        const applications=await JobApplication.find({companyId}).populate('userId','name image resume').populate('jobId','title location category level salary').exec()
        return res.json({success:true,applications})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//Get a company Posted Jobs
export const getCompanyPostedJobs=async(req,res)=>{
try {
    const companyId=req.company._id 
    const jobs=await Job.find({companyId})
    // Adding No.of applicants info in data
const jobsData=await Promise.all(jobs.map(async ()=>{
    const applicants=await JobApplication.find({jobId:job._id});
    return {...job.toObject(),applicants:applicants.length}
}))
    res.json({success:true,jobsData:jobs})
    

} catch (error) {
    res.json({success:false,message:error.message})
}
}

//Change Job Application status
export const changeJobApplicationsStatus=async(req,res)=>{
    try {
        const {id,status}=req.body
//Find Job Application and update status

await JobApplication.findOneAndUpdate({_id:id},{status})
res.json({success:true,message:'Status Changed'})
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

//Change Job visibility
export const changeVisibility=async(req,res)=>{
try {
    const {id}=req.body
    const companyId=req.company._id

    const job=await Job.findById(id)
    if(companyId.toString()===job.companyId.toString()){
        job.visible=!job.visible
    }
    await job.save()
    res.json({success:true,job})

} catch (error) {
    res.json({success:false,message:error.message})
}
}