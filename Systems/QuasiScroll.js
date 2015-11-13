//============================================================================
// Quasi Scroll
// Version: 1.0
// Last Update: November 13, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiScroll.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/
//  - - http://forums.rpgmakerweb.com/ - add link when accepted
//============================================================================

var Imported = Imported || {};
Imported.Quasi_Scroll = 1.0;

//=============================================================================
 /*:
 * @plugindesc Allows for diagonal scrolls and scrolling towards a character
 * @author Quasi      Site: http://quasixi.com
 *
 * @help
 * =============================================================================
 * ** How to use Quasi Scroll
 * =============================================================================
 * Quasi scrolling will let the screen scroll at any angle and can do the
 * math for you can find the scroll distance to a certain event or player.
 *
 *   Diagonal Scrolls <Script Call>
 *       $gameMap.startQuasiScroll(distanceX, distanceY, speed);
 *     Set distanceX and distanceY to the value you want to scroll.
 *      - This values are in grid terms.
 *     Set speed to the scrolling speed.
 *      - 1 - 6 same as from the Scroll Map Event command.
 *
 *   Scroll Towards Characters <Script Call>
 *       $gameMap.scrollTowards(ID, speed);
 *     Set ID to the ID of the event you want to scroll towards.
 *      - If ID is set to 0, then it will scroll to the player.
 *     Set speed to the scroll speed.
 * =============================================================================
 * ** How to use Quasi Scroll with frames instead of default speed settings
 * =============================================================================
 * Using the scroll with a frame duration instead of speed can be helpful with
 * timing / making cutscenes since the screen can scroll at any speed you want
 * it.
 *
 *   Diagonal Scrolls <Script Call>
 *       $gameMap.startQuasiScroll(distanceX, distanceY, duration, true);
 *     Set distanceX and distanceY to the value you want to scroll.
 *      - This values are in grid terms.
 *     Set duration to the amount of frames this scroll will take
 *     !IMPORTANT! Leave the last value as true! This sets it appart from
 *     the other .startQuasiScroll()!
 *
 *   Scroll Towards Characters <Script Call>
 *       $gameMap.scrollTowards(ID, duration, true);
 *     Set ID to the ID of the event you want to scroll towards.
 *      - If ID is set to 0, then it will scroll to the player.
 *     Set duration to the amount of frames this scroll will take
 *     !IMPORTANT! Leave the last value as true! This sets it appart from
 *     the other .scrollTowards()!
 * =============================================================================
 * Links
 *  - http://quasixi.com/mv/
 *  - https://github.com/quasixi/RPG-Maker-MV
 *  - http://forums.rpgmakerweb.com/ - add link when accepted
 */
//=============================================================================

(function() {
  Game_Map.prototype.startQuasiScroll = function(distanceX, distanceY, speed, frames) {
    if (!this.isLoopHorizontal()) {
      if (this._displayX + distanceX < 0) {
        distanceX = -this._displayX;
      }
      if (this._displayX + distanceX > this.width() - this.screenTileX()) {
        distanceX = this.width() - this.screenTileX() - this._displayX;
      }
    }
    if (!this.isLoopVertical()) {
      if (this._displayY + distanceY < 0) {
        distanceY = -this._displayY;
      }
      if (this._displayY + distanceY > this.height() - this.screenTileY()) {
        distanceY = this.height() - this.screenTileY() - this._displayY;
      }
    }
    var directionX = distanceX > 0 ? 6 : distanceX < 0 ? 4 : 0;
    var directionY = distanceY > 0 ? 2 : distanceY < 0 ? 8 : 0;
    this._scrollDirection = [directionX, directionY];
    this._scrollRest      = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    this._scrollDistance  = this._scrollRest;
    this._scrollSpeed     = speed;
    this._scrollFrames    = frames;
    this._scrollRad       = Math.atan2(-distanceY, distanceX);
  };

  Game_Map.prototype.scrollTowards = function(chara, speed, frames) {
    var chara = chara === 0 ? $gamePlayer : $gameMap.event(chara);
    var centerX = this._displayX + this.screenTileX() / 2;
    var centerY = this._displayY + this.screenTileY() / 2;
    if (!this.isLoopHorizontal()) {
      if (centerX < this.screenTileX() / 2) {
        centerX = this.screenTileX() / 2;
      }
      if (centerX > this.width() - this.screenTileX() / 2) {
        centerX = this.width() - this.screenTileX() / 2;
      }
    }
    if (!this.isLoopVertical()) {
      if (centerY < this.screenTileY() / 2) {
        centerY = this.screenTileY() / 2;
      }
      if (centerY > this.height() - this.screenTileY() / 2) {
        centerY = this.height() - this.screenTileY() / 2;
      }
    }
    var distanceX = (chara.x + 0.5) - centerX;
    var distanceY = (chara.y + 0.5) - centerY;
    this.startQuasiScroll(distanceX, distanceY, speed || 4, frames);
  };

  var Alias_Game_Map_updateScroll = Game_Map.prototype.updateScroll;
  Game_Map.prototype.updateScroll = function() {
    if (this.isScrolling()) {
      if (this._scrollDirection.constructor === Array) {
        var lastX = this._displayX;
        var lastY = this._displayY;
        this.doQuasiScroll(this._scrollDirection[0], this._scrollDirection[1], this.scrollDistanceX(), this.scrollDistanceY());
        if (this._displayX === lastX && this._displayY === lastY) {
          this._scrollRest = 0;
        } else {
          this._scrollRest -= this.scrollDistance();
        }
        return;
      }
    }
    Alias_Game_Map_updateScroll.call(this);
  };

  var Alias_Game_Map_scrollDistance = Game_Map.prototype.scrollDistance;
  Game_Map.prototype.scrollDistance = function() {
    if (this._scrollFrames) {
      return Math.abs(this._scrollDistance / this._scrollSpeed);
    }
    return Alias_Game_Map_scrollDistanceX.call(this);
  }

  Game_Map.prototype.scrollDistanceX = function() {
    if (this._scrollFrames) {
      return Math.abs((this._scrollDistance * Math.cos(this._scrollRad)) / this._scrollSpeed);
    }
    return Math.abs(this.scrollDistance() * Math.cos(this._scrollRad));
  };

  Game_Map.prototype.scrollDistanceY = function() {
    if (this._scrollFrames) {
      return Math.abs((this._scrollDistance * Math.sin(this._scrollRad)) / this._scrollSpeed);
    }
    return Math.abs(this.scrollDistance() * Math.sin(this._scrollRad));
  };

  Game_Map.prototype.doQuasiScroll = function(directionX, directionY, distanceX, distanceY) {
    if (directionX === 4) {
      this.scrollLeft(distanceX);
    } else if (directionX === 6) {
      this.scrollRight(distanceX);
    }
    if (directionY === 2) {
      this.scrollDown(distanceY);
    } else if (directionY === 8) {
      this.scrollUp(distanceY);
    }
  };
})();
