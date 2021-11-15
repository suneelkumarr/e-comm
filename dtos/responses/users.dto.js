const RolesDto = require('./roles.dto')

function registerDto(user){
    return {
        success: true,
        full_messages:['User registed sucessfully']
    }
}


function loginSuccess(user){
    const token = user.generateJwt();
    return {
        sucess: true,
        token,
        user:{
            id:user.id,
            username:user.username,
            firstname:user.firstname,
            lastName:user.lastName,
            roles:RolesDto.toNames(user.roles || []),
            token
        }
    }
}

function buildOnlyForIdAndUsername(user) {
    if (user == null)
        return {};
    return {
        id: user.id,
        username: user.username
    }
}

module.exports = {
    registerDto, loginSuccess, buildOnlyForIdAndUsername
};