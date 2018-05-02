function main(){

console.log('hello from post');
const addReview = document.querySelector('#addReview');

	addReview.addEventListener('click', function(evt){

		evt.preventDefault();
		const req = new XMLHttpRequest();
		const url="/reviews/post";
		const id = document.querySelector('#courseNum').value;
		const title = document.querySelector('#title').value;
		const instructor = document.querySelector('#instructor').value;
		const description = document.querySelector('#description').value;
		const score = document.querySelector('#score').value;
		console.log("The post is ", id,title,instructor,description,score)

		console.log(url);
		req.open('POST', url,true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.addEventListener('load',function(){

			console.log("HTTPRequestPost");
			if(req.status>=200 && req.status<400){

				const review=JSON.parse(req.responseText);
				console.log("inside post");
				console.log(review);
				const tbody = document.querySelector("#review-table");
				// tbody.innerText="";

				const tr=document.createElement("tr");
				for(const prop in review){

					if(prop!=="_id" && prop!=="__v" && prop!=="course_id" && prop!=="title" && review.hasOwnProperty(prop)){

						console.log("inside if");
						const td = document.createElement("td");
						const text = document.createTextNode(review[prop]);
						if(prop ==='score'){
							td.classList.add('reviewScore');
						}
						td.appendChild(text);
						tr.appendChild(td);

					}
					
				}

				tbody.appendChild(tr);
				let p = document.createElement('p');
				document.querySelector('#post').style.display = 'none';
				p.innerText = "Thank you for your feedback";
				p.classList.add('lead');
				let container = document.querySelector('.container');
				container.appendChild(p);

				let reviewScore=document.querySelectorAll('.reviewScore');
				let scores = []
				for(let i = 0; i<reviewScore.length;i++){
					scores.push(reviewScore[i].innerHTML);
				}

				let average = scores.reduce((total,score)=>{

					return total + Number(score);
				},0);
				// console.log(scores);
				average = average/scores.length;
				document.getElementById('average').innerHTML = "The average score is: " + average;


			}

		});

			req.send(`id=${id}&title=${title}&instructor=${instructor}&description=${description}&score=${score}`);
	});
}

document.addEventListener('DOMContentLoaded', main);