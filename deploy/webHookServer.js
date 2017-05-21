var express = require('express')
var bodyParser = require('body-parser')
var logger = require("morgan")
var config = require("../config/config")

var port = config.deploy.webhook.port

var app = express()

app.use(logger('dev'))
app.use(bodyParser.json({
    limit: '1mb'
}))

app.post("/webhook", function(req, res) {
    if (req.headers['content-type'] != 'application/json') {
        return res.status(400).send("Please select content-type as application/json");
    }
    var event = getEvent(req)

    if (event == config.deploy.webhook.event) {
        if (req.headers['x-hub-signature']) {
            var crypto = require('crypto')
            var hmac = crypto.createHmac('sha1', config.deploy.webhook.secret)
            var computedSignature = hmac.update(Buffer.from(JSON.stringify(req.body), 'utf-8'), 'utf-8').digest('hex')
            if (req.headers['x-hub-signature'].split("=")[1] == computedSignature) {
                var execFile = require("child_process").execFile;
                execFile("./updateAndDeploy.sh", (err, stdout, stderr) => {
                    if (!err) {
                        console.log('stdout:', stdout)
                        console.log('stderr:', stderr)
                    } else {
                        console.error('Failed to run updateAndDeploy.sh script')
                    }
                    res.status(200).send("Success");
                })
            } else {
                res.status(400).send();
            }
        } else {
            res.status(400).send("x-hub-signature header is absent")
        }
    } else {
        res.status(400).send("Not The Required Event");
    }
})

/**
 * Return the github Event from the Request Object
 * It returns event in the form of event:reponame:ref
 * 
 * @returns {string}
 */
function getEvent(req) {
    var type = req.headers['x-github-event']
    var reponame = ""
    var ref = ""
    if (req.body) {
        if (req.body.repository) {
            if (req.body.repository.name) {
                reponame = req.body.repository.name;
            } else {
                console.error('Undefined req.body.repository.name');
                console.error('body:', req.body);
            }
        } else {
            console.error('Undefined req.body.repository');
            console.error('body:', req.body);
        }

        if (req.body.ref) {
            ref = req.body.ref;
        } else {
            console.error('Undefined req.body.ref');
            console.error('body:', req.body);
        }
    } else {
        console.error('Undefined req.body');
    }

    return type + ":" + reponame + ":" + ref
}

app.listen(port, (err) => {
    if (!err) console.log('Git WebHook Server/Receiver Started on port:', port)
})

process.on("uncaughtException", (err) => {
    console.error('UncaughtException:', err)
})