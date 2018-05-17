import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';

import cookieSession from 'cookie-session';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const port = parseInt(process.env.PORT, 10) || 3000;
const isDev = process.env.NODE_ENV !== 'production';
const app = next({ isDev });

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

const bcrypt = require('bcrypt-nodejs');

const db = require('./models');
const schemas = require('./models/schemas');

const nodemailer = require('nodemailer');

// const http = require('https');

const querystring = require('querystring');
const http = require('http');
const fs = require('fs');

// const sslPath = '/etc/letsencrypt/live/www.idea-ict-devel.cz/';
//
// const options = {
//     key: fs.readFileSync(sslPath + 'privkey.pem'),
//     cert: fs.readFileSync(sslPath + 'fullchain.pem')
// };

let smtpConfig = {
    host: 'mail.blueboard.cz',
    port: 587,
    secure: false,
    auth: {
        user: 'lubos.hnizdo@ideastudio.cz',
        pass: 's344NkG7guZ20AG'
    }
};

let transporter = nodemailer.createTransport(smtpConfig);

app.prepare()
    .then(() => {
        const server = express();

        // models
        db.sequelize.sync();

        // body parsers
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({
            extended: true
        }));

        // session / cookies
        server.use(cookieSession({
            name: 'DukaneSession',
            secret: 's3cr3t',
            saveUninitialized: false,
            secure: false,
            maxAge: 12 * 60 * 60 * 1000,
        }));

        // passport
        server.use(passport.initialize());
        server.use(passport.session());

        passport.serializeUser((user, callback) => {
            callback(null, user.uuid);
        });

        passport.deserializeUser((uuid, callback) => {
            const User = db.sequelize.model("User");

            User.findAll({
                where: {
                    uuid: uuid
                }})
                .then(users => {
                    if (!users || users.length < 1) {
                        return callback(null, false);
                    }

                    let user = users.pop();
                    callback(null, user);
                });
        });

        passport.use(new Strategy({
                usernameField: 'email',
                passwordField: 'password',
            },
            (username, password, callback) => {
                const User = db.sequelize.model("User");

                User.findAll({
                    where: {
                        email: username
                    }})
                    .then(users => {
                        if (!users || users.length < 1) {
                            return callback(null, false);
                        }

                        let user = users.pop();

                        if (user && bcrypt.compareSync(password, user.password)) {
                            return callback(null, user);
                        }

                        return callback(null, false);
                    });
            }
        ));

        // GRAPHQL

        server.use('/graphql',
            bodyParser.json(),
            graphqlExpress({
                schema: schemas,
                pretty: true
            })
        );

        // POST

        server.post('/mail', async(req, res) => {
            await transporter.sendMail({
                from: 'info@idea-ict-devel.cz',
                to: req.body.to ? req.body.to : 'lubos.hnizdo.matfyz@gmail.com',
                subject: req.body.subject ? req.body.subject : 'Message',
                html: req.body.text ? req.body.text : 'I hope this message gets delivered!'
            }, (err, info) => {
                console.log(info);

                if (err) {
                    console.log(err);
                } else {
                    res.end("OK");
                }
            });
        });

        server.post('/invite-new-user', async(req, res) => {
            const User = db.sequelize.model("User");
            const bcrypt = require('bcrypt-nodejs');
            const randomstring = require("randomstring");
            const password = randomstring.generate({
                length: 8,
                charset: 'alphabetic'
            });

            User.create({
                uuid: db.Sequelize.Utils.toDefaultValue(new db.Sequelize.DataTypes.UUIDV1()),
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: bcrypt.hashSync(password),
                created_at: new Date(),
                updated_at: new Date(),
            }).then(user => {
                if (req.body.role && req.body.role == 'manager') {
                    const UserRole = db.sequelize.model("UserRole");
                    UserRole.create({
                        'user_uuid': user.uuid,
                        'role_uuid': 'ddb01eb0-3c4f-11e8-81d1-efa81d454729',
                        created_at: new Date(),
                        updated_at: new Date(),
                    });
                }

                const path = __dirname + '/emails/invite' + ((req.body.role && req.body.role == 'manager') ? '-manager' : '') + '.email';
                const source = '' + fs.readFileSync(path);

                const handlebars = require('handlebars');
                const template = handlebars.compile(source);
                const templateData = {
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    base_url: 'http://idea-ict-devel.cz:3000',
                    password: password,
                    email: req.body.email,
                };

                const data = querystring.stringify({
                    to: req.body.email,
                    subject: "DUKANE Project Manager",
                    text: template(templateData),
                });

                const options = {
                    host: "idea-ict-devel.cz",
                    port: 3000,
                    path: '/mail',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(data)
                    }
                };

                const request = http.request(options, (response) => {
                    response.setEncoding('utf8');
                    response.on('data', function (chunk) {
                        res.redirect('/invite-new-user');
                    });
                });

                request.write(data);
                request.end();
            });
        });

        server.post('/login', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

        // GET

        server.get('/login', (req, res) => {
            return handler(req, res);
        });

        server.get('/static/*', (req, res) => {
            return handler(req, res);
        });

        server.get('/_next/*(_error|app).js', (req, res) => {
            return handler(req, res);
        });

        server.get('/logout', (req, res) => {
            if (req.logout && req.isAuthenticated && req.isAuthenticated()) {
                req.logout();
            }
            res.redirect('/');
        });

        server.get('/is-authenticated', bodyParser.json(), (req, res) => {
            res.setHeader("Content-type", "application/json");

            if (req.isAuthenticated && req.isAuthenticated() && req.user) {
                req.user.getRoles().then(roles => {
                    let user = {
                        email: req.user.email,
                        first_name: req.user.first_name,
                        last_name: req.user.last_name,
                        extra_permissions: req.user.extra_permissions,
                        roles: roles,
                    };

                    return res.send({
                        isAuthenticated: true,
                        user: user,
                    });
                });
            } else {
                return res.send({isAuthenticated: false});
            }
        });

        server.get('*', (req, res) => {
            if (req.isAuthenticated && req.isAuthenticated()) {
                db.sequelize.request = req;
                return handler(req, res);
            }

            res.redirect('/login');
        });

        //const httpServer = http.createServer(options, server);

        server.listen(port, (err) => {
            if (err) {
                console.log('error???');
                throw err;
            }
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1);
    });