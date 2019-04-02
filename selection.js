let s = document.querySelectorAll('.selection');
for (let i = 0; i < s.length; i++) {
  s[i].style.cursor = "pointer";
}

function link(link) {
  switch (link) {
    case 1: change(pages.BALANCE); break;
  }
}