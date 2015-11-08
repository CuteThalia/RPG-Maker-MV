//============================================================================
// Quasi Pathfind
// Version: 1.0
// Last Update: November 7, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiPathfind.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/
//  - - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
//============================================================================

var Imported = Imported || {};
Imported.Quasi_PathFind = 1.0;

//=============================================================================
 /*:
 * @plugindesc A Pathfinding plugin for Quasi Movement. ( Non - Optimized)
 * @author Quasi      Site: http://quasixi.com
 *
 * @param Search Limit
 * @desc Max amount of tiles to search.
 * default: 2000     MV Default: 12
 * @default 2000
 *
 * @param Show Console Logs
 * @desc Shows logs about the path finding and time taken.
 * default: true
 * @default true
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
 *  - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
 */
//=============================================================================

if (!Imported.Quasi_Movement) {
  alert("Error: Quasi Pathfind requires Quasi Movement to work.");
  throw new Error("Error: Quasi Pathfind requires Quasi Movement to work.")
}
(function() {
  var Pathfind = {}
  Pathfind.proccessParameters = function() {
    var parameters   = PluginManager.parameters('QuasiPathfind');
    this.searchLimit = Number(parameters['Search Limit'] || 2);
    this.showLog     = parameters['Show Console Logs'].toLowerCase() === "true";
  };
  Pathfind.proccessParameters();

  Pathfind.node = function(parent, point) {
    var mapWidth = $gameMap.width() * QuasiMovement.tileSize;
    var node = {
      parent: parent,
      x: point[0],
      y: point[1],
      value: point[0] + (point[1] * mapWidth),
      f: 0,
      g: 0
    };
    return node;
  };

  Pathfind.nodeDistance = function(inital, final) {
    return Math.abs(inital.x - final.x) + Math.abs(inital.y - final.y);
  };

  //-----------------------------------------------------------------------------
  // Game_Character
  //
  // The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.

  Game_Character.prototype.updatePathFind = function(goalX, goalY) {
    if (this._pathFind) {
      if (this._pathFind.length === 1) {
        this._pathFind = null;
        $gameTemp.clearDestination();
        return;
      }
      if (this._tempGoal[0] !== $gameTemp.destinationPX() ||
          this._tempGoal[1] !== $gameTemp.destinationPY()) {
        this._pathFind = null;
        return;
      }
      var dir;
      var current = this._pathFind.shift();
      var next = this._pathFind[0];
      var sx = current[0] - next[0];
      var sy = current[1] - next[1];
      var dir;
      if (Math.abs(sx) > Math.abs(sy)) {
        dir = sx > 0 ? 4 : 6;
      } else if (sy !== 0) {
        dir = sy > 0 ? 8 : 2;
      }
      this.moveStraight(dir);
    }
  };

  Game_Character.prototype.startPathFind = function(goalX, goalY) {
    this._pathFind = null;
    if (!QuasiMovement.offGrid) {
      var ox = goalX % this.moveTiles();
      var oy = goalY % this.moveTiles();
      goalX  = goalX - ox;
      goalY  = goalY - oy;
    }
    if (!this.canPass(goalX, goalY, 5)) {
      if (Pathfind.showLog) {
        console.log("Not passable");
      }
      return;
    }
    if (goalX === this._px && goalY === this._py) {
      return;
    }
    this._pathFind = this.aStar([this._px, this._py], [goalX, goalY]);
    if (this === $gamePlayer) {
      this._tempGoal = [$gameTemp.destinationPX(), $gameTemp.destinationPY()];
    }
    this.endPathFind();
  };

  Game_Character.prototype.endPathFind = function() {

  };

  Game_Character.prototype.aStar = function(start, end) {
    var startNode = Pathfind.node(null, start);
    var endNode = Pathfind.node(null, end);
    var openNodes = [startNode];
    var closedValues = {};
    closedValues[startNode.value] = true;
    var current = startNode;
    var neighbors, newNode, finalPath;
    var max = Pathfind.searchLimit;
    var i, j;
    if (Pathfind.showLog) {
      console.log("Pathfinding Started");
      console.time("Pathfind");
    }
    while(openNodes.length !== 0) {
      max--;
      if (max === 0) {
        if (Pathfind.showLog) {
          console.log("Pathfinding reached search Limit.");
        }
        finalPath = this.createPathFrom(current);
        break;
      }
      current = openNodes[0];
      for (i = 0; i < openNodes.length; i++) {
        if (openNodes[i].f < current.f) {
          current = openNodes[i];
        }
      }
      if (current.value === endNode.value) {
        if (Pathfind.showLog) {
          console.log("Pathfinding found end point.");
        }
        finalPath = this.createPathFrom(current);
        break;
      }
      openNodes.splice(openNodes.indexOf(current), 1);
      neighbors = this.findNeighbors(current.x, current.y, endNode);
      for (i = 0, j = neighbors.length; i < j; i++) {
        newNode = Pathfind.node(current, neighbors[i]);
        if (!closedValues[newNode.value]) {
          newNode.g = current.g + Pathfind.nodeDistance(newNode, current);
          newNode.f = newNode.g + Pathfind.nodeDistance(newNode, endNode);
          openNodes.push(newNode);
          closedValues[newNode.value] = true;
        }
      }
    }
    if (Pathfind.showLog) {
      console.timeEnd("Pathfind");
    }
    finalPath.unshift([startNode.x, startNode.y])
    return finalPath;
  };

  Game_Character.prototype.findNeighbors = function(x, y, endNode) {
    var neighbors = [];
    var i, dir, x2, y2;
    for (i = 1; i < 5; i++) {
      dir = i * 2;
      if (this.canPass(x, y, dir, this.moveTiles())) {
        x2 = $gameMap.roundPXWithDirection(x, dir, this.moveTiles());
        y2 = $gameMap.roundPYWithDirection(y, dir, this.moveTiles());
        if (Math.abs(x2 - endNode.x) < this.moveTiles() &&
            Math.abs(y2 - endNode.y) < this.moveTiles()) {
          neighbors.push([endNode.x, endNode.y]);
        } else {
          neighbors.push([x2, y2]);
        }
      }
    }
    return neighbors;
  };

  Game_Character.prototype.createPathFrom = function(node) {
    var path = [];
    do {
      path.push([node.x, node.y]);
      node = node.parent;
    }while(node.parent);
    return path.reverse();
  };

  Game_Event.prototype.endPathFind = function() {
    var move = {
      2: Game_Character.ROUTE_MOVE_DOWN,     4: Game_Character.ROUTE_MOVE_LEFT,
      6: Game_Character.ROUTE_MOVE_RIGHT,    8: Game_Character.ROUTE_MOVE_UP
    }
   var route = {};
   route.list = [];
   route.repeat = false;
   route.skippable = false;
   route.wait = false;
   var dir;
   var current = this._pathFind.shift();
   var i, j, sx, sy, command;
   for (i = 0, j = this._pathFind.length; i < j; i++) {
     sx = current[0] - this._pathFind[i][0];
     sy = current[1] - this._pathFind[i][1];
     if (Math.abs(sx) > Math.abs(sy)) {
       dir = sx > 0 ? 4 : 6;
     } else if (sy !== 0) {
       dir = sy > 0 ? 8 : 2;
     }
     command = {};
     command.code = move[dir];
     route.list.push(command);
     current = this._pathFind[i];
   }
   command = {};
   command.code = 0;
   route.list.push(command);
   this.forceMoveRoute(route);
  };

})();
