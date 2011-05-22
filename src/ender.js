function ($) {

	$.ender({
		deckmate: function() {
			return $( new DeckMate(this) );
		}
	}, true);

}(ender);
