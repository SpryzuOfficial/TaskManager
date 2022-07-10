const {request, response} = require('express');

const { verifyUserByEmailHeader } = require('../helpers/userVerification');

const addTask = async(req = request, res = response) =>
{
    const {ok, user} = await verifyUserByEmailHeader(res, req);
    if(!ok) return;

    const {name, description} = req.body;

    const task = {name, description};

    let flag = true;
    user.tasks.map(element =>
    {
        if(element.name === task.name)
        {
            flag = false;
            return;
        }
    });

    if(!flag) 
    {
        return res.status(400).json({
            ok: false,
            msg: 'Task already exists'
        });
    }

    user.tasks.push(task);

    await user.save();

    res.status(200).json({
        ok: true,
        user
    });
}

const checkTask = async(req = request, res = response) =>
{
    const {ok, user} = await verifyUserByEmailHeader(res, req);
    if(!ok) return;
    
    const {id} = req.body;

    user.tasks.map(element =>
    {
        if(element.id === id)
        {
            element.done = !element.done;
        }  
    });

    await user.save();

    res.status(200).json({
        ok: true,
        user
    });
}

const getTasks = async(req = request, res = response) =>
{
    const {ok, user} = await verifyUserByEmailHeader(res, req);
    if(!ok) return;

    res.status(200).json({
        ok: true,
        tasks: user.tasks
    });
}

const editTask = async(req = request, res = response) =>
{
    const {ok, user} = await verifyUserByEmailHeader(res, req);
    if(!ok) return;

    const {id, name, description} = req.body;

    let flag = false;
    user.tasks.forEach(element =>
    {
        if(element.id === id)
        {
            element.name = name;
            element.description = description;

            flag = true;
            return;
        }
    });

    if(!flag) 
    {
        return res.status(400).json({
            ok: false,
            msg: 'Task not exists'
        });
    }

    await user.save();

    res.status(200).json({
        ok: true,
        user
    });
}

const deleteTask = async(req = request, res = response) =>
{
    const {ok, user} = await verifyUserByEmailHeader(res, req);
    if(!ok) return;

    const {id} = req.body;

    user.tasks.forEach((element, i) =>
    {
        if(element.id === id)
        {
            user.tasks.splice(i, 1);
        }
    });

    await user.save();

    res.status(200).json({
        ok: true,
        user
    });
}

module.exports = {
    addTask,
    checkTask,
    getTasks,
    editTask,
    deleteTask
}