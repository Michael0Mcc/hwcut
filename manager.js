const pages = {
  SELECTION: 0,
  BALANCE: 1
}

let page = pages.SELECTION;

function change(p) {
  page = p;

  switch (page) {
    case pages.SELECTION:
      document.querySelector('#balance').style.display = 'none';
      document.querySelector('#selection').style.display = 'block';
      document.querySelector('#header').innerHTML = 'HW Cut';
      document.title = 'HW Cut | Selection';
      break;

    case pages.BALANCE:
      document.querySelector('#selection').style.display = 'none';
      document.querySelector('#balance').style.display = 'block';
      document.querySelector('#header').innerHTML = 'Chemical Balancing';
      document.title = 'HW Cut | Chemical Balancing';
      break;
  
    default:
      document.querySelector('#balance').style.display = 'none';
      document.querySelector('#selection').style.display = 'block';
      document.querySelector('#header').innerHTML = 'HW Cut';
      document.title = 'HW Cut | Selection';
      break;
  }
}

change(pages.SELECTION);