function onlyName(role) {
    return {name: role.get('name')}
}

function toNameList(roles) {
    console.log(roles);
    if (roles == null) return [];
    return roles.map(r => r.name)
}

module.exports = {
    onlyName, toNameList
};