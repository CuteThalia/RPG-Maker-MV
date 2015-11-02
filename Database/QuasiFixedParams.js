//=============================================================================
// Quasi Fixed Params
// Version: 1.01
// Last Update: November 1, 2015
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
//  - - http://forums.rpgmakerweb.com/ (post link)
//=============================================================================
var Imported = Imported || {};
Imported.Quasi_FixedParams = 1.01;
//=============================================================================
 /*:
 * @plugindesc Change the way movement works.
 * @author Quasi      Site: http://quasixi.com
 *
 * @help
 * =============================================================================
 * ** Setting up a State with Fixed Params
 * =============================================================================
 * Fixed Params allows you to add a fixed param value to states. With this you
 * can create states that will add a constant value to a param. Or create
 * a posion / regeneration state that ticks a fixed number.
 *   Setting up <note tag>
 *       <params>
 *       Param: Value
 *       </params>
 *     Where param can be: MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK, HRT, MRT, TRT
 *     Value can be any number or even a formula. Can use a and v[] but not b!
 *
 * HRT, MRT, TRT are new params that work like HRG, MRG, TGR but instead of
 * increasing/decreasing by a percentage, they tick a fixed value.
 * =============================================================================
 * ** Examples:
 * =============================================================================
 *   Example 1:
 *       <param>
 *       MHP: 100
 *       ATK: 20
 *       </param>
 *     Would result in that state adding 100 to max hp and 20 to attack.
 *
 *   Example 2:
 *       <param>
 *       MHP: -100
 *       MRT: 5 + v[1]
 *       </param>
 *     Would result in that state removes 100 hp but you will have an mp regen
 *     of 5 + value of variable 1
 *
 *  * value can be negative
 *  * param is not case sensative
 * =============================================================================
 *  * Links
 *  - http://quasixi.com/mv/fixed-params/
 *  - http://forums.rpgmakerweb.com/ (post link)
 */
//=============================================================================
(function() {
  Params = {};
  Params.id = {
    "mhp": 0, "mmp": 1, "atk": 2, "def": 3,
    "mat": 4, "mdf": 5, "agi": 6, "luk": 7,
    "hrt": 8, "mrt": 9, "trt": 10
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
    trt: { get: function() { return this.qParam(2); }, configurable: true }
  });

  var Alias_Game_BattlerBase_param = Game_BattlerBase.prototype.param;
  Game_BattlerBase.prototype.param = function(paramId) {
    var value = Alias_Game_BattlerBase_param.call(this, paramId);
    value += this.stateParamPlus(paramId);
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

  Game_BattlerBase.prototype.qParam = function(qParamId) {
    return this.stateParamPlus(qParamId + 8);
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
})();
