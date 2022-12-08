let creepLogic = require('.././creeps/index');


function fillingManager(castleRoom){

    Memory.fillingManager = {
        creeps: [creepLogic.truck.defaultSettings(1)]
    }

    // Check to make sure all your creeps are spawned, if not add them to build queue
    for(let i = 0; i < Memory.fillingManager.creeps.length; i++) {
        if(!(Memory.fillingManager.creeps[i].name in Game.creeps)){
            console.log(`${Memory.fillingManager.creeps[i].name} was not in game creeps`)
            castleRoom.memory.buildQueue.medium.push(Memory.fillingManager.creeps[i])
        }
    }
}
module.exports = fillingManager