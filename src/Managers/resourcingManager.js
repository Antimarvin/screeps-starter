let creepLogic = require('.././creeps/index');
function getEmpireSources() {

    let empireSources = []

    for(let r in Memory.rooms) {
        if(Memory.rooms[r].sources){
            for(let s in Memory.rooms[r].sources) {
                empireSources.push(Memory.rooms[r].sources[s])
            }
        }
    }
    return empireSources
}


 function resourcingManager(castleRoom){

    //create object if it doesnt exist
    Memory.resourcingManager = {}


    let allSources = getEmpireSources()

    //create list of all sources
    for(let s of allSources){
        if(s !== undefined){
            let sourceObject = Game.getObjectById(s.id)
            let creeps = []

            //add harvesters
            creeps.push(creepLogic.harvester.defaultSettings(sourceObject.id,1))

            //add trucks
            creeps.push(creepLogic.miningTruck.defaultSettings(sourceObject.id, s.miningLocations[0],castleRoom.name, 1))

            Memory.resourcingManager[s.id] = {
                source: Game.getObjectById(s.id),
                miningLocations: s.miningLocations,
                distance: 0,
                creeps: creeps
            }
        }
    }

    console.log(JSON.stringify(castleRoom.memory.buildQueue.high))
    for(let source in Memory.resourcingManager){
        for(let i = 0; i < Memory.resourcingManager[source].creeps.length; i++) {
            if(!(Memory.resourcingManager[source].creeps[i].name in Game.creeps)){
                console.log(`${Memory.resourcingManager[source].creeps[i].name} was not in game creeps`)
                castleRoom.memory.buildQueue.high.push(Memory.resourcingManager[source].creeps[i])
            }
        }
    }
     console.log(JSON.stringify(castleRoom.memory.buildQueue.high))
 }
 module.exports = resourcingManager