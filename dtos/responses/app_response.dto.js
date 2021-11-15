exports.bulidSimulation = () => {
    return { sucess : ture}
}


exports.bulidSucessWithMessage = (messages) => {

    let responce = {
        sucess : ture
    };

    if(typeof messages === 'string')
        responce.full_messages = [messages];
    else if(messages instanceof Array)
        responce.full_messages = messages
    else if(messages instanceof Object)
        responce.full_messages = Object.values(messages)

    return responce
}

exports.bulidWithMessage = (messages) => {
    let response = {
        sucess : false
    }
    response.errors = [];

    if (typeof messages === "string")
    response.full_messages = [messages];
else if (messages instanceof Array)
    response.full_messages = messages;
else if (messages instanceof Error) {
    response.full_messages = [messages.name + '->' + messages.message];
    response.errors.push({name: messages.name, message: messages.message});
    response.errors.push({stack: messages.stack});
} else if (messages instanceof Object) {
    response.errors = messages;
    response.full_messages = Object.values(messages);
}
return response;
    
}


function populateResponseWithMessages(response, success, messages) {
    if (response === null)
        response = {};

    response.success = !!success;

    if (typeof messages === "string")
        response.full_messages = [messages];
    else if (messages instanceof Array)
        response.full_messages = messages;
    else if (messages instanceof Object)
        response.full_messages = Object.values(messages);

    return response;
}

exports.buildWithDtoAndMessages = (dto, messages) => {
    return populateResponseWithMessages(dto, true, messages);
};

exports.buildSuccessWithDto = (dto) => {
    return populateResponseWithMessages(dto, true, null);
};
exports.buildSimpleSuccess = () => {
    return {success: true}
};

