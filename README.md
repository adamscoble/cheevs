## Adam Scoble presents
# jquery.cheevs-1.0.0.js
Activate animated achievements on your website (Currently Xbox only)

## Dependencies
* [jQuery](http://docs.jquery.com/)

## Compatibility
* IE7+
* All other modern browsers

## Known Bugs
* Minor graphical issues in IE7, 8 and some mobile browsers

## Example
[http://woheva.com/cheevs/](http://woheva.com/cheevs/?p=center&a=50G%20--%20Visited%20Cheevs!)

## Usage
Be sure to include the font-face declaration, either by including the provided stylesheet, or in your own stylesheet.

	@font-face {
	    font-family: 'convectionregular';
	    src: url('cheevs/fonts/convectionregular-webfont.eot');
	    src: url('cheevs/fonts/convectionregular-webfont.eot?#iefix') format('embedded-opentype'),
	         url('cheevs/fonts/convectionregular-webfont.woff') format('woff'),
	         url('cheevs/fonts/convectionregular-webfont.ttf') format('truetype'),
	         url('cheevs/fonts/convectionregular-webfont.svg#convectionregular') format('svg');
	    font-weight: normal;
	    font-style: normal;
	}

Plugin attaches itself to the window automatically (`window.cheevs`). To add an achievement use the `add()` method:

`cheevs.add({achievement: 'An achievement!'})`

You can queue up as many achievements as you like. Optionally, you can pass an array of objects to the plugin:

	cheevs.add([
		{heading: "FIRST ACHIEVEMENT", achievement: "An"},
		{achievement: "Achievement"},
		{achievement: "!", position: "bottom"}
	])

## Achievement Object Properties
`type: 'xbox'` The achievement graphic to show and animate. (Currenly Xbox only)

`position: 'center'` Where the achievement should be positioned (`'top'`, `'center'`, `'bottom'`)

`heading: null` Updates the achievement heading. (Xbox default is 'ACHIEVEMENT UNLOCKED')

`achievement: ''` Achievement text

## Methods
`add(achievementObject)` Add an achievement (See 'Usage' for an explanation)

`add(arrayOfAchievementObjects)` Add a number of achievements (See 'Usage' for an explanation)

`changeDirectory(string)` Change the directory of Cheevs' files (default directory is `cheevs`)

##Extra credits
* Kilian Lippa (original idea inspiration)