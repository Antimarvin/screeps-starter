// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if one is found...
        if (target !== undefined) {
            // ...FIRE!
            this.attack(target);
        }
    };