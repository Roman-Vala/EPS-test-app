
const passport = require('passport');
const axios = require('axios');
var dotenv = require('dotenv');






exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};


/**
 * GET /dashboard
 */
exports.dashboardGet = function(req, res) {
  
  res.render('dashboard' );
  
  
  

};


/**
 * POST /dashboard
 */
exports.dashboardPost = function(req, res) {
  let device = req.body.submit
  let now = Math.round((new Date()).getTime() / 1000)
  axios({
    method: 'get',
    url: `https://api.wattwatchers.com.au/v2/long-energy/${device}`,
    params: {granularity: '15m',fromTs: now - (86400)},
    headers: {
      Authorization: 'Bearer ' + process.env.WWATCHERS_API_KEY
    }
  })
  .then(response => {

    let ch1 =[]
    let tmz = []
    response.data.forEach(obj=>{
      let watts = Math.abs(obj.eReal[0]/obj.duration)
      ch1.push(parseFloat(watts.toFixed(2)))

      let localOffset = (-1) * new Date().getTimezoneOffset()*60000
                let date = new Date((obj.timestamp*1000)+localOffset)
            tmz.push(date.toISOString().slice(0, 19).replace('T', ' '))

    })

    

    res.render('dashboard',{ch1:ch1,tmz:JSON.stringify(tmz),device:device} );
    console.log(tmz);
  })
  .catch(error => {
    console.log(error);
  });


  
  
};
