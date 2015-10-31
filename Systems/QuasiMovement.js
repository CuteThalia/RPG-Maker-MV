//============================================================================
// Quasi Movement
// Version: 1.0
// Last Update: October 31, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiMovement.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - - If using YEP_CoreEngine, place this somewhere below it!
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/movement/
//  - - http://forums.rpgmakerweb.com/ (post link)
//============================================================================

var Imported = Imported || {};
Imported.Quasi_Movement = 0.9;

//=============================================================================
 /*:
 * @plugindesc Change the way movement works.
 * @author Quasi      Site: http://quasixi.com
 *
 * @param Grid
 * @desc The amount of pixels you want to move per movement.
 * Script Default: 1   MV Default: 48
 * @default 1
 *
 * @param Off Grid
 * @desc Allow characters to move faster then the set GRID?
 * Set to true or false
 * @default true
 *
 * @param Smart Move
 * @desc If the move didn't succeed try again at lower speeds.
 * 0 - Disabled  1 - Speed  2 - Dir  3 - Speed & Dir
 * @default 0
 *
 * @param Mid Pass
 * @desc An extra collision check for the midpoint of the movement.
 * Set to true or false
 * @default false
 *
 * @param Diagonal
 * @desc Allow for diagonal movement?
 * Set to true or false
 * @default true
 *
 * @param Diagonal Speed
 * @desc Adjust the speed when moving diagonal.
 * Default: 0
 * @default 0
 *
 * @param Collision
 * @desc The color for collisions in the collision map.
 * default: #ff0000 (red)
 * @default #ff0000
 *
 * @param Water Collision
 * @desc Color for water collisions (Boats and Ships can move on).
 * default: #00ff00
 * @default #00ff00
 *
 * @param Deep Water Collision
 * @desc Color for deep water collisions (Only Ships can move on).
 * default: #0000ff
 * @default #0000ff
 *
 * @param Player Box
 * @desc Default player box. (width, height, ox, oy)
 * default: 36, 24, 6, 24
 * @default 36, 24, 6, 24
 *
 * @param Event Box
 * @desc Default event box. (width, height, ox, oy)
 * default: 36, 24, 6, 24
 * @default 36, 24, 6, 24
 *
 * @param Boat Box
 * @desc Default boat box. (width, height, ox, oy)
 * default: 36, 24, 6, 12
 * @default 36, 24, 6, 12
 *
 * @param Ship Box
 * @desc Default ship box. (width, height, ox, oy)
 * default: 36, 24, 6, 24
 * @default 36, 24, 6, 24
 *
 * @param Airship Box
 * @desc Default airship box. (width, height, ox, oy)
 * default: 36, 36, 6, 6     (Only used for landing)
 * @default 36, 36, 6, 6
 *
 * @param Convert Collision Map
 * @desc Converts the collision map into bounding boxes.
 * Set to true or false  (Not fully supported yet, should leave false)
 * @default false
 *
 * @param Show Boxes
 * @desc Show the bounding boxes during testing.
 * Set to true or false
 * @default true
 *
 * @help
 * =============================================================================
 * ** Setting up Bounding Boxes
 * =============================================================================
 * The following are placed inside Player Notes or as a Comment inside the
 * event. Event box is based off it's current page. So Event can have a
 * different box depending on its page.
 *   Single Box <Note Tag>
 *       <bbox=width,height,ox,oy>
 *
 *   Different box based on direction <Comment>
 *       <bbox>
 *       5: width, height, ox, oy
 *       X: width, height, ox, oy
 *       </bbox>
 *     Where 5 is the default box if a box isn't set for a direction. And X is
 *     the box for that direction. Direction can be 2, 4, 6 or 8.
 *     * Resets on page change
 *
 *   Setting default OX and OY values for events <Comment>
 *       <ox=X>
 *         or
 *       <oy=Y>
 *     Set X or Y to the values you want. Can be negative.
 *     * Resets on page change
 * =============================================================================
 * ** Setting up Collision Maps
 * =============================================================================
 * Allows the use of an image with collisions. Using this you can setup a
 * pseudo perfect pixel collision.
 *   Add a Collision Map <Note Tag>
 *       <cm=filename>
 *     Replace filename with the name of the collision map you want to load.
 *     Don't add the extension, and file should be location in img/parallaxs/
 *     * Map note tags are found in the map properties
 * =============================================================================
 * ** Passability Levels
 * =============================================================================
 * Passability levels are a new feature which sets weither a character can
 * walk over water or deep water tiles.
 *   Levels:
 *       0 - Default, Can only move on passable tiles
 *       1 - Boat, Can only move on water 1 tiles
 *       2 - Ship, Can only move on water 1 and water 2 tiles
 *       3 - NEW, Can move on passable tiles and water 1 tiles
 *       4 - NEW, Can move on passable tiles, water 1 and water 2 tiles
 *
 *   Get Characters Passability Level <Script call>
 *       $gamePlayer.passabilityLevel();
 *          or
 *       $gameMap.event(ID).passabilityLevel();
 *
 *   Change Player Passability Level <Script call>
 *       $gamePlayer.setPassability(X);
 *     Set x to the level you want to set it to.
 *
 *   Change Event Passability Level <Script call>
 *       $gameMap.event(ID).setPassability(X);
 *     Set ID to the event ID and X to the level you want to set it to.
 *
 *   Set Event default Passability Level <Comment>
 *       <pl=X>
 *     Set X to the level you want to set it to.
 *     * Resets on page change.
 * =============================================================================
 * ** Script Calls
 * =============================================================================
 * The following are to be placed inside "Script..." commands
 *
 * Script calls for Move Routes:
 *   Q Move - Moves the character X amount of distance, ignores Off Grid setting
 *       qmove(direction, amount, multiplicity)
 *     direction    - which direction the movement should be
 *     amount       - how many times should the player move
 *     multiplicity - multiplies amount for easier calculations
 *
 *   M Move - Moves the character X amount of distance, stays on Grid.
 *       mmove(direction, amount, multiplicity)
 *     same definitions as qmove()
 *
 * =Special thanks to Archeia===================================================
 * Links
 *  - http://quasixi.com/mv/movement/
 *  - http://forums.rpgmakerweb.com/ (post link)
 */
//=============================================================================

