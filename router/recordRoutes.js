const express = require('express')
const RecordController = require('../controllers/recordController')

const recordRouter = express.Router()

recordRouter.post('/createRecord/:userId/:exerciseId',RecordController.createRecord)
recordRouter.get('/getRecords/:userId/:exerciseId',RecordController.getRecords)

module.exports = recordRouter

