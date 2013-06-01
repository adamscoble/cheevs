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

## Usage
Plugin attaches itself to the window automatically (`window.cheevs`). To add an achievement use the `add()` function:

`cheevs.add({achievement: 'An achievement!'})`

You can queue up as many achievements as you like. Optionally, you can pass an array of objects to the plugin:

	cheevs.add([
		{heading: "FIRST ACHIEVEMENT", achievement: "An"},
		{achievement: "Achievement"},
		{achievement: "!", position: "bottom"}
	])

## Methods
`add(achievementObject)` Add an achievement (See 'Usage' for an explanation)

`add(arrayOfAchievementObjects)` Add a number of achievements (See 'Usage' for an explanation)

`changeDirector(string)` Change the directory of Cheevs' files (default directory is `cheevs`)

## Options
`type: 'xbox'` The achievement graphic to show and animate. (Currenly Xbox only)

`position: 'center'` Where the achievement should be positioned (`'top'`, `'center'`, `'bottom'`)

`heading: null` Updates the achievement heading. (Xbox default is 'ACHIEVEMENT UNLOCKED')

`achievement: ''` Achievement text

##Extra credits
* Kilian Lippa (original idea inspiration)