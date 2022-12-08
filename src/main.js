let prototypes = require('./prototypes'); //needs to be called to update prototypes. otherwise unused
let creepLogic = require('./creeps');
let roomLogic = require('./room');
let managersLogic = require('./Managers')
let config = require('../.screeps.json');


module.exports.loop = function () {
    let debug_status = config.debug
    // make a list of all of our rooms;
    let myCastles = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    // Run room update to update room plans for all rooms
    _.forEach(Game.rooms, r => r.update(debug_status));
    _.forEach(myCastles, r => managersLogic.resourcingManager(r));
    _.forEach(myCastles, r => managersLogic.fillingManager(r));
    _.forEach(myCastles, r => managersLogic.scoutingManager(r));

    //run resourcing manager to update resourcing creep commands and develop needed creeps


    // run spawn logic against each room in our empire

    _.forEach(myCastles, r => roomLogic.spawning(r));
    
    // run each creep role see /creeps/index.js
    for(let n in Game.creeps) {
        let creep = Game.creeps[n];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }

    //tower logic. Find each tower. Call defend to shoot stuff
    let towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // run tower logic
        tower.defend();
    }

    // free up memory if creep no longer exists
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}