(function() {
	var lastAlert = $.systemTime(),
		lastAlertDuration = 0,
		maxAlertDuration = 12000,
		alertQueue = new java.util.concurrent.ConcurrentLinkedQueue;
	
	function doAlerts(){
		setInterval(function() {
			var now = $.systemTime();
			if(!alertQueue.isEmpty() && lastAlert + lastAlertDuration < now)
			{
				var alertString = alertQueue.poll();
				lastAlertDuration = parseInt(JSON.parse(alertString).alert_combination.duration) + 1000;
				$.panelsocketserver.sendToAll(alertString);
				lastAlert = now;
			}
		}, 1000);
	};
	
	function addAlert(giffile, giftext, duration)
	{
		installTimedAlert(giffile, giftext, duration, "Center", "BounceIn", "BounceOut");
	};
	
	function addAlert(giffile, giftext, duration, position)
	{
		installTimedAlert(giffile, giftext, duration, position, "BounceIn", "BounceOut");
	};
	
	function addAlert(giffile, giftext, duration, position, inanimation, outanimation)
	{
		var alertstring = '{"alert_combination":{"gif":"'+giffile+'","text":"'+giftext+'","duration":"'+duration+'","location":"'+position+'","inanimation":"'+inanimation+'","outanimation":"'+outanimation+'"}}';
		alertQueue.add(alertstring);
	};
	
	$.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0];

        /**
         * @commandpath auction - Primary auction command
         */
        if (command.equalsIgnoreCase('testalert')) {
            if (!action) {
                $.say($.whisperPrefix(sender) + 'Usage: testalert <text>');
                return;
            }
			if(args[2] > maxAlertDuration)
			{
				$.say("Couldn´t add alert to queue, duration > maxAlertDuration ("+maxAlertDuration+")");
			}
			else
			{
				var string = '{"alert_combination":{"gif":"'+args[0]+'","text":"'+args[1]+'","duration":"'+args[2]+'","location":"'+args[3]+'","inanimation":"'+args[4]+'","outanimation":"'+args[5]+'"}}'
				alertQueue.add(string);
			}
        }

        /**
         * @commandpath bid [amount] - Amount to bid on the current auction
         */
        if (command.equalsIgnoreCase('bid')) {
            bid(sender, action);
        }
    });
	
	$.bind('initReady', function() {
        $.registerChatCommand('./custom/extendedAlertsHandler.js', 'testalert', 2);
		
		doAlerts();
    });
	$.addAlert = addAlert;
})();