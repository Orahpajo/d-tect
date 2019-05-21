const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const config = require('./config.json');
app.use(cors());
app.use(bodyParser.json());

let Operation = require('./operation.model');2

const uri = config.mongoUri;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

const operationRoutes = express.Router();

operationRoutes.route('/').get(function(req, res) {
    Operation.find(function(err, operations) {
        if (err) {
            console.log(err);
        } else {
            res.json(operations);
        }
    });
});

operationRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Operation.findById(id, function(err, todo) {
        res.json(todo);
    });
});

operationRoutes.route('/add').post(function(req, res) {
    let operation = new Operation(req.body);
    operation.save()
        .then(todo => {
            res.status(200).json({'operation': 'operation added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new operation odo failed');
        });
});

operationRoutes.route('/update/:id').post(function(req, res) {
    Operation.findById(req.params.id, function(err, operation) {
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
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});