//============================================================================
// Quasi Movement Plus
// Version: 1.0
// Last Update: Novemeber 23, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiMovementPlus.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - - Place somewhere below QuasiMovement
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/movement/
//  - - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
//============================================================================

var Imported = Imported || {};
Imported.Quasi_MovementPlus = 1.0;

//=============================================================================
 /*:
 * @plugindesc Adds extra features to Quasi Movement
 * @author Quasi      Site: http://quasixi.com
 *
 * @param Extra Interaction Distance
 * @desc Lets you increase the interaction distance, in pixel terms.
 * Default: 0
 * @default 0
 *
 * @param Dash on Mouse
 * @desc Auto dash on mouse clicks?
 * Set to true or false
 * @default true
 *
 * @param Face towards Mouse
 * @desc Player will face towards mouse location
 * Set to true or false
 * @default true
 *
 * @help
 * =============================================================================
 * ** Extras
 * =============================================================================
 * Stop Event while Messgae is playing <Comment> or <Note>
 *       <lockonmsg>
 *     Place this inside a comment on the event page or place it inside
 *     the events note.
 *
 *  ** Comments are Page based.
 *  ** Notes apply to all Pages.
 * =============================================================================
 * Links
 *  - http://quasixi.com/mv/movement/
 *  - https://github.com/quasixi/RPG-Maker-MV
 *  - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
 */
//=============================================================================

if (!Imported.Quasi_Movement) {
  alert("Error: Quasi Movement Plus requires Quasi Movement to work.");
  throw new Error("Error: Quasi Movement Plus requires Quasi Movement to work.")
}
(function() {
  var MovementPlus = {};
  MovementPlus.proccessParameters = function() {
    var parameters   = PluginManager.parameters('QuasiMovementPlus');
    this.interaction = Number(parameters['Extra Interaction Distance'] || 0);
    this.dashOnMouse = (parameters['Dash on Mouse'].toLowerCase() === 'true');
    this.faceMouse = (parameters['Face towards Mouse'].toLowerCase() === 'true');
  };
  MovementPlus.proccessParameters();

  TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._onMove(x, y);
  };

  //-----------------------------------------------------------------------------
  // Game_Player
  //
  // The game object class for the player. It contains event starting
  // determinants and map scrolling functions.

  var Alias_Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function() {
    Alias_Game_Player_initMembers.call(this);
    this._mouseX = TouchInput.x;
    this._mouseY = TouchInput.y;
  }

  var Alias_Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    if (!this.isMoving() && this.canMove()) {
      this.updateDirection();
    }
    Alias_Game_Player_update.call(this, sceneActive);
  };

  Game_Player.prototype.updateDirection = function() {
    if (this._mouseX !== TouchInput.x && this._mouseY !== TouchInput.y) {
      this._mouseX = TouchInput.x;
      this._mouseY = TouchInput.y;
      var x1 = $gameMap.canvasToMapPX(this._mouseX);
      var x2 = this.cx();
      var y1 = $gameMap.canvasToMapPY(this._mouseY);
      var y2 = this.cy();
      var radian = Math.atan2(-(y1 - y2), x1 - x2);
      radian += radian < 0 ? 2 * Math.PI : 0;
      if (radian >= 0 && radian < Math.PI / 4) {
        this.setDirection(6);
      } else if (radian >= Math.PI / 4 && radian < 3 * Math.PI / 4) {
        this.setDirection(8);
      } else if (radian >= 3 * Math.PI / 4 && radian < 5 * Math.PI / 4) {
        this.setDirection(4);
      } else if (radian >= 5 * Math.PI / 4 && radian < 7 * Math.PI / 4) {
        this.setDirection(2);
      } else if (radian >= 7 * Math.PI / 4) {
        this.setDirection(6);
      }
    }
  };

  Game_Player.prototype.updateDashing = function() {
    if (this.isMoving()) {
      return;
    }
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
      this._dashing = this.isDashButtonPressed() || (MovementPlus.dashOnMouse && $gameTemp.isDestinationValid());
    } else {
      this._dashing = false;
    }
  };

  Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
      var direction = this.direction();
      var x1 = this._px;
      var y1 = this._py;
      var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles() + MovementPlus.interaction);
      var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles() + MovementPlus.interaction);
      this.startMapEvent(x2, y2, triggers, true);
      if ($gameMap.isAnyEventStarting) {
        var es = $gameMap.isAnyEventStarting();
      } else if ($gameMap.someEventStarting) {
        var es = $gameMap.someEventStarting();
      } else {
        var es = true;
        alert("Please inform Quasi that you do not have a 'isAnyEventStarting' function");
      }
      if (!es) {
        return this.checkCounter(triggers);
      }
    }
  };

  Game_Player.prototype.checkCounter = function(triggers) {
    var direction = this.direction();
    var x1 = this._px;
    var y1 = this._py;
    var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles() + MovementPlus.interaction);
    var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles() + MovementPlus.interaction);
    this.collider().moveto(x2, y2);
    var boxes = $gameMap.getTileBoxesAt(this.collider());
    var passboxes = [];
    if (boxes.length === 0) {
      this.collider().moveto(x1, y1);
      return false;
    }
    var counter;
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isCounter) {
        continue;
      }
      counter = boxes[i];
      break;
    }
    this.collider().moveto(x1, y1);
    if (counter) {
      if ([4, 6].contains(direction)) {
        var dist = Math.abs(counter.center.x - this.cx());
        dist += this.collider().width;
      }  else if ([8, 2].contains(direction)) {
        var dist = Math.abs(counter.center.y - this.cy());
        dist += this.collider().height;
      }
      var x3 = $gameMap.roundPXWithDirection(x1, direction, dist);
      var y3 = $gameMap.roundPYWithDirection(y1, direction, dist);
      return this.startMapEvent(x3, y3, triggers, true);
    }
    return false;
  };

  Game_Player.prototype.shipBoatThere = function() {
    var direction = this.direction();
    var x1 = this._px;
    var y1 = this._py;
    var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles() + 4 + MovementPlus.interaction);
    var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles() + 4 + MovementPlus.interaction);
    var collider = this.copyCollider();
    collider.moveto(x2, y2)
    var vehicles = $gameMap.getCharactersAt(collider, function(e) {
      if (e.constructor !== Game_Vehicle) {
        return true;
      }
      return (e.isAirship() || !e.isOnMap());
    });
    if (vehicles.length === 0) {
      return false;
    }
    var cx = this.cx();
    var cy = this.cy();
    vehicles.sort(function(a, b) {
      return a.pixelDistanceFrom(cx, cy) - b.pixelDistanceFrom(cx, cy);
    });
    return vehicles[0];
  };

  //-----------------------------------------------------------------------------
  // Game_Event
  //
  // The game object class for an event. It contains functionality for event page
  // switching and running parallel process events.

    Game_Event.prototype.lockOnMsg = function() {
      var comment = this.comments();
      var note = this.notes();
      return /<lockonmsg>/i.test(comment) || /<lockonmsg>/i.test(note);
    };

    var Alias_Game_Event_updateStop = Game_Event.prototype.updateStop;
    Game_Event.prototype.updateStop = function() {
      if (this.lockOnMsg()) {
        if ($gameMessage.isBusy()) {
          this.lockedFromMsg = true;
          this.lock();
        } else if (this._locked && this.lockedFromMsg) {
          this.lockedMsg = null;
          this.unlock();
        }
      }
      Alias_Game_Event_updateStop.call(this);
    };
})();
