// bonzo, bean, qwery, valentine

function DeckMate(el) {

	this.options = {

		// The value here gets added as a class to the card.
		// The keys double as the HTML ASCII entity.
		suits: {
			spades: 'black',
			clubs: 'black',
			hearts: 'red',
			diams: 'red'
		},

		members: {
			cardA: ['c8'],
			card2: ['c2','c14'],
			card3: ['c2','c8','c14'],
			card4: ['c1','c3','c13','c15'],
			card5: ['c1','c3','c8','c13','c15'],
			card6: ['c1','c3','c7','c9','c13','c15'],
			card7: ['c1','c3','c5','c7','c9','c13','c15'],
			card8: ['c1','c3','c5','c7','c9','c11','c13','c15'],
			card9: ['c1','c3','c4','c6','c8','c10','c12','c13','c15'],
			card10: ['c1','c3','c4','c5','c6','c10','c11','c12','c13','c15'],
			cardJ: ['f1'],
			cardQ: ['f2'],
			cardK: ['f3']
		}

	};

	// Assuming either element id as a string or element object for el.
	var deck = ( ( typeof el == 'string') ? document.getElementById(el) : el );
	var table = deck.parentNode;

	var htmlstr = '';

	for ( var suit in this.options.suits ) {
		for ( var card in this.options.members ) {
			htmlstr += '<div class="card ' + suit + ' ' + this.options.suits[suit] + ' ' + card + '">';
			htmlstr += '<u>' + card.split('card')[1] + '</u><s>&' + suit + ';</s><u class="b">' + card.split('card')[1] + '</u><s class="b">&' + suit + ';</s>';
			var l = this.options.members[card].length;
			for (var i=0;i<l;i++) {
				htmlstr += '<b class="' + this.options.members[card][i] + '">&' + suit + ';</b>';
			}
			htmlstr += '<i></i>';
			htmlstr += '</div>';
		}
	}
	$( deck ).html( htmlstr );
	// Qwery
	var cards = $('.card', deck);
	var current = 0;

	var revcards = cards.reverse();
	var l = revcards.length;
	for (var i=0;i<l;i++) {
		$( revcards[i] ).css({
			left: current + 'px',
			top: current + 'px'
		});
		moveToFront( revcards[i] );
		current++;
	}

	$(document).bind( 'mousedown', doDown );
	$(document).bind( 'mousemove', doMove );
	$(document).bind( 'mouseup', doUp );
	$(document).bind( 'touchstart', doDown );
	$(document).bind( 'touchmove', doMove );
	$(document).bind( 'touchend', doUp );
	$(document).bind( 'contextmenu', doContext );

	var dragged = false;
	var dragbox = false;
	var coords;
	var moveIt = false;
	var hasDragged = false;

	function moveToFront( card ) {
		moveIt = false;
		deck.appendChild( card );
	}

	function doDown(e) {
		var target = e.target;
		if ( target.tagName.toLowerCase() == 'i' ) {
			e.preventDefault();
			$('#deck .selected').removeClass('selected');
			$('.dragbox', deck).remove();
			var card = target.parentNode;
			dragged = card;
			coords = getCoords(e);
			moveIt = true;
			hasDragged = false;
		} else if ( target.id == 'table' ) {
			e.preventDefault();
			$('#deck .selected').removeClass('selected');
			$('.dragbox', deck).remove();
			coords = getCoords(e);
			$(table).append('<div class="dragbox" style="top:' + coords.y + 'px;left:' + coords.x + 'px"></div>');
			hasDragged = false;
			dragbox = $('.dragbox', deck)[0];
		}
	}

	function doUp(e) {
		if (dragged) $(dragged).addClass('selected');
		dragged = false;
		moveIt = false;
		if (dragbox) {
			dragbox = false;
			$('.dragbox', deck).remove();
		}
	}

	function doMove(e) {
		if (!dragged && !dragbox) return false;
		var currCoords = getCoords(e);
		if (dragbox) {
			e.preventDefault();
			hasDragged = true;
			if ( currCoords.x < coords.x ) {
				dragbox.style.width = ( coords.x - currCoords.x )+'px';
				dragbox.style.left = currCoords.x + 'px';
			} else {
				dragbox.style.width = ( currCoords.x - coords.x )+'px';
				dragbox.style.left = coords.x + 'px';
			}
			if ( currCoords.y < coords.y ) {
				dragbox.style.height = ( coords.y - currCoords.y )+'px';
				dragbox.style.top = currCoords.y + 'px';
			} else {
				dragbox.style.height = ( currCoords.y - coords.y )+'px';
				dragbox.style.top = coords.y + 'px';
			}
		} else {
			if (moveIt) moveToFront( dragged );
			e.preventDefault();
			hasDragged = true;
			dragged.style.left = (dragged.offsetLeft + currCoords.x - coords.x)+'px';
			dragged.style.top = (dragged.offsetTop + currCoords.y - coords.y)+'px';
			coords = getCoords(e);
		}
	}

	function getCoords(e) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;

		if ( e.touches ) {
			var touch = e.touches[0];
			posx = touch.pageX;
			posy = touch.pageY;
		} else if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return {x:posx,y:posy};
	}

	function doContext(e) {
		var target = e.target;
		if ( target.tagName.toLowerCase() == 'i' ) {
			e.preventDefault();
			var coords = getCoords(e);
		}
	}

}
