// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        let hostileCreepWithHeal = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
            filter: c => c.getActiveBodyparts(HEAL)> 0
        });
        var target

        if (!hostileCreepWithHeal) {
              target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        else {
              target = hostileCreepWithHeal
        }
        // if one is found...
        if (target !== undefined) {
            // ...FIRE!
            this.attack(target);
        }
    };