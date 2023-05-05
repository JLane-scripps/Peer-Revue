/*********
 *  Jordan 
 *  This is the .gs file so your handy dandy google script will open 
 *  This file is responsible for handling "server-side" functions that interface with the google doc and other google api 
 */


/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  var ui = DocumentApp.getUi();
  // Init Peer Revue Sidebar widget
  ui.createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();  
}

function showPrompt() {
  var ui = DocumentApp.getUi(); // Same variations.
  var result = ui.prompt(
      'Let\'s get to know each other!',
      'Please enter a username:',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {
    // User clicked "OK".
    ui.alert('Your name is ' + text + '.');
  } else if (button == ui.Button.CANCEL) {
    // User clicked "Cancel".
    ui.alert('I didn\'t get your name. Peer Revue cannot run without this data. Try again.');
    throw new Error("No Username Provided. Exiting Program.");

  } else if (button == ui.Button.CLOSE ) {
    // User clicked X in the title bar.
    if(!text){
      ui.alert('I didn\'t get your name. Peer Revue cannot run without this data. Try again.');
      throw new Error("An error occurred. Exiting script.");
    }
  }

  // retrieve user cache
  var cache = CacheService.getUserCache();
  
  // add username to user cache
  cache.put("username", text);

  return text;
}



/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('PeerRevue')
      .setTitle('Peer Revue');
  DocumentApp.getUi().showSidebar(ui);


 
}


/************************
 * Gets html from another file in the project 
 * 
 */
function getAquariumHtml() {
  var html = HtmlService.createTemplateFromFile('Aquarium.html').getRawContent();
  Logger.log(html)
  return html;
}

function getFantasyHtml() {
  var html = HtmlService.createTemplateFromFile('Fantasy.html').getRawContent();
  Logger.log(html)
  return html;
}




/***********************
 * Counts words in a Google Doc 
 * @ return how many words
 */
function howManyWords(){
  var space = " ";
  var text = DocumentApp.getActiveDocument().getBody().getText();
  var words = text.replace(/\s+/g, space).split(space);
  return words.length;
}

/************************
 * Counts paragraphs in a Google Doc 
 * @return how many paragraphs 
 */
function howManyParagraphs(){
  // Counts the occurences of tabs instead. 
  var find = /\t+/; //regex so that the user cannot spam tabs! 
  var text = DocumentApp.getActiveDocument().getBody().getText();
  Logger.log(text.split(find).length - 1);
  return (text.split(find)).length - 1;

  //This is google docs definition of paragraphs - a bit too broad for us
  /* Logger.log(DocumentApp.getActiveDocument().getBody().getParagraphs().length)
  return DocumentApp.getActiveDocument().getBody().getParagraphs().length; */

}

/************************************************
 *  Returns username that is stored in the cache
 ************************************************/
function getUser(){
  var cache = CacheService.getUserCache();

   if( cache.get("username") == null){ //you can change this condition to if-true when testing
    showPrompt();
  }
  var username = cache.get("username");
   Logger.log(username);
  // returns cache data that is associated with the key "username"
  return username;

}
/****************************************************************
 * Uploads image based on the Url 
 ****************************************************************/
function uploadImageFromUrl(imageUrl) {
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  // Save the image blob to Google Drive or Google Cloud Storage
  return "Image uploaded successfully";
}

function processPoints(points) {
	Logger.log("Received data: " + points);
  CacheService.getUserCache().put("points", points);
}

function getPoints(){
  var points = parseInt(CacheService.getUserCache().get("points"));
  Logger.log("Points = " +  points);
  return points;
}
