const RolesDto = require('./roles.dto')

function registerDto(user){
    return {
        success: true,
        full_messages:['User registed sucessfully']
    }
}


function loginStatus(user){
    const token = user.generateJwt();
    return {
        sucess: true,
        token,
        user:{
            id:user.id,
            username:user.username,
            firstname:user.firstname,
            lastName:user.lastName,
            roles:RolesDto.toNameList(user.roles || []),
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
    registerDto, loginStatus, buildOnlyForIdAndUsername
};