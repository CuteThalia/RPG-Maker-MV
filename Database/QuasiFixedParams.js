//=============================================================================
// Quasi Fixed Params
// Version: 1.02
// Last Update: November 2, 2015
//=============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//=============================================================================
// How to install:
//  - Save this file as "QuasiFixedParams.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/fixed-params/
//  - - http://forums.rpgmakerweb.com/index.php?/topic/48777-quasi-fixed-params/
//=============================================================================
var Imported = Imported || {};
Imported.Quasi_FixedParams = 1.02;
//=============================================================================
 /*:
 * @plugindesc Adds some new parameters related to Sp-Param and Ex-Param
 * @author Quasi      Site: http://quasixi.com
 *
 * @help
 * =============================================================================
 * ** Setting up a States or Equips with Fixed Params
 * =============================================================================
 * Fixed Params allows you to add a fixed param value to states and equipment.
 * With this you can create states that will add a constant value to a param.
 * Or create a poison / regeneration state that ticks a fixed number.
 *   Setting up <note tag>
 *       <params>
 *       Param: Value
 *       </params>
 *     Where param can be: MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK and new Params
 *     Value can be any number or even a formula. Can use a and v[] but not b!
 *
 *   New Params:
 *   (HRT) Hp Regeneration tick     - Works like Hp Regeneration (Ex-Parameter)
 *   (MRT) Mp Regeneration tick     - Works like Mp Regeneration (Ex-Parameter)
 *   (TRT) Tp Regeneration tick     - Works like Tp Regeneration (Ex-Parameter)
 *   (MCC) Mp Cost Constant         - Works like Mp Cost Rate (Sp-Parameter)
 *   (TCC) Tp Charge Constant       - Works like Tp Charge Rate (Sp-Parameter)
 *   (PDC) Physical Damage Constant - Works like Physical Damage (Sp-Parameter)
 *   (MDC) Magical Damage Constant  - Works like Magical Damage (Sp-Parameter)
 *   (FDC) Floor Damage Constant    - Works like Floor Damage (Sp-Parameter)
 *   (EXC) Experience Constant      - Works like Expericence (Sp-Parameter)
 * The difference is that these new stats are fixed values, not a percent.
 * =============================================================================
 * ** Examples:
 * =============================================================================
 *   Example 1:
 *       <params>
 *       MHP: 100
 *       ATK: 20
 *       </params>
 *     Would result in that state adding 100 to max hp and 20 to attack.
 *
 *   Example 2:
 *       <params>
 *       MHP: -100
 *       MRT: 5 + v[1]
 *       </params>
 *     Would result in that state removes 100 hp but you will have an mp regen
 *     of 5 + value of variable 1
 *
 *  * value can be negative
 *  * param is not case sensative
 * =============================================================================
 *  * Links
 *  - http://quasixi.com/mv/
 *  - http://forums.rpgmakerweb.com/index.php?/topic/48777-quasi-fixed-params/
 */
