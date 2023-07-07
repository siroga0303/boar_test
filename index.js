const sumbitBtn = document.querySelector("button")
const numpage = document.getElementById("num")

const filterBtn = document.querySelector(".checkout")
const numplayer = document.getElementById("num_play")
const numperc = document.getElementById("num_per")


sumbitBtn.addEventListener('click', function(event){
  event.preventDefault();
  console.log(numpage.value)
  check(numpage.value);

})

filterBtn.addEventListener('click', function(event){
  event.preventDefault();
  let result
  if(numplayer.value.includes('player')){
    
  result = part1.filter(el => ((el[`${numplayer.value}`]/el['totalvotes']).toFixed(2) *100 ).toFixed(2) >= parseInt(numperc.value) ) 
  
  }
  else if (numplayer.value.includes('playtime')){
    
    result = part1.filter(el => (parseInt(el[`${numplayer.value}`]) + parseInt(numplayer.value.includes('max') ? el[`minplaytime`]: el[`maxplaytime`])) - parseInt(numperc.value) >= parseInt(el[`minplaytime`]) && (parseInt(el[`${numplayer.value}`]) + parseInt(numplayer.value.includes('max') ? el[`minplaytime`]: el[`maxplaytime`])) - parseInt(numperc.value) <= parseInt(el[`maxplaytime`]))
  }  
  else {
    
    result = part1.filter(el => el[`${numplayer.value}`] >= parseFloat(numperc.value) ) 

  }
  
  
  convert(result)


  


})

let part1 =[];
let part2 = [];



async function check(numpage) {
    let response1 = await fetch(`https://alive-bikini-foal.cyclic.app/get?id=${parseInt(numpage)}&num1=50&num2=0`);
    let response2 = await fetch(`https://alive-bikini-foal.cyclic.app/get?id=${parseInt(numpage)}&num1=100&num2=50`);
    console.log("GO")
    if (response1.ok && response2.ok) { // если HTTP-статус в диапазоне 200-299
      // получаем тело ответа (см. про этот метод ниже)
      part1 = await response1.json();
      part2 = await response2.json();
      console.log(part1, part2)
      createArray()
    } else {
      alert("Ошибка HTTP: " + response1.status);
    }

    
}



function createArray(){
  part1.push(...part2)
  convert(part1)
}





function convert(jsonData) {
         
  // Sample JSON data
  
  
  // Get the container element where the table will be inserted
  let container = document.getElementById("container");
  try {
    let tab = document.querySelector('table') 
    tab.remove()
  }
  catch(e) {
    console.log(e)
  }
  
  // Create the table element
  let table = document.createElement("table");
  const objectWithMostAttributes = jsonData.reduce(
    (objectWithMostAttributes, nextObject) => {
      // use Object.keys(object).length to get number of attributes of the object
      // reduce goes through the objects, and will set the first item as the first element of the array
      // and the second item as the second element of the array
  
      // Depending on what is inside the function, you can decide how it chooses what to return
      // The below code uses Object.keys(object.length) to get the number of attributes of the objects and compares them
      // It uses a ternary operator, it checks if the objectWithMostAttributes is more than or equal to the nextObject
      // If it is, return objectWithMostAttributes (to be used as the next objectWithMostAttributes),
      // else return the nextObject as the (to be used as the next objectWithMostAttributes)
  
      // This will continue until it gets to the end of the array
      return (Object.keys(objectWithMostAttributes).length >= Object.keys(nextObject).length) ? objectWithMostAttributes : nextObject;
    }
  );
  // Get the keys (column names) of the first object in the JSON data
  let cols = Object.keys(objectWithMostAttributes);
  
  
  // Create the header element
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");
  
  // Loop through the column names and create header cells
  cols.forEach((item) => {
     let th = document.createElement("th");
     th.innerText = item; // Set the column name as the text of the header cell
     tr.appendChild(th); // Append the header cell to the header row
  });
  thead.appendChild(tr); // Append the header row to the header
  table.append(tr) // Append the header to the table
  
  // Loop through the JSON data and create table rows
  jsonData.forEach((item) => {
     let tr = document.createElement("tr");
     
     // Get the values of the current object in the JSON data
     let vals = Object.values(item);
     let totalcounts = vals[4];
     // Loop through the values and create table cells
     for(let i = 0; i < vals.length; i++) {
      
      let td = document.createElement("td");
      if (i === 0) {
        img = document.createElement('img');
        img.src = vals[i];
        img.setAttribute("class", 'fit-picture');
        td.appendChild(img);

      }
      else if(i > 5) {
        td.innerText = `${vals[i]} => ${((vals[i] / totalcounts).toFixed(2)*100).toFixed(0)} %`;
      }
      else {
        td.innerText = vals[i]; // Set the value as the text of the table cell
      }
      tr.appendChild(td); 
     }
     
     table.appendChild(tr); // Append the table row to the table
  });
  container.appendChild(table) // Append the table to the container element
  let arr = document.querySelectorAll("th")
  for(var i = 0; i < arr.length; i++) {
    arr[i].addEventListener("click", bindClick(i, cols));
}


}


let clicked = false;
function bindClick(i, cols) {
  return function() {
    let part3
      if (i > 1 && i < 6) {
        if(!clicked) {
          part3 = structuredClone(part1);
          part3.sort(function(a, b) {
            return a[`${cols[i]}`] - b[`${cols[i]}`];
          });
          clicked = !clicked
          
          
        }
        else if (clicked) {
          part3 = structuredClone(part1);
          part3.sort(function(a, b) {
            return  b[`${cols[i]}`]- a[`${cols[i]}`];
          });
          clicked = !clicked
        }
        convert(part3) 
      }
      
      console.log("you clicked region number " + i);
  };
 }