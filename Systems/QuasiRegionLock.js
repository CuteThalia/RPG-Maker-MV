//============================================================================
// Quasi Region Lock
// Version: 1.0
// Last Update: November 11, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiRegionLock.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - - Place somewhere below QuasiMovement
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/
//  - - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
//============================================================================

var Imported = Imported || {};
Imported.Quasi_RegionLock = 1.0;

//=============================================================================
 /*:
 * @plugindesc Allows you to let Events only move on certain Regions.
 * @author Quasi      Site: http://quasixi.com
 *
 * @help
 * =============================================================================
 * ** Region Locking
 * =============================================================================
 * Region Lock (Comment)
 *     <region=LIST>
 *   LIST - Set to the regions that the event is allowed to move on.
 *   LIST can be a single value or multiple. It can also be a HEX color if you
 *   want to lock them on a color off a region map.
 *   * Resets on page change.
 *
 * Examples:
 *     <region=1>
 *   This will only allow the Event to move on Region 1.
 *
 *     <region=1,2>
 *   This will only allow the Event to move on Regions 1 and 2.
 *
 *     <region=1,2,#00ff00,#0000ff>
 *   This will only allow Event to move on Regions 1, 2 and Colors #00ff00 and #0000ff
 * =============================================================================
 * Links
 *  - http://quasixi.com/mv/
 *  - https://github.com/quasixi/RPG-Maker-MV
 *  - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
 */
//=============================================================================

if (!Imported.Quasi_Movement) {
  alert("Error: Quasi Region Lock requires Quasi Movement to work.");
  throw new Error("Error: Quasi Region Lock requires Quasi Movement to work.")
}
(function() {
  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this._regionLock = null;
  };

  Game_Event.prototype.regionLock = function() {
    if (!this._regionLock) {
      this._regionLock = [];
      var regions1 = /<region=(.*)>/.exec(this.comments());
      if (regions1) {
        regions1 = QuasiMovement.stringToAry(regions1[1]);
        this._regionLock = this._regionLock.concat(regions1);
      }
    }
    return this._regionLock;
  };

  Game_Event.prototype.collideWithTileBox = function(d) {
    if (this.movedOffRegion(d)) {
      return true;
    }
    Game_CharacterBase.prototype.collideWithTileBox.call(this, d);
  };

  Game_Event.prototype.movedOffRegion = function(d) {
    if (this.regionLock().length > 0) {
      var collider = this.collider(d);
      var pass = 0;
      var x1 = Math.floor(collider.edges["top"][0].x);
      var x2 = Math.floor(collider.edges["top"][1].x);
      var y1 = Math.floor(collider.edges["top"][0].y);
      var y2 = Math.floor(collider.edges["bottom"][0].y);
      var p = [[x1, y1], [x2, y1], [x1, y2], [x2, y2]];
      var r;
      for (var i = 0; i < 8; i++) {
        if (i < 4) {
          r1 = $gameMap.regionId(Math.floor(p[i][0] / QuasiMovement.tileSize), Math.floor(p[i][1] / QuasiMovement.tileSize));
          r2 = $gameMap.getPixelRegion(p[i][0], p[i][1]);
          if (!this.regionLock().contains(r1) && !this.regionLock().contains(r2)) {
            return true;
          }
        }
      }
    }
    return false;
  };
})();
