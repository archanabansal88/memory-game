(function() {
	/**
	* @constructor represents MemoryGame
	* @param {jQuery object} container
	*/
	class MemoryGame {
		constructor(container) {
			this.icons = [
				{
					icon: 'fa-diamond',
					name: 'diamond',
				},
				{
					icon: 'fa-paper-plane-o',
					name: 'paper-plane',
				},
				{
					icon: 'fa-anchor',
					name: 'anchor',
				},
				{
					icon: 'fa-bolt',
					name: 'bolt',
				},
				{
					icon: 'fa-cube',
					name: 'cube',
				},
				{
					icon: 'fa-leaf',
					name: 'leaf',
				},
				{
					icon: 'fa-bicycle',
					name: 'bicycle',
				},
				{
					icon: 'fa-bomb',
					name: 'bomb',
				},
			];

			this.array = [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7];
			this.counter = 0;
			this.move = 0;
			this.timer = false;
			this.container = container;
			this.init();
		}

		/**
		* @description initialize the app
		*/
		init() {
			this.array = this.shuffle(this.array);
			this.createMarkUp();
			this.attachEvent();
		}

		/**
		* @description shuffle the array 
		* @param {array} array - shuffle the list of cards
		* @returns {array} Shuffled array
		*/
		shuffle(array) {
			const arr = [...array];
			var currentIndex = arr.length,
				temporaryValue,
				randomIndex;
			while (currentIndex !== 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = arr[currentIndex];
				arr[currentIndex] = arr[randomIndex];
				arr[randomIndex] = temporaryValue;
			}
			return arr;
		}

		/**
		* @description create card and rating markup
		*/
		createMarkUp() {
			this.createCardMarkup();
			this.createRatingMarkup();
		}

		/**
		* @description loop through each card and create its HTML
		*- add each card's HTML to the page
		*/
		createCardMarkup() {
			const temp = this.array.map(value => {
				const icon = this.icons[value].icon;
				const name = this.icons[value].name;
				return `<li class="card" data-id = "${name}">
                <i class="fa ${icon}"></i>
            </li>`;
			});

			this.container.find('.deck').append(temp);
		}

		/**
		* @description create 3 stars through loop and add each star's html to page
		*/
		createRatingMarkup() {
			let temp = [];
			for (var i = 0; i < 3; i++) {
				temp.push(`<li><i class="fa fa-star" id = ${i}></i></li>`);
			}
			this.container.find('.stars').append(temp);
		}

		/**
		* @description set up the event listener for a card, restart button and replay button
		*/
		attachEvent() {
			this.container.on('click', '.card', this.handleCardClick.bind(this));
			this.container.on('click', '.restart', this.handleRestartClick.bind(this));
			this.container.on('click', '.play-again', this.handleRestartClick.bind(this));
		}

		/**
		* @description allows the player to reset the game board, the timer, moves and the star rating
		*/
		handleRestartClick() {
			this.container.find('.replay').removeClass('gameOver');
			clearInterval(this.timer);
			this.container.find('.deck').html('');
			this.container.find('.stars').html('');
			this.move = 0;
			this.timer = false;
			this.container.find('.time').html('00:00');
			this.startTime = false;
			this.container.find('.moves').html(this.move);
			this.arr = this.shuffle(this.array);
			this.createMarkUp();
		}

		/**
		* @description check if card is not opened then invoke openCard function and invoke startTimer function
		* @param{object} click event object
		*/
		handleCardClick(event) {
			const $target = $(event.target);
			this.startTimer();
			if (!$target.hasClass('open') && !$target.hasClass('fa')) {
				this.openCard($target);
			}
		}

		/**
		* @description display the card's symbol and increment counter
		*-if counter is 2 then invoke checkCard function
		* @param{object} jquery card object
		*/
		openCard($target) {
			this.counter++;
			$target.addClass('open show');
			if (this.counter === 2) {
				this.checkCard($target);
			} else {
				this.previousMove = $target;
				this.icon = $target.data('id');
			}
		}

		/**
		* @description increment the move counter and display it on the page
		*-invoke starRating function
		*-check to see if the two cards match or unmatch
		* @param{object} jquery card object
		*/
		checkCard($target) {
			this.move++;
			this.container.find('.moves').html(this.move);
			this.starRating();
			if ($target.data('id') === this.icon) {
				this.matchedCard($target);
			} else {
				this.unMatchedCard($target);
			}
			this.counter = 0;
		}

		/**
		* @description set the starCount and depending on the number of moves add and remove class
		*/
		starRating() {
			if (this.move > 7 && this.move <= 14) {
				this.container.find('#2').removeClass('fa-star');
				this.container.find('#2').addClass('fa-star-o');
				this.starCount = 2;
			} else if (this.move > 14) {
				this.container.find('#1').removeClass('fa-star');
				this.container.find('#1').addClass('fa-star-o');
				this.starCount = 1;
			} else {
				this.starCount = 3;
			}
		}

		/**
		* @description lock the 2 cards in the open position and add class match
		*-invoke the function checkWinner
		*@param{object} jquery card object
		*/
		matchedCard($target) {
			$target.addClass('match');
			this.previousMove.addClass('match');
			this.checkWinner();
		}

		/**
		* @description hide unmatched card's symbol
		*@param{object} jquery card object
		*/
		unMatchedCard($target) {
			setTimeout(() => {
				$target.removeClass('open show');
				this.previousMove.removeClass('open show');
			}, 300);
		}

		/**
		* @description set start time and start timer
		*/
		startTimer() {
			if (!this.startTime) {
				this.startTime = Date.now();
				this.timer = setInterval(this.updateTimer.bind(this), 1000);
			}
		}

		/**
		* @description get time and display time on the page
		*/
		updateTimer() {
			const time = this.getTime(this.startTime, true);
			this.container.find('.time').html(time);
		}

		/**
		* @description get the time difference between start time and end time
		*-@returns {string} mins and secs	
		*/
		getTime(startTime, isTimeFormat) {
			let min = 0;
			const endTime = Date.now();
			const timeDiff = endTime - startTime;
			if (timeDiff / 1000 > 60) {
				min = Math.round(timeDiff / (1000 * 60));
			}
			const sec = Math.round((timeDiff - min * 60000) / 1000);
			return this.displayTime(min, sec, isTimeFormat);
		}

		/**
		* @description format time and display time
		*-@returns {string} mins and secs
		*/
		displayTime(min, sec, isTimeFormat) {
			if (isTimeFormat) {
				min = min < 10 ? '0' + min : min;
				sec = sec < 10 ? '0' + sec : sec;
				return min + ':' + sec;
			}
			if (min && sec) {
				return min + ' min ' + sec + ' secs';
			} else if (!min) {
				return sec + ' secs';
			}
			return min + ' min';
		}

		/**
		* @description if all cards have matched, display a message with the final score
		*-It should also tell the user how much time it took to win the game, total number of moves and what the star rating was
		*-ask if they want to play again. 
		*/
		checkWinner() {
			if (this.container.find('.match').length === 16) {
				const time = this.getTime(this.startTime, false);
				clearInterval(this.timer);
				const status = `<div>\
														<i class="fa fa-check-circle-o fa-4x check" aria-hidden="true"></i>\
												</div>\
												<div><strong>Congratulations!! You Won!</strong></div>\
												<div class='inline-block'>with ${this.move} moves</div>\
												<span>and ${this.starCount} stars</span>\
												<div>in ${time}</div>`;
				this.container.find('.win').html(status);
				this.container.find('.replay').addClass('gameOver');
			}
		}
	}

	new MemoryGame($('.container'));
})();
