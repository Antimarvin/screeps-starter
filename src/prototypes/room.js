
Room.prototype.updateContainerProps = function (debug_status){
    console.log("Running Container Props for ." + this.name)
    if(!this.memory.containers || debug_status) {
        this.memory.containers = {}
    }

    let containers = this.find(FIND_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_CONTAINER)
    })

    let sources = this.find(FIND_SOURCES)

    for(let c of containers){
        if(!this.memory.containers[c.id]){

            this.memory.containers[c.id] = {}
            let isSourceContainer = false

            for(let s of sources){
                if(c.pos.isNearTo(s)){
                    isSourceContainer = true
                    break
                }
            }
            this.memory.containers[c.id].mine = isSourceContainer;
        }
    }
}

//Initialize hrPlan with base role quantities
Room.prototype.createHRPlan = function (){
    console.log("Running HR plan for ." + this.name)
    this.memory.hrPlan = {
        harvester: {
            role: 'harvester',
            minQty: this.find(FIND_SOURCES).length
        },
        truck: {
            role: 'truck',
            minQty: 2
        },
        upgrader: {
            role: 'upgrader',
            minQty: 4
        },
        builder: {
            role: 'builder',
            minQty: 2
        },
        repairer: {
            role: 'repairer',
            minQty: 4
        },
        wallRepairer: {
            role: 'wallRepairer',
            minQty: 1
        }
    }
}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    //if this room has no memory then initialize the room
    if (!this.memory.hrPlan || debug_status) {
        this.createHRPlan();
    }
    if(!this.memory.containers || debug_status){
        this.updateContainerProps();
    }
    if(!this.memory.containers || debug_status){
        this.updateContainerProps(debug_status);
    }
}
