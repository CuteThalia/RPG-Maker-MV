//============================================================================
// Quasi Movement
// Version: 1.09
// Last Update: November 16, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// Downloading from Github
//  - Click on Raw next to Blame and History
//  - Once new page loads, right click and save as
//============================================================================
// How to install:
//  - Save this file as "QuasiMovement.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - - If using YEP_CoreEngine, place this somewhere below it!
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/movement/
//  - - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
//============================================================================

var Imported = Imported || {};
Imported.Quasi_Movement = 1.09;

//=============================================================================
 /*:
 * @plugindesc Change the way movement works.
 * @author Quasi       Site: http://quasixi.com
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
 * @param Tile Size
 * @desc Adjust the size of tile boxes.
 * Script Default: 48
 * @default 48
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
 * @param Dash on Mouse
 * @desc Auto dash on mouse clicks?
 * Set to true or false
 * @default true
 *
 * @param =====================
 * @desc Spacer
 * @default
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
 * @param =====================
 * @desc Spacer
 * @default
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
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param JSON folder
 * @desc Where to store JSON files.
 * Default: data/
 * @default data/
 *
 * @param Collision Map folder
 * @desc Where to store Collision Map images.
 * Default: img/parallaxes/
 * @default img/parallaxes/
 *
 * @param Region Map folder
 * @desc Where to store Region Map images.
 * Default: img/parallaxes/
 * @default img/parallaxes/
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Use Regions Boxes
 * @desc Set to true if you want to put Box Colliders on regions.
 * default: false
 * @default false
 *
 * @param Convert Collision Map
 * @desc Converts the collision map into Box Colliders.
 * Set to true or false  (Not fully supported yet, should leave false)
 * @default false
 *
 * @param Show Boxes
 * @desc Show the Box Colliders by default during testing.
 * Set to true or false      - Toggle on/off with F10 during play test
 * @default true
 *
 * @help
 * =============================================================================
 * ** Setting up Colliders
 * =============================================================================
 * The following are placed inside Player Notes or as a Comment inside the
 * event. Event box is based off it's current page. So Event can have a
 * different box depending on its page.
 *   Single Collider <Note Tag>
 *       <collider=type,width,height,ox,oy>
 *
 *   Different collider based on direction <Comment>
 *       <collider>
 *       5: type, width, height, ox, oy
 *       X: type, width, height, ox, oy
 *       </collider>
 *     Where 5 is the default box if a box isn't set for a direction. And X is
 *     the box for that direction. Direction can be 2, 4, 6 or 8.
 *     Type can be box or circle
 *     * Resets on page change
 *
 *   A good circle collider for 48x48 sprites:
 *       <collider=circle,36,24,6,24>
 *
 *   Setting default OX and OY values for events <Comment>
 *       <ox=X>
 *         or
 *       <oy=Y>
 *     Set X or Y to the values you want. Can be negative.
 *     * Resets on page change
 * =============================================================================
 * ** Setting up Region Boxes
 * =============================================================================
 * To use region boxes, you first have to enabled "Use Region Boxes" in
 * the plugin settings. Next you need to create a json file called
 * "RegionBoxes.json" inside the folder you set for JSON folder parameter.
 *   If you do not know how to create a .json file download my sample
 *   RegionBoxes.json file:
 *       https://gist.github.com/quasixi/ff149320fd6885191d87
 *
 *   JSON template <JSON>
 *       {
 *         "REGION ID 1": [
 *                     {"width": w, "height": h, "ox": ox value, "oy": oy value, "tag": "some text"}
 *                        ],
 *         "REGION ID 2": [
 *                     {"width": w, "height": h, "ox": value, "oy": value},
 *                     {"width": w, "height": h, "ox": value, "oy": value}
 *                        ]
 *       }
 *     "REGION ID 2" is an example of a region with 2 boxes
 *     Replace REGION ID with the actual number for the region, but keep it
 *     inside the quotes! Becareful with the commas ( , ) place them
 *     after } or ] only if it's not the last one in the list!
 *
 *     You can see line 200 doesn't end with a called because it's the last
 *     box in that region. line 203 does end with a comma because there is
 *     another box! But line 204 does not have a comma since it's the last
 *     box. Line 201 ends with a comma because there's another region.
 *     But line 205 does not have a comma because it's the last region.
 *
 *     The tag field will act like notetags for regions. This will allow me to
 *     treat regions differently depending on the tag if needed.
 *
 *     Few tags:
 *         <counter>
 *         <bush>
 *         <ladder>
 *         <damage>
 *     * You can use more then one tag, just keep it inside the "" quotes!
 *       Ex:  "<bush><damage>"
 * =============================================================================
 * ** Setting up Collision Maps
 * =============================================================================
 * Allows the use of an image with collisions. Using this you can setup a
 * pseudo perfect pixel collision.
 *   Add a Collision Map <Note Tag>
 *       <cm=filename>
 *     Replace filename with the name of the collision map you want to load.
 *     Don't add the extension, and file should be location in the folder you
 *     set in the Collision Map folder parameter.
 *     * Map note tags are found in the map properties
 *
 *   Add a Region Map <Note Tag>
 *       <rm=filename>
 *     Replace filename with the name of the region map you want to load.
 *     Don't add the extension, and file should be location in the folder you
 *     set in the Region Map folder parameter.
 *     * Region maps do not effect collisions at all!
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
 * Other script calls:
 *   Get color from region map.
 *       $gameMap.getPixelRegion(x, y)
 *     x and y default to players center location.
 *     return value is a string of the hex color.
 *
 *   Get tile flags
 *       $gameMap.flagsAt(x, y)
 *     x and y default to players x and y
 *     works best when grid is equal to tile size.
 *     the results are logged in the console.
 *
 *   Pixel based jump
 *       $gamePlayer.pixelJump(distanceX, distanceY)
 *         or
 *       $gameMap.event(ID).pixelJump(distanceX, distanceY)
 *
 *   Jump Forward
 *       $gamePlayer.jumpForward(direction)
 *         or
 *       $gameMap.event(ID).jumpForward(direction)
 *     Jumps 1 tile size forward
 *     Direction defaults to the characters direction so it can be left out.
 *
 *   Create a collider
 *       var myBoxCollider = new QuasiMovement.Box_Collider(w, h, ox, oy, shiftY);
 *         or
 *       var myCircleCollider = new QuasiMovement.Circle_Collider(w, h, ox, oy, shiftY);
 *
 *   Moving a custom collider
 *       myCollider.moveto(x, y);
 *     Set X and Y in pixel terms.
 *     Also use the correct variable that you used to make the collider.
 *
 *   Showing Custom collider on map
 *       SceneManager._scene.addTempCollider(collider, duration)
 *     (Only works if you're in Scene_Map!)
 *     Set collider to the collider object
 *     Set duration to the duration it'll display
 *
 *   Get characters that overlap with a collider
 *       $gameMap.getCharactersAt(collider, ignore)
 *     Collider needs to be a Collider object
 *     Ignore is a function
 *     > Returns an Array of characters it overlays.
 *      - Can leave ignore function undefined if you want to manually filter
 *     ( Search this script for an example usage if needed )
 *
 *   Get map tiles that overlap with collider
 *       $gameMap.getTileBoxesAt(collider)
 *     Collider needs to be a Collider object
 *     > Returns an Array of tilesboxes it overlays
 *      - You will need to manually filter this array because there's
 *        no ignore parameter, so it returns all tiles.
 *
 *
 * =Special thanks to Archeia===================================================
 * Links
 *  - http://quasixi.com/mv/movement/
 *  - https://github.com/quasixi/RPG-Maker-MV
 *  - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
 */
//=============================================================================

