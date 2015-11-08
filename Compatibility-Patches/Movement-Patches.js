//=============================================================================
// Add this to your plugins/js folder and turn on inside plugin manager.
// Place this anywhere below move movement script in the plugin manager.
// File name not important, you can also copy / past this inside my
// movement script if you don't wish to create a new file.
//=============================================================================
// Scripts that are fixed with this:
// - YEP - Save Event Locations
//=============================================================================

if (Imported.YEP_SaveEventLocations && Imported.Quasi_Movement) {
  Game_Event.prototype.updateMove = function() {
    Game_CharacterBase.prototype.updateMove.call(this);
    this.saveLocation();
  };
}
