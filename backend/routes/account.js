const express = require('express');
const { authMiddleware } = require('../authmiddleware');
const { Account } = require('../db');

const router = express.Router();



router.get('/balance', authMiddleware, async (req, res)=>{
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

// Now the good transaction would be atomic , meaning if only one of the two things happened
// then there should be a rollback , it is either all or nothing
// otherwise there would be inconsistency

// Now we may want to use transaction properties in mongoose
// but there is a small problem while doing that so we'll now proceed with ugly way to solve this



router.post('/transfer', authMiddleware, async (req, res) => {
    const { amount, to } = req.body;

    const account = await Account.findOne({
        userId: req.userId
    })

    if(account.balance < amount){
        return res.status(400).json({
            message: "Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    });

    if(!toAccount){
        return res.status(400).json({
            message: "Invalid Account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    },{
        $inc: {
            balance: -amount
        }
    })

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    })

    res.json({
        message: "Transfer successful"
    })
});
















module.exports = router;

