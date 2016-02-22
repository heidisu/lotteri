function httpGet(min, max) {
	var url = 'https://www.random.org/integers/?num=1&min=' + min + 
	'&max=' + max + '&col=1&base=10&format=plain&rnd=new';
	var client = new XMLHttpRequest();
	client.open("GET", url, false);
	client.send();
	return client.responseText;
}

function localGet(min, max) {
	return Math.floor(min + (Math.random() * (max - min + 1)));
}

function getRandomNumber(min, max, useLocal) {
	if (useLocal) {
		return localGet(parseInt(min), parseInt(max));
	} else {
		return httpGet(min, max);
	}
}

function adjustCss(num2active) {
	if (num2active) {
		$('.number').css("padding-left", "15%");
	} else {
		$('.number').css("padding-left", "40%");
	}
}

var NumberConfig = function (active) {
	this.min = ko.observable(0);
	this.max = ko.observable(0);
	this.number = ko.observable();
	this.active = ko.observable(active);
	this.drawNumber = function (bool) {
		this.number = getRandomNumber(this.min(), this.max(), bool);
		console.log("Tall: " + this.number);
	}
}

var Config = function (number1, number2, visible, rnd) {
	this.number1 = ko.observable(number1);
	this.number2 = ko.observable(number2);
	this.visible = ko.observable(visible);
	this.randomPicker = ko.observable(rnd);
}

var Lottery = function (visible) {
	this.visible = ko.observable(visible);
}

var Model = function () {
	this.lottery = ko.observable(new Lottery(true));
	this.config = ko.observable(new Config(new NumberConfig(true), new NumberConfig(false), false, "rnd"));

	this.showLottery = function () {
		this.lottery().visible(true);
		this.config().visible(false);
	},

	this.showConfig = function () {
		this.lottery().visible(false);
		this.config().visible(true);
	},

	this.keyPress = function (sender, event) {
		adjustCss(this.config().number2().active());
		var bool = this.config().randomPicker() == 'jsc';

		this.config().number1().drawNumber(bool);
		$('.number2').hide();

		var active2 = this.config().number2().active();
		var min2;
		var number2;
		if (this.config().number2().active()) {
			this.config().number2().drawNumber(bool);
			min2 = this.config().number2().min();
			number2 = parseInt(this.config().number2().number);
		}

		var number = parseInt(this.config().number1().number);
		$({
			val1 : this.config().number1().min()
		}).animate({
			val1 : number
		}, {
			duration : 1500,
			easing : 'swing',
			step : function () {
				$('.number').text(Math.round(this.val1));
			},
			complete : function () {
				if (active2) {
					$('.number2').show();
					$({
						val2 : min2
					}).animate({
						val2 : number2
					}, {
						duration : 1500,
						easing : 'swing',
						step : function () {
							$('.number2').text(Math.round(this.val2));
						}
					});
				}
			}
		});
	}
}

$(document).ready(function () {
	ko.applyBindings(new Model()); // This makes Knockout get to work

});
