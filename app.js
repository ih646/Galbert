require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Review = mongoose.model('Review');
const express = require('express');
const request=require('request');
// const cookieParser = require('cookie-parser');
// const expressValidator = require('express-validator');
// const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const app = express();
const path = require('path');

const sessionOptions = {
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

app.get("/",(req,res)=>{

	res.render("home");
})

app.get("/login", (req,res)=>{

	res.render('login');
})

app.get("/register", (req,res)=>{

	res.render('register');
})

app.post("/register", (req,res)=>{

	User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { message : "Problem registering. username or password may already exist" });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
})

app.post('/login', function(req,res,next){

	passport.authenticate('local',function(err, user, info) {
    
    if (err) { return next(err); }
    
    if (!user) { res.render('login', {message: "user does not exist or incorrect password"}) }
    
    else{
	    
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      
	      return res.redirect('/');
	    
	    });
  	}

  })(req, res, next);

})

	
app.get('/search',(req,res)=>{

	res.render('search')
})


let API="https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?";

let port= process.env.PORT || 3000;

app.set('view engine','hbs');

app.get('/courses/find',(req,res)=>{

	res.render('form');
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/courses', (req,res)=>{

	let queryString=API;
	let counter=0;

	for( let query in req.query){

		if(counter===0 && req.query[query]!==""){

			queryString+=`${query}=${req.query[query]}`;
			counter++;
		}
		else{

			if( req.query[query]!=="") queryString+=`&${query}=${req.query[query]}`;


		}
	}

	request(queryString,function(error,response,body){ 

		console.log(queryString);       

		let result=JSON.parse(body);

		delete result.totalMatches;

		let courses=[];

		for(let course in result){

			courses.push(result[course]);
		}

		res.json(courses);

	})
	
})

app.get('/courses/:course',(req,res)=>{

	let query = API+'course='+req.params.course;
	let course = {}
	let name = ""
	let link = ""
	request(query,function(error,response,body){ 

		return new Promise(function(fulfill,reject){


			let result=JSON.parse(body);

			delete result.totalMatches;
			
			for(let prop in result['1']){

				if(result['1'].hasOwnProperty(prop)){

					course[prop] = result['1'][prop]
					
					if(prop === 'instructors'){

						let instructor = course[prop][0];
						for(key in instructor){
				
							name = key;
							link = instructor[key];
							console.log(key);

						}
					}
				}	
				
			}
			if(name){
				fulfill(course['course']);
			}
			else{

				reject('something went wrong')
			}
		}).then(function(val){

			console.log(val);
			Review.find({course_id:val},(err,result)=>{

				if(err){

					console.log('err');	
					res.render('reviews', {message: 'problem loading reviews'});
				}
				else{

					let average = result.reduce((total,review)=>{
						return total + review.score;
					}, 0);

					average = average/(result.length);

					console.log("course info ",course['title'], course['course']);
					console.log('before render ',result);
					res.render('reviews',{course: course, instructor: name, reviews: result, link: link, average: average});
				}

			})


		}).catch((val)=>{

			res.render('reviews', {message: val})
		})	       
		
	})
		

})

app.post('/reviews/post',(req,res)=>{

	console.log(req.user);
	console.log(req.body);
	const review = new Review({

		user: req.user.username,
		course_id: req.body.id,
		title: req.body.title,
		instructor: req.body.instructor,
		description: req.body.description,
		score: parseInt(req.body.score,10)


	});

	console.log(review);

	review.save((err,result)=>{

		if(err){

			console.log('error saving');
			console.log('the result is ', result)
		}
		console.log(result);
		res.json(result);
	});


})

app.get('/myReviews',(req,res)=>{

	if(req.user){

		Review.find({user: req.user.username},(err,reviews)=>{

			if(err){

				console.log('couldnt find reviews')
			}
			else{

				res.render('myReviews',{reviews: reviews})
			}


		})

	}
	else{

		res.render('myReviews');
	}
	

})


app.listen(port, function(){

	console.log('app running');
})