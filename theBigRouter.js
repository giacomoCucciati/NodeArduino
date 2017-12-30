const path = require('path')
var express = require('express')
var router = express.Router()

router.use( (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', (req,res) =>
    res.send('theBigRouter says: Hello World!')
)

router.get('/subpage', (req,res) =>
    res.send('theBigRouter says: you are in the subpage')
)

router.get('/user/:userId', (req,res) =>
    res.send('theBigRouter says: ' + req.params.userId)
)

router.get('/myfile', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
})

module.exports = router
