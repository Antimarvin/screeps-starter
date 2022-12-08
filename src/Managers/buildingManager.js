let creepLogic = require('.././creeps/index');

function buildingManager(castleRoom){

    Memory.buildingManager = {
        creeps: [creepLogic.builder.defaultSettings(1)]
    }
    let constructionSites = [Game.constructionSites[i]]
    let highPriorityRepair = _.filter(Game.structures, s => s.hits < s.hitsMax
        && (s.structureType === STRUCTURE_SPAWN
        || s.structureType === STRUCTURE_STORAGE
        || s.structureType === STRUCTURE_EXTENSION))
    let mediumPriorityRepair = _.filter(Game.structures, s => s.hits < s.hitsMax
        && (s.structureType === STRUCTURE_LAB
            || s.structureType === STRUCTURE_CONTAINER
            || s.structureType === STRUCTURE_LINK))
    let lowPriorityRepair = _.filter(Game.structures, s => s.hits < s.hitsMax
        && (s.structureType === STRUCTURE_ROAD))

    // Check to make sure all your creeps are spawned, if not add them to build queue
    for(let i = 0; i < Memory.buildingManager.creeps.length; i++) {
        if(!(Memory.buildingManager.creeps[i].name in Game.creeps)){
            console.log(`${Memory.buildingManager.creeps[i].name} was not in game creeps`)
            castleRoom.memory.buildQueue.medium.push(Memory.buildingManager.creeps[i])
        }
    }
    let builders = _.filter(Game.creeps, c => c.memory.role === 'builder')
    if(builders){
        for(let builder in builders){
            if(builder.memory.job === false){

            }
        }
    }

}
module.exports = buildingManager