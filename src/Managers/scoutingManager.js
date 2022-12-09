let creepLogic = require('.././creeps/index');


function scoutingManager(castleRoom){

    Memory.scoutingManager = {
        creeps: [creepLogic.scout.defaultSettings(1)]
    }

    let roomsToScout = []
    for(let adjacentRoomsKey in castleRoom.memory.adjacentRooms){
        if(!(castleRoom.memory.adjacentRooms[adjacentRoomsKey] in Memory.rooms)) {
            roomsToScout.push(castleRoom.memory.adjacentRooms[adjacentRoomsKey])
        }
    }
    //console.log(JSON.stringify(roomsToScout))

    // Check to make sure all your creeps are spawned, if not add them to build queue
    for(let i = 0; i < Memory.scoutingManager.creeps.length; i++) {
        if((!(Memory.scoutingManager.creeps[i].name in Game.creeps) && roomsToScout.length > 0)){
            console.log(`${Memory.scoutingManager.creeps[i].name} was not in game creeps`)
            castleRoom.memory.buildQueue.medium.push(Memory.scoutingManager.creeps[i])
        }
    }

    let scouts = _.filter(Game.creeps, c => c.memory.role === 'scout')
    if(scouts){
        for(let s in scouts){
            let scout = scouts[s]
            console.log(`Scout ${scout.name} is working ${scout.memory.working}`)
            if(scout.memory.working === false && roomsToScout.length > 0){
                //console.log(`Sending ${scout.name} to go to ${roomsToScout[0]}`)
                scout.memory.working = true
                scout.memory.targetRoom = roomsToScout[0]
                //console.log(scout.memory.targetRoom)
            }
        }
    }



}
module.exports = scoutingManager