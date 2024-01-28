const express = require('express');
const { authMiddleware } = require('../authmiddleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();


console.log('hi there from account');

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



// router.post('/transfer', authMiddleware, async (req, res) => {
//     const { amount, to } = req.body;

//     const account = await Account.findOne({
//         userId: req.userId
//     })

//     if(account.balance < amount){
//         return res.status(400).json({
//             message: "Insufficient Balance"
//         })
//     }

//     const toAccount = await Account.findOne({
//         userId: to
//     });

//     if(!toAccount){
//         return res.status(400).json({
//             message: "Invalid Account"
//         })
//     }

//     await Account.updateOne({
//         userId: req.userId
//     },{
//         $inc: {
//             balance: -amount
//         }
//     })

//     await Account.updateOne({
//         userId: to
//     }, {
//         $inc: {
//             balance: amount
//         }
//     })

//     res.json({
//         message: "Transfer successful"
//     })
// });


// Let's just do the hard way

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid Account"
        });
    }

    // Perform the transfer

    await Account.updateOne({ userId: req.userId}, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);


    // Commit the transaction

    await session.commitTransaction();

    res.json({
        message: "Transfer Successful"
    })
})







module.exports = router;