//=============================================================================
(function() {
  Params = {};
  Params.id = {
    "mhp": 0,  "mmp": 1,  "atk": 2,  "def": 3,
    "mat": 4,  "mdf": 5,  "agi": 6,  "luk": 7,
    "hrt": 8,  "mrt": 9,  "trt": 10, "mcc": 11,
    "tcc": 12, "pdc": 13, "mdc": 14, "fdc": 15,
    "exc": 16
  }
  Params.states = {};
  Params.stateParamsPlus = function(stateId) {
    if (!this.states[stateId]) {
      var params = /<params>([\s\S]*)<\/params>/i.exec($dataStates[stateId].note);
      if (params) {
        this.states[stateId] = stringToObjAry(params[0]);
      } else {
        this.states[stateId] = false;
      }
    }
    return this.states[stateId];
  };

  Params.equips = {};
  Params.equips[0] = {};
  Params.equips[1] = {};
  Params.equipParamsPlus = function(equipId, isWeapon) {
    if (isWeapon) {
      var data = this.equips[0];
      var note = $dataWeapons[equipId].note;
    } else {
      var data = this.equips[1];
      var note = $dataArmors[equipId].note;
    }
    if (!data[equipId]) {
      var params = /<params>([\s\S]*)<\/params>/i.exec(note);
      if (params) {
        data[equipId] = stringToObjAry(params[0]);
      } else {
        data[equipId] = false;
      }
    }
    return data[equipId];
  };

  function stringToObjAry(string) {
    var ary = string.split('\n');
    var obj = {};
    ary = ary.filter(function(i) { return i != "" });
    ary.forEach(function(e, i, a) {
      var s = /^(.*):(.*)/.exec(e);
      if (s) {
        var id = Params.id[s[1].toLowerCase()];
        obj[id] = s[2];
      }
    });
    return obj;
  };

  //-----------------------------------------------------------------------------
  // Game_BattlerBase
  //
  // The superclass of Game_Battler. It mainly contains parameters calculation.

  Object.defineProperties(Game_BattlerBase.prototype, {
    // Hp Regeneration tick
    hrt: { get: function() { return this.qParam(0); }, configurable: true },
    // Mp Regeneration tick
    mrt: { get: function() { return this.qParam(1); }, configurable: true },
    // Tp Regeneration tick
    trt: { get: function() { return this.qParam(2); }, configurable: true },
    // Mp Cost Constant
    mcc: { get: function() { return this.qParam(3); }, configurable: true },
    // Tp Charge Constant
    tcc: { get: function() { return this.qParam(4); }, configurable: true },
    // Physical Damage Constant
    pdc: { get: function() { return this.qParam(5); }, configurable: true },
    // Magical Damage Constant
    mdc: { get: function() { return this.qParam(6); }, configurable: true },
    // Floor Damage Constant
    fdc: { get: function() { return this.qParam(7); }, configurable: true },
    // EXperience Constant
    exc: { get: function() { return this.qParam(8); }, configurable: true }
  });

  var Alias_Game_BattlerBase_param = Game_BattlerBase.prototype.param;
  Game_BattlerBase.prototype.param = function(paramId) {
    var value = Alias_Game_BattlerBase_param.call(this, paramId);
    value += this.stateParamPlus(paramId);
    value += this.equipParamPlus(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
  };

  Game_BattlerBase.prototype.stateParamPlus = function(paramId) {
    var value = 0;
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
      var params = Params.stateParamsPlus(states[i].id);
      if (params[paramId]) {
        var v = $gameVariables._data;
        var a = this;
        value += eval(params[paramId]);
      }
    }
    return value;
  };

  Game_BattlerBase.prototype.equipParamPlus = function(paramId) {
    return 0;
  };

  Game_BattlerBase.prototype.qParam = function(qParamId) {
    return Number(this.stateParamPlus(qParamId + 8) + this.equipParamPlus(qParamId + 8) || 0);
  };

  var Alias_Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
  Game_BattlerBase.prototype.skillMpCost = function(skill) {
    var value = Alias_Game_BattlerBase_skillMpCost.call(this, skill);
    return Math.floor(value + this.mcc);
  };

  //-----------------------------------------------------------------------------
  // Game_Battler
  //
  // The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
  // and actions.

  Game_Battler.prototype.regenerateHp = function() {
    var value = Math.floor(this.mhp * this.hrg + this.hrt);
    value = Math.max(value, -this.maxSlipDamage());
    if (value !== 0) {
      this.gainHp(value);
    }
  };

  Game_Battler.prototype.regenerateMp = function() {
    var value = Math.floor(this.mmp * this.mrg + this.mrt);
    if (value !== 0) {
      this.gainMp(value);
    }
  };

  Game_Battler.prototype.regenerateTp = function() {
    var value = Math.floor(100 * this.trg + this.trt);
    this.gainSilentTp(value);
  };

  Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var value = Math.floor(50 * damageRate * this.tcr + this.tcc);
    this.gainSilentTp(value);
  };

  //-----------------------------------------------------------------------------
  // Game_Actor
  //
  // The game object class for an actor.

  Game_Actor.prototype.equipParamPlus = function(paramId) {
    var value = 0;
    var equips = this.equips();
    equips.forEach(function(equip) {
      if (equip) {
        var params = Params.equipParamsPlus(equip.id, DataManager.isWeapon(equip));
        if (params[paramId]) {
          var v = $gameVariables._data;
          var a = this;
          value += eval(params[paramId]);
        }
      }
    }, this);
    return value;
  };

  var Alias_Game_Actor_basicFloorDamage = Game_Actor.prototype.basicFloorDamage;
  Game_Actor.prototype.basicFloorDamage = function() {
    var value = Alias_Game_Actor_basicFloorDamage.call(this);
    return value + this.fdc;
  };

  var Alias_Game_Actor_finalExpRate = Game_Actor.prototype.finalExpRate;
  Game_Actor.prototype.finalExpRate = function() {
    var value = Alias_Game_Actor_finalExpRate.call(this);
    return value + this.exc;
  };

  //-----------------------------------------------------------------------------
  // Game_Action
  //
  // The game object class for a battle action.

  Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
      value *= target.pdr;
      value += target.pdc;
    }
    if (this.isMagical()) {
      value *= target.mdr;
      value += target.mdc;
    }
    if (baseValue < 0) {
      value *= target.rec;
    }
    if (critical) {
      value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
  };

  Game_Action.prototype.applyItemUserEffect = function(target) {
    var value = Math.floor(this.item().tpGain * this.subject().tcr + this.subject().tcc);
    this.subject().gainSilentTp(value);
  };
})();
