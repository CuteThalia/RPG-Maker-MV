//============================================================================
// Quasi TileD
// Version: 0.9
// Last Update: November 7, 2015
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiTileD.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/
//  - - http://forums.rpgmakerweb.com/ + link
//============================================================================

var Imported = Imported || {};
Imported.Quasi_TileD = 0.9;

//=============================================================================
 /*:
 * @plugindesc Allows you to import tiled json files.
 * @author Quasi      Site: http://quasixi.com
 *
 * @param TileD Path
 * @desc The path to your tileD json files.
 * Default: tiled/
 * @default tiled/
 *
 * @help
 * =============================================================================
 * ** Note
 * =============================================================================
 * This is an incomplete plugin. It does read and create the maps off tiled
 * editor. But There are still a few features missing. Plus I'm not sure
 * I like how I'm handing the tilemap.
 *
 * To use, add the note tag:
 *     <tileD=filename>
 * Can load in isometric maps as well.
 *
 * I am not sure if I will finish this. Because I don't even know if I'm using
 * tiled map editor correctly, so I might be loading it incorrectly.
 * =============================================================================
 * Links
 *  - http://quasixi.com/mv/
 *  - https://github.com/quasixi/RPG-Maker-MV
 *  - http://forums.rpgmakerweb.com/ -- link
 */
//=============================================================================

