console.log('discovery started')

var resin = require("resin-sdk")
var fs = require("fs")
var _ = require("lodash")

var login = process.env.RESIN_TOKEN ?
  resin.auth.loginWithToken(process.env.RESIN_TOKEN) :
  resin.auth.login({ email: process.env.RESIN_EMAIL, password: process.env.RESIN_PASS });

login.then(function () {
  console.log("Successfully authenticated with resin API")
  setInterval(function(){
    resin.models.device.getAllByApplication(process.env.RESIN_APP_NAME).then(function(devices) {
      if (error) throw error;
      // format array and save it as json file
      saveJson(_.map(devices, format));
    });
  }, process.env.DISCOVERY_INTERVAL);
});

function saveJson(array) {
  fs.writeFile(__dirname + '/targets.json', JSON.stringify(array), 'utf8')
}

function format(device) {
  var url = device.uuid + ".resindevice.io:80"
   return {
    targets: [url],
    labels: {
      resin_device_uuid: device.uuid,
      resin_app: device.application[0].app_name
    }
  }
}
