const User = require('../model/customer')
const Bcrypt = require('bcrypt');
const Joi = require('joi')
const create_post = async(req, res)=>{
    const Schema = Joi.object({
        Name: Joi.string()
            .min(5)
            .max(20)
            .required(),
        DOB: Joi.string()
            .min(5)
            .max(15)
            .required(),
        Address: Joi.string()
            .min(5)
            .max(20)
            .required(),
        Photo: Joi.string()
            .min(5)
            .max(25)
            .required(),
    })
    let userpayload
    let validateSchema = Schema.validate(req.body)
    console.log(validateSchema.error)
    if(validateSchema.error){
        return res.status(400).json({
            massage: validateSchema.error.massage || "Bad Request",
            code: 400
        })
    }
    else{
        userpayload = validateSchema.value
    }
    try{
        userpayload = {
            Name: userpayload.Name,
            DOB: userpayload.DOB,
            Address:userpayload.Address,
            Photo: userpayload.Photo,
        }
        const exits = await User.findOne({ where: { Name: userpayload.Name } })
        console.log(exits);
        if (exits) {
            return res.status(200).send({
                massage: "user already exits",
                status: 422,
                data: exits

            })
        }
        else {
            const result = await User.create(userpayload)
            return res.status(201).send({
                massage: "user added successfully",
                status: 201,
                data: result
            })

        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            massage: 'internal server Error',
            status: 500
        })
    }
    }
// get all data
const get_data = async(req, res)=>{
    try{
        const exits = await User.findAll()
        if(exits){
            return res.status(200).send({
                message: "data",
                status: 200,
                data: exits
            })
        }
        else{
            return res.status(400).json({
                massage: 'Data  not found ' || "Bad Request",
                status: 400
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            massage: 'internal server Error',
            status: 500,
            data: err
    
        })
    }
}
// update data by id
const update_data = async(req, res)=>{
    const Schema = Joi.object({
        Name: Joi.string()
            .min(5)
            .max(20)
            .optional(),
        DOB: Joi.string()
            .min(5)
            .max(20)
            .optional(),
        Address: Joi.string()
            .max(15)
            .optional(),
        Photo: Joi.string()
            .min(5)
            .max(25)
            .optional(),
    })
    let userpayload
    let validateSchema = Schema.validate(req.body)
    console.log(validateSchema.error)
    if(validateSchema.error){
        return res.status(400).json({
            massage: validateSchema.error.massage || "Bad Request",
            code: 400
        })
    }
    else{
        userpayload = validateSchema.value
    }
    try{
        const result = await User.update(userpayload,{
            where:{Id: req.params.Id}
        })
        return res.status(200).send({
            message: "userdata updated successfully",
            status: 200,
            data: result
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            massage: 'internal server Error',
            status: 500,
            data: err
    
        })
    }
}
// delete data by id
const delete_data = async(req, res)=>{
    try{
        const data = await User.destroy({where:{Id: req.params.Id}})
        if(data){
            return res.status(200).send({message: "data deleted", status: 200})
        }
        else{
            return res.status(400).json({
                message: "data not found",
                status:400
            })
        }  
    }
    catch(err){
        return res.status(500).json({
            message: "internal server error",
            status: 400
        })
    }
}
module.exports = {create_post, update_data, delete_data, get_data}