const express = require('express');
const {
    updateUser,
    deleteUser,
    userResources,
    redeemPoints,
    addPoints,

    leaderboardPage,
    getUserSavedAndPurchasedItems,
    savePYQ,
    saveNote,
    unsavePYQ,
    unsaveNote,
} = require('../../controllers/api/user.controller.js');
const { verifyToken } = require('../../utils/verifyUser.js');
const { validateApiKey } = require('../../middleware.js');
const wrapAsync = require('../../utils/wrapAsync.js');

const router = express.Router();

router.post('/update/:id', verifyToken, validateApiKey, wrapAsync(updateUser));

router.get('/userdata', verifyToken, validateApiKey, wrapAsync(userResources));

router.post(
    '/redeempoints',
    verifyToken,
    validateApiKey,
    wrapAsync(redeemPoints)
);

router.post('/add-points', verifyToken, wrapAsync(addPoints));

router.get('/leaderboard', wrapAsync(leaderboardPage));

router.get(
    '/saved-purchased',
    verifyToken,
    wrapAsync(getUserSavedAndPurchasedItems)
);

router.post('/save-pyq/:pyqId', verifyToken, wrapAsync(savePYQ));
router.post('/unsave-pyq/:pyqId', verifyToken, wrapAsync(unsavePYQ));

router.post('/save-note/:noteId', verifyToken, wrapAsync(saveNote));
router.post('/unsave-note/:noteId', verifyToken, wrapAsync(unsaveNote));

// router.delete('/delete/:id', verifyToken, wrapAsync(deleteUser));  //will implement later if needed

module.exports = router;
