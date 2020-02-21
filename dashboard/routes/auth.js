var express = require('express');
var router = express.Router();

// above is if i/p in fields not match with that with below
let users = [
  { email: 'a@a.com', password: 'aaa', name: 'Shiv Shankar' },
]


router.get('/', function (req, res) {
  res.render('signin', { title: 'signin' })
})

router.post('/', function (req, res) {
  let { email, password } = req.body;
  console.log(email)
  console.log(password)
 // above: for printing in console whatever we give in i/p 
  if (email != undefined && email !== '' && password != undefined && password !== '') {

    users.forEach((u) => {
      if (u.email === email && u.password === password) {
        req.session.isLoggedIn = true;
        req.session.user=u;
        res.redirect('/')
      }
    })
  } else {
     res.render('signin', {title:'sign in'})
    // above: if we entered nothing and pressed submit
  }
})
module.exports = router;
