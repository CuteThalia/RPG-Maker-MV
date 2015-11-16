//=============================================================================
// Quasi Params Plus
// Version: 1.054
// Last Update: November 16, 2015
//=============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//=============================================================================
// How to install:
//  - Save this file as "QuasiParamsPlus.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/
//  - - http://forums.rpgmakerweb.com/index.php?/topic/48777-quasi-params-plus/
//=============================================================================

var Imported = Imported || {};
Imported.Quasi_ParamsPlus = 1.054;

//=============================================================================
 /*:
 * @plugindesc Adds improvements to parameters
 * @author Quasi      Site: http://quasixi.com
 *
 * @param Use Custom Parameters
 * @desc If this is set to true, you will need a "Parameters.json" file inside
 * your data folder!     Set to true to enable, false to disable.
 * @default true
 *
 * @help
 * =============================================================================
 * ** Setting up Fixed Params
 * =============================================================================
 * Fixed Params allows you to add a fixed param value to states and equipment.
 * With this you can create states that will add a constant value to a param.
 * Or create a poison / regeneration state that ticks a fixed number.
 * ( You can also add these in Actors, Classes and Enemies Notes)
 *   Setting up <note tag>
 *       <params>
 *       Param: Value
 *       </params>
 *     Where param can be: MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK and new Params
 *     Value can be any number or even a formula. Can use a and v[] but not b!
 *
 *   New Built in Parameters:
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
 * ** Creating new Parameters
 * =============================================================================
 * To use custom parameters, you first have to enabled "Use Custom Parameters"
 * in the plugin settings. Next you need to create a json file inside the
 * data folder called "Parameters.json"
 *   If you do not know how to create a .json file download my sample
 *   Parameters.json file:
 *       https://gist.github.com/quasixi/3b928832bf42d4471560
 *
 *   JSON template <JSON>
 *       [
 *     	     {"abr": "abbreviation 1", "name": "param 1 name", "default": value},
 *     	     {"abr": "abbreviation 2", "name": "param 2 name", "default": value}
 *       ]
 *    (See the Example json file above!)
 *  Set abbreviation to the abbreviation you want to use for the new param.
 *   * Do not use any existing abbreviations ( Example: mhp, mmp, atk, ect..)
 *  Set param name to the full name of the parameter.
 *  Set default value to an number ( Can not use formulas here! )
 *   * Everything should be inside quotes except the value for default!
 *  Be careful with comma placement! Place a comma after every closing bracket }
 *  but not on the last one! ( Notice there's no comma after the } on line 65 )
 *    If you need helping setting these up, let me know or give me a list of
 *  the abbreviations, full name and default values, and I'll create it for
 *  you.
 * =============================================================================
 * ** Using new Parameters
 * =============================================================================
 * After you have created the new parameters you can use them the same way as
 * you use existing parameters.
 *     For example, lets say the abbreviation of a parameter I made was "qpp"
 *   If I want to get the value of qpp for my player I would use:
 *       $gameParty.members()[MEMBER ID].qpp
 *     (There are other ways to get an actors stat besides this!)
 *   Or if you want to use these parameters inside a forumla you would do:
 *       a.qpp    or    b.qpp
 *   These new parameters can be used inside the fixed params note tag!
 *
 *   To Change a custom Parameter use <Script Call>
 *       $gameParty.members()[MEMBER ID].addCParam(CParamId, value)
 *     * CParamId is the id of the custom parameter. which is based on
 *     the order the custom param was made. So in my example since param qpp
 *     was made first that would have an id of 0, while qpt has an id of 1.
 *     * Value can be a negative number.
 *
 *   These new functions can be used to get data from the new custom parameters
 *       QuasiParams.customAbr(ID)
 *       QuasiParams.customName(ID)
 *       QuasiParams.customMin(ID)
 *       QuasiParams.customMax(ID)
 *     Set ID to the id of the custom parameter.
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
 *   Example of Stat to rate:
 *      <rates>
 *      5 agi to cri
 *      5 agi to hit
 *      </rates>
 *    For every 5 agi you will gain 1% of critical and hit rate.
 *    (Can only be used inside Actors, Classes and Enemy notes!)
 *
 *  * value can be negative
 *  * params is not case sensative
 * =============================================================================
 *  * Links
 *  - http://quasixi.com/mv/
 *  - http://forums.rpgmakerweb.com/index.php?/topic/48777-quasi-params-plus/
 */
