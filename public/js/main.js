// TODO: add client side code for single page application

function createTable(){

			console.log("HTTPRequest");
			if(this.status>=200 && this.status<400){

				const courses=JSON.parse(this.responseText);

				console.log(courses);
				console.log(courses.length);
				const tbody = document.querySelector("#search-results");
				tbody.innerText="";

				for(let i=0; i<courses.length; i++){

					const tr1=document.createElement("tr");
					const tr2 = document.createElement('tr');
					let courseURL = '/courses/'+courses[i]['course'];
					let schedule =""
					if(courses[i]['days'] && courses[i]['times']){
						schedule= `${courses[i]['days']}\n ${courses[i]['times']}`
					}
					else{

						schedule = "TBA"
					}
					let anchorInstructor = document.createElement('a');
					let instructor;
					if(courses[i]['instructors']){

						instructor = courses[i]['instructors'][0];
						for(key in instructor){
							anchorInstructor.href ='https://gallatin.nyu.edu'+instructor[key];
							anchorInstructor.innerHTML ="Instructor:"+ key + "";
							anchorInstructor.setAttribute("target", "_blank");
						}
					

					}
					 
					let description = courses[i]['description']
					description += `\n type: ${courses[i]['type']}\n notes: ${courses[i]['notes']}`

					for(let prop in courses[i]){

						if(prop ==='course' || prop==='title' ||prop==='credit' || prop==='year' || prop ==='term'){
								const td = document.createElement("td");
								const text = document.createTextNode(courses[i][prop]);
								td.appendChild(text);
								tr1.appendChild(td);
							}

							if(prop ==='section'){

								break;
							}
						}

					const td1 = document.createElement("td");
					td1.appendChild(anchorInstructor);
					tr2.appendChild(td1);

					const td2 = document.createElement("td");
					const text1 = document.createTextNode(schedule);
					td2.appendChild(text1);
					tr2.appendChild(td2);
	
   					const tdReview = document.createElement("td");
					let anchorReview = document.createElement('a');
    				anchorReview.href =  courseURL; // Insted of calling setAttribute 
   					anchorReview.innerHTML = "See/add Review(s)";
   					tdReview.appendChild(anchorReview);
   					tr2.appendChild(tdReview);
   					
   					tbody.appendChild(tr1);
   					tbody.appendChild(tr2)

   					let tr3 = document.createElement('tr');
					let a = document.createElement('a');
   					a.href = "";
   					a.innerHTML = "See description";
   					let tdDescriptionTrigger = document.createElement('td');
   					tdDescriptionTrigger.appendChild(a);
   					tr3.appendChild(tdDescriptionTrigger);
   					
   					let tdDescription = document.createElement('td');
   					tdDescription.innerHTML = description;
   					tdDescription.style.display = 'none';
   					tr3.appendChild(tdDescription);
   					tbody.appendChild(tr3);

   					a.addEventListener('click',function(evt){

   						evt.preventDefault();

   						if(tdDescription.style.display === 'none'){

   							tdDescription.style.display = 'block'
   						}
   						else{

   							tdDescription.style.display ='none' 
   						}
   					})

   					

   				}
			}

		};




function main() {

	console.log('hello from main');

	const search = document.querySelector('#search');


	search.addEventListener('click', function(evt){

		evt.preventDefault();
		const req = new XMLHttpRequest();
		let url="/courses";
		let query = "";
		query = $( "form" ).serialize()
		if(query){
			url = url +"?"+query;
		}
		
		console.log(url);
		req.open('GET', url,true);
		req.addEventListener('load',createTable);

		req.send();


	});
}

document.addEventListener("DOMContentLoaded", main);
