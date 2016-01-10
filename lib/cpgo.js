var path = require('path');
var os = require('os');
var fs = require('fs');
var request = require('request');
//var config = {
//  server: 'http://127.0.0.1:3000/',
//  key:'123'
//}

function run () {
  var op = process.argv[2];
  var data = process.argv[3];
  var config = {};

  var cfpath = path.join(os.homedir(), '.cpgo');
  var config = {};
  
  if (!(op == 'i' || op == 'init')) {
    try {
      config = JSON.parse(fs.readFileSync(cfpath, "utf8"));
      
    } catch (err) {
      console.log('Configuration file not found!, run "cpgo init" to generate.');
      process.exit(0);
    }
  }

  if (op == 'g' || op == 'get') {
    request.get(config.server  + config.key)
    .on('data', function (info) {
      info = JSON.parse(info);
      console.log(info.data);
      process.exit();
    })
    .on('error', function (err) {
      console.log(err);
      process.exit();
    });
  } else if (op == 'p' || op == 'put') {
    request.post(config.server + config.key)
    .json({type:'text',data:data})
    .on('response', function (response) {
      process.exit();
    })
    .on('error', function (err) {
      process.exit();
    });
  } else if (op == 'i' || op == 'init') {
    var rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('CPGO server url: ', (server) => {

      if (server.charAt(server.length-1) != '/') {
        server += '/';
      }

      config = {
        server: server,
        key: require('crypto').randomBytes(32).toString('hex')
      }

      fs.writeFileSync(cfpath, JSON.stringify(config),'utf8');  

      console.log('Config file saved to ~/.cpgo');
      
      rl.close();
      process.exit();
    });
  } else {
    console.log('Usage:');
    console.log('cpgo <op> data');
    console.log('where op is one of the following:');
    console.log('get - Retrieve clipboard, shorcut: g');
    console.log('post - Send to clipboard, shorcut: p');
    console.log('init - Initialize configuration file, shorcut: i');
    process.exit();
  }
}

module.exports = exports = {run:run};

