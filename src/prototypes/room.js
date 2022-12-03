//Initialize rooms with data
Room.prototype.init = function init(){
    console.log("Running init for ." + this.name)
    this.memory.hrPlan = {
        harvester: {
            role: 'harvester',
            minQty: 5
        },
        upgrader: {
            role: 'upgrader',
            minQty: 5
        }
    }

}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    //if this room has no memory then initialize the room
    if (!this.memory.hrPlan || debug_status) {
        this.init();
    }
}