//=============================================================================

var QuasiParams = (function() {
  var Params = {};
  Params.public = {};
  Params.plugin = PluginManager.parameters('QuasiParamsPlus');
  Params.public.id = {
    "mhp": 0,  "mmp": 1,  "atk": 2,  "def": 3,
    "mat": 4,  "mdf": 5,  "agi": 6,  "luk": 7,
    "hrt": 8,  "mrt": 9,  "trt": 10, "mcc": 11,
    "tcc": 12, "pdc": 13, "mdc": 14, "fdc": 15,
    "exc": 16
  }
  Params.public.xid = {
    "hit": 0, "eva": 1, "cri": 2, "cev": 3,
    "mev": 4, "mrf": 5, "cnt": 6, "hrg": 7,
    "mrg": 8, "trg": 9
  }
  Params.public.sid = {
    "trg": 0, "grd": 1, "rec": 2, "pha": 3,
    "mcr": 4, "tcr": 5, "pdr": 6, "mdr": 7,
    "fdr": 8, "exr": 9
  }

  Params.states = {};
  Params.stateParamsPlus = function(stateId) {
    if (!this.states[stateId]) {
      var params = /<params>([\s\S]*)<\/params>/i.exec($dataStates[stateId].note);
      if (params) {
        this.states[stateId] = this.stringToObjAry(params[1]);
      } else {
        this.states[stateId] = 0;
      }
    }
    return this.states[stateId];
  };

  Params.equips = [];
  Params.equips[0] = {}; // weapons
  Params.equips[1] = {}; // armors
  Params.equipParamsPlus = function(equip) {
    if (!equip.atypeId) {
      var data = this.equips[0];
    } else {
      var data = this.equips[1];
    }
    var id = equip.baseItemId || equip.id;
    if (!data[id]) {
      var note   = equip.note;
      var params = /<params>([\s\S]*)<\/params>/i.exec(note);
      if (params) {
        data[id] = this.stringToObjAry(params[1]);
      } else {
        data[id] = data[id] || {};
      }
    }
    return data[id];
  };

  Params.charas = [];
  Params.charas[0] = {}; // actors
  Params.charas[1] = {}; // classes
  Params.charas[2] = {}; // enemies
  Params.charaParamsPlus = function(charaId, type) {
    if (type === "actor") {
      var data = this.charas[0];
      var note = $dataActors[charaId].note;
    } else if (type === "class") {
      var data = this.charas[1];
      var note = $dataClasses[charaId].note;
    } else if (type === "enemy") {
      var data = this.charas[2];
      var note = $dataEnemies[charaId].note;
    }
    if (!data[charaId]) {
      var params = /<params>([\s\S]*)<\/params>/i.exec(note);
      if (params) {
        data[charaId] = this.stringToObjAry(params[1]);
      } else {
        data[charaId] = 0;
      }
    }
    return data[charaId];
  };

  Params.rates = {xParam: {}, sParam: {}};
  Params.rates["xParam"][0] = {}; // actors
  Params.rates["sParam"][0] = {}; // actors
  Params.rates["xParam"][1] = {}; // classes
  Params.rates["sParam"][1] = {}; // classes
  Params.rates["xParam"][2] = {}; // enemies
  Params.rates["sParam"][2] = {}; // enemies
  Params.rateParamsPlus = function(charaId, type, pType) {
    if (type === "actor") {
      var data = this.rates[pType][0];
      var note = $dataActors[charaId].note;
    } else if (type === "class") {
      var data = this.rates[pType][1];
      var note = $dataClasses[charaId].note;
    } else if (type === "enemy") {
      var data = this.rates[pType][2];
      var note = $dataEnemies[charaId].note;
    }
    if (!data[charaId]) {
      var params = /<rates>([\s\S]*)<\/rates>/i.exec(note);
      if (params) {
        data[charaId] = this.stringToRateAry(params[1], pType);;
      } else {
        data[charaId] = {};
      }

    }
    return data[charaId];
  };

  Params.custom = [];
  Params.useCustom = (Params.plugin['Use Custom Parameters'].toLowerCase() === 'true');
  Params.loadCustomParams = function() {
    if (this.useCustom) {
      var xhr = new XMLHttpRequest();
      var url = 'data/Parameters.json';
      xhr.open('GET', url, true);
      xhr.overrideMimeType('application/json');
      xhr.onload = function() {
        Params.custom = JSON.parse(xhr.responseText);
      };
      xhr.onerror = function() {
        alert("File: data/Parameters.json not found.");
      };
      xhr.send();
    }
  };
  Params.loadCustomParams();

  Params.public.customAbr = function(id) {
    return Params.custom[id].abr;
  };

  Params.public.customName = function(id) {
    return Params.custom[id].name;
  };

  Params.public.customMax = function(id) {
    return Params.custom[id].max;
  };

  Params.public.customMin = function(id) {
    return Params.custom[id].min;
  };

  Params.stringToObjAry = function(string) {
    var ary = string.split('\n');
    var obj = {};
    ary = ary.filter(function(i) { return i != ""; });
    ary.forEach(function(e) {
      var s = /^(.*):(.*)/.exec(e);
      if (s) {
        var id = Params.public.id[s[1].toLowerCase()];
        if (typeof id === 'undefined') {
          var p = s[1].toLowerCase();
          for (var i = 0; i < Params.custom.length; i++) {
            if (Params.custom[i]["abr"] === p) {
              break;
            }
          }
          id = 17 + i;
        }
        obj[id] = s[2];
      }
    });
    return obj;
  };

  Params.stringToRateAry = function(string, pType) {
    var ary = string.split('\n');
    var obj = {};
    ary = ary.filter(function(i) { return i != ""; });
    ary.forEach(function(e) {
      var s = /(-?[0-9]*)(.*)to(.*)/.exec(e);
      if (s) {
        s = s.map(function(i) { return i.replace(/\s+/g,'')});
        if (pType === "xParam") {
          var id = Params.public.xid[s[3].toLowerCase()];
        } else {
          var id = Params.public.sid[s[3].toLowerCase()];
        }
        var stat  = s[2].toLowerCase();
        var value = Number(s[1] || 1);
        obj[id] = "(a."+ stat + "/ " + value + ") / 100";
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

  var Alias_Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function() {
    Alias_Game_BattlerBase_initMembers.call(this);
    this._cParamPlus = {};
    Params.custom.forEach(function(param, index) {
      this._cParamPlus[index] = 0;
    }, this);
    if (!Params.addedCustoms) {
      Params.custom.forEach(function(param, index) {
        if (param["abr"] in this) {
          alert("Can not use the abbreviation " + param["abr"]);
        } else {
          var obj = {};
          obj[param["abr"]] = { get: function() {return this.cParam(index); }, configurable: true }
          Object.defineProperties(Game_BattlerBase.prototype, obj);
        }
      }, this);
      Params.addedCustoms = true;
    }
  };

  var Alias_Game_BattlerBase_param = Game_BattlerBase.prototype.param;
  Game_BattlerBase.prototype.param = function(paramId) {
    var value = Alias_Game_BattlerBase_param.call(this, paramId);
    value += this.stateParamPlus(paramId);
    value += this.equipParamPlus(paramId);
    value += this.getCharaParamPlus(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    var finalValue = Math.round(value.clamp(minValue, maxValue));
    return finalValue;
  };

  var Alias_Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
  Game_BattlerBase.prototype.xparam = function(xparamId) {
    var value = Alias_Game_BattlerBase_xparam.call(this, xparamId);
    value += this.getRateParamPlus(xparamId, "xParam");
    return value;
  };

  var Alias_Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
  Game_BattlerBase.prototype.sparam = function(sparamId) {
    var value = Alias_Game_BattlerBase_sparam.call(this, sparamId);
    value += this.getRateParamPlus(sparamId, "sParam");
    return value;
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
    return Number(value || 0);
  };

  Game_BattlerBase.prototype.equipParamPlus = function(paramId) {
    return 0;
  };

  Game_BattlerBase.prototype.getCharaParamPlus = function(paramId) {
    var value = 0;
    if (this.isActor()) {
      value += this.charaParamPlus(paramId, this.actorId(), "actor");
      value += this.charaParamPlus(paramId, this._classId, "class");
    } else if (this.isEnemy()) {
      value += this.charaParamPlus(paramId, this.enemyId(), "enemy");
      // if plugin for enemy class, then add enemy classes params here.
    }
    return Number(value || 0);
  };

  Game_BattlerBase.prototype.charaParamPlus = function(paramId, charaId, type) {
    if (type) {
      var value = 0;
      var params = Params.charaParamsPlus(charaId, type);
      if (params[paramId]) {
        var v = $gameVariables._data;
        var a = this;
        value += eval(params[paramId]);
      }
    }
    return Number(value || 0);
  };

  Game_BattlerBase.prototype.getRateParamPlus = function(paramId, pType) {
    var value = 0;
    if (this.isActor()) {
      value += this.rateParamPlus(paramId, this.actorId(), "actor", pType);
      value += this.rateParamPlus(paramId, this._classId, "class", pType);
    } else if (this.isEnemy()) {
      value += this.rateParamPlus(paramId, this.enemyId(), "enemy", pType);
      // if plugin for enemy class, then add enemy classes params here.
    }
    return Number(value || 0);
  };

  Game_BattlerBase.prototype.rateParamPlus = function(paramId, charaId, type, pType) {
    if (type) {
      var value = 0;
      var params = Params.rateParamsPlus(charaId, type, pType);
      if (params[paramId]) {
        var a = this;
        value += eval(params[paramId]);
      }
    }
    return Number(value || 0);
  };

  Game_BattlerBase.prototype.qParam = function(qParamId) {
    var value = this.stateParamPlus(qParamId + 8);
    value += this.equipParamPlus(qParamId + 8);
    value += this.getCharaParamPlus(qParamId + 8);
    if (qParamId > 8) {
      value += Params.custom[qParamId - 9].default || 0;
      value += this._cParamPlus[qParamId - 9] || 0;
    }
    return value || 0;
  };

  Game_BattlerBase.prototype.cParam = function(cParamId) {
    var value = this.qParam(cParamId + 9);
    var min   = typeof Params.public.customMin(cParamId) === 'number' ? Params.public.customMin(cParamId) : value;
    var max   = typeof Params.public.customMax(cParamId) === 'number' ? Params.public.customMax(cParamId) : value;
    return Math.round(value.clamp(min, max));;
  };

  Game_BattlerBase.prototype.addCParam = function(paramId, value) {
    if (!this._cParamPlus[paramId]) {
      this._cParamPlus[paramId] = 0;
    }
    this._cParamPlus[paramId] += value;
    this.refresh();
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
        var params = Params.equipParamsPlus(equip);
        if (params[paramId]) {
          var v = $gameVariables._data;
          var a = this;
          value += eval(params[paramId]);
        }
      }
    }, this);
    return Number(value || 0);
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

  if (Imported.YEP_DamageCore) {
    Game_Action.prototype.applyPhysicalRate = function(value, baseDamage, target) {
      value *= target.pdr;
      return value + target.pdc;
    };
    Game_Action.prototype.applyMagicalRate = function(value, baseDamage, target) {
      value *= target.mdr;
      return value + target.mdc;
    };
  } else {
    var Alias_Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
      if (Imported.YEP_DamageCore) {
        return Alias_Game_Action_makeDamageValue.call(this, target, critical);
      }
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
  }

  var Alias_Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function(target) {
    Alias_Game_Action_applyItemUserEffect.call(this, target);
    var value = Math.floor(this.subject().tcc);
    this.subject().gainSilentTp(value);
  };

  return Params.public;
})();
