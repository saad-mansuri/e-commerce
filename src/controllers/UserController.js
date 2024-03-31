const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/UserModel')
// const {isValidName, isValidEmail, isValidPass, isValidPhone, isValidRequestBody} = require('../validators/UserValidations')
const {isValidRequestBody,isValidObjectId,isValidEmail,isValidName,isValidPass,isValidPhone,isValidStreet,isValidPincode,isValidImage} = require("../validators/UserValidations");

const createUser = asyncHandler(async(req, res) => {
    try{
        const reqBody = req.body
        const {fname, lname, email, password, phone, address, profileImage, } = reqBody
        if(!fname && !lname && !email && !password && !phone && !address && !profileImage){
            res.status(400);
            throw new Error('All fields ar mandatory!')
        }
        let files = req.files;

        // first-name validation
        if (!fname)
            return res.status(400).send({ status: false, message: "fname is required" });

        if(!isValidName(fname.trim())){
            return res.status(400).send({staus:400, message:"fname is not valid or required"})
        }

        // last-name validation
        if (!lname)
            return res.status(400).send({ status: false, message: "lname is required" });

        if(!isValidName(lname.trim())) 
            return res.status(400).send({staus:400, message:"lname is not valid or required"})

        //email validation
        if (!email) 
            return res.status(400).send({ status: false, message: "email is required" });
        if (!isValidEmail(email.trim()))
            return res.status(400).send({ status: false, message: "email is not Valid or Empty" });
      
        const checkDuplicateEmail = await User.findOne({email:email})
        if (checkDuplicateEmail)
            return res.status(400).send({ status: false, message: "email is already registered!" });

        // password validation
        if (!password)
            return res.status(400).send({ status: false, message: "password is required" });
        if (!isValidPass(password))
            return res.status(400).send({status: false, message:"Password should be between 8 and 15 character and it should be alpha numeric"});
        reqBody.password = await bcrypt.hash(password, 10)

        //phone validation
        if (!phone)
            return res.status(400).send({ status: false, message: "phone is required" });

        if (!isValidPhone(phone))
            return res.status(400).send({ status: false, message: "phone is not Valid or Empty" });

        const checkDuplicatePhone = await User.findOne({phone:phone})
        if (checkDuplicatePhone)
            return res.status(400).send({status: false, message: "phone number is Already registered !"});

        // Validation of address
        if (!address)
        return res.status(400).send({ status: false, message: "address is required" });
        // try {
        //   reqBody.address = JSON.parse(address);
        // } catch (err) {
        //     return res.status(400).send({ status: false, message: "Address must be Object" });
        // }
        if (Object.keys(reqBody.address).length > 2)
        return res.status(400).send({ status: false, message: "dont't Enter extra keys in Address" });

        const { shipping, billing } = reqBody.address; //destructuring  of address object
        // validation of shipping address
        if (shipping) {
            if (Object.keys(shipping).length > 3)
            return res.status(400).send({status: false,message: "dont't Enter extra keys in shipping"});
    
            const { street, city, pincode } = shipping; //destructuring  of shipping object
    
            if (!isValidRequestBody(shipping))
            return res.status(400).send({ status: false, message: "enter data into the shipping"});
    
            // shipping street validation
            if (!street)
            return res.status(400).send({ status: false, message: "shipping street is required" });
    
            if (!isValidStreet(street))
            return res.status(400).send({ status: false, message: "shipping street is not valid" });
    
            // shipping city validation
            if (!city)
            return res.status(400).send({ status: false, message: "shipping city is required" });
    
            if (!isValidName(city))
            return res.status(400).send({ status: false, message: "city is not valid" });
    
            // shipping pincode validation
            if (!pincode)
            return res.status(400).send({ status: false, message: "pincode is required" });
    
            if (!isValidPincode(pincode))
            return res.status(400).send({ status: false, message: "pincode is not valid" });
            
        } else {
            return res.status(400).send({ status: false, message: "shipping is required" });
        }

        // billing validation
        if (billing) {
            if (Object.keys(billing).length > 3)
            return res.status(400).send({status: false,message: "dont't Enter extra keys in billing"});

            if (!isValidRequestBody(billing))
            return res.status(400).send({ status: false, message: "enter data into the billing" });

            const { street, city, pincode } = billing; //destructuring  of billing object

            // billing street validation
            if (!street)
            return res.status(400).send({ status: false, message: "billing street is required" });
            if (!isValidStreet(street))
            return res.status(400).send({ status: false, message: "billing street is not valid" });

            // billing city validation
            if (!city)
            return res.status(400).send({ status: false, message: "billing city is required" });

            if (!isValidName(city))
            return res.status(400).send({ status: false, message: "billing city is not valid" });

            // billing pincode validation
            if (!pincode)
            return res.status(400).send({ status: false, message: "billing pincode is required" });

            if (!isValidPincode(pincode))
            return res.status(400).send({ status: false, message: "billing pincode is not valid" });

        } else {
            return res.status(400).send({ status: false, message: "billing is required" });
        }

        const obj = JSON.parse(JSON.stringify(reqBody));
        
        const user = await User.create(obj)
        if(user){
            res.status(200).send({status:200, message:'User created successfully', user:reqBody})
        }

    }catch(err){
        return res.status(500).send(err.message)
    }
})

module.exports = {createUser}