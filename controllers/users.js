const {request, response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const addUser = async(req = request, res = response) =>
{
    const {username, email, password} = req.body;
    
    const checkUser = await User.findOne({email});

    if(checkUser)
    {
        return res.status(400).json({
            ok: false, 
            msg: 'Email already used',
        });
    }

    const user = new User({username, email, password});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        ok: true,
        user
    });
}

const loginUser = async(req = request, res = response) =>
{
    const {username, email, password} = req.body;

    const userName = await User.findOne({username});
    const userEmail = await User.findOne({email});

    if(!userName && !userEmail)
    {
        return res.status(400).json({
            ok: false,
            msg: "Invalid email/username"
        });
    }

    const user = userName ? userName : userEmail;

    const validPassword = bcryptjs.compareSync(password, user.password);

    if(!validPassword)
    {
        return res.status(400).json({
            ok: false,
            msg: "Invalid password"
        });
    }

    res.status(200).json({
        ok: true,
        user
    });
}

module.exports = {
    addUser,
    loginUser
}