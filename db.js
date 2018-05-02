const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

// structure may change in the future
const UserSchema = new mongoose.Schema({})


const ReviewSchema= new mongoose.Schema({

	user: String,
	course_id: String,
	title: String,
	instructor: String,
	description: String,
	score: Number

})

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
// mongoose.model('Course', CourseSchema);
mongoose.model('Review', ReviewSchema);

mongoose.connect('mongodb://imtiaz27:mvemjsunp123@ds259089.mlab.com:59089/ait_final_project' );
