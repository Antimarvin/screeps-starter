

Room.prototype.memory.buildQueue = []
Room.prototype.memory.resourcePlan = undefined

//Finds optimum quantity and body type for a given source and storage location... eventually.
function findOptimumSourcePlan(storageLocation, source) {
    let sourcePlan = {}
    sourcePlan.quantity = 2
    sourcePlan.bodyType = "speed"
    sourcePlan.target = source.id
    return sourcePlan
}

//Update room.memory.resourcePlan with sources as keys, and lists of required harvesters for the sources
Room.prototype.resourcePlanning = function resourcePlanning(){
    //ensure attribute is created
    this.memory.resourcePlan = undefined

    let roomSources = this.find(FIND_SOURCES)

    for(let source of roomSources){
        this.memory.resourcePlan[source.id] = findOptimumSourcePlan()
    }

}

Room.prototype.update = function update() {
    // if you don't have a resource Plan, make one
    if (!this.memory.resourcePlan) {
        this.memory.resourcePlan = this.resourcePlan()
    }
    // If you have one (catching empty rooms), adjust build queue as required.
    if (this.memory.resourcePlan) {
        for (let s of this.memory.resourcePlan) {
            let creeps = _.filter(Game.creeps, c => c.room.name === this.name &&
                c.memory.target === s &&
                c.memory.bodyType === s.bodyType)
            if(creeps.length < s.quantity){
                for(let i = creeps.length; i < s.quantity; i++){
                    let spawndata = harvester.spawnData(s.bodyType)
                    spawndata.memory.target = s
                    spawndata.name = spawndata.name + "S" + s + "_" + i
                    this.memory.buildQueue.append(spawndata)
                    }
                }
            }
        }
    }