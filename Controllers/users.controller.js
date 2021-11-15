const _ = require('lodash');

const User = require('../config/Connectdb').User
const Role = require('../config/Connectdb').Role;

const {Op} = require('sequelize')

const UserResponseDto = require('../dtos/responses/users.dto')
const UserRequestDto = require('../dtos/requests/users.dto')

const AppResponseDto = require('../dtos/responses/app_response.dto')


exports.register = (req, res, next) =>{
    const body = req.body
    const resultBinding = UserRequestDto.createUserRequestDto(req.body)
    if(!_.isEmpty(resultBinding.errors)){
        return res.status(422).json(AppResponseDto.buildWithErrorMessages(resultBinding.errors))
    }

    const email = resultBinding.validatedData.email
    const username = resultBinding.validatedData.username

    User.findOne({where:{
        [Op.or]:[{username}, {email}]
    }}).then((user)=>{
        if(user) {
            const errors = {}

            if(user.username === req.body.username)
                errors.username = 'username: ' + req.body.username + 'is already taken'

            if(user.email === req.body.email)
                errors.email = 'email: ' + req.body.email + 'is already taken'

            if(!_.isEmpty(errors)){
                return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors))
            }

        }

        User.create(resultBinding.validatedData)
        .then((user)=>{
            if(user === null){
                throw user
            }

            if(user){
                console.dir(user);
                console.log(user.toJSON());
                res.json(UserResponseDto.registerDto(user))
            }else{
                console.log("user is Empty");
            }
        })

    }).catch((err)=>{
        return res.status(400).send(AppResponseDto.buildWithErrorMessages(err));
    })
}

exports.login = (req, res, next) => {
    const resultBinding = UserRequestDto.createUserRequestDto(req.body);
    const username = resultBinding.validatedData.username;
    const password = resultBinding.validatedData.password;


    if(!username || !password){
        res.status(401).send({error: "Invalid username or password"})
        return ;
    }

    //lookup the user name already exists
    //compaire password

    User.findOne({
        where: {username},
        include: [
            {
                model: Role,
                attributes: ['name']
            }
        ]
    }).then((user)=>{
        if(user && user.isValidPassword(password)) {
            req.user = user;
            return res.status(200).json(UserResponseDto.loginStatus(user)) 
        }else {
            return res.json(AppResponseDto.buildWithErrorMessages('Invalid credentials'));
        }
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err));
    });

}