const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const config = require('./config.json');
var fs = require('fs');
var http = require('http');
var https = require('https');

const path = require("path");
var privateKey = fs.readFileSync(path.resolve(__dirname, './d-tect_selfsigned.key'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname, './d-tect_selfsigned.crt'), 'utf8');

var credentials = { key: privateKey, cert: certificate };
app.use(cors());
app.use(bodyParser.json());

let Operation = require('./operation.model');

const uri = config.mongoUri;
console.log('connectiong to uri ' + uri)
mongoose.connect(uri, { useNewUrlParser: true }, function (err, db) {
    if (err) {
        console.log('error occured in mongoose.connect. Maybe Atlas blocked your IP. Error: ' + err);
    }
});
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
}).catch(error => console.log(error));

const operationRoutes = express.Router();

operationRoutes.route('/').get(function (req, res) {
    Operation.find(function (err, operations) {
        if (err) {
            console.log(err);
        } else {
            res.json(operations);
        }
    });
});

operationRoutes.route('/:operation_number').get(function (req, res) {
    let operation_number = req.params.operation_number;
    Operation.findOne({ operation_number: operation_number }, function (err, operation) {
        if (err) {
            console.log(err);
        } else {
            console.log('searching operation ' + operation_number);
            console.log('found number ' + operation.operation_number)
            res.json(operation);
        }
    });
});

operationRoutes.route('/add').post(function (req, res) {
    let operation = new Operation(req.body);
    operation.save()
        .then(todo => {
            res.status(200).json({ 'operation': 'operation added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new operation odo failed');
        });
});

operationRoutes.route('/update/:id').post(function (req, res) {
    Operation.findById(req.params.id, function (err, operation) {
        if (!operation)
            res.status(404).send("data is not found");
        else
            operation.operation_number = req.body.operation_number;
        operation.measure_points = req.body.measure_points;
        operation.save().then(operation => {
            res.json('Operation updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/operations', operationRoutes);
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});