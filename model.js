// http://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new

function httpGet(min, max){
    var url = 'http://www.random.org/integers/?num=1&min='+min+'&max='+max+'&col=1&base=10&format=plain&rnd=new';
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function localGet(min, max){
    return Math.floor(min + (Math.random() * (max - min + 1)));
}

function getRandomNumber(min, max, useLocal){
    if(useLocal){
	return localGet(parseInt(min), parseInt(max));
    }
    else{
	return httpGet(min, max);
    }
}

function adjustCss(num2aktiv){
    if(num2aktiv){
	$('.number').css("padding-left","15%");
    }
    else{
        $('.number').css("padding-left","40%");
    }
}

ko.bindingHandlers.onEnter = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        $(element).keypress(function(event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                value.call(this);
                return false;
            }
            return true;
        });
    },
    update: function(element, valueAccesor) {

    }
};

var viewModel = function(){
    this.lotteri = ko.observable(true),
    this.config = ko.observable(false),
    this.showLotteri = function(){
	this.lotteri(true);
	this.config(false);
    },
    this.showConfig = function(){
	this.lotteri(false);
	this.config(true);
    },
    this.min = ko.observable(0),
    this.max = ko.observable(0),
    this.number = ko.observable(),
    this.aktiv = ko.observable(true),
    this.min2 = ko.observable(0),
    this.max2 = ko.observable(0),
    this.number2 = ko.observable(),
    this.aktiv2 = ko.observable(false),
    this.randomPicker = ko.observable("rnd"),
    this.keyPress = function(sender, event) {
	adjustCss(this.aktiv2());
	var bool = this.randomPicker() == 'jsc';
	var min1 = parseInt(this.min());
	this.number(min1);
	var num = getRandomNumber(this.min(), this.max(), bool);
	$('.number2').hide();
	console.log("tall 1: "+ num);	
	var aktiv2 = this.aktiv2();
	var num2;
	var min2;
	if(aktiv2){
	    min2 = parseInt(this.min2());
	    num2 = getRandomNumber(this.min2(), this.max2(), bool);
	    console.log("tall 2: "+num2);
	}
	$({val1: min1}).animate({val1: num}, {
	    duration: 1500,
	    easing:'swing', 
	    step: function() { 
		$('.number').text(Math.round(this.val1));
	    },
	    complete: function(){
		if(aktiv2){
		    $('.number2').show();
		    $({val2: min2}).animate({val2: num2}, {
			duration: 1500,
			easing:'swing', 
			step: function() {
			    $('.number2').text(Math.round(this.val2));
			}
		    });   
		}
	    }
	});        
    }
}

$(document).ready(function () {    
    ko.applyBindings(new viewModel()); // This makes Knockout get to work
    
});