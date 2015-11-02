//============================================================================
// Quasi Passive
// Version: 0.9
// Last Update: November 1, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiPassive.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/
//  - - http://forums.rpgmakerweb.com/ -- link
//============================================================================

var Imported = Imported || {};
Imported.Quasi_Passives = 0.9;

//=============================================================================
 /*:
 * @plugindesc 
 * @author Quasi      Site: http://quasixi.com
 *
 * @param Passive Skill Type
 * @desc Change this value to the Skill Type ID that you wish to hide.
 *  Skills with this skill type id, are not shown in menus.
 * @default 3
 *
 * @param Enable Equipping
 * @desc Set to true or false if you want to be able to equip passives.
 *  Default: true
 * @default true
 *
 * @param Menu Name
 * @desc The text you want to appear in menus for the Passive menu.
 *  Default: Passive
 * @default Passive
 *
 * @help
 * =============================================================================
 * **
 * =============================================================================
 *
 * =============================================================================
 * Links
 *  - http://quasixi.com/mv/
 *  - https://github.com/quasixi/RPG-Maker-MV
 *  - http://forums.rpgmakerweb.com/ -- link
 */
//=============================================================================

(function() {
  var Passives    = {};
  Passives.states = {};
  Passives.skills = {};

  Passives.isStatePassive = function(stateId) {
    if (!this.states[stateId]) {
      var passive = /(<passive>)/i.exec($dataStates[stateId].note);
      this.states[stateId] = passive !== null;
    }
    return this.states[stateId];
  };

  Passives.isSkillPassive = function(skillId) {
    if (!this.skills[stateId]) {
      var passive = /<passive:(.*)>/i.exec($dataSkills[skillId].note);
      this.skills[stateId] = passive ? passive[1] : false;
    }
    return this.skills[stateId];
  };

  //-----------------------------------------------------------------------------
  // Game_BattlerBase
  //
  // The superclass of Game_Battler. It mainly contains parameters calculation.

  var Alias_Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function() {
    Alias_Game_BattlerBase_initMembers.call(this);
    this._equippedPassives = [];
  };

  Game_BattlerBase.prototype.clearStates = function() {
    if (this._states) {
      this._states = this._states.filter(function(id) {
        return Passives.isStatePassive(id);
      });
      this._stateTurns = {};
    } else {
      this._states = [];
      this._stateTurns = {};
    }
  };

  var Alias_Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
  Game_BattlerBase.prototype.eraseState = function(stateId) {
    if (Passives.isStatePassive(stateId)) {
      return;
    }
    Alias_Game_BattlerBase_eraseState.call(this, stateId);
  };

})();
