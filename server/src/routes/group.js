const router = require('express').Router()
const ctrls = require('../controllers/group')
const { verifyToken } = require('../middlewares/verifyToken')

router.post('/create', verifyToken, ctrls.createOrOpenChat)
router.post('/getGroup', verifyToken, ctrls.getGroupInfo)
router.post('/chatList', verifyToken, ctrls.getChatList)
router.get('/groupList/:uid', verifyToken, ctrls.getGroupList)
router.get('/userGroup/:gid', verifyToken, ctrls.getUserGroup)


module.exports = router