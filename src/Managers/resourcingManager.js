let creepLogic = require('.././creeps/index');
function getEmpireSources() {

    let empireSources = []

    for(let r in Memory.rooms) {
        if(Memory.rooms[r].sources){
            for(let s in Memory.rooms[r].sources) {
                if(Object.keys(Memory.rooms[r].sources[s]).length !== 0){
                    //console.log(`Pushing ${Memory.rooms[r].sources[s].id} onto the stack`)
                    empireSources.push(Memory.rooms[r].sources[s])
                }
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
        //console.log(JSON.stringify(s))
        if(s !== undefined){
            let creeps = []

            //add harvesters
            creeps.push(creepLogic.harvester.defaultSettings(s.id,s.miningLocations[0],1))

            //add trucks
            creeps.push(creepLogic.miningTruck.defaultSettings(s.id, s.miningLocations[0],castleRoom.name, 1))

            Memory.resourcingManager[s.id] = {
                source: Game.getObjectById(s.id),
                miningLocations: s.miningLocations,
                distance: 0,
                creeps: creeps
            }
        }
    }
    for(let source in Memory.resourcingManager){
        for(let i = 0; i < Memory.resourcingManager[source].creeps.length; i++) {
            if(!(Memory.resourcingManager[source].creeps[i].name in Game.creeps)){
                console.log(`${Memory.resourcingManager[source].creeps[i].name} was not in game creeps`)
                castleRoom.memory.buildQueue.high.push(Memory.resourcingManager[source].creeps[i])
            }
        }
    }
 }
 module.exports = resourcingManager