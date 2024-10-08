const Item = require("../Item");

module.exports = class Armor extends Item {
  constructor(options) {
    super("Armor");

    this.uses = 1;
    // if armour starts out broken, the setter will handle the logic of making it broken
    this.brokenUses = 0;
    this.optionBroken = options?.broken;
    this.magicCult = options?.magicCult;

    this.listeners = {
      immune: function (action, player) {
        //let killer = this.getVisitors(this.target, "kill");

        if (player == this.holder && action.hasLabel("kill")) {
          if (this.holder.tempImmunity["kill"]) return;

          // check for effect immunity
          for (let effect of this.holder.effects)
            if (effect.immunity["kill"] && effect.name != "Kill Immune") return;

          // check for saves
          for (let action of this.game.actions[0]) {
            if (action.target === this.holder && action.hasLabel("save")) {
              return;
            }
          }

          if (this.magicCult) {
            action.actor.giveEffect("Insanity");
          }

          this.uses--;
          this.holder.queueAlert(
            ":armor: Shattering to pieces, your armor saves your life!"
          );

          if (this.uses <= 0) {
            this.removeEffectsIfNeeded();
            if (this.brokenUses <= 0) {
              this.drop();
            }
          }
        }
      },
    };
  }

  set broken(broken) {
    if (broken) {
      this.brokenUses += this.uses;
      this.uses = 0;
      this.removeEffectsIfNeeded();
    } else {
      this.uses += this.brokenUses;
      this.brokenUses = 0;
      this.applyEffectsIfNeeded();
    }
  }

  removeEffectsIfNeeded() {
    if (this.effects.length > 0) {
      this.removeEffects();
      this.effects = [];
    }
  }

  applyEffectsIfNeeded() {
    if (this.uses > 0 && this.effects.length == 0) {
      this.effects = ["Kill Immune"];
      this.applyEffects();
    }
  }

  hold(player) {
    for (let item of player.items) {
      if (item.name == "Armor") {
        item.uses += this.uses;
        item.brokenUses += this.brokenUses;
        item.applyEffectsIfNeeded();
        return;
      }
    }

    super.hold(player);
    this.broken = this.optionBroken;
  }
};
