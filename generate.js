

const apiResult = [{
    f_name: "Joel",
    l_name: "McConnell",
    position: "40o"
  }, {
    f_name: "Nasheim",
    l_name: "Hamilton",
    position: "30o"
  }, {
    f_name: "Racardo",
    l_name: "Rowe",
    position: "35o"
  }];
  
function getPatients() {
    return fetch("http://localhost:5000/api/patient")
        .then ((res) => res.json())
        .then((json) => {
            console.log(json);
            var patients = json;
            return patients;
        });

}

function getPosition(id) {

    return fetch("http://localhost:5000/api/record"+ id)
        .then((res) => res.json())
        .then ((json)=> {
            console.log(json);
            var position = json;
            return position;
        });
}



const container = document.getElementById('cardlist1');
getPatients().then( patients =>
  patients.forEach((result, idx) => {
    // Create card element
    const card = document.createElement('div');
    card.classList = 'card-body';
    result.position= getPosition(result.patient_id).position;
    // Construct card content
    const content = `
    <div class="card" id="heading-${idx}"  style="width: 300px">
    <img class="card-img-top" src="https://www.w3schools.com/bootstrap4/img_avatar3.png" alt="Card image">
    <div class="card-body">
      <h4 class="card-title">Patient</h4>
      <p class="card-text">Name: ${result.f_name} ${result.l_name}</p>
      <p class="card-text">Position: ${result.position}</p>
      <a href="#" class="btn btn-warning">Edit</a>
      <a href="#" class="btn btn-danger">Delete</a>
    </div>
  </div>
    `;
  
    // Append newyly created card element to the container
    container.innerHTML += content;
    
  })
)
document.body.appendChild(container);


//fetch("localhost:5000/api")
// let data = [
//     {name: 'name0', description: 'description', date: 'XX/XX/XXXX'},
//     {name: 'name1', description: 'description', date: 'XX/XX/XXXX'},
//     {name: 'name2', description: 'description', date: 'XX/XX/XXXX'},
// ]

// data.forEach(res => {
//     let card = document.createElement("div");

//     let name = document.createTextNode('Name:' + res.name + ', ');
//     card.appendChild(name);

//     let description = document.createTextNode('Description:' + res.description + ', ');
//     card.appendChild(description);

//     let date = document.createTextNode('date:' + res.date);
//     card.appendChild(date);

//     let container = document.querySelector("#container");
//     container.appendChild(card);
// });

// function createCard() {

//     var carddiv = document.createElement("DIV");
//     carddiv.classList.add("card");

//     var imgcard = document.createElement("IMG");
//     imgcard.classList.add("card-img-top");

//     var cardbody = document.createElement("DIV");
//     cardbody.classList.add("card-body");

//     var cardtitle = document.createElement("H4");
//     cardtitle.classList.add("card-title");

//     var carddiv = document.createElement("div");
//     carddiv.classList.add("card");



//     return carddiv;
// }