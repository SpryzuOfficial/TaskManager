const User = require('../models/user');

const verifyUserByEmailHeader = async(res, req) =>
{
    const userEmail = req.header('user-email');

    if(!userEmail)
    {
        res.status(400).json({
            ok: false,
            msg: 'User email is undefined'
        });
        return {ok: false};
    }

    const user = await User.findOne({email: userEmail});

    if(!user)
    {
        res.status(400).json({
            ok: false,
            msg: 'Invalid email, user not exists'
        });
        return {ok: false};
    }

    return {ok: true, user};
}

module.exports = {
    verifyUserByEmailHeader
}