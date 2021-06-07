


var elements = document.getElementsByClassName('card');

function move(){
    window.location ="patient.html";
}

for (var i=0; i<elements.length; i++){
    elements[i].addEventListener('click',move,false);
}

var removeClassElements = document.getElementsByClassName('remove');

for(var i = 0; i < removeClassElements.length; i++){
  var element = removeClassElements[i];  
  element.addEventListener('click', remove);
}

var editClassElements = document.getElementsByClassName('edit');

for(var i = 0; i < editClassElements.length; i++){
  var element = editClassElements[i];  
  element.addEventListener('click', edit);
}

function remove() {
    fetch("http://localhost:5000/api/patient/:",{
        method: "DELETE",
        body: JSON.stringify(jsonBody),
        headers:{
            "Content-type": "application/json", 
    
        },
    })
}

function edit() {
    fetch("http://localhost:5000/api/patient",{
        method: "PUT",
        body: JSON.stringify(jsonBody),
        headers:{
            "Content-type": "application/json", 
    
        },
    })
    .then((res)=> res.json())
    .then((json)=> console.log(json));
}

document.getElementById("add_patient").addEventListener("click", function(event){
    event.preventDefault();
    let fname = document.getElementById("f_name").value;
    let lname = document.getElementById("l_name").value;
    let age = document.getElementById("age").value;
    let patient_id = document.getElementById("patient_id").value;
    
    let jsonBody ={
        f_name: fname,
        l_name: lname,
        age: age,
        patient_id: patient_id 
    }
    fetch("http://localhost:5000/api/patient",{
        method: "POST",
        body: JSON.stringify(jsonBody),
        headers: {
            "Content-type" : "application/json",
        },

    }).then((res) => res.json())
    .then((json) => console.log(json));

}
)

  