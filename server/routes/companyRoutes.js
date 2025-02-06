import express from 'express'
import { changeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'
const router =express.Router()

//Register a company
router.post('/register',upload.single('image')  ,registerCompany)

//Company Login
router.post('/login',loginCompany)

//get Company Data

router.post('/company',protectCompany, getCompanyData)
//post a job
router.post('/post-job',protectCompany,postJob)
//Get application data of the company
router.get('/applicants',protectCompany,getCompanyJobApplicants)
//Get company Job List
router.get('/list-jobs',protectCompany,getCompanyPostedJobs)
//Change application status
router.post('/change-status',protectCompany,changeJobApplicationsStatus)
//change Application visibility
router.post('/change-visibility',protectCompany,changeVisibility)

export default router