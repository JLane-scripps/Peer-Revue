/*********
 *  This is the .gs file so your handy dandy google script will open 
 *  This file is responsible for handling "server-side" functions that interface with the google doc and other google api 
 */


/***************
 * Firebase stuff
 */


/****************************
 * Writes data to firebase
 * @param id : user id generated
 * @param username: username the user chose when registering
 * @param points : how many points the user has
 * @param aquariumArray: array represemnting how many fish the user had in the aquarium
 * @param fantasyArray: array representing the game data for the fantasy game
 */
function writeToFirebase(id, username, points, aquariumArray, fantasyArray){
// we want to\ use better and more secure way of accessing firebase, this is just
// because we are in early stages of developement.
  var firebaseUrl = /**REDACTED FOR SECURITY **/
  var firebaseSecret = /**REDACTED FOR SECURITY **/
  var database = FirebaseApp.getDatabaseByUrl(firebaseUrl, firebaseSecret);

  var email = Session.getActiveUser().getEmail()
  Logger.log("email = " + email);
 
  // write to usernamedirectory 
  database.setData("users/" + id, {
    "email" : email,
    "username": username,
    "points": points,
    "aquarium": aquariumArray,
    "fantasy": fantasyArray
  });
}


// converts an array to a string
function arrayToString(array){
  var strArr = "";
  for( let i = 0 ; i < array.length; i++)
    strArr+= array[i].toString() + ',';


  Logger.log("strArr = " + strArr);
  return strArr;
}



//string to an int array
function stringToArray(str){

  // this here is just for debugging
  //str = "32,32,44,11,32,";

  str = str.substring(0,str.length-1)

  var array = str.split(',').map(function(item) {
    return parseInt(item, 10);
});


  Logger.log(array)


return array;


}

function retrieveUserData(){
  
  var user = generateID();

// we want to\ use better and more secure way of accessing firebase, this is just
// because we are in early stages of developement.
  var firebaseUrl = /**REDACTED FOR SECURITY **/
  var firebaseSecret = /**REDACTED FOR SECURITY **/
  var database = FirebaseApp.getDatabaseByUrl(firebaseUrl, firebaseSecret);

  // Read data from the Firebase Realtime Database
  var data = database.getData("users/" + user);


  Logger.log(data);

  return data;
}



/************************************************
 *  Returns username that is stored in the cache (soon to be database !)
 ************************************************/
function getUser(){
  var cache = CacheService.getUserCache();
  

 if( retrieveUserData() == null){ //you can change this condition to if-true when testing
    showPrompt();
  } 
  var data = retrieveUserData();

  var username = data.username;


   Logger.log(username);
  // returns cache data that is associated with the key "username"


  return username;

}



function generateID(){
  var email = Session.getActiveUser().getEmail()
  Logger.log("email = " + email);
  var user = email.split('@')[0];
  Logger.log("user = " + user);

  // This algorithm generates IDs that are NOT necessarily unique and needs to be improved.
  // It was just an easy way to implement user ids in a short amount of time for the early stages
  // of this project
  id = "";
  for(var i = 0; i < user.length; i++){
    id+= (user.charCodeAt(i)).toString();
  }

  
  Logger.log("user id = "+ id);
  return id;
}


function readData() {
// we want to\ use better and more secure way of accessing firebase, this is just
// because we are in early stages of developement.
  var firebaseUrl = /**REDACTED FOR SECURITY **/
  var firebaseSecret = /**REDACTED FOR SECURITY **/
  var database = FirebaseApp.getDatabaseByUrl(firebaseUrl, firebaseSecret);

  // Read data from the Firebase Realtime Database
  var data = database.getData("path/to/data");
  Logger.log(data);
}



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


  // add user identifier and user  to firebase
  //id, username, points, aquariumArray, fantasyArray
  writeToFirebase(generateID() ,text ,0 ,arrayToString(getAquariumData()),arrayToString(getFantasyData()));
  
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


/********* 
 *  getters n setters
 * 
*/

function processPoints(points) {
	Logger.log("Received data: " + points);

  var data = retrieveUserData();
  if(data != null){
  data.points = points;
  //id, username, points, aquariumArray, fantasyArray
  writeToFirebase(generateID(), data.username, data.points, data.aquarium, data.fantasy);
  }else{
    Logger.log("Cant write to firebase if account data is null");
  }

}


function setFantasyData(array){

  Logger.log("Received fantasy data: " +array);
  var strArray =arrayToString(array);
  var data = retrieveUserData();
  if(data != null){
    Logger.log("retrieved array = " + strArray);
    data.fantasy = strArray;
    Logger.log("fantasy is now : " + data.fantasy);
    //id, username, points, aquariumArray, fantasyArray
    writeToFirebase(generateID(), data.username, data.points, data.aquarium, data.fantasy);
  }else{
    Logger.log("Cant write to firebase if account data is null");
  }
}

function setAquariumData(array){
  Logger.log("Received aquarium data: " +array);
  var strArray = arrayToString(array);
  var data = retrieveUserData();
  if(data != null){
    Logger.log("retrieved array = " + strArray);
    data.aquarium = strArray;
    Logger.log("aquarium is now : " + data.aquarium);
    //id, username, points, aquariumArray, fantasyArray
    writeToFirebase(generateID(), data.username, data.points, data.aquarium, data.fantasy);
  }else{
    Logger.log("Cant write to firebase if account data is null");
  }
}

function getFantasyData(){
  var fantasy = [
      -1, 0, 0, 0, 100, //background index, potions, energy
      1, -1, -1, 40, //knight lv, hp, mana, xp
      1, -1, -1, 40, //mage   lv, hp, mana, xp
      1, -1, -1, 40, //rogue  lv, hp, mana, xp
      1, -1, -1, 40, //cleric lv, hp, mana, xp
      -1, -1, -1, //monster level, hp, type
      0, -1, 0 //currentPlayer, currentCharacter, gameEnded
    ];

  Logger.log("fantasy prior to retrieval =" + fantasy);

  var data = retrieveUserData();
  if(data == null){
    Logger.log("data is null");
  }else{
    fantasy = stringToArray(data.fantasy);
    Logger.log("fantasy post recieval: " + fantasy);

  }
  return fantasy;
}

function getAquariumData(){
  var aquarium = [0,0,0,0,0];
  Logger.log("aquarium prior to retrieval = " + aquarium);
  var data = retrieveUserData();
  if(data == null){
    Logger.log("data is null");
  }else{
    aquarium = stringToArray(data.aquarium);
    Logger.log("aquarium post recieval: " + aquarium);
  }
  return aquarium;

}

function getUsername(){
  var username = "null";
  var data = retrieveUserData();
  if(data == null){
    showPrompt();
    getUsername(); // make recursive call
  }
  Logger.log("username = " +  username);
  return retrieveUserData().username;
}

function getPoints(){
  var points = 0;
  var data = retrieveUserData();
  if(data != null){
    points= data.points;
  }
  Logger.log("points = " + points);
  return points;
}
