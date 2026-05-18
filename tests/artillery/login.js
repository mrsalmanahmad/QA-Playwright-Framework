const {testLogin} = require('../commands/login')

async function artilleryScript(page){
    await testLogin(page)
}

module.exports = {
    artilleryScript,
};

