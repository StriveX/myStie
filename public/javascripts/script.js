var counter = 1;
var limit = 4;
function addInput(divName){
     if (counter == limit)  {

     }
     else {
     	  counter++;
          var newdiv = document.createElement('div');
          newdiv.innerHTML = "<p><input type='text' name='entry[field" + counter + "]' placeholder='Filed' />"
                   + "<select name='entry[type" + counter + "]'>" 
                   + "  <option value='int'>Integer</option>"
                   + "  <option value='float'>Float</option>"
                   + "  <option value='date'>Date</option>"
                   + "  <option value='tinyint'>Selection</option>"
                   + "</select><input type='button' value='New Field' onClick='addInput('field')'></p>";
          document.getElementById(divName).appendChild(newdiv);
          document.getElementById("numField").value = counter;
     }
}