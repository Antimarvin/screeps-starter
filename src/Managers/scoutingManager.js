let creepLogic = require('.././creeps/index');


function scoutingManager(castleRoom){

    Memory.scoutingManager = {
        creeps: [creepLogic.scout.defaultSettings(1)]
    }

    let roomsToScout = []
    for(let room in castleRoom.memory.adjacentRooms){
        if(!(room.name in Memory.rooms)) {
            roomsToScout.push(room.name)
        }
    }

    // Check to make sure all your creeps are spawned, if not add them to build queue
    for(let i = 0; i < Memory.scoutingManager.creeps.length; i++) {
        if((!(Memory.scoutingManager.creeps[i].name in Game.creeps) && roomsToScout.length > 0)){
            console.log(`${Memory.scoutingManager.creeps[i].name} was not in game creeps`)
            castleRoom.memory.buildQueue.medium.push(Memory.scoutingManager.creeps[i])
        }
    }


    let scouts = _.filter(Game.creeps, c => c.memory.role === 'scout')
    if(scouts){
        for(let scout in scouts){
            if(scout.memory.working === false){
                scout.memory.working = true
                scout.memory.targetRoom = roomsToScout[0]
            }
        }
    }



}
module.exports = scoutingManager