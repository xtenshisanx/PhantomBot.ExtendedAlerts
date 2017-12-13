/*
 * Copyright (C) 2017 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* 
 * @author IllusionaryOne
 */
var DEBUG_MODE = true;
var url = window.location.host.split(":");
var addr = 'ws://' + url[0] + ':' + getPanelPort();
var connection = new WebSocket(addr, []);
var isConnected = false;
var defaultLocation = "Center";
var defaultInAnimation = "bounceIn";
var defaultOutAnimation = "bounceOut";

/**
 * @function debugMsg
 * @param {String} message
 */
function debugMsg(message) {
    if (DEBUG_MODE) console.log('Alerts::DEBUG::' + message);
}

/**
 * @function logMsg
 * @param {String} message
 */
function logMsg(message) {
    console.log('Alerts::' + message);
}

/**
 * @event connection.onopen
 * Triggered when the WebSocket connection is opened.
 */
connection.onopen = function(data) {
    var jsonObject = {};
    debugMsg('connection.onopen()');
    jsonObject['authenticate'] = getAuth();
    connection.send(JSON.stringify(jsonObject));
    isConnected = true;
}

/**
 * @event connection.onclose
 * Triggered when the WebSocket connection is closed by the bot.
 */
connection.onclose = function(data) {
    debugMsg('connection.onclose()');
    isConnected = false;
}

/**
 * @event connection.onmessage
 * Triggered when a message comes in from the WebSocket. This event is in the other
 * panel JS files as well.
 */
connection.onmessage = function(e) {
    try {
        var messageObject = JSON.parse(e.data);
    } catch (ex) {
        logMsg('connection.onmessage: badJson(' + e.data + '): ' + ex.message);
        return;
    }
    debugMsg('connection.onmessage('+ e.data + ')');

    if (messageObject['authresult'] == false) {
        if (!messageObject['authresult']) {
            isConnected = false;
            return;
        }
        return;
    }
	
	if (messageObject['alert_combination'] !== undefined)
	{
		var vgif = messageObject['alert_combination']['gif'];
		var vtext = messageObject['alert_combination']['text'];
		var vduration = messageObject['alert_combination']['duration'];
		var vlocation, vinanimation, voutanimation;
		if (messageObject['alert_combination']['location'] == "undefined")
		{
			vlocation = defaultLocation;
		}
		else
		{
			vlocation = messageObject['alert_combination']['location'];
		}
		
		if (messageObject['alert_combination']['inanimation'] == "undefined")
		{
			vinanimation = defaultInAnimation;
		}
		else
		{
			vinanimation = messageObject['alert_combination']['inanimation'];
		}
		
		if (messageObject['alert_combination']['outanimation'] == "undefined")
		{
			voutanimation = defaultOutAnimation;
		}
		else
		{
			voutanimation = messageObject['alert_combination']['outanimation'];
		}
		logMsg('connection.onmessage: location (' + vlocation + ')');
		$("#"+vlocation + " img").attr('src','');
        $("#"+vlocation).html('<div id="'+vlocation+'div" style="width:100%; height: 100%; vertical-align: middle; text-align:center;"><img src="/config/gif-alerts/' + vgif + '.gif"><br><p>' + vtext + '</p></div>');
		$("#"+vlocation+"div").addClass('animated ' + vinanimation);
		
        // If the file doesn't exist a DOM error is tossed to the Console.
        var audioObj = new Audio('/config/gif-alerts/' + vgif + '.mp3');
        audioObj.volume = 1.0;
        audioObj.play();

        setTimeout(function() {
			/*$(vlocation+"div").animate({
				opacity: "0"
			}, vduration);*/
			$("#"+vlocation+"div").removeClass('animated ' + vinanimation);
			$("#"+vlocation+"div").addClass('animated ' + voutanimation);
		}, vduration);
	}
}
