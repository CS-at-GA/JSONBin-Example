let displayText = "";

let jsonBin = {
  masterKey: "", // your key here
  accessKey: "$2b$10$5fYj2rYlL.npdySHp9/z/.fHka9qtkD9DQG4RT/t1osiQTwTLa.T2", // your key here
  rootURL: "https://api.jsonbin.io/v3/b",
  ID: "6356cee42b3499323be94459",// your bin id here
  data:undefined
}

const keyBindings = {
  c:createUser,
  x:clearAllData
  // r:readUser,
  // u:updateUser,
  // d:deleteUser
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  getAllData();
  textWrap(WORD)
}

function sync(finishedText="done syncing", errorText="error while syncing") {
  displayText = "syncing data";
  fetch( jsonBin.rootURL + '/' + jsonBin.ID, {
    method: 'PUT',
    body: JSON.stringify(jsonBin.data),
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': jsonBin.masterKey
    }
  })
  .then( () => displayText = finishedText )
  .then( () => getAllData() )
  .catch(e=>console.log(`${errorText}: ${e}`))  
}

function getAllData() {
  displayText = "retrieving data"
  fetch( jsonBin.rootURL + '/' + jsonBin.ID, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': jsonBin.accessKey
    }
  })
  .then((response) => response.json())
  .then((data) => jsonBin.data = data.record )
  .then(()=>displayText = "data fetched")
  .catch( e => displayText = `error during fetch ${e}`);  
}

function draw() {
  background('white')
  text( displayText, 10, 10, 100 )
  if( jsonBin.data ) {
    let y = 10;
    const dy = 20;
    for( let user of jsonBin.data.users ) {
      text( user.name, 120, y );
      y += dy;
    }
  }
}

function keyPressed() {
  if( key in keyBindings ) {
    keyBindings[key](); 
  }  
}

function randomName() {
  const names = ["ALEX", "BLAKE", "CHRIS", "DEE", "FRANKIE", "GERRIE", "JO", "KRIS","LOU","MAL","PAT","RAY","SAL","TONY"] ;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return random(names) + " " + random(letters.split('')) + ". " + random(letters.split('')) + ".";
}

function createUser(name=randomName()) {
  displayText = `creating user: ${name}`
  let newUser = { 
    name,
    uuid: uuid()
  }
  jsonBin.data.users.push( newUser );
  sync(`successfully added user: ${name}`, `error creating user: ${name}`);
}

function clearAllData() {
  displayText = `clearing all data`
  fetch( jsonBin.rootURL + '/' + jsonBin.ID, {
    method: 'PUT',
    body: JSON.stringify({data:[],users:[]}),
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': jsonBin.masterKey
    }
  })
  .then( () => displayText = `successfully cleared all data`)
  .then( () => getAllData() )
  .catch(e=>console.log(`${e}`))  
}

function uuid() {
  const chars = "abcdefghijklmnopqrstuvwxyz12345ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  return Array.from( Array(16), () => random(chars) ).join('');
}