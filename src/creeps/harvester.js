const HARVESTER_TYPES = {
    speed: [WORK, CARRY, MOVE, MOVE],
    capacity: [WORK, CARRY, CARRY, MOVE],
    efficiency: [WORK, WORK, CARRY, MOVE]
}

var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            creep.say('Mining!')
            if(creep.harvest(Game.getObjectById(creep.memory.target)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target));
            }
        }
        else {
            creep.say('Full');
            
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    },
    // returns an object with the data to spawn a new creep
    /** *
     * @param {string} type
     */
    spawnData: function(type) {
            let body = HARVESTER_TYPES[type];
            let memory = {role: 'harvester', busy: false};
            let name = type + " Harvester S-";

            return {body: body, name: name, memory: memory};
    }
};

module.exports =  harvester;