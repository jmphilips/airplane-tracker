'use strict'

const { Router } = require('express')

const router = Router()

router.use(require('./login'))

module.exports = router