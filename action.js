

var elements = document.getElementsByClassName('card');

function move(){
    window.location ="patient.html";
}

for (var i=0; i<elements.length; i++){
    elements[i].addEventListener('click',move,false);
}



// fetch("http://localhost:5000/api/patient",{
//     method: "PUT",
//     body: JSON.stringify(jsonBody),
//     headers:{
//         "Content-type": "application/json", 

//     },
// })
// .then((res)=> res.json())
// .then((json)=> console.log(json));

  