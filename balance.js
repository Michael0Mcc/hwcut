document.querySelector('#home').style.cursor = "pointer";
function home() {
  change(pages.SELECTION);
}

function submit() {
  let equation = document.querySelector('#equation').value;
  if (equation != '') {
    document.querySelector('#solved').innerHTML = solve(equation);
  }
}

document.onkeypress = e => {
  e = e || window.event;
  if (e.keyCode == 13) {
    submit();
  }
}

function solve(x) {
  //firstly we find bigNumber, which will be all numbers multiplied together, in order to assume the last element is a constant amount of that
  bigNumber = 1;
  arrayOfNumbers = new Set(x.split(/\D+/g));
  arrayOfNumbers.delete("");
  for (let i of arrayOfNumbers) bigNumber *= parseInt(i);
  
  //first actual step, we split into left hand side and right hand side, and then into separate molecules
  //number of molecules is number of variables, number of elements is number of equations, variables refer to the coefficients of the chemical equation
  //note, the structure of this is changed a lot in the golfed version since right is the same as negative left
  left = x.split("=")[0].split("+");
  righ = x.split("=")[1].split("+");
  molecules = left.length + righ.length;
  
  //then let's find what elements there are - this will also become how many equations we have, or the columns of our matrix minus one
  //we replace all the non-element characters, and then split based on the uppercase characters
  //this also sometimes adds a "" to the array, we don't need that so we just delete it
  //turn into a set in order to remove repeats
  elems = new Set(x.replace(/\d+|\+|->/g,"").match(/([A-Z][a-z]*)/g));
  elems.delete("");
  
  rrefArray = [];//first index is rows, second index columns - each row is an equation x*(A11)+y*(A21)+z*(A31)=A41 etc etc, to solve for xyz as coefficients
  //loop thru the elements, since for each element we'll have an equation, or a row in the array
  for (let elem of elems) {
    buildArr = [];
    //loop thru the sides
    for (let molecule of left) {
      //let's see how many of element elem are in molecule molecule
      //ASSUMPTION: each element happens only once per molecule (no shenanigans like CH3COOH)
      index = molecule.indexOf(elem);
      if (index == -1) buildArr.push(0);
      else {
        index += elem.length;
        numberAfterElement = molecule.substring(index).match(/^\d+/g);
        if (numberAfterElement == null) buildArr.push(1);
        else buildArr.push(parseInt(numberAfterElement));
      }
    }
    //same for right, except each item is negative
    for (let molecule of righ) {
      index = molecule.indexOf(elem);
      if (index == -1) buildArr.push(0);
      else {
        index += elem.length;
        numberAfterElement = molecule.substring(index).match(/^\d+/g);
        if (numberAfterElement == null) buildArr.push(-1);
        else buildArr.push(parseInt(numberAfterElement)*(-1));
      }
    }
    rrefArray.push(buildArr);
  }
  
  //Gauss-Jordan algorithm starts here, on rrefArray
  for (pivot=0;pivot<Math.min(molecules, elems.size);pivot++) {
    //for each pivot element, first we search for a row in which the pivot is nonzero
    //this is guaranteed to exist because there are no empty molecules
    for (i=pivot;i<rrefArray.length;i++) {
      row = rrefArray[i];
      if (row[pivot] != 0) {
        workingOnThisRow = rrefArray.splice(rrefArray.indexOf(row), 1)[0];
      }
    }
    //then multiply elements so the pivot element of workingOnThisRow is equal to bigNumber we determined above, this is all to keep everything in integer-space
    multiplyWhat = bigNumber / workingOnThisRow[pivot]
    for (i=0;i<workingOnThisRow.length;i++) workingOnThisRow[i] *= multiplyWhat
    //then we make sure the other rows don't have this column as a number, the other rows have to be zero, if not we can normalize to bigNumber and subtract
    for (let i in rrefArray) {
      row = rrefArray[i];
      if (row[pivot] != 0) {
        multiplyWhat = bigNumber / row[pivot]
        for (j=0;j<row.length;j++) {
          row[j] *= multiplyWhat;
          row[j] -= workingOnThisRow[j];
          row[j] /= multiplyWhat;
        }
        rrefArray[i]=row;
      }
    }
    //finally we put the row back
    rrefArray.splice(pivot, 0, workingOnThisRow);
  }
  
  //and finally we're done!
  //sanity check to make sure it succeeded, if not then the matrix is insolvable
  if (rrefArray[0][elems.size] == 0 || rrefArray[0][elems.size] == undefined) return "No possible solutions!";
  
  //last step - get the results of the rref, which will be the coefficients of em except for the last one, which would be bigNumber (1 with typical implementation of the algorithm)
  bigNumber *= -1;
  gcd_calc = function(a, b) {
    if (!b) return a;
    return gcd_calc(b, a%b);
  };
  coEffs = [];
  gcd = bigNumber;
  for (i=0;i<rrefArray.length;i++) {
    num = rrefArray[i][molecules-1];
    coEffs.push(num);
    gcd = gcd_calc(gcd, num)
  }
  coEffs.push(bigNumber);
  for (i=0;i<coEffs.length;i++) coEffs[i] /= gcd;
  
  //now we make it human readable
  //we have left and right from before, let's not forget those!
  out = "";
  for (i=0;i<coEffs.length;i++) {
    coEff = coEffs[i];
    if (coEff != 1) out += coEff;
    out += left.shift();
    if (left.length == 0 && righ.length != 0) {
      out += "= ";
      left = righ;
    } else if (i != coEffs.length-1) out += "+ ";
  }
  return out;
}