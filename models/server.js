const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server
{
    constructor()
    {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {users: '/users', tasks: '/tasks'};
    
        this.connectDB();

        this.middlewares();

        this.routes();
    }

    async connectDB()
    {
        await dbConnection();
    }

    middlewares()
    {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes()
    {
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.tasks, require('../routes/tasks'));
    }

    listen()
    {
        this.app.listen(this.port, () =>
        {
            console.log(`Running on port ${this.port}`);
        });
    }
}

module.exports = Server;