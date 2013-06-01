/* cheevs by Adam Scoble - https://github.com/adamscoble/cheevs - adam.scoble@gmail.com */

// ## Adam Scoble presents
// # jquery.cheevs-1.0.0.js
// Activate animated achievements on your website (Currently Xbox only)

// ## Dependencies
// * [jQuery](http://docs.jquery.com/)

// ## Compatibility
// * IE7+
// * All other modern browsers

// ## Known Bugs
// * Minor graphical issues in IE7, 8 and some mobile browsers

// ## Usage
// Plugin attaches itself to the window automatically (`window.cheevs`). To add an achievement use the `add()` function:

// `cheevs.add({achievement: 'An achievement!'})`

// You can queue up as many achievements as you like. Optionally, you can pass an array of objects to the plugin:

//     cheevs.add([
//         {heading: "FIRST ACHIEVEMENT", achievement: "An"},
//         {achievement: "Achievement"},
//         {achievement: "!", position: "bottom"}
//     ])

// ## Methods
// `add(achievementObject)` Add an achievement (See 'Usage' for an explanation)

// `add(arrayOfAchievementObjects)` Add a number of achievements (See 'Usage' for an explanation)

// `changeDirector(string)` Change the directory of Cheevs' files (default directory is `cheevs`)

// ## Options
// `type: 'xbox'` The achievement graphic to show and animate. (Currenly Xbox only)

// `position: 'center'` Where the achievement should be positioned (`'top'`, `'center'`, `'bottom'`)

// `heading: null` Updates the achievement heading. (Xbox default is 'ACHIEVEMENT UNLOCKED')

// `achievement: ''` Achievement text

// ##Extra credits
// * Kilian Lippa (original idea inspiration)

