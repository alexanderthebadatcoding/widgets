// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: trophy;
const apiUrl = "http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard";
// can change to to womens NCAA by changing the link to Womens-college-basketball above
let gameTime, gameUrl, widget;
let teamEvent = null;

// Function to find the first event with shortName including the specified teamName
function findTeamEvent(data, teamName) {
  const events = data.events || [];

  for (const event of events) {
    const shortName = event.shortName || "";

    if (shortName.includes(teamName)) {
      const homeTeamData = event.competitions[0].competitors[0].team;
      const awayTeamData = event.competitions[0].competitors[1].team;
      const homeTeam = homeTeamData.shortDisplayName;
      const awayTeam = awayTeamData.shortDisplayName;
      const homeTeamAlternateColor = homeTeamData.alternateColor;
      const homeTeamColor = homeTeamData.color;
      const awayTeamAlternateColor = awayTeamData.alternateColor;
      const awayTeamColor = awayTeamData.color;
      let broadcastName = "";

      if (
        event.competitions &&
        event.competitions[0] &&
        event.competitions[0].broadcasts &&
        event.competitions[0].broadcasts[0] &&
        event.competitions[0].broadcasts[0].names &&
        event.competitions[0].broadcasts[0].names.length > 0
      ) {
        broadcastName = event.competitions[0].broadcasts[0].names[0];
      }

      gameTime = new Date(event.date);
      gameUrl = event.links[0].href;

      const homeTeamScore = event.competitions[0].competitors[0].score;
      const awayTeamScore = event.competitions[0].competitors[1].score;

      // Extract game state
      const gameState = event.status.type.state;

     let oddsDetails;
// Check if the game state is "pre"
if (gameState === "pre") {
  // Extract odds details if available
  if (
  event &&
  event.competitions &&
  event.competitions[0] &&
  event.competitions[0].odds &&
  event.competitions[0].odds[0]
) {
  oddsDetails = event.competitions[0].odds[0].details;
}

} else {
  oddsDetails = "";
}
    
      const clock = event.status.type.detail;

      return {
        eventId: event.id,
        teamEvent: event,
        name: event.name,
        date: event.date,
        homeTeam,
        awayTeam,
        homeTeamAlternateColor,
        homeTeamColor,
        awayTeamAlternateColor,
        awayTeamColor,
        broadcastName,
        gameTime,
        gameUrl,
        homeTeamScore,
        awayTeamScore,
        gameState,
        oddsDetails,
        clock
      }
  } 
  }
  
  return null; // Return null if no match is found
}


// Create a new Request object
const request = new Request(apiUrl);

// Fetch data from the URL
const data = await request.loadJSON();

// Find and log the first event with the specified team in its shortName// 
// const teamName = ""; // Replace with the desired team name
// Parse the arguments
let teamName = ""; // Default team name
if (args.widgetParameter) {
  teamName = args.widgetParameter.toUpperCase();
  
} else {
  const length = data.events.length;
  const randomIndex = Math.floor(Math.random() * length);
  teamEvent = data.events[randomIndex];
  console.log(`No ${teamName} Event found. Using a random event.`);
}

teamEvent = findTeamEvent(data, teamName);
// If no team event is found, use events[0]
// if (!teamEvent) {
//   teamEvent = data.events[0];
// }


if (teamEvent) {
//   console.log(`Found ${teamName} Event: ${teamEvent.homeTeam}`);

  // Create a widget to display the next game information
  widget = new ListWidget();
  if (gameUrl) {widget.url = gameUrl;}
  
  
let gradient = new LinearGradient();
  
gradient.colors = [new Color(teamEvent.homeTeamColor), new Color(teamEvent.awayTeamColor)];
gradient.locations = [0.0, 1.0];
gradient.startPoint = new Point(0, 0.5); // Gradient starts from the left
gradient.endPoint = new Point(1, 0.5);

widget.backgroundGradient = gradient;

let timeText;

if (teamEvent.gameState === "pre") {
  const isToday = isSameDay(new Date(), gameTime);
  if (isToday) {
  const formattedTime = 
  gameTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  timeText = widget.addText(`${teamEvent.broadcastName} ${formattedTime}`);
  timeText.font = Font.semiboldMonospacedSystemFont(14)
  timeText.centerAlignText();
widget.addSpacer(8)
} else {
  const formattedTime = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
}).format(gameTime);
  timeText = widget.addText(`${formattedTime}`);
  timeText.textColor = new Color("#ffffff");
  timeText.centerAlignText()

widget.addSpacer(8)
}
let teamsText = widget.addText(`${teamEvent.homeTeam} vs ${teamEvent.awayTeam}`);
teamsText.font = Font.boldSystemFont(24); // Adjust the font size here
teamsText.textColor = new Color("#ffffff");
teamsText.centerAlignText()
widget.addSpacer(15)

// Display odds details if available
if (teamEvent.oddsDetails) {
  let oddsText = widget.addText(`${teamEvent.oddsDetails}`);
  oddsText.font = Font.semiboldMonospacedSystemFont(16);
  oddsText.textColor = new Color("#ffffff");
  oddsText.centerAlignText();
}

} else if (teamEvent.gameState === "in") {
    // Display clock and period details
    let clockText = widget.addText(`${teamEvent.clock}` );
    clockText.font = Font.semiboldMonospacedSystemFont(16);
    clockText.textColor = new Color("#ffffff");
    clockText.centerAlignText();
    
// Display home team and away team scores
let scoresText = widget.addText(`${teamEvent.homeTeam}: ${teamEvent.homeTeamScore} | ${teamEvent.awayTeam}: ${teamEvent.awayTeamScore}`);
scoresText.font = Font.semiboldMonospacedSystemFont(18);
scoresText.textColor = new Color("#ffffff");
scoresText.centerAlignText();
widget.addSpacer(8);
  
  } else if (teamEvent.gameState === "post") {

    // Display clock and period details
    let clockText = widget.addText(`${teamEvent.clock}` );
    clockText.font = Font.semiboldMonospacedSystemFont(16);
    clockText.textColor = new Color("#ffffff");
    clockText.centerAlignText();
    widget.addSpacer(8);
    let scoresText = widget.addText(`${teamEvent.homeTeam}: ${teamEvent.homeTeamScore} | ${teamEvent.awayTeam}: ${teamEvent.awayTeamScore}`);
scoresText.font = Font.semiboldMonospacedSystemFont(20);
scoresText.textColor = new Color("#ffffff");
scoresText.centerAlignText();
widget.addSpacer(8);
  }


  // Set widget padding
  widget.setPadding(20, 4, 20, 4);

// Function to check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

} else {
  console.log(`No ${teamName} Event found.`);
  widget = new ListWidget();
  let teamsText = widget.addText(`${teamName} not found. Please Use a valid Short Name`)
teamsText.font = Font.semiboldMonospacedSystemFont(22); // Adjust the font size here
teamsText.textColor = new Color("#FFFFFF");
teamsText.centerAlignText()
widget.addSpacer(15)
}




  // Present the widget
  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentMedium();
  }

  // Complete the script
  Script.complete();
