const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('62fbd09500965abe18bc10c6')
        
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
}
);
                

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



app.use(errorController.get404);

mongoose.connect('mongodb+srv://admin:doudou@cluster0.iaepn.mongodb.net/eshop')
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
    const user = new User({
        name: 'John',
        email: 'j@g',
        cart: {items:[]}
    });
    user.save();
}
    }).catch(err=>{
        console.log(err);
    }
    );
    app.listen(3000);
}
).catch(err=>{
    console.log(err);
}
);