if (!Imported.Quasi_Movement) {
  alert("Error: Quasi TileD requires Quasi Movement to work.");
  throw new Error("Error: Quasi TileD requires Quasi Movement to work.")
}
(function() {
  var parameters = PluginManager.parameters('QuasiTileD');
  tileD      = {};
  tileD.path     = parameters["TileD Path"];
  tileD.currentMap;

  tileD.loadMap = function(file) {
    var xhr = new XMLHttpRequest();
    var url = tileD.path + file + '.json';
    xhr.open('GET', url, true);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      tileD.setup(JSON.parse(xhr.responseText));
    };
    xhr.onerror = function() {
      alert("File: " + url + " not found.");
    };
    xhr.send();
  };

  tileD.setup = function(file) {
    this.loadSettings(file);
    this.loadTilesets(file);
    this.loadLayers(file);
    this.currentMap = {};
    this.currentMap.tilesets = this.tilesets;
    this.currentMap.lowerLayers = this.lowerLayers;
    this.currentMap.upperLayers = this.upperLayers;
    this.currentMap.settings = this.settings;
  };

  tileD.loadSettings = function(file) {
    this.settings = {};
    this.settings.tileHeight  = file.tileheight;
    this.settings.tileWidth   = file.tilewidth;
    this.settings.height      = file.height;
    this.settings.width       = file.width;
    this.settings.orientation = file.orientation;
  };

  tileD.tilesets = [];
  tileD.loadTilesets = function(file) {
    var i, j;
    var tilesets = file.tilesets;
    var tileset, file;
    for (i = 0, j = tilesets.length; i < j; i++) {
      file = /.*\/(.*).png/.exec(tilesets[i].image);
      if (file) {
        tileset = {};
        tileset.first = tilesets[i].firstgid;
        tileset.last  = tilesets[i].tilecount + tileset.first - 1;
        tileset.tileWidth  = tilesets[i].tilewidth;
        tileset.tileHeight = tilesets[i].tileheight;
        tileset.img = ImageManager.loadTileset(file[1]);
        this.tilesets.push(tileset);
      }
    }
  };

  tileD.lowerLayers  = [];
  tileD.upperLayers  = [];
  tileD.heightMap    = [];
  tileD.collisionMap = [];
  tileD.loadLayers = function(file) {
    var i, j;
    var layers = file.layers;
    this.maxDepth = 0;
    this.minDepth = 0;
    for (i = 0, j = layers.length; i < j; i++) {
      if(/^lower/i.test(layers[i].name)) {
        this.lowerLayers.push(layers[i]);
        if (layers[i].offsety) {
          this.minDepth = layers[i].offsety < this.minDepth ? layers[i].offsety : this.minDepth;
          this.maxDepth = layers[i].offsety > this.maxDepth ? layers[i].offsety : this.maxDepth;
        }
      }
      if(/^upper/i.test(layers[i].name)) {
        this.upperLayers.push(layers[i]);
        if (layers[i].offsety) {
          this.minDepth = layers[i].offsety < this.minDepth ? layers[i].offsety : this.minDepth;
          this.maxDepth = layers[i].offsety > this.maxDepth ? layers[i].offsety : this.maxDepth;
        }
      }
      if(/^heights/i.test(layers[i].name)) {
        this.setupHeightMap(layers[i].objects);
      }
      if(/^collision/i.test(layers[i].name)) {
        this.collisionMap = layers[i].objects;
      }
    }
  };

  tileD.setupHeightMap = function(data) {
    this.heightMap = new Array(this.settings.width);
    var x, y
    for (x = 0; x < this.heightMap.length; x++) {
      this.heightMap[x] = [];
      for (y = 0; y < this.settings.height; y++) {
        this.heightMap[x].push([]);
      }
    }
    var i;
    for (i = 0; i < data.length; i++) {
      var w = data[i].width;
      var h = data[i].height;
      var l = data[i].properties.Height || data[i].properties.height;
      var box  = new QuasiMovement.Box_Collider(w, h);
      box.moveto(data[i].x, data[i].y);
      box.level = Number(l || 0);
      /*
      var edge = box.gridEdge();
      var x1   = edge[0];
      var x2   = edge[1];
      var y1   = edge[2];
      var y2   = edge[3];
      */
      var edge1 = box.edges['top'];
      var edge2 = box.edges['bottom'];
      var x1 = Math.floor(edge1[0].x / this.settings.tileHeight);
      var x2 = Math.floor(edge1[1].x / this.settings.tileHeight);
      var y1 = Math.floor(edge1[0].y / this.settings.tileHeight);
      var y2 = Math.floor(edge2[0].y / this.settings.tileHeight);
      for (var x = x1; x <= x2; x++) {
        for (var y = y1; y <= y2; y++) {
          this.heightMap[x][y].push(box);
        }
      }
    }
  };

  tileD.getHeightsAt = function(box) {
    if (!this.heightMap) {
      return [];
    }
    /*
    var edge = box.gridEdge();
    var x1   = edge[0];
    var x2   = edge[1];
    var y1   = edge[2];
    var y2   = edge[3];
    */
    var edge1 = box.edges['top'];
    var edge2 = box.edges['bottom'];
    var x1 = Math.floor(edge1[0].x / this.settings.tileHeight);
    var x2 = Math.floor(edge1[1].x / this.settings.tileHeight);
    var y1 = Math.floor(edge1[0].y / this.settings.tileHeight);
    var y2 = Math.floor(edge2[0].y / this.settings.tileHeight);
    var boxes = [];
    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        if (x < 0 || x >= this.settings.width) {
          continue;
        } else if (y < 0 || y >= this.settings.height) {
          continue;
        }
        for (var i = 0; i < this.heightMap[x][y].length; i++) {
          boxes.push(this.heightMap[x][y][i]);
        }
      }
    }
    return boxes;
  };

  tileD.heightAt = function(collider) {
    var x = Math.floor(collider.center.x / QuasiMovement.tileSize);
    var y = Math.floor(collider.center.y / QuasiMovement.tileSize);
    var boxes = this.heightMap[x][y];
    x *= this.settings.tileHeight;
    y *= this.settings.tileHeight;
    var height;
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].containsPoint(x, y)) {
        height = boxes[i].level;
        break;
      }
    }
    return height || 0;
  };

  tileD.clear = function() {
    this.currentMap   = null;
    this.settings     = null;
    this.lowerLayers  = [];
    this.upperLayers  = [];
    this.heightMap    = [];
    this.collisionMap = [];
    this.tilesets     = [];
  };

  tileD.isIso = function() {
    if (!this.settings) {
      return false;
    }
    return this.settings.orientation === "isometric";
  };

  tileD.toIso = function(x, y) {
    if (!this.isIso()) {
      return [x, y];
    }
    var isoX = x - y;
    var isoY = (x + y) / 2
    return [isoX, isoY];
  };

  tileD.shiftX = function() {
    if (!this.isIso()) {
      return 0;
    }
    var height = this.settings.height - 1;
    var tileWidth = this.settings.tileWidth;
    return height * tileWidth / 2;
  };

  tileD.shiftY = function() {
    if (!this.isIso()) {
      return 0;
    }
    var width = this.settings.height - 1;
    var tileWidth = this.settings.tileWidth;
    return (width * tileWidth / 4) + this.maxDepth + Math.abs(this.minDepth);
  }

  tileD.getLayerSize = function() {
    var width      = this.settings.width;
    var height     = this.settings.height;
    var tileWidth  = this.settings.tileWidth;
    var tileHeight = this.settings.tileHeight;
    if (!this.isIso()) {
      return [width * tileWidth, height * tileHeight];
    }
    var sHeight = (this.maxDepth + Math.abs(this.minDepth)) * 2;
    sHeight += SceneManager._screenHeight;
    var sWidth = SceneManager._screenWidth;
    var total = width + height;
    return [(total * tileWidth / 2) + sWidth, (total * tileHeight / 2) + sHeight];
  };

  //-----------------------------------------------------------------------------
  // Game_Map
  //
  // The game object class for a map. It contains scrolling and passage
  // determination functions.

  var Alias_Game_Map_Setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_Setup.call(this, mapId);
    this.loadTileD();
  };

  Game_Map.prototype.loadTileD = function() {
    var td = /<tileD=(.*)>/i.exec($dataMap.note);
    if (td) {
      tileD.loadMap(td[1]);
    } else {
      tileD.clear();
    }
  };

  var Alias_Game_Map_setDisplayPos = Game_Map.prototype.setDisplayPos;
  Game_Map.prototype.setDisplayPos = function(x, y) {
    if (tileD.isIso()) {
      this._displayX  = x;
      this._parallaxX = x;
      this._displayY  = y;
      this._parallaxY = y;
    } else {
      Alias_Game_Map_setDisplayPos.call(this, x, y);
    }
  };

  var Alias_Game_Map_displayX = Game_Map.prototype.displayX;
  Game_Map.prototype.displayX = function() {
    if (tileD.isIso()) {
      var isoX = tileD.toIso(this._displayX, this._displayY)[0] * -32
      return isoX - 48;
    } else {
      return Alias_Game_Map_displayX.call(this);
    }
  };

  var Alias_Game_Map_displayY = Game_Map.prototype.displayY;
  Game_Map.prototype.displayY = function() {
    if (tileD.isIso()) {
      var isoY = tileD.toIso(this._displayX, this._displayY)[1] * -32
      return isoY;
    } else {
      return Alias_Game_Map_displayY.call(this);
    }
  };

  var Alias_Game_Map_scrollDown = Game_Map.prototype.scrollDown;
  Game_Map.prototype.scrollDown = function(distance) {
    if (tileD.isIso()) {
      this._displayY += distance;
      if (this._parallaxLoopY) {
        this._parallaxY += distance;
      }
    } else {
      Alias_Game_Map_scrollDown.call(this, distance);
    }
  };

  var Alias_Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
  Game_Map.prototype.scrollLeft = function(distance) {
    if (tileD.isIso()) {
      this._displayX -= distance;
      if (this._parallaxLoopX) {
        this._parallaxX -= distance;
      }
    } else {
      Alias_Game_Map_scrollLeft.call(this, distance)
    }
  };

  var Alias_Game_Map_scrollRight = Game_Map.prototype.scrollRight;
  Game_Map.prototype.scrollRight = function(distance) {
    if (tileD.isIso()) {
      this._displayX += distance;
      if (this._parallaxLoopX) {
        this._parallaxX += distance;
      }
    } else {
      Alias_Game_Map_scrollRight.call(this, distance);
    }
  };

  var Alias_Game_Map_scrollUp = Game_Map.prototype.scrollUp;
  Game_Map.prototype.scrollUp = function(distance) {
    if (tileD.isIso()) {
      this._displayY -= distance;
      if (this._parallaxLoopY) {
        this._parallaxY -= distance;
      }
    } else {
      Alias_Game_Map_scrollUp.call(this, distance);
    }
  };

  var Alias_Game_Map_collisionMapPass = Game_Map.prototype.collisionMapPass;
  Game_Map.prototype.collisionMapPass = function(collider, dir, level) {
    if (tileD.isIso()) {
      return true;
    }
    return Alias_Game_Map_collisionMapPass.call(this, collider, dir, level);
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //
  // The superclass of Game_Character. It handles basic information, such as
  // coordinates and images, shared by all characters.

  Game_CharacterBase.prototype.heightLevel = function() {
    this._heightLevel = tileD.heightAt(this.collider());
    return this._heightLevel;
  };

  var Alias_Game_CharacterBase_screenX = Game_CharacterBase.prototype.screenX;
  Game_CharacterBase.prototype.screenX = function() {
    if (tileD.isIso()) {
      var x = this.preIsoX();
      var y = this.preIsoY();
      return tileD.toIso(x, y)[0] + tileD.shiftX();
    } else {
      return Alias_Game_CharacterBase_screenX.call(this);
    }
  };

  var Alias_Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
  Game_CharacterBase.prototype.screenY = function() {
    if (tileD.isIso()) {
      var x = this.preIsoX();
      var y = this.preIsoY();
      return tileD.toIso(x, y)[1] + tileD.shiftY();
    } else {
      return Alias_Game_CharacterBase_screenY.call(this);
    }
  };

  Game_CharacterBase.prototype.preIsoX = function() {
    var tw = tileD.settings.tileWidth;
    var th = tileD.settings.tileHeight;
    var x = this._realX;
    x *= (tw < th ? tw : th);
    x += tw / 4;
    x -= this.heightLevel();
    x += -this.shiftY() - this.jumpHeight();
    return x;
  };

  Game_CharacterBase.prototype.preIsoY = function() {
    var tw = tileD.settings.tileWidth;
    var th = tileD.settings.tileHeight;
    var y = this._realY;
    y *= (tw < th ? tw : th);
    y -= tw / 4;
    y -= this.heightLevel();
    y += -this.shiftY() - this.jumpHeight();
    return y;
  };

  var Alias_Game_CharacterBase_collideWithTileBox = Game_CharacterBase.prototype.collideWithTileBox
  Game_CharacterBase.prototype.collideWithTileBox = function(d) {
    if (tileD.isIso()) {
      return false;//this.checkHeightLevel(d);
    }
    return Alias_Game_CharacterBase_collideWithTileBox.call(this, d);
  };

  Game_CharacterBase.prototype.checkHeightLevel = function(d) {
    var boxes = tileD.getHeightsAt(this.collider(d));
    for (var i = 0; i < boxes.length; i++) {
      if (this.collider(d).intersects(boxes[i])) {
        return true;
      }
    }
  };

  var Alias_Game_Player_centerX = Game_Player.prototype.centerX;
  Game_Player.prototype.centerX = function() {
    if (tileD.isIso()) {
      return (Graphics.width / 32 - 1) / 2.0 - (this.heightLevel() / 32);
    } else {
      return Alias_Game_Player_centerX.call(this);
    }
  };

  var Alias_Game_Player_centerY = Game_Player.prototype.centerY;
  Game_Player.prototype.centerY = function() {
    if (tileD.isIso()) {
      return (Graphics.height / 32 - 1) / 2.0 - (this.heightLevel() / 32);
    } else {
      return Alias_Game_Player_centerY.call(this);
    }
  };

  var Alias_Game_Player_updateScroll = Game_Player.prototype.updateScroll;
  Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    if (tileD.isIso()) {
      var x1 = lastScrolledX;
      var y1 = lastScrolledY;
      var x2 = this.scrolledX();
      var y2 = this.scrolledY();
      if (y2 > y1) {
        $gameMap.scrollDown(y2 - y1);
      }
      if (x2 < x1) {
        $gameMap.scrollLeft(x1 - x2);
      }
      if (x2 > x1) {
        $gameMap.scrollRight(x2 - x1);
      }
      if (y2 < y1) {
        $gameMap.scrollUp(y1 - y2);
      }
    } else {
      Alias_Game_Player_updateScroll.call(this, lastScrolledX, lastScrolledY);
    }
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //
  // The set of sprites on the map screen.

  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    if (tileD.currentMap) {
      if (this._tilemap) {
        this._baseSprite.removeChildren();
      }
      Spriteset_Base.prototype.createLowerLayer.call(this);
      this.createParallax();
      this.createTile2D();
      this.createCharacters();
      this.createShadow();
      this.createDestination();
      this.createWeather();
    } else {
      this._tileD = null;
      Alias_Spriteset_Map_createLowerLayer.call(this);
    }
  };

  Spriteset_Map.prototype.createTile2D = function() {
    this._tileD = tileD.currentMap;
    this._tilemap = new TileDmap();
    this._tilemap.tileWidth  = this._tileD.settings.tileWidth;
    this._tilemap.tileHeight = this._tileD.settings.tileHeight;
    this._tilemap.setData(this._tileD.settings.width, this._tileD.settings.height, this._tileD);
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    this._tilemap._createLayers();
    console.time("Draw");
    this.drawTileD("lowerLayers");
    this.drawTileD("upperLayers");
    this._baseSprite.addChild(this._tilemap);
    console.timeEnd("Draw");
  };

  Spriteset_Map.prototype.drawTileD = function(layer) {
    var layers = this._tileD[layer];
    var layersData;
    var i, j, k, l, m, n;
    for (i = 0, j = layers.length; i < j; i++) {
      layerData = layers[i].data;
      for (k = 0, l = layerData.length; k < l; k++) {
        var tileset;
        for (m = 0, n = this._tileD.tilesets.length; m < n; m++) {
          if (layerData[k] >= this._tileD.tilesets[m].first &&
              layerData[k] <= this._tileD.tilesets[m].last) {
            tileset = this._tileD.tilesets[m];
            break;
          }
        }
        if (tileset) {
          this._tilemap.addBitmap(tileset, layers[i], k, layer);
        }
      }
    }
  };

  Spriteset_Map.prototype.StabledrawTileD = function(layer) {
    var layers = this._tileD[layer].data;
    var i, j, k, l, m, n;
    for (i = 0, j = layers.length; i < j; i++) {
      for (k = 0, l = layers[i].length; k < l; k++) {
        var tileset;
        for (m = 0, n = this._tileD.tilesets.length; m < n; m++) {
          if (layers[i][k] >= this._tileD.tilesets[m].first &&
              layers[i][k] <= this._tileD.tilesets[m].last) {
            tileset = this._tileD.tilesets[m];
            break;
          }
        }
        if (tileset) {
          this._tilemap.addBitmap(tileset, layers[i][k], k, layer);
        }
      }
    }
  };

  var Alias_Sprite_Character_updateColliders =   Sprite_Character.prototype.updateColliders;
  Sprite_Character.prototype.updateColliders = function() {
    if (!this.bitmap.isReady()) {
      return;
    }
    if (tileD.isIso()) {
      return;
    }
    Alias_Sprite_Character_updateColliders.call(this)
  };

  var Alias_Spriteset_Map_loadTileset = Spriteset_Map.prototype.loadTileset;
  Spriteset_Map.prototype.loadTileset = function() {
    if (!this._tileD) {
      Alias_Spriteset_Map_loadTileset.call(this);
    }
  };

  var Alias_Spriteset_Map_updateTileset = Spriteset_Map.prototype.updateTileset;
  Spriteset_Map.prototype.updateTileset = function() {
    if (tileD.currentMap !== this._tileD) {
      this.createLowerLayer();
    }
    Alias_Spriteset_Map_updateTileset.call(this);
  };

  var Alias_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    if (tileD.isIso()) {
      this._tilemap.x = $gameMap.displayX();
      this._tilemap.y = $gameMap.displayY();
    } else {
      Alias_Spriteset_Map_updateTilemap.call(this);
    }
  };


  function TileDmap() {
    this.initialize.apply(this, arguments);
  }

  TileDmap.prototype = Object.create(Tilemap.prototype);
  TileDmap.prototype.constructor = TileDmap;

  TileDmap.prototype.initialize = function() {
    Tilemap.prototype.initialize.call(this);
  };

  TileDmap.prototype._createLayers = function() {
    var size = tileD.getLayerSize();
    this._width = size[0] + this._margin * 2;
    this._height = size[1] + this._margin * 2;
    var width = this._width;
    var height = this._height;
    var margin = this._margin;
    var layerWidth = size[0];
    var layerHeight = size[1];
    this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
    this._upperBitmap = new Bitmap(layerWidth, layerHeight);
    this._layerWidth = layerWidth;
    this._layerHeight = layerHeight;

    this._lowerLayer = new Sprite();
    this._lowerLayer.move(-margin, -margin, width, height);
    this._lowerLayer.z = 0;

    this._upperLayer = new Sprite();
    this._upperLayer.move(-margin, -margin, width, height);
    this._upperLayer.z = 4;

    for (var i = 0; i < 4; i++) {
        this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
        this._upperLayer.addChild(new Sprite(this._upperBitmap));
    }

    this.addChild(this._lowerLayer);
    this.addChild(this._upperLayer);
  };

  TileDmap.prototype.addBitmap = function(source, layerData, i, layer) {
    var tileId = layerData.data[i];
    var ox  = layerData.offsetx || 0;
    var oy  = layerData.offsety || 0;
    var tw  = this._tileWidth;
    var th  = this._tileHeight;
    var stw = source.tileWidth;
    var sth = source.tileHeight;
    var w   = source.img.width / tw;
    var h   = source.img.height / th;
    var si  = tileId - source.first;
    var sx  = (si % w) * stw;
    var sy  = Math.floor(si / w) * sth;
    var x   = (i % this._mapWidth) * (tw < th ? tw : th);
    var y   = Math.floor(i / this._mapWidth) * (tw < th ? tw : th);
    var iso = tileD.toIso(x, y);
    var dx  = iso[0] + ox + tileD.shiftX();
    var dy  = iso[1] + oy + tileD.shiftY();
    if (source.img) {
      if (layer === "lowerLayers") {
        //this._lowerBitmap.clearRect(dx, dy, tw, th);
        this._lowerBitmap.blt(source.img, sx, sy, stw, sth, dx, dy);
      } else {
        //this._upperBitmap.clearRect(dx, dy, tw, th);
        this._upperBitmap.blt(source.img, sx, sy, stw, sth, dx, dy);
      }
    }
  };

  TileDmap.prototype.oldaddBitmap = function(source, tileId, i, layer) {
    var tw  = this._tileWidth;
    var th  = this._tileHeight;
    var stw = source.tileWidth;
    var sth = source.tileHeight;
    var w   = source.img.width / tw;
    var h   = source.img.height / th;
    var si  = tileId - source.first;
    var sx  = (si % w) * stw;
    var sy  = Math.floor(si / w) * sth;
    var x   = (i % this._mapWidth) * tw;
    var y   = Math.floor(i / this._mapWidth) * th;
    var iso = tileD.toIso(x, y);
    var dx  = iso[0];
    var dy  = iso[1];
    //console.log(dx, dy);
    if (source.img) {
      if (layer === "lowerLayers") {
        //this._lowerBitmap.clearRect(dx, dy, tw, th);
        this._lowerBitmap.blt(source.img, sx, sy, stw, sth, dx, dy);
      } else {
        //this._upperBitmap.clearRect(dx, dy, tw, th);
        this._upperBitmap.blt(source.img, sx, sy, stw, sth, dx, dy);
      }
    }
  };

  TileDmap.prototype._paintTiles = function(startX, startY, x, y) {

  };
})();
