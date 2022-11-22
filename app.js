const express = require('express');
const http = require('http');
const bcrypt = require('bcryptjs');
const path = require("path");
const bodyParser = require('body-parser');
const { userDB } = require('./data');



const app = express();
const server = http.createServer(app)


//while encoding urls dont allow it to extend to much
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/register', async (req, res) => {
  try {
    let foundUser = userDB.find((data) =>  data.email === req.body.email )
    // , (err,user)=>{
    //   if(err){console.log(err);return;}
    //   else{return user}
    // });

    console.log(req.body)
    console.log(foundUser, 1);

    if (!foundUser) {
      let hashPassword = await bcrypt.hash(req.body.password, 10)
      //   ,(err,hash) => {
      //   if(err){ console.log(err); return;}
      //   else { console.log(hash); return hash;}
      // })
      console.log(1)

      // const newUser = new users.Users(
      //   Date.now(),
      //   req.body.username,
      //   req.body.email,
      //   hashPassword)

      const newUser = {
        id: Date.now(),
        username: req.body.username,
        email: req.body.email,
        password: hashPassword

      }

      userDB.push(newUser);
      console.log(2, newUser);

      console.log('User list', userDB);


      res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./register.html'>Register another user</a></div>")
    } else {
      res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./register.html'>Register again</a></div>")

    }
  } catch (error) {
    console.log(error);
    res.send("Internal server error");
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    console.log(5, userDB);
    let foundUser = userDB.find((data) => {return (req.body.login === data.username) || (req.body.login === data.email)});
    console.log(foundUser);
    console.log(12);
    if (foundUser) {
      console.log(13)
      let submitedPass = req.body.password;
      let storedPass = foundUser.password;
      let passwordMatch = await bcrypt.compareSync(submitedPass, storedPass);

      if (passwordMatch) {
        let usrname = foundUser.username;
        res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`)
      } else {
        console.log('wrong password');
        res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>")
      }
    } else {

      let fakePass = '$2basldoiuqoeiwe[wndlml';
      console.log(req.body.password, fakePass)
      await bcrypt.compare(req.body.password, fakePass);
      console.log(await bcrypt.compareSync(req.body.password, fakePass));
      //   , (hash, err) => {
      //   if (err) { console.log(err); return }
      //   else { console.log(hash); return hash; }
      // });


      console.log('invalid credentials');
      res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>")
    }

  } catch (error) {

    console.log(error);
    res.send('Internal server err');
  }
});


server.listen(3000, () => {
  console.log('Server is listening on port 3000....')
});