var QuasiMovement = (function() {
  var Movement = {};
  Movement.proccessParameters = function() {
    var parameters   = PluginManager.parameters('QuasiMovement');
    this.grid        = Number(parameters['Grid'] || 1);
    this.offGrid     = (parameters['Off Grid'].toLowerCase() === 'true');
    this.tileSize    = Number(parameters['Tile Size'] || 48);
    this.smartMove   = Number(parameters['Smart Move'] || 0);
    this.midPass     = (parameters['Mid Pass'].toLowerCase() === 'true');
    this.diagonal    = (parameters['Diagonal'].toLowerCase() === 'true');
    this.diagSpeed   = Number(parameters['Diagonal Speed'] || 0);
    this.dashOnMouse = (parameters['Dash on Mouse'].toLowerCase() === 'true');
    this.collision   = parameters['Collision'];
    this.water1      = parameters['Water Collision'];
    this.water2      = parameters['Deep Water Collision'];
    this.playerBox   = this.stringToAry(parameters['Player Box']);
    this.eventBox    = this.stringToAry(parameters['Event Box']);
    this.boatBox     = this.stringToAry(parameters['Boat Box']);
    this.shipBox     = this.stringToAry(parameters['Ship Box']);
    this.airshipBox  = this.stringToAry(parameters['Airship Box']);
    this.jFolder     = parameters['JSON folder'];
    this.rmFolder    = parameters['Region Map folder'];
    this.cmFolder    = parameters['Collision Map folder'];
    this.useRegions  = (parameters['Use Regions Boxes'].toLowerCase() === 'true');
    this.convert     = (parameters['Convert Collision Map'].toLowerCase() === 'true');
    this.showBoxes   = (parameters['Show Boxes'].toLowerCase() === 'true');
    this.tileBoxes   = {
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
    this.regionBoxes = {};
    if (this.useRegions) {
      this.loadRegionBoxes();
    }

    var size = this.tileSize / 48;
    for (var key in this.tileBoxes) {
      if (this.tileBoxes.hasOwnProperty(key)) {
        for (var i = 0; i < this.tileBoxes[key].length; i++) {
          if (this.tileBoxes[key][i].constructor === Array) {
            for (var j = 0; j < this.tileBoxes[key][i].length; j++) {
              this.tileBoxes[key][i][j] *= size;
            }
          } else {
            this.tileBoxes[key][i] *= size;
          }
        }
      }
    }
  };

  Movement.loadRegionBoxes = function() {
    var xhr = new XMLHttpRequest();
    var url = this.jFolder + 'RegionBoxes.json';
    xhr.open('GET', url, true);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      Movement.regionBoxes = JSON.parse(xhr.responseText);
    };
    xhr.onerror = function() {
      alert("File: " + this.jFolder + "RegionBoxes.json not found.");
    };
    xhr.send();
  };

  Movement.stringToAry = function(string) {
    var ary = string.split(',');
    ary = ary.map(function(s) {
      s = s.replace(/\s+/g, '');
      if (/^-?[0-9]+$/.test(s)) {
        return Number(s || 0);
      }
      return s;
    });
    return ary;
  };

  Movement.stringToObjAry = function(string) {
    var ary = string.split('\n');
    var obj = {};
    ary = ary.filter(function(i) { return i != "" });
    ary.forEach(function(e, i, a) {
      var s = /^(.*):(.*)/.exec(e);
      if (s) {
        obj[s[1]] = this.stringToAry(s[2]);
      }
    });
    return obj;
  };

  Movement.proccessParameters();

  var Alias_DataManager_saveGame = DataManager.saveGame;
  DataManager.saveGame = function(savefileId) {
    $gameMap.disposeCollisionmap();
    return Alias_DataManager_saveGame.call(this, savefileId);
  };

  var Alias_Scene_Save_onSaveSuccess = Scene_Save.prototype.onSaveSuccess;
  Scene_Save.prototype.onSaveSuccess = function() {
    Alias_Scene_Save_onSaveSuccess.call(this);
    $gameMap.reloadAllBoxes();
  };

  var Alias_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    Alias_Scene_Map_onMapLoaded.call(this);
    $gameMap.reloadAllBoxes();
  }

  //-----------------------------------------------------------------------------
  // Box_Collider
  //
  // This class handles Box Colliders for characters.

  function Box_Collider() {
    this.initialize.apply(this, arguments);
  };
  Box_Collider.prototype.constructor = Box_Collider;

  Box_Collider.prototype.initialize = function(w, h, ox, oy, shift_y) {
    this.width   = w;
    this.height  = h;
    this.ox      = ox || 0;
    this.oy      = oy || 0;
    this.shift_y = shift_y || 0;
    this.x = this.y = 0;
    this.zoomX = 1;
    this.zoomY = 1;
    this.center;
    this.vertices(true);
  };

  Box_Collider.prototype.isCircle = function() {
    return false;
  };

  Box_Collider.prototype.isPolygon = function() {
    return false;
  };

  Box_Collider.prototype.isBox = function() {
    return true;
  };

  Box_Collider.prototype.moveto = function(x, y) {
    if (x !== this.x || y !== this.y){
      this.x = x;
      this.y = y;
      this.vertices(true);
    }
  };

  Box_Collider.prototype.scale = function(zX, zY) {
    this.zoomX = zX;
    this.zoomY = zY || zX;
    this.vertices(true);
  };

  Box_Collider.prototype.vertices = function(reset) {
    if (reset || !this._vertices){
      var w  = this.width * this.zoomX;
      var h  = this.height * this.zoomY;
      var ox = this.ox + (this.width - w)/2;
      var oy = this.oy + (this.height - h)/2;
      var range_x = {};
      range_x.min = this.x + ox;
      range_x.max = this.x + ox + w - 1;
      var range_y = {};
      range_y.min = this.y + oy - this.shift_y;
      range_y.max = this.y + oy - this.shift_y + h - 1;

      var topLeft     = new Point(range_x.min, range_y.min);
      var topRight    = new Point(range_x.max, range_y.min);
      var bottomLeft  = new Point(range_x.min, range_y.max);
      var bottomRight = new Point(range_x.max, range_y.max);

      this.box    = [range_x, range_y];
      this.center = new Point(topLeft.x + (w / 2), topLeft.y + (h / 2));
      this.edges  = {};
      this.edges.left   = [topLeft, bottomLeft];
      this.edges.right  = [topRight, bottomRight];
      this.edges.top    = [topLeft, topRight];
      this.edges.bottom = [bottomLeft, bottomRight];
      this._vertices = [topLeft, topRight, bottomLeft, bottomRight];
    }
    return this._vertices;
  };

  Box_Collider.prototype.gridEdge = function(direction) {
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

  Box_Collider.prototype.intersects = function(other) {
    if (this.height === 0 || this.width === 0) {
      return false;
    }
    if (other.isCircle()) {
      return this.intersectsWithCircle(other);
    }
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

  Box_Collider.prototype.oldintersectsWithCircle = function(circle) {
    // This should be more accurate but new one shows better results
    // Keeping this method incase I need to revert.
    if (this.containsPoint(circle.center.x, circle.center.y)) {
      return true;
    }
    var x1 = this.center.x;
    var x2 = circle.center.x;
    var y1 = this.center.y;
    var y2 = circle.center.y;
    var rad = Math.atan2(-(y1 - y2), x1 - x2);
    var pos = circle.circlePosition(rad);
    return this.containsPoint(pos[0], pos[1]);
  };

  Box_Collider.prototype.intersectsWithCircle = function(circle) {
    if (this.height === 0 || this.width === 0) {
      return false;
    }
    var i, j;
    for (i = 0, j = this._vertices.length; i < j; i++) {
      if (circle.containsPoint(this._vertices[i].x , this._vertices[i].y)) {
        return true;
      }
    }
    for (i = 0, j = circle._circleVertices.length; i < j; i++) {
      if (this.containsPoint(circle._circleVertices[i].x , circle._circleVertices[i].y)) {
        return true;
      }
    }
    return false;
  };

  Box_Collider.prototype.inside = function(other) {
    if (this.height === 0 || this.width === 0) {
      return false;
    }
    if (other.isCircle()) {
      var vertices = other._circleVertices;
    } else {
      var vertices = other._vertices;
    }
    var i, j;
    for (i = 0, j = vertices.length; i < j; i++) {
      if (!this.containsPoint(vertices[i].x, vertices[i].y)) {
        return false;
      }
    }
    return true;
  };

  Box_Collider.prototype.halfInside = function(other) {
    if (this.height === 0 || this.width === 0) {
      return false;
    }
    if (other.isCircle()) {
      var vertices = other._circleVertices;
    } else {
      var vertices = other._vertices;
    }
    var pass = 0;
    var i, j;
    for (i = 0, j = vertices.length; i < j; i++) {
      if (!this.containsPoint(vertices[i].x, vertices[i].y)) {
        pass++;
        if (pass >= j / 2) {
          return false;
        }
      }
    }
    return true;
  };

  Box_Collider.prototype.containsPoint = function(x, y) {
    if (this.height === 0 || this.width === 0) {
      return false;
    }
    var x1min = this._vertices[0].x;
    var x1max = this._vertices[1].x;
    var y1min = this._vertices[0].y;
    var y1max = this._vertices[2].y;
    var insideX = (x1min <= x) && (x1max >= x);
    var insideY = (y1min <= y) && (y1max >= y);
    return insideX && insideY;
  };

  Box_Collider.prototype.equals = function(other) {
    return (this.constructor === other.constructor &&
      this.width === other.width && this.height === other.height &&
      this.x === other.x && this.y === other.y &&
      this.ox === other.ox && this.oy === other.oy);
  };

  Movement.Box_Collider = Box_Collider;

  //-----------------------------------------------------------------------------
  // Circle_Collider
  //
  // This class handles Circle Colliders for characters.

  function Circle_Collider() {
      this.initialize.apply(this, arguments);
  };
  Circle_Collider.prototype = Object.create(Box_Collider.prototype);
  Circle_Collider.prototype.constructor = Circle_Collider;

  Circle_Collider.prototype.initialize = function(w, h, ox, oy, shift_y) {
    this.radiusX  = w / 2;
    this.radiusY  = h / 2;
    Box_Collider.prototype.initialize.call(this, w, h, ox, oy, shift_y);
  };

  Circle_Collider.prototype.vertices = function(reset) {
    this._vertices = Box_Collider.prototype.vertices.call(this, reset);
    if (reset || !this._circleVertices){
      var rx = this.radiusX * this.zoomX;
      var ry = this.radiusY * this.zoomY;
      var top    = new Point(this._vertices[0].x + rx, this._vertices[0].y);
      var left   = new Point(this._vertices[0].x, this._vertices[0].y + ry);
      var right  = new Point(this._vertices[0].x + 2 * rx, this._vertices[0].y + ry);
      var bottom = new Point(this._vertices[0].x + rx, this._vertices[0].y + 2 * ry);
      var topLeft     = new Point(this._vertices[0].x + rx / 2, this._vertices[0].y + ry / 2);
      var topRight    = new Point(this._vertices[1].x - rx / 2, this._vertices[1].y + ry / 2);
      var bottomLeft  = new Point(this._vertices[2].x + rx / 2, this._vertices[3].y - ry / 2);
      var bottomRight = new Point(this._vertices[3].x - rx / 2, this._vertices[3].y - ry / 2);
      this._circleVertices = [top, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight];
    }
    return this._vertices;
  };

  Circle_Collider.prototype.isCircle = function() {
    return true;
  };

  Circle_Collider.prototype.isBox = function() {
    return false;
  };

  Circle_Collider.prototype.circlePosition = function(radians){
    var x = (this.radiusX * this.zoomX) * Math.cos(radians);
    var y = -(this.radiusY * this.zoomY) * Math.sin(radians); // Y axis is flipped
    return [this.center.x + x, this.center.y + y];
  };

  Circle_Collider.prototype.intersects = function(other) {
    if (other.isBox()) {
      return other.intersectsWithCircle(this);
    }
    var x1 = this.center.x;
    var x2 = other.center.x;
    var y1 = this.center.y;
    var y2 = other.center.y;
    var rad = Math.atan2(-(y1 - y2), x1 - x2);
    var pos = other.circlePosition(rad);
    return this.containsPoint(pos[0], pos[1]);
  };

  Circle_Collider.prototype.containsPoint = function(x, y) {
    var h = this.center.x;
    var k = this.center.y;
    var xOverRx = Math.pow(x - h, 2) / Math.pow((this.radiusX * this.zoomX), 2);
    var yOverRy = Math.pow(y - k, 2) / Math.pow((this.radiusY * this.zoomY), 2);
    return xOverRx + yOverRy <= 1;
  };

  Movement.Circle_Collider = Circle_Collider;

  //-----------------------------------------------------------------------------
  // Polygon_Collider
  //
  // This class handles Polygon Colliders for characters.

  function Polygon_Collider() {
      this.initialize.apply(this, arguments);
  };
  Polygon_Collider.prototype = Object.create(Box_Collider.prototype);
  Polygon_Collider.prototype.constructor = Polygon_Collider;

  Polygon_Collider.prototype.initialize = function(vertices) {
    this.polyVertices = [];
    this.baseVertices = [];
    for (var i = 0; i < vertices.length; i++) {
      this.polyVertices.push(new Point(vertices[i].x, vertices[i].y));
      this.baseVertices.push(new Point(vertices[i].x, vertices[i].y));
    }
    vertices.sort(function(a, b) {
      return a.x - b.x;
    });
    var xMin = vertices[0].x;
    var xMax = vertices[vertices.length - 1].x;
    vertices.sort(function(a, b) {
      return a.y- b.y;
    });
    var yMin = vertices[0].y;
    var yMax = vertices[vertices.length - 1].y;
    var w = Math.abs(xMax - xMin);
    var h = Math.abs(yMax - yMin);
    var ox = Math.min(xMin, 0, xMax);
    var oy = Math.min(yMin, 0, yMax);
    Box_Collider.prototype.initialize.call(this, w, h, ox, oy);
  };

  Polygon_Collider.prototype.reshape = function(points) {
    this.initialize(points);
  };

  Polygon_Collider.prototype.isPolygon = function() {
    return true;
  };

  Polygon_Collider.prototype.isBox = function() {
    return false;
  };

  Polygon_Collider.prototype.scale = function(zX, zY) {
    return;
  };

  Polygon_Collider.prototype.vertices = function(reset) {
    if (reset){
      var i, j;
      for (i = 0, j = this.polyVertices.length; i < j; i++) {
        this.polyVertices[i].x = this.x + this.baseVertices[i].x;
        this.polyVertices[i].y = this.y + this.baseVertices[i].y;
      }
    }
    return Box_Collider.prototype.vertices.call(this, reset);
  };

  Polygon_Collider.prototype.intersects = function(other) {
    if (other.isCircle()) {
      return this.intersectsWithCircle(other);
    }
    if (other.isBox()) {
      return this.intersectsWithBox(other);
    }
    // Not a real polygon intersection check!
    // There should not be any polygon - polygon intersections anyways
    var i, j;
    for (i = 0, j = other.polyVertices.length; i < j; i++) {
      if (this.containsPoint(other.polyVertices[i].x, other.polyVertices[i].y)) {
        return true;
      }
    }
    return false;
  };

  Polygon_Collider.prototype.intersectsWithCircle = function(other) {
    // Not accurate but good enough for what I use it for
    var i, j;
    for (i = 0, j = other._circleVertices.length; i < j; i++) {
      if (this.containsPoint(other._circleVertices[i].x, other._circleVertices[i].y)) {
        return true;
      }
    }
    return false
  };

  Polygon_Collider.prototype.intersectsWithBox = function(other) {
    var i, j;
    for (i = 0, j = other._vertices.length; i < j; i++) {
      if (this.containsPoint(other._vertices[i].x, other._vertices[i].y)) {
        return true;
      }
    }
    return false
  };

  Polygon_Collider.prototype.containsPoint = function(x, y) {
    var i;
    var j = this.polyVertices.length - 1;
    var odd = false;
    var poly = this.polyVertices;
    for (i = 0; i < this.polyVertices.length; i++) {
      if (poly[i].y < y && poly[j].y >= y || poly[j].y < y && poly[i].y >= y) {
        if (poly[i].x + (y - poly[i].y) / (poly[j].y - poly[i].y) * (poly[j].x - poly[i].x) < x) {
          odd = !odd;
        }
      }
      j = i;
    }
    return odd;
  };

  Movement.Polygon_Collider = Polygon_Collider;

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
    this._destinationPX = x - $gameMap.tileWidth() / 2;
    this._destinationPY = y - $gameMap.tileHeight() / 2;
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
    this.reloadAllBoxes();
  };

  Game_Map.prototype.reloadAllBoxes = function() {
    delete this._tileBoxes;
    delete this._characterGrid;
    this.reloadTileBoxes();
    var i, j;
    for (i = 0, j = this.events().length; i < j; i++) {
      this.events()[i].reloadBoxes();
    }
    for (i = 0, j = this._vehicles.length; i < j; i++) {
      this._vehicles[i].reloadBoxes();
    }
    $gamePlayer.reloadBoxes();
    $gamePlayer.followers().forEach(function(follower) {
      follower.reloadBoxes();
    });
  };

  Game_Map.prototype.reloadTileBoxes = function() {
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
    this.setupRegionmap();
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
        for (var i = tiles.length; i >= 0; i--) {
          var flag = flags[tiles[i - 1]];
          if (flag === 16) {
            continue;
          }
          if (this._tileBoxes[x][y]) {
            this._tileBoxes[x][y] = this._tileBoxes[x][y].concat(this.tileBox(x, y, flag));
          } else {
            this._tileBoxes[x][y] = this.tileBox(x, y, flag);
          }
        }
      }
    }
  };

  Game_Map.prototype.tileBox = function(x, y, flag) {
    if (Movement.regionBoxes[this.regionId(x, y)]) {
      var regionData = Movement.regionBoxes[this.regionId(x, y)];
      var boxData = [];
      for (var i = 0; i < regionData.length; i++) {
        var data = [];
        data[0] = regionData[i]["width"] || 0;
        data[1] = regionData[i]["height"] || 0;
        data[2] = regionData[i]["ox"] || 0;
        data[3] = regionData[i]["oy"] || 0;
        data[4] = regionData[i]["tag"] || "";
        boxData[i] = data;
      }
      flag = 0;
    } else {
      var boxData = Movement.tileBoxes[flag];
    }
    if (!boxData) {
      if (flag & 0x20 || flag & 0x40 || flag & 0x80 || flag & 0x100) {
        boxData = [Movement.tileSize, Movement.tileSize, 0, 0];
      } else {
        return [];
      }
    }
    var tilebox = [];
    if (boxData[0].constructor === Array){
      boxData.forEach(function(box) {
        var newBox = this.makeTileBox(x, y, flag, box);
        tilebox.push(newBox);
      }, this);
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
    var newBox = new Box_Collider(w, h, ox, oy);
    newBox.moveto(x1, y1);
    newBox.note      = boxData[4] || "";
    newBox.flag      = flag;
    newBox.isLadder  = (flag & 0x20)  || /<ladder>/i.test(newBox.note);
    newBox.isBush    = (flag & 0x40)  || /<bush>/i.test(newBox.note);
    newBox.isCounter = (flag & 0x80)  || /<counter>/i.test(newBox.note);
    newBox.isDamage  = (flag & 0x100) || /<damage>/i.test(newBox.note);
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
        this._collisionmap = ImageManager.loadBitmap(Movement.cmFolder, cm[1]);
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

  Game_Map.prototype.disposeCollisionmap = function() {
    if (this._collisionmap) {
      delete this._collisionmap;
    }
    if (this._regionmap) {
      delete this._regionmap;
    }
  };

  Game_Map.prototype.convertCollisionmap = function(cm) {
    var img = ImageManager.loadBitmap(Movement.cmFolder, cm[1]);
    var collisionBoxes = img.addLoadListener(function() {
      var boxes = [];
      var nodes = new Array(img.height);
      for (var x = 0; x < nodes.length; x++) {
        nodes[x] = [];
      }
      var collisions = [];
      collisions.push(Movement.collision);
      collisions.push(Movement.water1);
      collisions.push(Movement.water2);
      var y = img.height;
      var x = 0;
      while (y > 0){
        y--;
        x = img.width;
        while (x > 0){
          x--;
          while (!collisions.contains(img.getColor(x, y))) {
            x--;
            if (x === 0) {
              break;
            }
          }
          if (x === 0) {
            break;
          }
          var color = img.getColor(x, y);
          if (!collisions.contains(color)) {
            break;
          }
          while (nodes[y].contains(x)) {
            x--;
          }
          if (img.getColor(x, y) !== color) {
            continue;
          } else if (x < 0) {
            break;
          }
          var starting_x = x;

          while (img.getColor(x, y) === color) {
            x--;
            if (nodes[y].contains(x)) {
              break;
            }
            if (x === 0) {
              break;
            }
          }
          var ending_x = x;
          var temp_x;
          var temp_y = y;

          while (true) {
            temp_x = starting_x;
            temp_y--;
            while (img.getColor(temp_x, temp_y) === color) {
              temp_x--;
              if (temp_x === ending_x) {
                break;
              }
            }
            if (temp_x === ending_x) {
              for (var scanned_x = starting_x; scanned_x !== ending_x; scanned_x--) {
                nodes[temp_y].push(scanned_x);
              }
            } else {
              break;
            }
            if (temp_y === 0) {
              break;
            }
          }
          var w = starting_x - ending_x + 1;
          var h = y - temp_y + 1;
          var newBox = new Box_Collider(w, h);
          newBox.moveto(ending_x, temp_y);
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

  Game_Map.prototype.setupRegionmap = function() {
    var rm = /<rm=(.*)>/i.exec($dataMap.note);
    if (rm) {
      this._regionmap = ImageManager.loadBitmap(Movement.rmFolder, rm[1]);
    } else {
      this._regionmap = null;
    }
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

  Game_Map.prototype.collisionMapPass = function(collider, dir, passableColors) {
    if (!this._collisionmap.isReady()) {
      return false;
    }
    if (collider.isBox()) {
      return this.collisionMapBoxPass(collider, dir, passableColors);
    }
    if (collider.isCircle()) {
      return this.collisionMapCirclePass(collider, dir, passableColors);
    }
  };

  Game_Map.prototype.insidePassableOnly = function(collider, passableColors) {
    if (!Movement.convert) {
      passableColors.splice(passableColors.indexOf("#000000"), 1);
      return this.collisionMapBoxPass(collider, "top", passableColors) &&
             this.collisionMapBoxPass(collider, "bottom", passableColors);
    }
    return true;
  };

  Game_Map.prototype.collisionMapBoxPass = function(collider, dir, passableColors) {
    var x1 = Math.floor(collider.edges[dir][0].x);
    var x2 = Math.floor(collider.edges[dir][1].x);
    var y1 = Math.floor(collider.edges[dir][0].y);
    var y2 = Math.floor(collider.edges[dir][1].y);
    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        if (!passableColors.contains(this._collisionmap.getColor(x, y))) {
          return false;
        }
      }
    }
    return true;
  };

  Game_Map.prototype.collisionMapCirclePass = function(collider, dir, passableColors) {
    switch (dir) {
      case "bottom":
        var r1 = Math.PI;
        var r2 = Math.PI * 2;
        var s = Math.PI / collider.width;
        break;
      case "left":
        var r1 = Math.PI / 2;
        var r2 = Math.PI;
        var s = Math.PI / collider.height;
        break;
      case "right":
        var r1 = -Math.PI / 2;
        var r2 = Math.PI / 2;
        var s = Math.PI / collider.height;
        break;
      case "top":
        var r1 = 0;
        var r2 = Math.PI;
        var s = Math.PI / collider.width;
        break;
    }
    while (r1 <= r2) {
      var pos = collider.circlePosition(r1);
      if (!passableColors.contains(this._collisionmap.getColor(Math.floor(pos[0]), Math.floor(pos[1])))) {
        return false;
      }
      r1 += s;
    }
    return true;
  };

  Game_Map.prototype.getTileBoxesAt = function(collider) {
    if (!this._tileBoxes) {
      return [];
    }
    var edge = collider.gridEdge();
    var x1   = edge[0];
    var x2   = edge[1];
    var y1   = edge[2];
    var y2   = edge[3];
    var boxes = [];
    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        if (x < 0 || x >= this.width()) {
          continue;
        }
        if (y < 0 || y >= this.height()) {
          continue;
        }
        for (var i = 0; i < this._tileBoxes[x][y].length; i++) {
          if (collider.intersects(this._tileBoxes[x][y][i])) {
            boxes.push(this._tileBoxes[x][y][i]);
          }
        }
      }
    }
    return boxes;
  };

  Game_Map.prototype.getCharactersAt = function(collider, ignore) {
    ignore = ignore || function() { return false; };
    var edge = collider.gridEdge();
    var x1   = edge[0];
    var x2   = edge[1];
    var y1   = edge[2];
    var y2   = edge[3];
    var charas = [];
    var x, y, i;
    for (x = x1; x <= x2; x++) {
      for (y = y1; y <= y2; y++) {
        if (x < 0 || x >= this.width()) {
          continue;
        }
        if (y < 0 || y >= this.height()) {
          continue;
        }
        for (i = 0; i < this._characterGrid[x][y].length; i++) {
          if (ignore(this._characterGrid[x][y][i])) {
            continue;
          }
          if (collider.intersects(this._characterGrid[x][y][i].collider())) {
            if (!charas.contains(this._characterGrid[x][y][i])) {
              charas.push(this._characterGrid[x][y][i]);
            }
          }
        }
      }
    }
    return charas;
  };

  Game_Map.prototype.updateCharacterGrid = function(chara, prev) {
    var box  = chara.collider();
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

  Game_Map.prototype.getPixelRegion = function(x, y) {
    if (this._regionmap) {
      if (!this._regionmap.isReady()) {
        return 0;
      }
      return this._regionmap.getColor(x || $gamePlayer.cx(), y || $gamePlayer.cy());
    }
    return 0;
  };

  Game_Map.prototype.adjustPX = function(x) {
    return this.adjustX(x / Movement.tileSize) * Movement.tileSize;
  };

  Game_Map.prototype.adjustPY = function(y) {
    return this.adjustY(y / Movement.tileSize) * Movement.tileSize;
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
    this._currentPosition;
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
    return this._gridPosition !== this.collider().gridEdge();
  };

  Game_CharacterBase.prototype.positionChanged = function() {
    return this._currentPosition !== this.collider().center;
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
    if (!this._collider) {
      this.collider();
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
    if (!this._collider) {
      this.collider();
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
      this.collider(dir).moveto(x, y);
      return false;
    }
    if ($gameMap.isLoopHorizontal() || $gameMap.isLoopVertical()) {
      var edge = this.collider(dir).gridEdge();
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
        this.collider(dir).moveto(x1, y1);
        if (!this.collisionCheck(x1, y1, dir, dist)) {
          this.collider(dir).moveto(x, y);
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
    if (this._smartMoveDir) {
      return (this.canPass(x, y, vert, dist) && this.canPass(x, y1, horz, dist)) ||
             (this.canPass(x, y, horz, dist) && this.canPass(x1, y, vert, dist));
    } else {
      return (this.canPass(x, y, vert, dist) && this.canPass(x, y1, horz, dist)) &&
             (this.canPass(x, y, horz, dist) && this.canPass(x1, y, vert, dist));
    }
  };

  Game_CharacterBase.prototype.middlePass = function(x, y, dir, dist) {
    var dist = dist / 2 || this.moveTiles() / 2;
    var x1 = $gameMap.roundPXWithDirection(x, this.reverseDir(dir), dist);
    var y1 = $gameMap.roundPYWithDirection(y, this.reverseDir(dir), dist);
    this.collider(dir).moveto(x1, y1);
    if (this.collideWithTileBox(dir)) {
      return false;
    }
    if (!Movement.convert) {
      var edge = {2: "bottom", 4: "left", 6: "right", 8: "top"};
      if (dir === 5) {
        if (!$gameMap.collisionMapPass(this.collider(dir), "top", this.passableColors()) &&
            !$gameMap.collisionMapPass(this.collider(dir), "top", this.passableColors())) {
          return false;
        }
      } else {
        if (!$gameMap.collisionMapPass(this.collider(dir), edge[dir], this.passableColors())) {
          return false;
        }
      }
    }
    if (this.collideWithCharacter(dir)) {
      return false;
    }
    this.collider(dir).moveto(x, y);
    return true;
  };

  Game_CharacterBase.prototype.collisionCheck = function(x, y, dir, dist) {
    this.collider(dir).moveto(x, y);
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
      if (dir === 5) {
        if (!$gameMap.collisionMapPass(this.collider(dir), "top", this.passableColors()) &&
            !$gameMap.collisionMapPass(this.collider(dir), "top", this.passableColors())) {
          return false;
        }
      } else {
        if (!$gameMap.collisionMapPass(this.collider(dir), edge[dir], this.passableColors())) {
          return false;
        }
      }
    }
    if (this._passabilityLevel === 1 || this._passabilityLevel === 2) {
      if (!$gameMap.insidePassableOnly(this.collider(), this.passableColors()) && !this.insidePassableOnlyBox(dir)) {
        return false;
      }
    }
    if (this.collideWithCharacter(dir)) {
      return false;
    }
    return true;
  };

  Game_CharacterBase.prototype.valid = function(d) {
    var edge = this.collider(d).gridEdge();
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
    var boxes = $gameMap.getTileBoxesAt(this.collider(d));
    for (var i = 0; i < boxes.length; i++) {
      if (this.passableColors().contains(boxes[i].color)) {
        continue;
      }
      return true;
    }
    return false;
  };

  Game_CharacterBase.prototype.collideWithCharacter = function(d) {
    var self = this;
    var charas = $gameMap.getCharactersAt(this.collider(d), function(chara) {
      if (chara.isThrough() || chara === self || !chara.isNormalPriority()) {
        return true;
      }
      if (self.constructor === Game_Player) {
        if (self.isInVehicle() && chara.constructor === Game_Vehicle) {
          return chara._type === self._vehicleType;
        }
      }
      return false;
    });
    return charas.length > 0;
  };

  Game_CharacterBase.prototype.insidePassableOnlyBox = function(d, boxes) {
    boxes = $gameMap.getTileBoxesAt(this.collider(d));
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!this.passableColors().contains(boxes[i].color)) {
        return false;
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.collider(d).vertices();
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
    var colors = ["#ffffff", "#000000"];
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
    if (this.collider().constructor !== Box_Collider &&
        this.collider().constructor !== Circle_Collider) {
      this.reloadBoxes();
    }
    if (this.isStopping()) {
      this.updateStop();
    }
    if (this.isJumping()) {
      this.updateJump();
    } else if (this.isMoving()) {
      this.updateMove();
    }
    this.updateAnimation();
    if (this.positionChanged()) {
      this.onPositionChange();
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
    this._px = this._realPX = this._x * Movement.tileSize;
    this._py = this._realPY = this._y * Movement.tileSize;
    this.moveAllBoxes(this._px, this._py);
  };

  Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this.stillMoving() && this.hasWalkAnime()) {
      this._animationCount += 1.5;
    } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
      this._animationCount++;
    }
  };

  Game_CharacterBase.prototype.onPositionChange = function() {
    if (this.gridChanged()) {
      this.updateGridChange();
    }
    this._currentPosition = this.collider().center;
  };

  Game_CharacterBase.prototype.updateGridChange = function() {
    $gameMap.updateCharacterGrid(this, this._gridPosition);
    this._gridPosition = this.collider().gridEdge();
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
    if (!this._collider) {
      return false;
    }
    var boxes = $gameMap.getTileBoxesAt(this.collider());
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isLadder) {
        return false;
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.collider().vertices();
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
    if (!this._collider) {
      return false;
    }
    var boxes = $gameMap.getTileBoxesAt(this.collider());
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isBush) {
        return false;
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.collider().vertices();
    for (var i = 0; i < vertices.length; i++) {
      for (var j = 0; j < passboxes.length; j++) {
        if (passboxes[j].containsPoint(vertices[i].x, vertices[i].y)) {
          pass++;
        }
      }
    }
    return pass === 4;
  };

  Game_CharacterBase.prototype.pixelJump = function(xPlus, yPlus) {
    return this.jump(xPlus / Movement.tileSize, yPlus / Movement.tileSize);
  };

  Game_CharacterBase.prototype.jumpForward = function(dir) {
    dir = dir || this._direction;
    var x = dir === 6 ? 1 : dir === 4 ? -1 : 0;
    var y = dir === 2 ? 1 : dir === 8 ? -1 : 0;
    this.jump(x, y);
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
      this.collider(d).moveto(this._px, this._py);
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
      this.collider(horz).moveto(this._px, this._py);
      this.collider(vert).moveto(this._px, this._py);
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
      this.collider(d).moveto(this._px, this._py);
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

  Game_CharacterBase.prototype.reloadBoxes = function() {
    delete this._collider;
    this.collider();
    $gameMap.updateCharacterGrid(this, []);
    this._gridPosition = this.collider().gridEdge();
  };

  Game_CharacterBase.prototype.collider = function(direction) {
    var direction = direction || this._direction;
    if (!this._collider) {
      this.setupCollider(direction);
    }
    return this._collider[direction] || this._collider[5];
  };

  Game_CharacterBase.prototype.setupCollider = function(direction) {
    this._collider = [];
    if (this.constructor === Game_Player) {
      var box  = Movement.playerBox;
      var note = this.notes();
    } else if (this.constructor === Game_Event) {
      var box  = Movement.eventBox;
      var note = this.comments();
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
    if (note) {
      var multibox = /<collider>([\s\S]*)<\/collider>/.exec(note);
      if (!multibox) {
        multibox  = /<bbox>([\s\S]*)<\/bbox>/.exec(note);
        var oldmulti = true;
      }

      var singlebox = /<collider=(.*)>/.exec(note);
      if (!singlebox) {
        singlebox = /<bbox=(.*)>/.exec(note);
        var oldsingle = true;
      }
    }
    if (multibox) {
      var multi = Movement.stringToObjAry(multibox[1]);
      var boxW  = box[0] || 0;
      var boxH  = box[1] || 0;
      var boxOX = box[2] || 0;
      var boxOY = box[3] || 0;
      this._collider[5] = new Box_Collider(boxW, boxH, boxOX, boxOY, this.shiftY());
      for (var key in multi) {
        if (multi.hasOwnProperty(key)) {
          var box = multi[key];
          var t = "box";
          var i = 0;
          if (!oldmulti) {
            var t = box[0].toLowerCase();
            var i = 1;
          }
          var w  = box[0 + i] || boxW;
          var h  = box[1 + i] || boxH;
          var ox = typeof box[2 + i] === 'number' ? box[2 + i] : boxOX;
          var oy = typeof box[3 + i] === 'number'  ? box[3 + i] : boxOY;
          if (t === "box") {
            this._collider[key] = new Box_Collider(w, h, ox, oy, this.shiftY());
          } else if (t === "circle"){
            this._collider[key] = new Circle_Collider(w, h, ox, oy, this.shiftY());
          }
        }
      }
      this.moveAllBoxes(this._px, this._py);
    } else {
      var boxW  = box[0] || 0;
      var boxH  = box[1] || 0;
      var boxOX = box[2] || 0;
      var boxOY = box[3] || 0;
      var t = "box";
      var i = 0;
      if (singlebox) {
        var newBox = Movement.stringToAry(singlebox[1]);
        if (!oldsingle) {
          var t = newBox[0].toLowerCase();
          var i = 1;
        }
        boxW  = newBox[0 + i] || boxW;
        boxH  = newBox[1 + i] || boxH;
        boxOX = typeof newBox[2 + i] === 'number' ? newBox[2 + i] : boxOX;
        boxOY = typeof newBox[3 + i] === 'number' ? newBox[3 + i] : boxOY;
      }
      if (t === "box") {
        this._collider[5] = new Box_Collider(boxW, boxH, boxOX, boxOY, this.shiftY());
      } else if (t === "circle") {
        this._collider[5] = new Circle_Collider(boxW, boxH, boxOX, boxOY, this.shiftY());
      }
      this._collider[5].moveto(this._px, this._py);
    }
  }

  Game_CharacterBase.prototype.moveAllBoxes = function(newX, newY) {
    newX = typeof newX === 'number' ? newX : this._px;
    newY = typeof newY === 'number' ? newY : this._py;
    for (var i = 0; i < this._collider.length; i++) {
      if (this._collider[i]) {
        this._collider[i].moveto(newX, newY);
      }
    }
  };

  Game_CharacterBase.prototype.copyCollider = function() {
    var w = this.collider().width;
    var h = this.collider().height;
    var ox = this.collider().ox;
    var oy = this.collider().oy;
    if (this.collider().isCircle()) {
      var collider = new Circle_Collider(w, h, ox, oy, this.shiftY());
    } else {
      var collider = new Box_Collider(w, h, ox, oy, this.shiftY());
    }
    collider.moveto(this._px, this._py);
    return collider;
  };

  Game_CharacterBase.prototype.cx = function() {
    return this.collider().center.x;
  };

  Game_CharacterBase.prototype.cy = function() {
    return this.collider().center.y;
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
  };

  Game_Character.prototype.subMmove = function(settings) {
    var move = {
      2: Game_Character.ROUTE_MOVE_DOWN,     4: Game_Character.ROUTE_MOVE_LEFT,
      6: Game_Character.ROUTE_MOVE_RIGHT,    8: Game_Character.ROUTE_MOVE_UP,
      1: Game_Character.ROUTE_MOVE_LOWER_L,  3: Game_Character.ROUTE_MOVE_LOWER_R,
      7: Game_Character.ROUTE_MOVE_UPPER_L,  9: Game_Character.ROUTE_MOVE_UPPER_R
    }
    settings = Movement.stringToAry(settings);
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
    settings  = Movement.stringToAry(settings);
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

  Game_Character.prototype.pixelDistanceFromWithBox = function(other) {
    // to do or not, not really needed
  };

  Game_Character.prototype.moveRandom = function() {
      var d = 2 + Math.randomInt(4) * 2;
      if (this.canPass(this._px, this._py, d)) {
        this.moveStraight(d);
      }
  };

  Game_Character.prototype.moveTowardCharacter = function(character) {
    var sx = this.cx() - character.cx();
    var sy = this.cy() - character.cy();
    if (sx != 0 && sy != 0 && Movement.diagonal) {
      this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    }
    if (Math.abs(sx) > Math.abs(sy)) {
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

  Game_Character.prototype.startPathFind = function(goalX, goalY) {
    this._pathFind = null;
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

  Game_Character.prototype.updatePathFind = function() {

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

  var Alias_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    if (!Movement.diagonal){
      Alias_Game_Player_moveByInput.call(this);
    } else {
      if (!this.isMoving() && this.canMove()) {
        var direction = Input.dir8;
        if (direction > 0) {
          $gameTemp.clearDestination();
          this._pathFind = null;
        } else if ($gameTemp.isDestinationValid()){
          var x = $gameTemp.destinationPX();
          var y = $gameTemp.destinationPY();
          if (!this._pathFind) {
            direction = this.startPathFind(x, y);
          }
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

  Game_Player.prototype.updateDashing = function() {
    if (this.isMoving()) {
      return;
    }
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
      this._dashing = this.isDashButtonPressed() || (Movement.dashOnMouse && $gameTemp.isDestinationValid());
    } else {
      this._dashing = false;
    }
  };

  Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this._stopCount < 1;
    this.updateDashing();
    if (sceneActive) {
      this.moveByInput();
      if (!this.isMoving() && this.canMove()) {
        this.updatePathFind();
      }
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
        if (this._freqCount >= this.freqThreshold()) {
          this.updateEncounterCount();
          this._freqCount = 0;
        }
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
      var collider = this.copyCollider();
      collider.moveto(x, y)
      var self = this;
      var events = $gameMap.getCharactersAt(collider, function(e) {
        return (e === self || e.constructor === Game_Follower || e.constructor === Game_Vehicle);
      });
      if (events.length === 0) {
        return;
      }
      var cx = this.cx();
      var cy = this.cy();
      events.sort(function(a, b) {
        return a.pixelDistanceFrom(cx, cy) - b.pixelDistanceFrom(cx, cy);
      });
      var event = events[0];
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
      var h = this.collider().height / 2;
      var w = this.collider().width / 2;
      var mDist1 = Movement.tileSize + ([2, 8].contains(direction) ? h : w)
      var mDist2 = 2 * Movement.tileSize + ([2, 8].contains(direction) ? h : w)
      if ($gameMap.distance(this.cx(), this.cy(), destX, destY) > mDist2) {
        return false;
      }
      if (this.collider().containsPoint(destX, destY)) {
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
    var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles());
    var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles());
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
    var collider = this.copyCollider();
    var airship = $gameMap.getCharactersAt(collider, function(e) {
      if (e.constructor !== Game_Vehicle) {
        return true;
      }
      return (!e.isAirship() || !e.isOnMap());
    });
    return airship[0];
  };

  Game_Player.prototype.shipBoatThere = function() {
    var direction = this.direction();
    var x1 = this._px;
    var y1 = this._py;
    var x2 = $gameMap.roundPXWithDirection(x1, direction, this.moveTiles() + 4);
    var y2 = $gameMap.roundPYWithDirection(y1, direction, this.moveTiles() + 4);
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

  Game_Player.prototype.getOffVehicle = function() {
    this._vehicleSyncd = false;
    this._passabilityLevel = 5;
    this.setThrough(false);
    this.moveAllBoxes(this._px, this._py);
    var direction = this.direction();
    if (Movement.offGrid) {
      if ([4, 6].contains(direction)) {
        var dist = this.vehicle().collider().ox - this.collider().ox;
        dist = this.collider().width + (direction === 4 ? -dist : dist);
      }  else if ([8, 2].contains(direction)) {
        var dist = this.vehicle().collider().oy - this.collider().oy;
        dist = this.collider().height + (direction === 8 ? -dist : dist);
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
      var prevX = this.vehicle().collider().x;
      var prevY = this.vehicle().collider().y;
      if (!this.isInAirship()) {
        this.setThrough(true);
        this.fixedMove(direction, dist);
        this.vehicle().collider().moveto(prevX, prevY);
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

  Game_Player.prototype.isOnDamageFloor = function() {
    var boxes = $gameMap.getTileBoxesAt(this.collider());
    var passboxes = [];
    if (boxes.length === 0) {
      return false;
    }
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isDamage) {
        return false;
      }
      passboxes.push(boxes[i]);
    }
    var pass = 0;
    var vertices = this.collider().vertices();
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

  Game_Player.prototype.collider = function(direction) {
    if (this._vehicleSyncd) {
      return this.vehicle().collider(direction);
    } else {
      return Game_Character.prototype.collider.call(this, direction);
    }
  };

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
        this.collider(move[0][0]).moveto(this._px, this._py);
        this.collider(move[0][1]).moveto(this._px, this._py);
      } else {
        var collided = this.collideWithPreceding(preceding, move[0], move[2]);
        this.collider(move[0]).moveto(this._px, this._py);
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
    if (!this.isVisible()){
      return false;
    }
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(this._px, d, dist);
    var y1 = $gameMap.roundPYWithDirection(this._py, d, dist);
    var self = this;
    var charas = $gameMap.getCharactersAt(this.collider(d), function(chara) {
      if (chara === self || chara !== preceding ||
          chara._direction === self.reverseDir(self.direction()) ) {
        return true;
      }
      return false;
    });
    if (charas.length > 0) {
      return true;
    }
    this.collider(d).moveto(x1, y1);
    charas = $gameMap.getCharactersAt(this.collider(d), function(chara) {
      if (chara === self || chara !== preceding ||
          chara._direction === self.reverseDir(self.direction()) ) {
        return true;
      }
      return false;
    });
    this.collider(d).moveto(this._px, this._py);
    return charas.length > 0;
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
  };

  Game_Vehicle.prototype.isOnMap = function() {
    return this._mapId === $gameMap.mapId();
  };

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
    if (!this.page() || !this.list()) {
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

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.initialPosition();
    this.passabilityLevel(true);
    this._collider = null;
    this._randomDir = null;
  };

  Game_Event.prototype.initialPosition = function() {
    var ox = this.initialOffset().x;
    var oy = this.initialOffset().y;
    this.setPixelPosition(this._px + ox, this._py + oy);
  };

  Game_Event.prototype.initialOffset = function() {
    if (!this._initialOffset) {
      var ox = /<ox=(-?[0-9]*)>/.exec(this.comments());
      var oy = /<oy=(-?[0-9]*)>/.exec(this.comments());
      if (ox) {
        ox = Number(ox[1] || 0);
      }
      if (oy) {
        oy = Number(oy[1] || 0);
      }
      this._initialOffset = new Point(ox || 0 , oy || 0);
    }
    return this._initialOffset;
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
        var prevX = this.collider().x;
        var prevY = this.collider().y;
        this.collider().moveto(x, y);
        var self = this;
        var charas = $gameMap.getCharactersAt(this.collider(), function(chara) {
          if (chara.constructor !== Game_Player) {
            return true;
          }
          return false;
        });
        this.collider().moveto(prevX, prevY);
        if (charas.length > 0) {
          this._stopCount = 0;
          this._freqCount = this.freqThreshold();
          this.start();
        }
      }
    }
  };

  Game_Event.prototype.moveTypeRandom = function() {
    if (this._freqCount === 0 || !this._randomDir) {
      this._randomDir = 2 * (Math.randomInt(4) + 1);
    }
    if (!this.canPass(this._px, this._py, this._randomDir)) {
      this._randomDir = 2 * (Math.randomInt(4) + 1);
    }
    this.moveStraight(this._randomDir);
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
          if (!Movement.offGrid) {
            var ox  = x % Movement.tileSize;
            var oy  = y % Movement.tileSize;
            x -= ox;
            y -= oy;
          }
          $gameTemp.setPixelDestination(x, y);
        }
        this._touchCount++;
      } else {
        this._touchCount = 0;
      }
    }
  };

  Scene_Map.prototype.addTempCollider = function(collider, duration, remove) {
    if ($gameTemp.isPlaytest() && Movement.showBoxes) {
      this._spriteset.addTempCollider(collider, duration || 60, remove);
    }
  };

  Input.keyMapper[121] = 'F10';
  var Alias_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
  Scene_Map.prototype.updateMain = function() {
    Alias_Scene_Map_updateMain.call(this);
    if ($gameTemp.isPlaytest() && Input.isTriggered('F10')) {
      Movement.showBoxes = !Movement.showBoxes;
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Destination
  //
  // The sprite for displaying the destination place of the touch input.

  Sprite_Destination.prototype.updatePosition = function() {
    var tileWidth = $gameMap.tileWidth();
    var tileHeight = $gameMap.tileHeight();
    var x = $gameTemp.destinationPX();
    var y = $gameTemp.destinationPY();
    this.x = $gameMap.adjustPX(x) + tileWidth / 2;
    this.y = $gameMap.adjustPY(y) + tileHeight / 2;
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character
  //
  // The sprite for displaying a character.

  var Alias_Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    Alias_Sprite_Character_update.call(this);
    if ($gameTemp.isPlaytest()) {
      this.updateColliders();
    }
  };

  Sprite_Character.prototype.updateColliders = function() {
    if (!this.bitmap.isReady()) {
      return;
    }
    if (this._colliderData !== this._character.collider()) {
      this.createColliders();
    }
    if (!this._colliderSprite) {
      return;
    }
    if (this._character.constructor == Game_Follower){
      this._colliderSprite.visible = this._character.isVisible() && Movement.showBoxes;
    } else {
      this._colliderSprite.visible = this.visible && Movement.showBoxes;
    }
  };

  Sprite_Character.prototype.createColliders = function() {
    this._colliderData = this._character.collider();
    if (this._colliderData.constructor !== Box_Collider &&
        this._colliderData.constructor !== Circle_Collider) {
      return;
    }
    var w = this._colliderData.width;
    var h = this._colliderData.height;
    var ox = this._colliderData.ox;
    var oy = this._colliderData.oy;
    if (this._colliderSprite) {
      this.removeChild(this._colliderSprite);
    }
    this._colliderSprite = new Sprite();
    this._colliderSprite.bitmap = new Bitmap(w + ox, h + oy);
    if (this._colliderData.isCircle()) {
      var radiusX = this._colliderData.radiusX;
      var radiusY = this._colliderData.radiusY;
      this._colliderSprite.bitmap.drawEllipse(radiusX, radiusY, radiusX, radiusY, Movement.collision);
    } else {
      this._colliderSprite.bitmap.fillRect(0, 0, w, h, Movement.collision);
    }
    this._colliderSprite.x += ox;
    this._colliderSprite.y += oy;
    this._colliderSprite.x -= this.x - this._character._px;
    this._colliderSprite.x -= $gameMap.displayX() * 48;
    this._colliderSprite.y -= this.y - this._character._py + this._character.shiftY();
    this._colliderSprite.y -= $gameMap.displayY() * 48;
    this._colliderSprite.opacity = 100;
    this.addChild(this._colliderSprite);
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //
  // The set of sprites on the map screen.

  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    Alias_Spriteset_Map_createLowerLayer.call(this);
    if ($gameTemp.isPlaytest()) {
      this.createTileBoxes();
      this._tempColliders = [];
    }
  };

  Spriteset_Map.prototype.createTileBoxes = function() {
    this._collisionmap = new TilingSprite();
    this._collisionmap.bitmap = $gameMap._collisionmap;
    this._collisionmap.opacity = 100;
    this._collisionmap.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._collisionmap);
    if ($gameMap._regionmap) {
      this._regionmap = new TilingSprite();
      this._regionmap.bitmap = $gameMap._regionmap;
      this._regionmap.opacity = 100;
      this._regionmap.move(0, 0, Graphics.width, Graphics.height);
      this._collisionmap.addChild(this._regionmap);
    }
  };

  Spriteset_Map.prototype.addTempCollider = function(collider, duration, remove) {
    var i, j;
    var temp = {};
    for (i = 0, j = this._tempColliders.length; i < j; i++) {
      if (this._tempColliders[i].collider === collider) {
        if (remove) {
          var replace = true;
          temp = this._tempColliders[i];
          break;
        }
      }
      if (this._tempColliders[i].collider.equals(collider)) {
        this._tempColliders[i].decay = duration;
        return;
      }
    }
    temp.collider = collider;
    temp.decay = duration;
    if (!replace) {
      temp.sprite = new Sprite();
    }
    temp.sprite.bitmap = new Bitmap(collider.width + collider.ox, collider.height + collider.oy);
    if (collider.isCircle()) {
      var radiusX = collider.radiusX;
      var radiusY = collider.radiusY;
      temp.sprite.bitmap.drawEllipse(radiusX, radiusY, radiusX, radiusY, Movement.collision);
    } else if (collider.isPolygon()) {
      temp.sprite.bitmap = new Bitmap(collider.width, collider.height);
      temp.sprite.bitmap.drawPolygon(collider.baseVertices, -collider.ox, -collider.oy, Movement.collision);
      temp.sprite._offset.x = collider.ox;
      temp.sprite._offset.y = collider.oy;
    } else {
      temp.sprite.bitmap.fillRect(collider.ox, collider.oy, collider.width, collider.height, Movement.collision);
    }
    temp.sprite.opacity = 100;
    temp.sprite.x += collider.x;
    temp.sprite.x -= $gameMap.displayX() * 48;
    temp.sprite.y += collider.y;
    temp.sprite.y -= $gameMap.displayY() * 48;
    if (!replace) {
      this._tempColliders.push(temp);
      this.addChild(temp.sprite);
    }
  };

  var Alias_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    Alias_Spriteset_Map_updateTilemap.call(this);
    if ((!$gameTemp.isPlaytest()) || !this._collisionmap) {
      return;
    }
    this.updateTileBoxes();
    if (this._tempColliders.length > 0) {
      this.updateTempColliders();
    }
  };

  Spriteset_Map.prototype.updateTileBoxes = function() {
    if (this._collisionmap.bitmap !== $gameMap._collisionmap) {
      this._collisionmap.bitmap = $gameMap._collisionmap;
    }
    if (this._regionmap) {
      if (this._regionmap.bitmap !== $gameMap._regionmap) {
        this._regionmap.bitmap = $gameMap._regionmap;
      }
      this._regionmap.visible = Movement.showBoxes;
      if (Movement.showBoxes) {
        this._regionmap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._regionmap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
      }
    }
    this._collisionmap.visible = Movement.showBoxes;
    if (Movement.showBoxes) {
      this._collisionmap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
      this._collisionmap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    }
  };

  Spriteset_Map.prototype.updateTempColliders = function() {
    var remove = [];
    for (var i = 0; i < this._tempColliders.length; i++) {
      if (this._tempColliders[i].decay <= 0 || !this._tempColliders[i].collider) {
        this.removeChild(this._tempColliders[i].sprite);
        remove.push(i);
      }
      this._tempColliders[i].decay--;
      this._tempColliders[i].sprite.x = this._tempColliders[i].collider.x;
      this._tempColliders[i].sprite.x -= $gameMap.displayX() * 48;
      this._tempColliders[i].sprite.y = this._tempColliders[i].collider.y;
      this._tempColliders[i].sprite.y -= $gameMap.displayY() * 48;
      this._tempColliders[i].sprite.visible = Movement.showBoxes;
    }
    for (var i = 0; i < remove.length; i++) {
      this._tempColliders.splice(remove[i], 1);
    }
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

  // Optimized version of getPixel()
  Bitmap.prototype.getColor = function(x, y) {
    if (!this._pixelData) {
      this._setPixelData();
    }
    x = Math.floor(x);
    y = Math.floor(y);
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

  Bitmap.prototype.drawEllipse = function(x, y, radiusX, radiusY, color) {
    var context = this._context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.scale(radiusX, radiusY);
    context.arc(1, 1, 1, 0, Math.PI * 2, false);
    context.translate(x, y);
    context.fill();
    context.restore();
    this._setDirty();
  };

  Bitmap.prototype.drawPolygon = function(points, shiftX, shiftY, color) {
    var context = this._context;
    context.save();
    context.fillStyle = color;
    context.moveTo(points[0].x + shiftX, points[0].y + shiftY);
    var i, j;
    for (i = 0, j = points.length; i < j; i++) {
      context.lineTo(points[i].x + shiftX, points[i].y + shiftY);
    }
    context.closePath();
    context.fill();
    context.restore();
    this._setDirty();
  };

  return Movement;
})();
