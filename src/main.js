let creepLogic = require('./creeps');
let roomLogic = require('./room');
let prototypes = require('./prototypes'); //needs to be called to update prototypes. otherwise unused
let config = require('../.screeps.json')


module.exports.loop = function () {
    let debug_status = config.debug
    // make a list of all of our rooms;
    let myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    // Run room update to update room plans for all rooms
    _.forEach(myRooms, r => r.update(debug_status));

    // run spawn logic against each room in our empire

    _.forEach(myRooms, r => roomLogic.spawning(r));
    
    // run each creep role see /creeps/index.js
    for(let n in Game.creeps) {
        let creep = Game.creeps[n];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }

    // free up memory if creep no longer exists
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}