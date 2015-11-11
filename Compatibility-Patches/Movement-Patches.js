//=============================================================================
// Add this to your plugins/js folder and turn on inside plugin manager.
// Place this anywhere below move movement script AND the plugin that needs
// compatibility.
// File name is not important.
//=============================================================================
// Scripts that are fixed with this:
// - YEP - Save Event Locations
// - - ^ Should be above Movement Plugin and above this patch
// - YEP - Event Chase Player
// - - ^ Should be below Movement Plugin and above this patch
//=============================================================================
if (Imported.Quasi_Movement) {
  if (Imported.YEP_SaveEventLocations) {
    Game_Event.prototype.updateMove = function() {
      Game_CharacterBase.prototype.updateMove.call(this);
      this.saveLocation();
    };
  }

  if (Imported.YEP_EventChasePlayer) {
    Game_Event.prototype.updateChaseMovement = function() {
      if (this._freqCount >= 0 && this._chasePlayer) {
        this.moveTowardPlayer();
      } else if (this._freqCount >= 0 && this._fleePlayer) {
        this.moveAwayFromPlayer();
      } else {
        Yanfly.ECP.Game_Event_updateSelfMovement.call(this);
      }
    };
  }
}