(function($){
	"use strict";
    function Cheevs(){
        this.$window = $(window);
        this.windowHeight = this._getWindowHeight();
        this.$body = $('body');
        this.bodyWidth = this._getBodyWidth();

        this._createDOMElement();
        this.$elem = $('#cheevs');

        this.type = { 
            xbox: new Cheevs.Xbox(this) 
        };

        this.achievements = [];
        this.isActive = false;
    	this._init();
    }

    Cheevs.prototype = {
        _createDOMElement : function(){
			this.$body.append('<div id="cheevs"></div>');
        },
        _getWindowHeight : function(){
            return this.$window.height();
        },
        _getBodyWidth : function(){
            return this.$body.outerWidth(false);
        },
        _init : function(){
            this._addEventListeners();  
        },
        _addEventListeners : function(){
            var cheevs = this;

        	cheevs.$window
                .bind('unlockAchievement', jQuery.proxy(cheevs.unlock, cheevs))
                .bind('achievementComplete', jQuery.proxy(cheevs._achievementComplete, cheevs))
                .resize(function(){
                    cheevs.windowHeight = cheevs._getWindowHeight();
                    cheevs.bodyWidth = cheevs._getBodyWidth();
                });
        },
        unlock : function(){
            if(this.isActive) return; 

            this.isActive = true;

            var achievement = this._getAchievement(0);

            this.type[achievement.type]._unlock(achievement);

            return this;
        },
        _getAchievement : function(index){
            var achievement = this.achievements[index];

            this.achievements.splice(0,1);

            return achievement;
        },
        _achievementComplete : function(){
            this.isActive = false;
            this.achievements.length && this.unlock();
        },
        add : function(achievements){
            var cheevs = this;

            if(typeof achievements === 'undefined'){
                console.error("Please define an achievement object");
                return cheevs;
            } else if (jQuery.isArray(achievements)) {
                jQuery.each(achievements, function(i, achievement){
                    cheevs._createAchievement(achievement);
                })
        	} else {
                cheevs._createAchievement(achievements);
        	}
        	cheevs.$window.trigger('unlockAchievement');
        	return cheevs;
        },
        _createAchievement : function(ach){
            var achievement = new Cheevs.Achievement(ach);
            this.achievements.push(achievement);
        },
        changeDirectory : function(directory){
            this.type.xbox._changeDirectory(directory);
        }
    };

    Cheevs.Achievement = function(achievement){
        var defaults = {
                type: "xbox",
                position: "center",
                heading: null,
                achievement: ""
            },
            data = $.extend({}, defaults, achievement || {});

        this.type = data.type,
        this.position = data.position,
        this.heading = data.heading,
        this.achievement = data.achievement;
        
        return this;
    };

    Cheevs.Xbox = function(cheevs){
        this.cheevs = cheevs;
        this._createDOMElement();
        this.elems = {}
        this._findElements();
        this.isLtIE9 = !$.support.leadingWhitespace;
        this.audioReady = false;
        this.imagesReady = false;
        this.imagesLoaded = 0;
        this._addEventListeners();
        this.staticWidth = this._getStaticWidth();
        this.targetWidth = 0;
        this.currentHeight = 100;
        this.position = "center";
        this.maxWidth = this._getMaxWidth();
        

        return this;
    };

    Cheevs.Xbox.prototype = {
        defaults: {
            heading: "ACHIEVEMENT UNLOCKED"
        },
        _createDOMElement : function(){
            this.cheevs.$elem.append('<div id="cheevs-xbox" style="height: 100px; position: fixed; display: none;"><img src="cheevs/cheevs-icon_xbox-trophy.png" id="cheevs-xbox-trophy" style="width: auto; height: 100px; float: left;" /><img src="cheevs/cheevs-icon_xbox-logo.png" id="cheevs-xbox-logo" style="width: auto; height: 100px; position: absolute; left: 0px; top: 0px;" /><div id="cheevs-xbox-text" style="height: 100px; background: #3b3f40; overflow: hidden; float: left;"><p id="cheevs-xbox-heading" style="font-family: \'convectionregular\', Arial, sans-serif; font-size: 30px; margin: 12px 10px 0px; color: #fff; width: 100%; white-space: nowrap;">ACHIEVEMENT UNLOCKED</p><p id="cheevs-xbox-achievement" style="font-family: \'convectionregular\', Arial, sans-serif; font-size: 30px; margin: 0px 10px 0px; color: #fff; width: 100%; white-space: nowrap;">ACHIEVEMENT UNLOCKED</p></div><img src="cheevs/cheevs-icon_xbox-end.png" id="cheevs-xbox-end" style="width: auto; height: 100px; float: left;" /><audio id="cheevs-xbox-sound"><source id="cheevs-xbox-sound" src="cheevs/cheevs-sound_xbox.mp3"><source id="cheevs-xbox-sound-ogg" src="cheevs/cheevs-sound_xbox.ogg"></source></audio></div>');
        },
        _findElements : function(){
            var $c = this.cheevs.$elem;

            this.elems = {  $elem: $c.find('#cheevs-xbox'),
                            $trophy: $c.find('#cheevs-xbox-trophy'),
                            $logo: $c.find('#cheevs-xbox-logo'),
                            $text: $c.find('#cheevs-xbox-text'),
                            $heading: $c.find('#cheevs-xbox-heading'),
                            $achievement: $c.find('#cheevs-xbox-achievement'),
                            $end: $c.find('#cheevs-xbox-end'),
                            $sound: $c.find('#cheevs-xbox-sound') }

            this.elems.$resizeElems = this.elems.$trophy
                                        .add(this.elems.$logo)
                                        .add(this.elems.$text)
                                        .add(this.elems.$end);
        },
        _addEventListeners : function(){
            var xbox = this;

            if(this.isLtIE9){
                xbox.audioReady = true;
            } else {
                xbox.elems.$sound.bind("canplaythrough", function(){
                    xbox.audioReady = true;
                });
            }
            
            var $images = xbox.elems.$trophy
                            .add(xbox.elems.$logo)
                            .add(xbox.elems.$end);

            $images.load(jQuery.proxy(xbox._imageLoadedHandler, xbox));

            xbox.cheevs.$window.resize(function(){
                xbox.staticWidth = xbox._getStaticWidth();
                xbox.maxWidth = xbox._getMaxWidth();
                xbox._resizeElem();
                xbox._positionElem();
            });
        },
        _imageLoadedHandler : function(){
            this.imagesLoaded++;

            if(this.imagesLoaded == 3){
                this.imagesReady = true;
            }
        },
        _getStaticWidth : function(){
            return this.elems.$logo.outerHeight() * 1.5;
        },
        _getMaxWidth : function(){
            return this.cheevs.bodyWidth - this.staticWidth;
        },
        _unlock : function(achievement){
            if(!this._isMediaLoaded(achievement)){
                return;
            }

            this._resetValues();

            !this.isLtIE9 && this.elems.$sound[0].play();

            this._updateAchievementMarkup(achievement);

            this.elems.$elem.show();

            this._resizeElem();

            this.elems.$elem.hide();
            this.elems.$text.width(0);

            this.position = achievement.position;

            this._positionElem();

            this._animateIn(this.targetWidth);
        },
        _isMediaLoaded : function(achievement){
            if(!this.imagesReady || !this.audioReady){
                var cheevs = this;
                setTimeout(function(){
                    cheevs._unlock(achievement);
                },500);
                
                return false;
            }

            return true;
        },
        _resetValues : function(){
            this.elems.$elem.width('auto');
            this.elems.$heading.css({'font-size': 30, 'margin-top': '12px'});
            this.elems.$achievement.css({'font-size': 30, 'margin-top': 0});
            this.elems.$resizeElems.height(100);
            this.staticWidth = this._getStaticWidth();
        },
        _updateAchievementMarkup : function(achievement){
            if(achievement.heading){
                this.elems.$heading.html(achievement.heading);
            } else {
                this.elems.$heading.html(this.defaults.heading);
            }

            this.elems.$achievement.html(achievement.achievement);
        },
        _resizeElem : function(){
            var targetWidth = this.elems.$text.width('auto').outerWidth();

            if(targetWidth > this.maxWidth){
                targetWidth = this._resizeFont();
            }

            this.targetWidth = targetWidth;

            this.elems.$elem.width(this.staticWidth + targetWidth);
        },
        _resizeFont : function(){
            var currentFontSize = parseInt(this.elems.$heading.css('font-size'));

            this.elems.$heading.css({'font-size': currentFontSize - 1, 'margin-top': this.elems.$text.height() * 0.15});
            this.elems.$achievement.css({'font-size': currentFontSize - 1, 'margin-top': this.elems.$text.height() * 0.09});

            var newHeight = (this.elems.$heading.height() + this.elems.$achievement.height()) * 2;
            this.elems.$resizeElems.height(newHeight);
            this.currentHeight = newHeight;

            var targetWidth = this.elems.$text.outerWidth();

            this.staticWidth = this._getStaticWidth();
            this.maxWidth = this._getMaxWidth();

            if(targetWidth > this.maxWidth){
                targetWidth = this._resizeFont();
            }

            return targetWidth;
        },
        _positionElem : function(){
            var top = 0;

            switch (this.position){
                case "top":
                    top = this.currentHeight / 2;
                break;
                case "center":
                    top = this.cheevs.windowHeight / 2 - this.currentHeight / 2;
                break;
                case "bottom":
                    top = this.cheevs.windowHeight - this.currentHeight - (this.currentHeight / 2);
                break;
            }

            this.elems.$elem.css({  'top': top,
                                    'left': (this.cheevs.bodyWidth / 2) - ((this.staticWidth + this.targetWidth) / 2)});
        },
        _animateIn : function(targetWidth){
            jQuery.when(
                this.elems.$elem.stop().fadeIn(400),
                this.elems.$text.stop().animate({width: targetWidth}, 400)
            ).done(
                jQuery.proxy(this._animateLogo, this)
            );
        },
        _animateLogo : function(){
            this.elems.$logo
                .delay(1000)
                .fadeOut(600)
                .delay(1000)
                .fadeIn(600)
                .delay(1000)
                .fadeOut(600)
                .delay(1000)
                .fadeIn(600, jQuery.proxy(this._animateOut, this));
        },
        _animateOut : function(){
            jQuery.when(
                this.elems.$elem.fadeOut(400),
                this.elems.$text.animate({width: 0}, 400)
            ).done(
                jQuery.proxy(this._triggerAnimationComplete, this)
            );
        },
        _triggerAnimationComplete : function(){
            this.cheevs.$window.trigger('achievementComplete');
        },
        _changeDirectory : function(directory){
            var $elems = [  this.elems.$trophy,
                            this.elems.$logo,
                            this.elems.$end,
                            this.elems.$sound.find('#cheevs-xbox-sound'),
                            this.elems.$sound.find('#cheevs-xbox-sound-ogg')];

            this._updateSrcMarkup($elems, directory);
        },
        _updateSrcMarkup : function($elems, directory){
            jQuery.each($elems, function(i, $elem){
                var newSrc = directory + $elem.attr('src').substring($elem.attr('src').indexOf('/') + 1);
                $elem.attr('src', newSrc);
            });
        }
    };

    window.cheevs = new Cheevs();
    
})(jQuery);