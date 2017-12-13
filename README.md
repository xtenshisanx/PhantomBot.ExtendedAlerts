# PhantomBot.ExtendedAlerts
## Information
ExtendedAlerts is an enxtention for your PhantomBot, it enhance the alerts HTML with a 3x3 grid.
you could now add aditional informations for your alerts like:
InAnimation (see animate.css)
OutAnimation (see animate.css)
Location (TopLeft, Top, TopRight, CenterLeft, Center, CenterRight, BottomLeft, Bottom, BottomRight)

You could test alerts like this:

!testalert "gifname" "text" "duration" "location" "inanimation" "outanimation"

## Installation

Download the github-branch to your desktop.
Unzip the file into your botfolder.

## Setup

To add alerts in an script do it like this:

ALERTSTRING = {"alert_combination":
	{
		"gif":" >giffile.gif< ",
		"text":" >giftext< ",
		"duration":" >gifduration< ",
		"location":" >giflocation< ",
		"inanimation":" >gifinanimation< ",
		"outanimation":"gifoutanimation"
	}
}

$.addAlert(ALERTSTRING)


## Additional Informations

You could change the maxAlertDuration in the ./scripts/custom/extendedAlertsHandler.js file (default: 12000)