// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: basketball-ball;
// Create a request for the ESPN API
let apiUrl = "http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard";
let req = new Request(apiUrl);
let nextGame;
// Load data as a string
let data = await req.loadString();

// Parse the JSON response
let jsonData = JSON.parse(data);

const params = args.widgetParameter
// Extract information about the next game
const events = jsonData.events;
const length = events.length;
const randomIndex = Math.floor(Math.random() * length);
if (events && events.length > 0) {
  const nextGame = events[randomIndex]; // Assuming the first event is the next game

// if (!params) {
//   nextGame = events[0]
//   } else {
//     nextGame = events[1]
//   }
  // Extract relevant information
const homeTeamData = nextGame.competitions[0].competitors[0].team;
const awayTeamData = nextGame.competitions[0].competitors[1].team;
const homeTeamLogoUrl = homeTeamData.logo;
    const awayTeamLogoUrl = awayTeamData.logo;
const homeTeam = homeTeamData.shortDisplayName;
const awayTeam = awayTeamData.shortDisplayName;
const homeTeamAlt = homeTeamData.alternateColor;
const homeTeamColor = homeTeamData.color;
let awayTeamColor = awayTeamData.color;
const awayTeamAlt = awayTeamData.alternateColor;
if (awayTeamColor === "ffffff") {
awayTeamColor = awayTeamAlt;
}

  let broadcastName = "";

if (
  nextGame &&
  nextGame.competitions &&
  nextGame.competitions[0] &&
  nextGame.competitions[0].broadcasts &&
  nextGame.competitions[0].broadcasts[0] &&
  nextGame.competitions[0].broadcasts[0].names &&
  nextGame.competitions[0].broadcasts[0].names.length > 0
) {
  broadcastName = nextGame.competitions[0].broadcasts[0].names[0];
}
  
  const gameTime = new Date(nextGame.date);
  const gameUrl = nextGame.links[0].href;

  const homeTeamScore = nextGame.competitions[0].competitors[0].score;
const awayTeamScore = nextGame.competitions[0].competitors[1].score;

// Extract game state
const gameState = nextGame.status.type.state;

// Load and display team logos
async function loadAndDisplayLogos(homeTeamLogoUrl, awayTeamLogoUrl) {
  // Load team logos asynchronously
  let homeTeamLogo = await loadImage(homeTeamLogoUrl);
  let awayTeamLogo = await loadImage(awayTeamLogoUrl);
let logoSize = 97;
  // Display home team and away team logos
  let logosStack = widget.addStack();
  logosStack.centerAlignContent()// 
// logosStack.backgroundColor = new Color("yellow");// 
// widget.setPadding(2, 2, 2, 2);
 logosStack.addSpacer(5);
logosStack.addImage(homeTeamLogo).imageSize = new Size(logoSize, logoSize);
  logosStack.addSpacer(75); // Adjust the spacing between logos
  logosStack.addImage(awayTeamLogo).imageSize = new Size(logoSize, logoSize);
  // logosStack.centerAlignContent();
  widget.addStack(logosStack);
}
let oddsDetails;
// Check if the game state is "pre"
if (gameState === "pre") {
  // Extract odds details if available
  if (
  nextGame &&
  nextGame.competitions &&
  nextGame.competitions[0] &&
  nextGame.competitions[0].odds &&
  nextGame.competitions[0].odds[0]
) {
  oddsDetails = nextGame.competitions[0].odds[0].details;
}

} else {
  oddsDetails = "";
}

  const isToday = isSameDay(new Date(), gameTime);

  // Create a widget to display the next game information
  let widget = new ListWidget();
  if (gameUrl) {
    widget.url = gameUrl;
  }
let gradient = new LinearGradient();

if (areColorsSimilar(homeTeamColor, awayTeamColor)) {
    awayTeamColor = awayTeamAlt;
}

  gradient.colors = [new Color(homeTeamColor), new Color(awayTeamColor)];
  gradient.locations = [0.0, 1.0];
  gradient.startPoint = new Point(0, 0.5); // Gradient starts from the left
  gradient.endPoint = new Point(1, 0.5);

  widget.backgroundGradient = gradient;

let timeText;

if (gameState === "pre") {
  if (isToday) {
  const formattedTime = gameTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  timeText = widget.addText(`${broadcastName} ${formattedTime}`);
  timeText.font = Font.semiboldMonospacedSystemFont(15)
  timeText.textColor = new Color("#ffffff");
  timeText.centerAlignText();
//   widget.addSpacer(6)
} else {
  timeText = widget.addText(`${gameTime.toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true })}`);
  timeText.centerAlignText();
  timeText.textColor = new Color("#ffffff");

// widget.addSpacer(8)
}
await loadAndDisplayLogos(homeTeamLogoUrl, awayTeamLogoUrl);
//   widget.addSpacer(15)

// Display odds details if available
if (oddsDetails) {
  let oddsText = widget.addText(`${oddsDetails}`);
  oddsText.font = Font.semiboldMonospacedSystemFont(16);
  oddsText.textColor = new Color("#ffffff");
  oddsText.centerAlignText();
// widget.addSpacer(3)
}
} else if (gameState === "in") {
  widget.addSpacer(12)
    // Extract clock and period details if available
    const clock = nextGame.status.type.detail;

    // Display clock and period details
    let clockText = widget.addText(`${clock}` );
    clockText.font = Font.semiboldMonospacedSystemFont(16);
    clockText.textColor = new Color("#ffffff");
    clockText.centerAlignText();
    
     await loadAndDisplayLogos(homeTeamLogoUrl, awayTeamLogoUrl);
//     widget.addSpacer(8);
// Display home team and away team scores
let scoresText = widget.addText(`${homeTeamScore}  ${awayTeamScore}`);
scoresText.font = Font.semiboldMonospacedSystemFont(28);
scoresText.textColor = new Color("#ffffff");
scoresText.centerAlignText();// // 
 widget.addSpacer(8)
  
  } else if (gameState === "post") {
        const clock = nextGame.status.type.detail;

    // Display clock and period details
  widget.addSpacer(6);
    let clockText = widget.addText(`${clock}` );
    clockText.font = Font.semiboldMonospacedSystemFont(17);
    clockText.textColor = new Color("#ffffff");
  clockText.centerAlignText();
//     widget.addSpacer(6);
    
    await loadAndDisplayLogos(homeTeamLogoUrl, awayTeamLogoUrl);
    
    let scoresText = widget.addText(`${homeTeamScore}      ${awayTeamScore}`);
scoresText.font = Font.semiboldMonospacedSystemFont(28);
scoresText.textColor = new Color("#ffffff");
scoresText.centerAlignText(); widget.addSpacer(6);

  }

  // Set widget padding
  widget.setPadding(25, 20, 25, 20);

  // Function to check if two dates are the same day
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Function to load an image from a URL
  async function loadImage(url) {
    const request = new Request(url);
    return await request.loadImage();
  }

  // Present the widget
  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentMedium();
  }

  // Complete the script
  Script.complete();
} else {
  // No events found
  console.log("No upcoming games found.");
  Script.complete();
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorDistance(rgb1, rgb2) {
    var rmean = (rgb1.r + rgb2.r) / 2;
    var r = rgb1.r - rgb2.r;
    var g = rgb1.g - rgb2.g;
    var b = rgb1.b - rgb2.b;
    return Math.sqrt((2 + rmean / 256) * r * r + 4 * g * g + (2 + (255 - rmean) / 256) * b * b);
}

function areColorsSimilar(hex1, hex2) {
    var rgb1 = hexToRgb(hex1);
    var rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return "wrong color input"; // Invalid color format
    var distance = colorDistance(rgb1, rgb2);
    return distance <= 50;
}