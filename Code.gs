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
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
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
  // Lets try counting the occurences of tabs instead. 
  var find = '\t';
  var text = DocumentApp.getActiveDocument().getBody().getText();
  return (text.split(find)).length - 1;

  // This is google docs definition of paragraphs - a bit too broad for us
  //Logger.log(DocumentApp.getActiveDocument().getBody().getParagraphs().length)
  //return DocumentApp.getActiveDocument().getBody().getParagraphs().length;

}