(function() {
  var Movement = {};
  proccessParameters();

  function proccessParameters() {
    var parameters      = PluginManager.parameters('QuasiMovement');
    Movement.grid       = Number(parameters['Grid'] || 1);
    Movement.offGrid    = (parameters['Off Grid'].toLowerCase() === 'true');
    // tileSize change not working
    Movement.tileSize   = 48;//Number(parameters['Tile Size'] || 48);
    Movement.smartMove  = Number(parameters['Smart Move'] || 0);
    Movement.midPass    = (parameters['Mid Pass'].toLowerCase() === 'true');
    Movement.diagonal   = (parameters['Diagonal'].toLowerCase() === 'true');
    Movement.diagSpeed  = Number(parameters['Diagonal Speed'] || 0);
    Movement.collision  = parameters['Collision'];
    Movement.water1     = parameters['Water Collision'];
    Movement.water2     = parameters['Deep Water Collision'];
    Movement.playerBox  = stringToIntAry(parameters['Player Box']);
    Movement.eventBox   = stringToIntAry(parameters['Event Box']);
    Movement.boatBox    = stringToIntAry(parameters['Boat Box']);
    Movement.shipBox    = stringToIntAry(parameters['Ship Box']);
    Movement.airshipBox = stringToIntAry(parameters['Airship Box']);
    Movement.convert    = (parameters['Convert Collision Map'].toLowerCase() === 'true');
    Movement.showBoxes  = (parameters['Show Boxes'].toLowerCase() === 'true');
    Movement.tileBoxes  = {
      1537: [48, 6, 0, 42],
      1538: [6, 48],
      1539: [[48, 6, 0, 42], [6, 48]],
      1540: [6, 48, 42],
      1541: [[48, 6, 0, 42], [6, 48, 42]],
      1544: [48, 6],
      1546: [[48, 6], [6, 48]],
      1548: [[48, 6], [6, 48, 42]],
      1551: [48, 48],
      2063: [48, 48],
      2575: [48, 48],
      3586: [6, 48],
      3588: [6, 48, 42],
      3590: [[6, 48], [6, 48, 42]],
      3592: [48, 6],
      3594: [[48, 6], [6, 48]],
      3596: [[48, 6], [6, 48, 42]],
      3598: [[48, 6], [6, 48], [6, 48, 42]],
      3599: [48, 48],
      3727: [48, 48]
    };
    var size = Movement.tileSize / 48;
    for (var key in Movement.tileBoxes) {
      if (Movement.tileBoxes.hasOwnProperty(key)) {
        for (var i = 0; i < Movement.tileBoxes[key].length; i++) {
          if (Movement.tileBoxes[key][i].constructor === Array) {
            for (var j = 0; j < Movement.tileBoxes[key][i].length; j++) {
              Movement.tileBoxes[key][i][j] * size;
            }
          } else {
            Movement.tileBoxes[key][i] * size;
          }
        }
      }
    }
  };

  function stringToIntAry(string) {
    var ary = string.split(',');
    ary = ary.map(function(s) { return Number(s || 0); });
    return ary;
  };

  function stringToObjAry(string) {
    var ary = string.split('\n');
    var obj = {};
    ary = ary.filter(function(i) { return i != "" });
    ary.forEach(function(e, i, a) {
      var s = /^(.*):(.*)/.exec(e);
      if (s) {
        obj[s[1]] = stringToIntAry(s[2]);
      }
    });
    return obj;
  };

  //-----------------------------------------------------------------------------
  // Bounding_Box
  //
  // This class handles bounding boxes for characters.

  function Bounding_Box() {
      this.initialize.apply(this, arguments);
  };

  Bounding_Box.prototype.initialize = function(w, h, ox, oy, shift_y) {
      this.width   = w;
      this.height  = h;
      this.ox      = ox || 0;
      this.oy      = oy || 0;
      this.shift_y = shift_y || 0;
      this.x = this.y = 0;
      this.center;
      this.vertices(true);
  };

  Bounding_Box.prototype.moveto = function(x, y) {
    if (x !== this.x || y !== this.y){
      this.x = x;
      this.y = y;
      this.vertices(true);
    }
  };

  Bounding_Box.prototype.vertices = function(reset) {
    if (reset || !this._vertices){
      var range_x = {};
      range_x.min = this.x + this.ox;
      range_x.max = this.x + this.ox + this.width - 1;
      var range_y = {};
      range_y.min = this.y + this.oy - this.shift_y;
      range_y.max = this.y + this.oy - this.shift_y + this.height - 1;

      var topLeft     = new Point(range_x.min, range_y.min);
      var topRight    = new Point(range_x.max, range_y.min);
      var bottomLeft  = new Point(range_x.min, range_y.max);
      var bottomRight = new Point(range_x.max, range_y.max);

      this.box    = [range_x, range_y];
      this.center = new Point(topLeft.x + (this.width / 2), topLeft.y + (this.height / 2));
      this.edges  = {};
      this.edges.left   = [topLeft, bottomLeft];
      this.edges.right  = [topRight, bottomRight];
      this.edges.top    = [topLeft, topRight];
      this.edges.bottom = [bottomLeft, bottomRight];
      this._vertices = [topLeft, topRight, bottomLeft, bottomRight];
    }
    return this._vertices;
  };

  Bounding_Box.prototype.gridEdge = function(direction) {
    if (!direction) {
      var edge1 = this.edges['top'];
      var edge2 = this.edges['bottom'];
      var x1 = Math.floor(edge1[0].x / Movement.tileSize);
      var x2 = Math.floor(edge1[1].x / Movement.tileSize);
      var y1 = Math.floor(edge1[0].y / Movement.tileSize);
      var y2 = Math.floor(edge2[0].y / Movement.tileSize);
      return [x1, x2, y1, y2]
    }
    var edge = this.edges[direction];
    var p1 = [Math.floor(edge[0].x / Movement.tileSize), Math.floor(edge[0].y / Movement.tileSize)];
    var p2 = [Math.floor(edge[1].x / Movement.tileSize), Math.floor(edge[1].y / Movement.tileSize)];
    return [p1, p2];
  };

  Bounding_Box.prototype.intersects = function(other) {
    var otherVertices = other._vertices;
    var x1min = this._vertices[0].x;
    var x1max = this._vertices[1].x;
    var y1min = this._vertices[0].y;
    var y1max = this._vertices[2].y;
    var x2min = otherVertices[0].x;
    var x2max = otherVertices[1].x;
    var y2min = otherVertices[0].y;
    var y2max = otherVertices[2].y;

    var insideX = (x1min <= x2max) && (x1max >= x2min);
    var insideY = (y1min <= y2max) && (y1max >= y2min);
    return insideX && insideY;
  };
  Bounding_Box.prototype.inside = function(other) {
    var otherVertices = other._vertices;
    var x2min = otherVertices[0].x;
    var x2max = otherVertices[1].x;
    var y2min = otherVertices[0].y;
    var y2max = otherVertices[2].y;
    var pass = 0;
    for (var i = 0; i < this._vertices.length; i++) {
      var insideX = (this._vertices[i].x <= x2max) && (this._vertices[i].x >= x2min);
      var insideY = (this._vertices[i].y <= y2max) && (this._vertices[i].y >= y2min);
      if (insideX && insideY) {
        pass++;
      }
    }
    return pass === 4;
  };

  Bounding_Box.prototype.containsPoint = function(x, y) {
    var x1min = this._vertices[0].x;
    var x1max = this._vertices[1].x;
    var y1min = this._vertices[0].y;
    var y1max = this._vertices[2].y;

    var insideX = (x1min <= x) && (x1max >= x);
    var insideY = (y1min <= y) && (y1max >= y);
    return insideX && insideY;
  };

  //-----------------------------------------------------------------------------
  // Game_Temp
  //
  // The game object class for temporary data that is not included in save data.

  var Alias_Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    Alias_Game_Temp_initialize.call(this);
    this._destinationPX = null;
    this._destinationPY = null;
  };

  Game_Temp.prototype.setPixelDestination = function(x, y) {
    this._destinationPX = x;
    this._destinationPY = y;
    var x1 = $gameMap.roundX(Math.floor(x / $gameMap.tileWidth()));
    var y1 = $gameMap.roundY(Math.floor(y / $gameMap.tileHeight()));
    this.setDestination(x1, y1);
  };

  var Alias_Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
  Game_Temp.prototype.clearDestination = function() {
    Alias_Game_Temp_clearDestination.call(this);
    this._destinationPX = null;
    this._destinationPY = null;
  };

  Game_Temp.prototype.destinationPX = function() {
    return this._destinationPX;
  };

  Game_Temp.prototype.destinationPY = function() {
    return this._destinationPY;
  };

  //-----------------------------------------------------------------------------
  // Game_Map
  //
  // The game object class for a map. It contains scrolling and passage
  // determination functions.

  var Alias_Game_Map_Setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
      Alias_Game_Map_Setup.call(this, mapId);
      this._tileBoxes = new Array(this.width());
      for (var x = 0; x < this._tileBoxes.length; x++) {
        this._tileBoxes[x] = [];
        for (var y = 0; y < this.height(); y++) {
          this._tileBoxes[x].push([]);
        }
      }
      this._characterGrid = new Array(this.width());
      for (var x = 0; x < this._characterGrid.length; x++) {
        this._characterGrid[x] = [];
        for (var y = 0; y < this.height(); y++) {
          this._characterGrid[x].push([]);
        }
      }
      this.setupTileBoxes();
      this.setupCollisionmap();
  };

  Game_Map.prototype.flagAt = function(x, y) {
    var x = x || $gamePlayer.x;
    var y = y || $gamePlayer.y;
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
      var flag = flags[tiles[i]];
      console.log("layer", i, ":", flag);
      if (flag & 0x20) {
        console.log("layer", i, "is ladder");
      }
      if (flag & 0x40) {
        console.log("layer", i, "is bush");
      }
      if (flag & 0x80) {
        console.log("layer", i, "is counter");
      }
      if (flag & 0x100) {
        console.log("layer", i, "is damage");
      }
    }
  };

  Game_Map.prototype.tileWidth = function() {
    return Movement.tileSize;
  };

  Game_Map.prototype.tileHeight = function() {
    return Movement.tileSize;
  };

  Game_Map.prototype.setupTileBoxes = function() {
    for (var x = 0; x < this.width(); x++) {
      for (var y = 0; y < this.height(); y++) {
        var flags = this.tilesetFlags();
        var tiles = this.allTiles(x, y);
        for (var i = tiles.length; i > 0; i--) {
          var flag = flags[tiles[i - 1]];
          if (flag === 16) {
            continue;
          }
          this._tileBoxes[x][y] = this.tileBox(x, y, flag);
        }
      }
    }
  };

  Game_Map.prototype.tileBox = function(x, y, flag) {
    var boxData = Movement.tileBoxes[flag];
    var isSpecial;
    if (!boxData) {
      if (flag & 0x20 || flag & 0x40 || flag & 0x80 || flag & 0x100) {
        boxData = [Movement.tileSize, Movement.tileSize, 0, 0];
      } else {
        return [];
      }
    }
    var tilebox = [];
    if (boxData[0].constructor === Array){
      var makeTileBox = Game_Map.prototype.makeTileBox;
      boxData.forEach(function(box) {
        var newBox = makeTileBox.call(this, x, y, flag, box);
        tilebox.push(newBox);
      });
    } else {
      var newBox = this.makeTileBox(x, y, flag, boxData);
      tilebox.push(newBox);
    }
    return tilebox;
  };

  Game_Map.prototype.makeTileBox = function(x, y, flag, boxData) {
    var x1 = x * Movement.tileSize;
    var y1 = y * Movement.tileSize;
    var ox = boxData[2] || 0;
    var oy = boxData[3] || 0;
    var w  = boxData[0];
    var h  = boxData[1];
    var newBox = new Bounding_Box(w, h, ox, oy);
    newBox.moveto(x1, y1);
    newBox.flag      = flag;
    newBox.isLadder  = flag & 0x20;
    newBox.isBush    = flag & 0x40;
    newBox.isCounter = flag & 0x80;
    newBox.isDamage  = flag & 0x100;
    if (flag === 2575) {
      newBox.color = Movement.water2;
    } else if (flag === 2063) {
      newBox.color = Movement.water1;
    } else {
      if (flag & 0x20 || flag & 0x40 || flag & 0x100) {
        newBox.color = '#ffffff';
      } else {
        newBox.color = Movement.collision;
      }
    }
    return newBox;
  };

  Game_Map.prototype.setupCollisionmap = function() {
    var cm = /<cm=(.*)>/i.exec($dataMap.note);
    if (cm) {
      if (Movement.convert) {
        this.convertCollisionmap(cm);
      } else {
        this._collisionmap = ImageManager.loadParallax(cm[1]);
        if (Movement.showBoxes && $gameTemp.isPlaytest()) {} {
          this._collisionmap.addLoadListener(function() {
            $gameMap.drawTileBoxes();
          });
        }
      }
    } else {
      this._collisionmap = new Bitmap(this.width() * Movement.tileSize, this.height() * Movement.tileSize);
      if (Movement.showBoxes && $gameTemp.isPlaytest()) {} {
        this.drawTileBoxes();
      }
    }
  };

  Game_Map.prototype.convertCollisionmap = function(cm) {
    var img = ImageManager.loadParallax(cm[1]);
    var collisionBoxes = img.addLoadListener(function() {
      var boxes = [];
      var nodes = new Map();
      var collisions = [];
      collisions.push(Movement.collision);
      collisions.push(Movement.water1);
      collisions.push(Movement.water2);

      for (var y = 0; y < img.height; y++){
        var x = 0;
        while (x < img.width - 1){
          while (!collisions.contains(img.getColor(x, y))) {
            x++;
            if (x === img.width) break;
          }
          var color = img.getColor(x, y);
          if (!collisions.contains(color)) {
            break;
          }

          while (nodes.get(x + ", " + y) === true) {
            x++;
          }
          if (nodes.get(x + ", " + y) === true) {
            x++;
          } else if (img.getColor(x, y) !== color) {
            continue;
          } else if (x >= img.width) {
            break;
          }
          var starting_x = x;

          while (img.getColor(x, y) === color) {
            x++;
            if (nodes.get(x + ", " + y) === true) break;
            if (x == img.width - 1) break;
          }
          var ending_x = x;
          var temp_x = starting_x;
          var temp_y  = y;

          while (true) {
            temp_x = starting_x;
            temp_y++;

            while (img.getColor(temp_x, temp_y) === color) {
              temp_x++;
              if (temp_x == ending_x) break;
            }

            if (temp_x === ending_x) {
              for (var scanned_x = starting_x; scanned_x !== ending_x + 1; scanned_x++) {
                nodes.set(scanned_x + ", " + temp_y, true);
              }
            } else {
              break;
            }
            if (temp_y === img.height - 1) {
              break;
            }
          }

          var w = ending_x - starting_x + 1;
          if (ending_x === img.width - 1) {
            w++;
          }
          var h = temp_y - y;
          var newBox = new Bounding_Box(w, h);
          newBox.moveto(starting_x, y);
          newBox.color = color;
          boxes.push(newBox);
        }
      }
      $gameMap._collisionmap = new Bitmap($gameMap.width() * Movement.tileSize, $gameMap.height() * Movement.tileSize);
      if (Movement.showBoxes && $gameTemp.isPlaytest()) {
        for (var i = 0; i < boxes.length; i++) {
          var x = boxes[i].x;
          var y = boxes[i].y;
          var w = boxes[i].width;
          var h = boxes[i].height;
          var color = boxes[i].color || Movement.collision;
          $gameMap._collisionmap.fillRect(x, y, w, h, color);
        }
        $gameMap.drawTileBoxes();
      }
      $gameMap.createCollisionGrid(boxes);
    });
  };

  Game_Map.prototype.drawTileBoxes = function() {
    for (var x = 0; x < this.width(); x++) {
      for (var y = 0; y < this.height(); y++) {
        var boxes = this._tileBoxes[x][y];
        for (var i = 0; i < boxes.length; i++) {
          var x1 = boxes[i].x;
          var y1 = boxes[i].y;
          var ox = boxes[i].ox;
          var oy = boxes[i].oy;
          var w  = boxes[i].width;
          var h  = boxes[i].height;
          var color = boxes[i].color || Movement.collision;
          this._collisionmap.fillRect(x1 + ox, y1 + oy, w, h, color);
        }
      }
    }
  };

  Game_Map.prototype.createCollisionGrid = function(boxes) {
    for (var i = 0; i < boxes.length; i++) {
      var box  = boxes[i];
      var edge = box.gridEdge();
      var x1   = edge[0];
      var x2   = edge[1];
      var y1   = edge[2];
      var y2   = edge[3];
      for (var x = x1; x <= x2; x++) {
        for (var y = y1; y <= y2; y++) {
          this._tileBoxes[x][y].push(box);
        }
      }
    }
  };

  Game_Map.prototype.collisionMapPass = function(box, dir, level) {
    if (!this._collisionmap.isReady()) {
      return false;
    }
    var x1 = Math.floor(box.edges[dir][0].x);
    var x2 = Math.floor(box.edges[dir][1].x);
    var y1 = Math.floor(box.edges[dir][0].y);
    var y2 = Math.floor(box.edges[dir][1].y);
    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        if (this._collisionmap.getColor(x, y) === Movement.collision) {
          return false;
        }
      }
    }
    return true;
  };

  Game_Map.prototype.getTileBoxesAt = function(box) {
    if (!this._tileBoxes) {
      return [];
    }
    var edge = box.gridEdge();
    var x1   = edge[0];
    var x2   = edge[1];
    var y1   = edge[2];
    var y2   = edge[3];
    var boxes = [];
    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        if (x < 0 || x >= this.width()) {
          continue;
        } else if (y < 0 || y >= this.height()) {
          continue;
        }
        for (var i = 0; i < this._tileBoxes[x][y].length; i++) {
          boxes.push(this._tileBoxes[x][y][i]);
        }
      }
    }
    return boxes;
  };

  Game_Map.prototype.getCharactersAt = function(box) {
    var edge = box.gridEdge();
    var x1   = edge[0];
    var x2   = edge[1];
    var y1   = edge[2];
    var y2   = edge[3];
    var charas = [];
    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        if (x < 0 || x >= this.width()) {
          continue;
        } else if (y < 0 || y >= this.height()) {
          continue;
        }
        for (var i = 0; i < this._characterGrid[x][y].length; i++) {
          if (!charas.contains(this._characterGrid[x][y][i])) {
            charas.push(this._characterGrid[x][y][i]);
          }
        }
      }
    }
    return charas;
  };

  Game_Map.prototype.updateCharacterGrid = function(chara, prev) {
    var box   = chara.boundingBox();
    var edge = box.gridEdge();
    var x1   = edge[0];
    var x2   = edge[1];
    var y1   = edge[2];
    var y2   = edge[3];
    var boxesInside = 0;
    var totalBoxes  = (prev[1] - prev[0]) * (prev[3] - prev[2]);
    for (var x = prev[0]; x <= prev[1]; x++) {
      for (var y = prev[2]; y <= prev[3]; y++) {
        if (x < 0 || x >= this.width()) {
          continue;
        } else if (y < 0 || y >= this.height()) {
          continue;
        }
        if (this._characterGrid[x][y].contains(chara)) {
          boxesInside++;
        }
      }
    }
    if (boxesInside == totalBoxes) {
      return;
    }
    for (var x = prev[0]; x <= prev[1]; x++) {
      for (var y = prev[2]; y <= prev[3]; y++) {
        if (x < 0 || x >= this.width()) {
          continue;
        } else if (y < 0 || y >= this.height()) {
          continue;
        }
        var i = this._characterGrid[x][y].indexOf(chara);
        this._characterGrid[x][y].splice(i, 1);
      }
    }
    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        if (x < 0 || x >= this.width()) {
          continue;
        } else if (y < 0 || y >= this.height()) {
          continue;
        }
        this._characterGrid[x][y].push(chara);
      }
    }
  };

  Game_Map.prototype.roundPX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width() * Movement.tileSize) : x;
  };

  Game_Map.prototype.roundPY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height() * Movement.tileSize) : y;
  };

  Game_Map.prototype.pxWithDirection = function(x, d, dist) {
    return x + (d === 6 ? dist : d === 4 ? -dist : 0);
  };

  Game_Map.prototype.pyWithDirection = function(y, d, dist) {
    return y + (d === 2 ? dist : d === 8 ? -dist : 0);
  };

  Game_Map.prototype.roundPXWithDirection = function(x, d, dist) {
    return this.roundPX(x + (d === 6 ? dist : d === 4 ? -dist : 0));
  };

  Game_Map.prototype.roundPYWithDirection = function(y, d, dist) {
    return this.roundPY(y + (d === 2 ? dist : d === 8 ? -dist : 0));
  };

  Game_Map.prototype.deltaPX = function(x1, x2) {
    var result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > (this.width() * Movement.tileSize) / 2) {
      if (result < 0) {
        result += this.width() * Movement.tileSize;
      } else {
        result -= this.width() * Movement.tileSize;
      }
    }
    return result;
  };

  Game_Map.prototype.deltaPY = function(y1, y2) {
    var result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > (this.height() * Movement.tileSize) / 2) {
      if (result < 0) {
        result += this.height() * Movement.tileSize;
      } else {
        result -= this.height() * Movement.tileSize;
      }
    }
    return result;
  };

  Game_Map.prototype.canvasToMapPX = function(x) {
      var tileWidth = this.tileWidth();
      var originX = this._displayX * tileWidth;
      return this.roundPX(originX + x);
  };

  Game_Map.prototype.canvasToMapPY = function(y) {
      var tileHeight = this.tileHeight();
      var originY = this._displayY * tileHeight;
      return this.roundPY(originY + y);
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //
  // The superclass of Game_Character. It handles basic information, such as
  // coordinates and images, shared by all characters.

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._px = this._py = this._realPx = this._realPy = 0;
    this._diagonal = false;
    this._grid = Movement.grid;
    this._gridPosition = [];
    this._passabilityLevel = 0;
    this._smartMoveDir   = Movement.smartMove == 2 || Movement.smartMove == 3;
    this._smartMoveSpeed = Movement.smartMove == 1 || Movement.smartMove == 3;
    this._dir4Diag = {
      8: [[4, 8], [6, 8]],
      6: [[6, 8], [6, 2]],
      2: [[4, 2], [6, 2]],
      4: [[4, 8], [4, 2]]
    };
    this._moveCount = this._movingCount = 0;
    this._freqCount = 0;
  }

  Game_CharacterBase.prototype.notes = function() {
    if (this.constructor === Game_Player || this.constructor === Game_Follower) {
      return this.actor().actor().note;
    } else if (this.constructor === Game_Event) {
      return this.event().note;
    } else {
      return "";
    }
  };

  Game_CharacterBase.prototype.stillMoving = function() {
    if (this.moveTiles() === this.frameSpeed()) {
      return this._moveCount > 0;
    }
    return this.isMoving();
  };

  Game_CharacterBase.prototype.isMoving = function() {
    return this._realPX !== this._px || this._realPY !== this._py;
  };

  Game_CharacterBase.prototype.isStopping = function() {
    return !this.stillMoving() && !this.isJumping();
  };

  Game_CharacterBase.prototype.gridChanged = function() {
    return this._gridPosition !== this.boundingBox().gridEdge();
  };

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    this._px = this._realPX = x * Movement.tileSize;
    this._py = this._realPY = y * Movement.tileSize;
    if (this.constructor === Game_Event) {
      if (!this.page()) {
        return;
      }
    }
    if (!this._boundingBox) {
      this.boundingBox();
    }
    this.moveAllBoxes(this._px, this._py);
  };

  Game_CharacterBase.prototype.setPixelPosition = function(x, y) {
    this.setPosition(x / Movement.tileSize, y / Movement.tileSize);
  };

  var Alias_Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
  Game_CharacterBase.prototype.copyPosition = function(character) {
    Alias_Game_CharacterBase_copyPosition.call(this, character);
    this._px = character._px;
    this._py = character._py;
    this._realPX = character._realPX;
    this._realPY = character._realPY;
    if (!this._boundingBox) {
      this.boundingBox();
    }
    this.moveAllBoxes(this._px, this._py);
  };

  Game_CharacterBase.prototype.setPassability = function(lvl) {
    this._passabilityLevel = Number(lvl || 0);
  };

  Game_CharacterBase.prototype.passabilityLevel = function() {
    return this._passabilityLevel;
  };

  Game_CharacterBase.prototype.canPass = function(x, y, dir, dist) {
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(x, dir, dist);
    var y1 = $gameMap.roundPYWithDirection(y, dir, dist);
    if (!this.collisionCheck(x1, y1, dir, dist)) {
      return false;
    }
    if ($gameMap.isLoopHorizontal() || $gameMap.isLoopVertical()) {
      var edge = this.boundingBox(dir).gridEdge();
      var x2   = edge[0];
      var x3   = edge[1];
      var y2   = edge[2];
      var y3   = edge[3];
      if (x2 < 0 || x3 >= $gameMap.width() - 1 ||
          y2 < 0 || y3 >= $gameMap.height() - 1) {
        var w = $gameMap.width() * Movement.tileSize;
        var h = $gameMap.height() * Movement.tileSize;
        x1 = x2 < 0 ? x1 + w : (x3 >= $gameMap.width() - 1 ? x1 - w : x1);
        y1 = y2 < 0 ? y1 + h : (y3 >= $gameMap.height() - 1 ? y1 - h : y1);
        this.boundingBox(dir).moveto(x1, y1);
        if (!this.collisionCheck(x1, y1, dir, dist)) {
          return false;
        }
      }
    }
    return true;
  };

  Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert, dist) {
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(x, horz, dist);
    var y1 = $gameMap.roundPYWithDirection(y, vert, dist);
    return (this.canPass(x, y, vert, dist) && this.canPass(x, y1, horz, dist)) ||
           (this.canPass(x, y, horz, dist) && this.canPass(x1, y, vert, dist))
  };

  Game_CharacterBase.prototype.middlePass = function(x, y, dir, dist) {
    var dist = dist / 2 || this.moveTiles() / 2;
    var x1 = $gameMap.roundPXWithDirection(x, this.reverseDir(dir), dist);
    var y1 = $gameMap.roundPYWithDirection(y, this.reverseDir(dir), dist);
    this.boundingBox(dir).moveto(x1, y1);
    if (this.collideWithTileBox(dir)) {
      return false;
    }
    if (!Movement.convert) {
      var edge = {2: "bottom", 4: "left", 6: "right", 8: "top"};
      if (!$gameMap.collisionMapPass(this.boundingBox(dir), edge[dir])) {
        return false;
      }
    }
    if (this.collideWithCharacter(dir)) {
      return false;
    }
    this.boundingBox(dir).moveto(x, y);
    return true;
  };

  Game_CharacterBase.prototype.collisionCheck = function(x, y, dir, dist) {
    this.boundingBox(dir).moveto(x, y);
    if (!this.valid(dir)) {
      return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
      return true;
    }
    if (Movement.midPass && this._passabilityLevel !== 5) {
      if (!this.middlePass(x, y, dir, dist)) {
        return false;
      }
    }
    if (this.collideWithTileBox(dir)) {
      return false;
    }
    if (!Movement.convert) {
      var edge = {2: "bottom", 4: "left", 6: "right", 8: "top"};
      if (!$gameMap.collisionMapPass(this.boundingBox(dir), edge[dir])) {
        return false;
      }
    }
    if (this.collideWithCharacter(dir)) {
      return false;
    }
    return true;
  };

  Game_CharacterBase.prototype.valid = function(d) {
    var edge = this.boundingBox(d).gridEdge();
    var x1   = edge[0];
    var x2   = edge[1];
    var y1   = edge[2];
    var y2   = edge[3];
    var maxW = $gameMap.width();
    var maxH = $gameMap.height();
    if (!$gameMap.isLoopHorizontal()) {
      if (x1 < 0 || x2 >= maxW) {
        return false;
      }
    }
    if (!$gameMap.isLoopVertical()) {
      if (y1 < 0 || y2 >= maxH) {
        return false;
      }
    }
    return true;
  };

  Game_CharacterBase.prototype.collideWithTileBox = function(d) {
    var boxes = $gameMap.getTileBoxesAt(this.boundingBox(d));
    if (this._passabilityLevel === 1 || this._passabilityLevel === 2) {
      return !this.insidePassableOnlyBox(d);
    }
    for (var i = 0; i < boxes.length; i++) {
      if (this.passableColors().contains(boxes[i].color)) {
        continue;
      }
      if (this.boundingBox(d).intersects(boxes[i])) {
        return true;
      }
    }
    return false;
  };

  Game_CharacterBase.prototype.collideWithCharacter = function(d) {
    var charas = $gameMap.getCharactersAt(this.boundingBox(d));
    for (var i = 0; i < charas.length; i++) {
      if (charas[i].isThrough() || charas[i] === this || !charas[i].isNormalPriority()) {
        continue;
      }
      if (this.constructor === Game_Player) {
        if (this.isInVehicle() && charas[i].constructor === Game_Vehicle) {
          if (charas[i]._type === this._vehicleType) {
            continue;
          }
        }
      }
      if (this.boundingBox(d).intersects(charas[i].boundingBox())) {
        return true;
      }
    }
    return false;
  };

  Game_CharacterBase.prototype.insidePassableOnlyBox = function(d) {
    var boxes = $gameMap.getTileBoxesAt(this.boundingBox(d));
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!this.passableColors().contains(boxes[i].color)) {
        if (this.boundingBox(d).intersects(boxes[i])) {
          return false;
        }
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.boundingBox(d).vertices();
    for (var i = 0; i < vertices.length; i++) {
      for (var j = 0; j < passboxes.length; j++) {
        if (passboxes[j].containsPoint(vertices[i].x, vertices[i].y)) {
          pass++;
        }
      }
    }
    return pass === 4;
  };

  Game_CharacterBase.prototype.passableColors = function() {
    var colors = ["#ffffff"];
    switch (this._passabilityLevel) {
      case 1:
      case 3:
        colors.push(Movement.water1);
        break;
      case 2:
      case 4:
        colors.push(Movement.water1);
        colors.push(Movement.water2);
        break;
    }
    return colors;
  };

  Game_CharacterBase.prototype.moveTiles = function() {
    return this._grid < this.frameSpeed() ? (Movement.offGrid ? this.frameSpeed() : this._grid) : this._grid;
  };

  Game_CharacterBase.prototype.frameSpeed = function() {
    return this.distancePerFrame() * Movement.tileSize;
  };

  Game_CharacterBase.prototype.freqThreshold = function() {
    return Movement.tileSize;
  };

  Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
      var x2 = $gameMap.roundPXWithDirection(this._px, d, this.moveTiles());
      var y2 = $gameMap.roundPYWithDirection(this._py, d, this.moveTiles());
      this.checkEventTriggerTouch(x2, y2);
  };

  Game_CharacterBase.prototype.update = function() {
    if (this.isStopping()) {
      this.updateStop();
    }
    if (this.isJumping()) {
      this.updateJump();
    } else if (this.isMoving()) {
      this.updateMove();
    }
    this.updateAnimation();
    if (this.gridChanged()) {
      this.updateGridChange();
    }
    if (this.constructor !== Game_Player) {
      if (this.stillMoving){
        this._moveCount = Math.max(this._moveCount - 1, 0);
        this._movingCount++;
        if (this._movingCount === Movement.tileSize) {
          this._stopCount = 0;
        }
      } else {
        this._movingCount = 0;
      }
    }
  };

  Game_CharacterBase.prototype.updateMove = function() {
    if (this._px < this._realPX) {
      this._realPX = Math.max(this._realPX - this.frameSpeed(), this._px);
    }
    if (this._px > this._realPX) {
      this._realPX = Math.min(this._realPX + this.frameSpeed(), this._px);
    }
    if (this._py < this._realPY) {
      this._realPY = Math.max(this._realPY - this.frameSpeed(), this._py);
    }
    if (this._py > this._realPY) {
      this._realPY = Math.min(this._realPY + this.frameSpeed(), this._py);
    }

    this._x = this._px / Movement.tileSize;
    this._y = this._py / Movement.tileSize;
    this._realX = this._realPX / Movement.tileSize;
    this._realY = this._realPY / Movement.tileSize;

    if (this.constructor === Game_Event) {
      if (!this._locked) {
        this._freqCount += this.moveTiles();
      }
    } else if (this.constructor === Game_Player)  {
      this._freqCount += this.moveTiles();
    }

    if (!this.isMoving()) {
      this.refreshBushDepth();
    }
  };

  var Alias_Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
  Game_CharacterBase.prototype.updateJump = function() {
    Alias_Game_CharacterBase_updateJump.call(this);
    this._px = this._realPX = this._realY * Movement.tileSize;
    this._py = this._realPY = this._realX * Movement.tileSize;
    this.moveAllBoxes(this._px, this._py);
  };

  Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this.stillMoving() && this.hasWalkAnime()) {
      this._animationCount += 1.5;
    } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
      this._animationCount++;
    }
  };

  Game_CharacterBase.prototype.updateGridChange = function() {
    $gameMap.updateCharacterGrid(this, this._gridPosition);
    this._gridPosition = this.boundingBox().gridEdge();
  };

  Game_CharacterBase.prototype.refreshBushDepth = function() {
    if (this.isNormalPriority() && !this.isObjectCharacter() &&
        this.isOnBush() && !this.isJumping()) {
      if (!this.stillMoving()) {
        this._bushDepth = 12;
      }
    } else {
      this._bushDepth = 0;
    }
  };

  Game_CharacterBase.prototype.isOnLadder = function() {
    if (!this._boundingBox) {
      return false;
    }
    var boxes = $gameMap.getTileBoxesAt(this.boundingBox());
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isLadder) {
        if (this.boundingBox().intersects(boxes[i])) {
          return false;
        }
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.boundingBox().vertices();
    for (var i = 0; i < vertices.length; i++) {
      for (var j = 0; j < passboxes.length; j++) {
        if (passboxes[j].containsPoint(vertices[i].x, vertices[i].y)) {
          pass++;
        }
      }
    }
    return pass === 4;
  };

  Game_CharacterBase.prototype.isOnBush = function() {
    if (!this._boundingBox) {
      return false;
    }
    var boxes = $gameMap.getTileBoxesAt(this.boundingBox());
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isBush) {
        if (this.boundingBox().intersects(boxes[i])) {
          return false;
        }
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.boundingBox().vertices();
    for (var i = 0; i < vertices.length; i++) {
      for (var j = 0; j < passboxes.length; j++) {
        if (passboxes[j].containsPoint(vertices[i].x, vertices[i].y)) {
          pass++;
        }
      }
    }
    return pass === 4;
  };

  Game_CharacterBase.prototype.moveStraight = function(d) {
    this.setMovementSuccess(this.canPass(this._px, this._py, d));
    var originalSpeed = this._moveSpeed;
    if (this._smartMoveSpeed && this.constructor === Game_Player) {
      this.smartMoveSpeed(d);
    }
    if (this.isMovementSucceeded()) {
      this.setDirection(d);
      this._px = $gameMap.roundPXWithDirection(this._px, d, this.moveTiles());
      this._py = $gameMap.roundPYWithDirection(this._py, d, this.moveTiles());
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(d), this.moveTiles());
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(d), this.moveTiles());
      this.increaseSteps();
      this._moveCount++;
      if (this.constructor === Game_Player) {
        this._followers.addMove(d, this.realMoveSpeed());
      }
    } else {
      this.setDirection(d);
      this.checkEventTriggerTouchFront(d);
      this.boundingBox(d).moveto(this._px, this._py);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this._smartMoveDir && this.constructor === Game_Player) {
      var dir = this._dir4Diag[d];
      if (this.canPassDiagonally(this._px, this._py, dir[0][0], dir[0][1])){
        this.moveDiagonally(dir[0][0], dir[0][1]);
      } else if (this.canPassDiagonally(this._px, this._py, dir[1][0], dir[1][1])) {
        this.moveDiagonally(dir[1][0], dir[1][1]);
      }
    }
  };

  Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    this.setMovementSuccess(this.canPassDiagonally(this._px, this._py, horz, vert));
    var originalSpeed = this._moveSpeed;
    if (this._smartMoveSpeed) {
      this.smartMoveSpeed([horz, vert], true);
    }
    if (this.isMovementSucceeded()) {
      this._px = $gameMap.roundPXWithDirection(this._px, horz, this.moveTiles());
      this._py = $gameMap.roundPYWithDirection(this._py, vert, this.moveTiles());
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), this.moveTiles());
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), this.moveTiles());
      this.increaseSteps();
      this._moveCount++;
      if (this.constructor === Game_Player) {
        this._followers.addMove([horz, vert], this.realMoveSpeed());
      }
    } else {
      this.boundingBox(horz).moveto(this._px, this._py);
      this.boundingBox(vert).moveto(this._px, this._py);
    }
    if (this._direction === this.reverseDir(horz)) {
      this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
      this.setDirection(vert);
    }
    this._moveSpeed = originalSpeed;

    if (!this.isMovementSucceeded() && this._smartMoveDir) {
      if (this.canPass(this._px, this._py, horz)) {
        this.moveStraight(horz);
      } else if (this.canPass(this._px, this._py, vert)) {
        this.moveStraight(vert);
      }
    }
  };

  Game_CharacterBase.prototype.fixedMove = function(d, dist) {
    this.setMovementSuccess(this.canPass(this._px, this._py, d, dist, true));
    if (this.isMovementSucceeded()) {
      this.setDirection(d);
      this._px = $gameMap.roundPXWithDirection(this._px, d, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, d, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(d), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(d), dist);
      this.increaseSteps();
      this._moveCount++;
      if (this.constructor === Game_Player) {
        this._followers.addMove(d, this.realMoveSpeed(), dist);
      }
    } else {
      this.setDirection(d);
      this.checkEventTriggerTouchFront(d);
      this.boundingBox(d).moveto(this._px, this._py);
    }
  };

  Game_CharacterBase.prototype.smartMoveSpeed = function(dir, diag) {
    if (this.isMovementSucceeded() && this.constructor !== Game_Player) {
      return;
    }
    while (!this.isMovementSucceeded() ) {
      if (this._moveSpeed < 1) {
        break;
      }
      this._moveSpeed--;
      if (diag){
        this.setMovementSuccess(this.canPassDiagonally(this._px, this._py, dir[0], dir[1]));
      } else {
        this.setMovementSuccess(this.canPass(this._px, this._py, dir));
      }
    }
  };

  Game_CharacterBase.prototype.boundingBox = function(direction) {
    var direction = direction || this._direction;
    if (!this._boundingBox) {
      this.setupBoundingBox(direction);
    }
    return this._boundingBox[direction] || this._boundingBox[5];
  };

  Game_CharacterBase.prototype.setupBoundingBox = function(direction) {
    this._boundingBox = [];
    if (this.constructor === Game_Player) {
      var box = Movement.playerBox;
      var multibox  = /<bbox>([\s\S]*)<\/bbox>/.exec(this.notes());
      var singlebox = /<bbox=(.*)>/.exec(this.notes());
    } else if (this.constructor === Game_Event) {
      var box = Movement.eventBox;
      var multibox  = /<bbox>([\s\S]*)<\/bbox>/.exec(this.comments());
      var singlebox = /<bbox=(.*)>/.exec(this.comments());
    } else if (this.constructor === Game_Vehicle) {
      if (this.isBoat()) {
        var box = Movement.boatBox;
      } else if (this.isShip()) {
        var box = Movement.shipBox;
      } else if (this.isAirship()) {
        var box = Movement.airshipBox;
      }
    } else {
      var box = Movement.eventBox;
    }
    if (multibox) {
      var multi = stringToObjAry(multibox[1]);
      var boxW  = box[0] || 0;
      var boxH  = box[1] || 0;
      var boxOX = box[2] || 0;
      var boxOY = box[3] || 0;
      this._boundingBox[5] = new Bounding_Box(boxW, boxH, boxOX, boxOY, this.shiftY());
      for (var key in multi) {
        if (multi.hasOwnProperty(key)) {
          var box = multi[key];
          var w  = box[0] || boxW;
          var h  = box[0] || boxH;
          var ox = typeof box[2] === 'number' ? box[2] : boxOX;
          var oy = typeof box[3] === 'number'  ? box[3] : boxOY;
          this._boundingBox[key] = new Bounding_Box(w, h, ox, oy, this.shiftY());
        }
      }
      this.moveAllBoxes(this._px, this._py);
    } else {
      var boxW  = box[0] || 0;
      var boxH  = box[1] || 0;
      var boxOX = box[2] || 0;
      var boxOY = box[3] || 0;
      if (singlebox) {
        var eventBox = stringToIntAry(singlebox[1]);
        boxW  = eventBox[0] || boxW;
        boxH  = eventBox[1] || boxH;
        boxOX = typeof eventBox[2] === 'number' ? eventBox[2] : boxOX;
        boxOY = typeof eventBox[3] === 'number'  ? eventBox[3] : boxOY;
      }
      this._boundingBox[5] = new Bounding_Box(boxW, boxH, boxOX, boxOY, this.shiftY());
      this._boundingBox[5].moveto(this._px, this._py);
    }
  }

  Game_CharacterBase.prototype.moveAllBoxes = function(newX, newY) {
    newX = typeof newX === 'number' ? newX : this._px;
    newY = typeof newY === 'number' ? newY : this._py;
    for (var i = 0; i < this._boundingBox.length; i++) {
      if (this._boundingBox[i]) {
        this._boundingBox[i].moveto(newX, newY);
      }
    }
  };

  Game_CharacterBase.prototype.cx = function() {
    return this.boundingBox().center.x;
  };

  Game_CharacterBase.prototype.cy = function() {
    return this.boundingBox().center.y;
  };

  //-----------------------------------------------------------------------------
  // Game_Character
  //
  // The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.

  var Alias_Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
  Game_Character.prototype.processMoveCommand = function(command) {
    var gc = Game_Character;
    var params = command.parameters;
    if (command.code === "fixedMove") {
      this.fixedMove(params[0], params[1]);
      return;
    }
    if (command.code === gc.ROUTE_SCRIPT) {
      var mmove = /mmove\((.*)\)/.exec(params[0]);
      var qmove = /qmove\((.*)\)/.exec(params[0]);
      if (mmove) {
        this.subMmove(mmove[1]);
        return;
      }
      if (qmove) {
        this.subQmove(qmove[1]);
        return;
      }
    }
    Alias_Game_Character_processMoveCommand.call(this, command);
  }

  Game_Character.prototype.subMmove = function(settings) {
    var move = {
      2: Game_Character.ROUTE_MOVE_DOWN,     4: Game_Character.ROUTE_MOVE_LEFT,
      6: Game_Character.ROUTE_MOVE_RIGHT,    8: Game_Character.ROUTE_MOVE_UP,
      1: Game_Character.ROUTE_MOVE_LOWER_L,  3: Game_Character.ROUTE_MOVE_LOWER_R,
      7: Game_Character.ROUTE_MOVE_UPPER_L,  9: Game_Character.ROUTE_MOVE_UPPER_R
    }
    settings = stringToIntAry(settings);
    var dir  = settings[0];
    var amt  = settings[1];
    var mult = settings[2] || 1;
    var tot  = amt * mult;
    for (var i = 0; i <= tot; i++) {
      var cmd  = {};
      cmd.code = move[dir];
      this._moveRoute.list.splice(this._moveRouteIndex + 1, 0, cmd);
    }
    this._moveRoute.list.splice(this._moveRouteIndex, 1);
  };

  Game_Character.prototype.subQmove = function(settings) {
    var move = {
      2: Game_Character.ROUTE_MOVE_DOWN,     4: Game_Character.ROUTE_MOVE_LEFT,
      6: Game_Character.ROUTE_MOVE_RIGHT,    8: Game_Character.ROUTE_MOVE_UP,
      1: Game_Character.ROUTE_MOVE_LOWER_L,  3: Game_Character.ROUTE_MOVE_LOWER_R,
      7: Game_Character.ROUTE_MOVE_UPPER_L,  9: Game_Character.ROUTE_MOVE_UPPER_R,
      5: Game_Character.ROUTE_MOVE_FORWARD,  0: Game_Character.ROUTE_MOVE_BACKWARD
    }
    settings  = stringToIntAry(settings);
    var dir   = settings[0];
    var amt   = settings[1];
    var multi = settings[2] || 1;
    var tot   = amt * multi;
    var steps = Math.floor(tot / this.moveTiles());
    var moved = 0;
    for (var i = 0; i < steps; i++) {
      moved += this.moveTiles();
      var cmd  = {};
      cmd.code = move[dir];
      this._moveRoute.list.splice(this._moveRouteIndex + 1, 0, cmd);
    }
    if (moved < tot) {
      var cmd = {};
      cmd.code = "fixedMove";
      cmd.parameters = [dir, tot - moved];
      this._moveRoute.list.splice(this._moveRouteIndex + 1 + i, 0, cmd);
    }
    this._moveRoute.list.splice(this._moveRouteIndex, 1);
    this._moveRouteIndex--;
  };

  Game_Character.prototype.deltaPXFrom = function(x) {
      return $gameMap.deltaPX(this.cx(), x);
  };

  Game_Character.prototype.deltaPYFrom = function(y) {
      return $gameMap.deltaPY(this.cy(), y);
  };

  Game_Character.prototype.pixelDistanceFrom = function(x, y) {
    return $gameMap.distance(this.cx(), this.cy(), x, y);
  };

  Game_Character.prototype.pixelDistanceFromWithBox = function(box1, box2) {
    var cx1 = box1.center.x;
    var cx2 = box2.center.x;
    var cy1 = box1.center.y;
    var cy2 = box2.center.y;
    if (box1.intersects(box2)) {
      return [$gameMap.deltaPX(cx1, cx2), $gameMap.deltaPY(cy1, cy2)];
    }
    var horz = cx1 > cx2 ? -1 : cx1 < cx2 ? 1 : 0;
    var vert = cy1 > cy2 ? -1 : cy1 < cy2 ? 1 : 0;
    var x1 = cx1 + (box1.width * horz / 2);
    var x2 = cx2 + (box2.width * -horz / 2);
    var y1 = cy1 + (box1.height * vert / 2);
    var y2 = cy2 + (box2.height * -vert / 2);
    return [$gameMap.deltaPX(x1, x2), $gameMap.deltaPY(y1, y2)];
  };

  Game_Character.prototype.moveRandom = function() {
      var d = 2 + Math.randomInt(4) * 2;
      if (this.canPass(this._px, this._py, d)) {
        this.moveStraight(d);
      }
  };

  Game_Character.prototype.moveTowardCharacter = function(character) {
    var sx = this.deltaPXFrom(character.cx());
    var sy = this.deltaPYFrom(character.cy());

    if (sx != 0 && sy != 0 && Movement.diagonal) {
      this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    } else if (Math.abs(sx) > Math.abs(sy)) {
      this.moveStraight(sx > 0 ? 4 : 6);
      if (!this.isMovementSucceeded() && sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
      }
    } else if (sy !== 0) {
      this.moveStraight(sy > 0 ? 8 : 2);
      if (!this.isMovementSucceeded() && sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
      }
    }
  };

  Game_Character.prototype.moveAwayFromCharacter = function(character) {
    var sx = this.deltaPXFrom(character.cx());
    var sy = this.deltaPYFrom(character.cy());

    if (sx != 0 && sy != 0 && Movement.diagonal) {
      this.moveDiagonally(sx > 0 ? 6 : 4, sy > 0 ? 2 : 8);
    } else if (Math.abs(sx) > Math.abs(sy)) {
      this.moveStraight(sx > 0 ? 6 : 4);
      if (!this.isMovementSucceeded() && sy !== 0) {
        this.moveStraight(sy > 0 ? 2 : 8);
      }
    } else if (sy !== 0) {
      this.moveStraight(sy > 0 ? 2 : 8);
      if (!this.isMovementSucceeded() && sx !== 0) {
        this.moveStraight(sx > 0 ? 6 : 4);
      }
    }
  };

  Game_Character.prototype.turnTowardCharacter = function(character) {
    var sx = this.deltaPXFrom(character.cx());
    var sy = this.deltaPYFrom(character.cy());
    if (Math.abs(sx) > Math.abs(sy)) {
      this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
      this.setDirection(sy > 0 ? 8 : 2);
    }
  };

  Game_Character.prototype.turnAwayFromCharacter = function(character) {
    var sx = this.deltaPXFrom(character.cx());
    var sy = this.deltaPYFrom(character.cy());
    if (Math.abs(sx) > Math.abs(sy)) {
      this.setDirection(sx > 0 ? 6 : 4);
    } else if (sy !== 0) {
      this.setDirection(sy > 0 ? 2 : 8);
    }
  };

  Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
    // Make to proper pathfinding with A*
    var ox  = this.cx() % this.moveTiles();
    var ox2 = goalX % this.moveTiles();
    var oy  = this.cy() % this.moveTiles();
    var oy2 = goalY % this.moveTiles();
    var sx  = this.deltaPXFrom(goalX);
    var sy  = this.deltaPYFrom(goalY);

    var dir;
    if (Math.abs(sx) > Math.abs(sy)) {
      goalX = goalX - ox2 + ox;
      sx = this.deltaPXFrom(goalX);
      sy = 0;
    } else if (Math.abs(sx) < Math.abs(sy)) {
      goalY = goalY - oy2 + oy;
      sy = this.deltaPYFrom(goalY);
      sx = 0;
    } else {
      sx = sy = 0;
    }
    if (Math.abs(sx) > Math.abs(sy)) {
      dir = sx > 0 ? 4 : 6;
    } else if (sy !== 0) {
      dir = sy > 0 ? 8 : 2;
    }
    return dir;
  };

  //-----------------------------------------------------------------------------
  // Game_Player
  //
  // The game object class for the player. It contains event starting
  // determinants and map scrolling functions.

  Game_Player.prototype.actor = function() {
    return $gameParty.leader();
  };

  Game_Player.prototype.locate = function(x, y) {
      Game_Character.prototype.locate.call(this, x, y);
      this.center(x, y);
      this.makeEncounterCount();
      if (this.isInVehicle()) {
          this.vehicle().refresh();
      }
      this._followers.synchronize(this);
  };

  Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this._stopCount < 1;
    this.updateDashing();
    if (sceneActive) {
      this.moveByInput();
    }
    var moving = this.isMoving();
    Game_Character.prototype.update.call(this);
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (this.stillMoving()) {
      this._moveCount = Math.max(this._moveCount - 1, 0);
      this._movingCount += this.frameSpeed();
      if (this._movingCount >= this.moveTiles()) {
        this._movingCount = this.frameSpeed();
        this.updateNonmoving(true);
      }
    }
    if (!moving) {
      this._movingCount = this.frameSpeed();
      this.updateNonmoving(wasMoving);
    }
    this._followers.update();
  };

  Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
      if (wasMoving) {
        if (this._freqCount >= this.freqThreshold()) {
          $gameParty.onPlayerWalk();
          this._freqCount = 0;
        }
        this.checkEventTriggerHere([1,2]);
        if ($gameMap.setupStartingEvent()) {
          return;
        }
      }
      if (this.triggerAction()) {
        return;
      }
      if (wasMoving) {
        this.updateEncounterCount();
      } else {
        $gameTemp.clearDestination();
      }
    }
  };

  Game_Player.prototype.updateVehicle = function() {
    if (this.isInVehicle() && !this.areFollowersGathering()) {
      if (this._vehicleGettingOn) {
        this.updateVehicleGetOn();
      } else if (this._vehicleGettingOff) {
        this.updateVehicleGetOff();
      } else {
        if (this._vehicleSyncd) {
          this.vehicle().syncWithPlayer();
        } else {
          this.copyPosition(this.vehicle());
          this._vehicleSyncd = true;
        }
      }
    }
  };

  Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
      var prevX = this.boundingBox().x;
      var prevY = this.boundingBox().y;
      this.boundingBox().moveto(x, y);
      var charas = $gameMap.getCharactersAt(this.boundingBox());
      var events = [];
      for (var i = 0; i < charas.length; i++) {
        if (charas[i] === this || charas[i].constructor === Game_Follower ||
            charas[i].constructor === Game_Vehicle) {
          continue;
        }
        if (this.boundingBox().intersects(charas[i].boundingBox())) {
          events.push(charas[i]);
        }
      }
      if (events.length === 0) {
        this.boundingBox().moveto(prevX, prevY);
        return;
      }
      var cx = this.cx();
      var cy = this.cy();
      events.sort(function(a, b) {
        return a.pixelDistanceFrom(cx, cy) - b.pixelDistanceFrom(cx, cy);
      });
      var event = events[0];
      this.boundingBox().moveto(prevX, prevY);
      if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
        event.start();
      }
    }
  };

  Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()){
      var direction = this.direction();
      var destX = $gameTemp.destinationPX();
      var destY = $gameTemp.destinationPY();
      var h = this.boundingBox().height / 2;
      var w = this.boundingBox().width / 2;
      var mDist1 = Movement.tileSize + ([2, 8].contains(direction) ? h : w)
      var mDist2 = 2 * Movement.tileSize + ([2, 8].contains(direction) ? h : w)
      if ($gameMap.distance(this.cx(), this.cy(), destX, destY) > mDist2) {
        return false;
      }
      if (this.boundingBox().containsPoint(destX, destY)) {
        if (this.airshipHere()) {
          if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
            return true;
          }
        }
        this.checkEventTriggerHere([0]);
        return $gameMap.setupStartingEvent();
      }
      if ($gameMap.distance(this.cx(), this.cy(), destX, destY) > mDist1) {
        this.checkCounter([0, 1, 2]);
        return $gameMap.setupStartingEvent();
      }
      if (this.shipBoatThere()) {
        if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
          return true;
        }
      }
      if (this.isInBoat() || this.isInShip()) {
          if (TouchInput.isTriggered() && this.getOffVehicle()) {
              return true;
          }
      }
      this.checkEventTriggerThere([0,1,2]);
      return $gameMap.setupStartingEvent();
    }
    return false;
  };

  Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
      this.startMapEvent(this._px, this._py, triggers, false);
    }
  };

  Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
      var direction = this.direction();
      var x1 = this._px;
      var y1 = this._py;
      var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles());
      var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles());
      this.startMapEvent(x2, y2, triggers, true);
      if (!$gameMap.isAnyEventStarting()) {
        this.boundingBox().moveto(x1, y1);
        return this.checkCounter(triggers);
      }
    }
  };

  Game_Player.prototype.checkCounter = function(triggers) {
    var direction = this.direction();
    var x1 = this._px;
    var y1 = this._py;
    var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles());
    var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles());
    this.boundingBox().moveto(x2, y2);
    var boxes = $gameMap.getTileBoxesAt(this.boundingBox());
    var passboxes = [];
    if (boxes.length === 0) {
      this.boundingBox().moveto(x1, y1);
      return false;
    }
    var counter;
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isCounter) {
        continue;
      }
      if (this.boundingBox().intersects(boxes[i])) {
        counter = boxes[i];
        break;
      }
    }
    this.boundingBox().moveto(x1, y1);
    if (counter) {
      if ([4, 6].contains(direction)) {
        var dist = Math.abs(counter.center.x - this.cx());
        dist += this.boundingBox().width;
      }  else if ([8, 2].contains(direction)) {
        var dist = Math.abs(counter.center.y - this.cy());
        dist += this.boundingBox().height;
      }
      var x3 = $gameMap.roundPXWithDirection(x1, direction, dist);
      var y3 = $gameMap.roundPYWithDirection(y1, direction, dist);
      return this.startMapEvent(x3, y3, triggers, true);
    }
    return false;
  };

  Game_Player.prototype.getOnVehicle = function() {
    var direction = this.direction();
    var airship = this.airshipHere();
    if (airship) {
      this._vehicleType = "airship";
    } else {
      var vehicle = this.shipBoatThere();
      if (vehicle) {
        this._vehicleType = vehicle._type;
        this._passabilityLevel = vehicle._type === "boat" ? 1 : 2;
      }
    }
    if (this.isInVehicle()) {
      this._vehicleGettingOn = true;
      this._vehicleSyncd = false;
      if (!this.isInAirship()) {
        this.setThrough(true);
        var cx = this.cx();
        var cy = this.cy();
        if ([4, 6].contains(direction)) {
          var dist = Math.abs($gameMap.deltaPX(cx, this.vehicle().cx()));
          this.fixedMove(direction, dist);
        } else if ([8, 2].contains(direction)) {
          var dist = Math.abs($gameMap.deltaPY(cy, this.vehicle().cy()));
          this.fixedMove(direction, dist);
        }
        this.setThrough(false);
      }
      this.gatherFollowers();
    }
    return this._vehicleGettingOn;
  };

  Game_Player.prototype.airshipHere = function() {
    var airship;
    var x1 = this._px;
    var y1 = this._py;
    this.boundingBox().moveto(x1, y1);
    var charas = $gameMap.getCharactersAt(this.boundingBox());
    for (var i = 0; i < charas.length; i++) {
      if (charas[i].constructor !== Game_Vehicle) {
        continue;
      }
      if (!charas[i].isAirship() || !charas[i].isOnMap()) {
        continue;
      }
      if (this.boundingBox().intersects(charas[i].boundingBox())) {
        airship = charas[i];
      }
    }
    return airship;
  };

  Game_Player.prototype.shipBoatThere = function() {
    var direction = this.direction();
    var x1 = this._px;
    var y1 = this._py;
    var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles() + 4);
    var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles() + 4);
    this.boundingBox().moveto(x2, y2);
    var charas = $gameMap.getCharactersAt(this.boundingBox());
    var vehicles = [];
    for (var i = 0; i < charas.length; i++) {
      if (charas[i].constructor !== Game_Vehicle) {
        continue;
      }
      if (charas[i].isAirship() || !charas[i].isOnMap()) {
        continue;
      }
      if (this.boundingBox().intersects(charas[i].boundingBox())) {
        vehicles.push(charas[i]);
      }
    }
    this.boundingBox().moveto(x1, y1);
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

  Game_Player.prototype.getOffVehicle = function() {
    this._vehicleSyncd = false;
    this._passabilityLevel = 5;
    this.setThrough(false);
    this.moveAllBoxes(this._px, this._py);
    var direction = this.direction();
    if (Movement.offGrid) {
      if ([4, 6].contains(direction)) {
        var dist = this.vehicle().boundingBox().ox - this.boundingBox().ox;
        dist = this.boundingBox().width + (direction === 4 ? -dist : dist);
      }  else if ([8, 2].contains(direction)) {
        var dist = this.vehicle().boundingBox().oy - this.boundingBox().oy;
        dist = this.boundingBox().height + (direction === 8 ? -dist : dist);
      }
    } else {
      if ([4, 6].contains(direction)) {
        var dist = this._px % this.moveTiles();
      } else if ([8, 2].contains(direction)) {
        var dist = this._py % this.moveTiles();
      }
      dist += this.moveTiles();
    }
    if (this.canPass(this._px, this._py, direction, dist)) {
      if (this.isInAirship()) {
        this.setDirection(2);
      }
      this._followers.synchronize(this);
      this.vehicle().getOff();
      this._passabilityLevel = 0;
      var prevX = this.vehicle().boundingBox().x;
      var prevY = this.vehicle().boundingBox().y;
      if (!this.isInAirship()) {
        this.setThrough(true);
        this.fixedMove(direction, dist);
        this.vehicle().boundingBox().moveto(prevX, prevY);
        this.setTransparent(false);
      }
      this._vehicleGettingOff = true;
      this.setMoveSpeed(4);
      this.setThrough(false);
      this.makeEncounterCount();
    } else {
      this._vehicleSyncd = true;
      this._passabilityLevel = this.vehicle()._type === "boat" ? 1 : 2;
      if (this.isInAirship()) {
        this.setThrough(true);
      }
    }
    return this._vehicleGettingOff;
  };

  var Alias_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    if (!Movement.diagonal){
      Alias_Game_Player_moveByInput.call(this);
    } else {
      if (!this.isMoving() && this.canMove()) {
        var direction = Input.dir8;
        if (direction > 0) {
          $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()){
          var x = $gameTemp.destinationPX();
          var y = $gameTemp.destinationPY();
          direction = this.findDirectionTo(x, y);
        }
        if ([2, 4, 6, 8].contains(direction)){
          this.moveStraight(direction);
        } else if ([1, 3, 7, 9].contains(direction)){
          var diag = {1: [4, 2], 3: [6, 2], 7: [4, 8], 9: [6, 8]};
          this.moveDiagonally(diag[direction][0], diag[direction][1]);
        }
      }
    }
  };

  Game_Player.prototype.isOnDamageFloor = function() {
    var boxes = $gameMap.getTileBoxesAt(this.boundingBox());
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isDamage) {
        if (this.boundingBox().intersects(boxes[i])) {
          return false;
        }
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.boundingBox().vertices();
    for (var i = 0; i < vertices.length; i++) {
      for (var j = 0; j < passboxes.length; j++) {
        if (passboxes[j].containsPoint(vertices[i].x, vertices[i].y)) {
          pass++;
        }
      }
    }
    return pass === 4;
  };

  Game_Player.prototype.moveStraight = function(d) {
    Game_Character.prototype.moveStraight.call(this, d);
  };

  Game_Player.prototype.moveDiagonally = function(horz, vert) {
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
  };

  Game_Player.prototype.boundingBox = function(direction) {
    if (this._vehicleSyncd) {
      return this.vehicle().boundingBox(direction);
    } else {
      return Game_Character.prototype.boundingBox.call(this, direction);
    }
  }

  //-----------------------------------------------------------------------------
  // Game_Follower
  //
  // The game object class for a follower. A follower is an allied character,
  // other than the front character, displayed in the party.

  var Alias_Game_Follower_initialize = Game_Follower.prototype.initialize;
  Game_Follower.prototype.initialize = function(memberIndex) {
    Alias_Game_Follower_initialize.call(this, memberIndex);
    this._moveList = [];
  };

  Game_Follower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
  };

  Game_Follower.prototype.addMove = function(direction, speed, dist) {
    this._moveList.push([direction, speed, dist]);
  };

  Game_Follower.prototype.clearList = function() {
    this._moveList = [];
  };

  Game_Follower.prototype.updateMoveList = function(preceding, gathering) {
    if (this._moveList.length === 0 || this.isMoving()) {
      return;
    }
    var move = this._moveList.shift();
    if (!gathering) {
      if (move[0].constructor === Array) {
        var collided = this.collideWithPreceding(preceding, move[0][0]) &&
                       this.collideWithPreceding(preceding, move[0][1]);
        this.boundingBox(move[0][0]).moveto(this._px, this._py);
        this.boundingBox(move[0][1]).moveto(this._px, this._py);
      } else {
        var collided = this.collideWithPreceding(preceding, move[0], move[2]);
        this.boundingBox(move[0]).moveto(this._px, this._py);
      }
      if (collided) {
        this._moveList.unshift(move);
        return;
      }
    }
    this.setMoveSpeed(move[1]);
    if (move[0].constructor === Array) {
      this.moveDiagonally(move[0][0], move[0][1]);
    } else {
      if (move[2]) {
        this.fixedMove(move[0], move[2]);
      } else {
        this.moveStraight(move[0]);
      }
    }
  };

  Game_Follower.prototype.collideWithPreceding = function(preceding, d, dist) {
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(this._px, d, dist);
    var y1 = $gameMap.roundPYWithDirection(this._py, d, dist);
    var charas = $gameMap.getCharactersAt(this.boundingBox(d));
    for (var i = 0; i < charas.length; i++) {
      if (charas[i] === this || charas[i] !== preceding ||
          charas[i]._direction === this.reverseDir(this.direction()) ) {
        continue;
      }
      if (this.boundingBox(d).intersects(charas[i].boundingBox())) {
        return true;
      }
    }
    this.boundingBox(d).moveto(x1, y1);
    charas = $gameMap.getCharactersAt(this.boundingBox(d));
    for (var i = 0; i < charas.length; i++) {
      if (charas[i] === this || charas[i] !== preceding ||
          charas[i]._direction === this.reverseDir(this.direction()) ) {
        continue;
      }
      if (this.boundingBox(d).intersects(charas[i].boundingBox())) {
        return true;
      }
    }
    this.boundingBox(d).moveto(this._px, this._py);
    return false;
  };

  //-----------------------------------------------------------------------------
  // Game_Follower
  //
  // The game object class for a follower. A follower is an allied character,
  // other than the front character, displayed in the party.

  Game_Followers.prototype.update = function() {
    this.forEach(function(follower) {
        follower.update();
    }, this);
    for (var i = this._data.length - 1; i >= 0; i--) {
      var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
      this._data[i].updateMoveList(precedingCharacter, this._gathering);
    }
  };

  Game_Followers.prototype.addMove = function(direction, speed, dist) {
    for (var i = this._data.length - 1; i >= 0; i--) {
      this._data[i].addMove(direction, speed, dist);
    }
  };

  Game_Followers.prototype.synchronize = function(chara) {
    this.forEach(function(follower) {
      follower.copyPosition(chara);
      follower.straighten();
      follower.setDirection(chara.direction());
      follower.clearList();
    }, this);
  };

  Game_Followers.prototype.areGathering = function() {
    if (this.areGathered() && this._gathering) {
      this._gathering = false;
      return true;
    }
    return false;
  };

  Game_Followers.prototype.areGathered = function() {
    return this.visibleFollowers().every(function(follower) {
      return follower.cx() === $gamePlayer.cx() && follower.cy() === $gamePlayer.cy();
    }, this);
  };

  //-----------------------------------------------------------------------------
  // Game_Vehicle
  //
  // The game object class for a vehicle.

  var Alias_Game_Vehicle_refresh = Game_Vehicle.prototype.refresh;
  Game_Vehicle.prototype.refresh = function() {
    Alias_Game_Vehicle_refresh.call(this);
    this.setThrough(!this.isOnMap());
  }

  Game_Vehicle.prototype.isOnMap = function() {
    return this._mapId === $gameMap.mapId();
  }

  //-----------------------------------------------------------------------------
  // Game_Event
  //
  // The game object class for an event. It contains functionality for event page
  // switching and running parallel process events.

  Game_Event.prototype.updateStop = function() {
    if (this._locked) {
      this._freqCount = this.freqThreshold();
      this.resetStopCount();
    }
    if (this._moveRouteForcing) {
      this.updateRoutineMove();
    }
    if (!this.isMoveRouteForcing()) {
      this.updateSelfMovement();
    }
  };

  Game_Event.prototype.updateSelfMovement = function() {
    if (this.isNearTheScreen() && !this._locked) {
      if (this._freqCount < this.freqThreshold()) {
        switch (this._moveType) {
        case 1:
          this.moveTypeRandom();
          break;
        case 2:
          this.moveTypeTowardPlayer();
          break;
        case 3:
          this.moveTypeCustom();
          break;
        }
      } else {
        this._stopCount++;
        if (this.checkStop(this.stopCountThreshold())) {
          this._stopCount = this._freqCount = 0;
        }
      }
    }
  };

  Game_Event.prototype.comments = function() {
    if (!this.list()) {
      return "";
    }
    var comments = this.list().filter(function(list) {
      return list.code === 108 || list.code === 408;
    });
    comments = comments.map(function(list) {
      return list.parameters;
    });
    return comments.join('\n');
  };

  var Alias_Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    Alias_Game_Event_setupPage.call(this);
    this.initalPosition();
    this.passabilityLevel(true);
    this._boundingBox = null;
  };

  Game_Event.prototype.initalPosition = function() {
    var ox = this.initalOffset().x;
    var oy = this.initalOffset().y;
    this.setPixelPosition(this._px + ox, this._py + oy);
  };

  Game_Event.prototype.initalOffset = function() {
    if (!this._initalOffset) {
      var ox = /<ox=(\d*)>/.exec(this.comments());
      var oy = /<oy=(\d*)>/.exec(this.comments());
      if (ox) {
        ox = Number(ox[1] || 0);
      }
      if (oy) {
        oy = Number(oy[1] || 0);
      }
      this._initalOffset = new Point(ox || 0 , oy || 0);
    }
    return this._initalOffset;
  };

  Game_Event.prototype.passabilityLevel = function(reset) {
    if (reset) {
      var lvl = /<pl=(\d*)>/.exec(this.comments());
      if (lvl) {
        this.setPassability(Number(lvl[1] || 0));
      } else {
        this.setPassability(0);
      }
    }
    return this._passabilityLevel;
  };

  Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning()) {
      if (this._trigger === 2 && !this.isJumping() && this.isNormalPriority()) {
        var prevX = this.boundingBox().x;
        var prevY = this.boundingBox().y;
        this.boundingBox().moveto(x, y);
        var charas = $gameMap.getCharactersAt(this.boundingBox());
        var player;
        for (var i = 0; i < charas.length; i++) {
          if (charas[i].constructor !== Game_Player) {
            continue;
          }
          if (this.boundingBox().intersects(charas[i].boundingBox())) {
            player = charas[i];
          }
        }
        this.boundingBox().moveto(prevX, prevY);
        if (player) {
          this._stopCount = 0;
          this._freqCount = this.freqThreshold();
          this.start();
        }
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Map
  //
  // The scene class of the map screen.

  Scene_Map.prototype.processMapTouch = function() {
    if (TouchInput.isTriggered() || this._touchCount > 0) {
      if (TouchInput.isPressed()) {
        if (this._touchCount === 0 || this._touchCount >= 15) {
          var x = $gameMap.canvasToMapPX(TouchInput.x);
          var y = $gameMap.canvasToMapPY(TouchInput.y);
          $gameTemp.setPixelDestination(x, y);
        }
        this._touchCount++;
      } else {
        this._touchCount = 0;
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character
  //
  // The sprite for displaying a character.

  var Alias_Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    Alias_Sprite_Character_update.call(this);
    this.updateBoundingBox();
  };

  Sprite_Character.prototype.updateBoundingBox = function() {
    if (!this.bitmap.isReady()) {
      return;
    }
    if (this._boundingBoxData !== this._character.boundingBox()) {
      this._boundingBoxData = this._character.boundingBox();
      var w = this._boundingBoxData.width;
      var h = this._boundingBoxData.height;
      var ox = this._boundingBoxData.ox;
      var oy = this._boundingBoxData.oy;
      if (this._boundingBoxSprite) {
        this.removeChild(this._boundingBoxSprite);
      }
      this._boundingBoxSprite = new Sprite();
      this._boundingBoxSprite.bitmap = new Bitmap(this.patternWidth(), this.patternHeight());
      this._boundingBoxSprite.bitmap.fillRect(ox, oy, w, h, Movement.collision);
      this._boundingBoxSprite.opacity = 100;
      this._boundingBoxSprite.anchor.x = 0.5;
      this._boundingBoxSprite.anchor.y = 1;
      this.addChild(this._boundingBoxSprite);
      if (!Movement.showBoxes) {
        this._boundingBoxSprite.visible = false;
      }
    }
    if (!Movement.showBoxes) {
      return;
    }
    if (this._character.constructor == Game_Follower){
      this._boundingBoxSprite.visible = this._character.isVisible();
    } else {
      this._boundingBoxSprite.visible = this.visible;
    }
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //
  // The set of sprites on the map screen.
  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    Alias_Spriteset_Map_createLowerLayer.call(this);
    this.createTileBoxes();
  };

  Spriteset_Map.prototype.createTileBoxes = function() {
    this._collisionmap = new TilingSprite();
    this._collisionmap.bitmap = $gameMap._collisionmap;
    this._collisionmap.opacity = 100;
    this._collisionmap.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._collisionmap);
    if (!Movement.showBoxes) {
      this._collisionmap.visible = false;
    }
  };

  var Alias_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    Alias_Spriteset_Map_updateTilemap.call(this);
    if (!Movement.showBoxes) {
      return;
    }
    if (this._collisionmap.bitmap !== $gameMap._collisionmap) {
      this._collisionmap.bitmap = $gameMap._collisionmap;
    }
    this._collisionmap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._collisionmap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
  };

  //-----------------------------------------------------------------------------
  /**
  * The basic object that represents an image.
  *
  * @class Bitmap
  */

  Bitmap.prototype._onLoad = function() {
    this._isLoading = false;
    this.resize(this._image.width, this._image.height);
    this._context.drawImage(this._image, 0, 0);
    this._setDirty();
    this._setPixelData();
    this._callLoadListeners();
  };

  Bitmap.prototype._setPixelData = function () {
    this._pixelData = this._context.getImageData(0, 0, this.width, this.height).data;
  };

  Bitmap.prototype.getColor = function(x, y) {
    if (!this._pixelData) {
      this._setPixelData();
    }
    if (x >= this.width || x < 0 || y >= this.height || y < 0) {
      return "";
    }
    var i = (x * 4) + (y * 4 * this.width);
    var result = '#';
    for (var c = 0; c < 3; c++) {
      result += this._pixelData[i + c].toString(16).padZero(2);
    }
    return result;
  };
})();
