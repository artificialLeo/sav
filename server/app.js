const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const userScheme = new Schema(
    {
        SortNO: String,
        CSKUID: String,
        CSKU: String,
        ItemName: String,
        ProdName: String,
        MarkName: String,
        TradeMarketMail: String
    }, {collection: "sav"});
const Prod = mongoose.model("Prod", userScheme);

const logScheme = new Schema(
    {
        password: String,
        email: String,
        name: String,
        surname: String,
    }, {collection: "users"});
const User = mongoose.model("User", logScheme);

const resScheme = new Schema(
    {
        dateNow: String,
        userName: String,
        userMail: String,
        actionInitiator: String,
        startDate: String,
        finishDate: String,
        actionComment: String,
        actionType: String,
        budgetQuantity: String,
        actionTypeAdditional: String,
        actionTypeLocale: String,
        budgetNumber: String,
        affiliateBudget: String,
        ttBudget: String,
        cskuBudget: String,
        budgetType: String,
        discount: String,
        manager: String,
        prod: String,
        mark: String,
        order: [{
            CSKUID: String,
            CSKU: String,
        }]
    }, {collection: "result"});
const Result = mongoose.model("Result", resScheme);

app.use(cors());

const uri = "mongodb+srv://u:1@cluster0.oxbux.mongodb.net/products?retryWrites=true&w=majority";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function(err){
    if(err) return console.log(err);
    app.listen(4000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

// Get all information about Products
app.get("/api/users", function(req, res){
    Prod.find({}, function(err, users){
        if(err) return console.log(err);
        res.send(users)
    });
});

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/server', express.static(path.join(__dirname, 'server')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Send mail
app.get("/", function(req, res){
        if(err) return console.log(err);
        res.send("users")
});

app.post("/api/send", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    main(req.body);
});

app.post("/api/user", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const userName = req.body.name;
        const userSurname = req.body.surname;
        const userMail = req.body.mail;
        const userPass = req.body.password;
        const user = new User({ name: userName, surname: userSurname, password: userPass, email: userMail });

        user.save(function(err){
            if(err) return console.log(err);
            res.send(user);
        });
});

app.post("/api/res", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

        const dateNow = req.body.dateNow;
        const userName = req.body.userName;
        const userMail = req.body.userMail;
        const actionInitiator = req.body.actionInitiator;
        const startDate = req.body.startDate;
        const finishDate = req.body.finishDate;
        const actionComment = req.body.actionComment;
        const actionType = req.body.actionType;
        const budgetQuantity = req.body.budgetQuantity;
        const actionTypeAdditional = req.body.actionTypeAdditional;
        const actionTypeLocale = req.body.actionTypeLocale;
        const budgetNumber = req.body.budgetNumber;
        const affiliateBudget = req.body.affiliateBudget;
        const ttBudget = req.body.ttBudget;
        const cskuBudget = req.body.cskuBudget;
        const budgetType = req.body.budgetType;
        const discount = req.body.discount;
        const manager = req.body.manager;
        const prod = req.body.prod;
        const mark = req.body.mark;
        const order = req.body.order;

        const result = new Result({
                dateNow: dateNow,
                userName: userName,
                userMail: userMail,
                actionInitiator: actionInitiator,
                startDate: startDate,
                finishDate: finishDate,
                actionComment: actionComment,
                actionType: actionType,
                budgetQuantity: budgetQuantity,
                actionTypeAdditional: actionTypeAdditional,
                actionTypeLocale: actionTypeLocale,
                budgetNumber: budgetNumber,
                affiliateBudget: affiliateBudget,
                ttBudget: ttBudget,
                cskuBudget: cskuBudget,
                budgetType: budgetType,
                discount: discount,
                manager: manager,
                prod: prod,
                mark: mark,
                order: order
        });

        result.save(function(err){
            if(err) return console.log(err);
            res.send(result);
        });
});

app.get("/api/all", function(req, res){

    User.find({}, function(err, users){

        if(err) return console.log(err);
        res.send(users)
    });
});

async function main(s) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
          user: 'horkovenko.k@gmail.com',
          pass: 'Astana1@'
      }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Form Handler 👻" <horkovenko.k@gmail.com>', // sender address
    to: "gorkovenko.g@asnova.com", // list of receivers
    subject: "Products", // Subject line
    text: JSON.stringify(s), // plain text body
    html: JSON.stringify(s), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
