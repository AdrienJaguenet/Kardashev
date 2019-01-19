var tabs = [
	'overview',
	'buildings',
	'techs',
	'upgrades'
]

var current_sel = 'overview';

function select_tab(tabname) {
	current_sel = tabname;
	for (var i in tabs) {
		document.getElementById(tabs[i]).style.display="none";
		document.getElementById("tab-"+tabs[i]).classList.remove("selected");
	}
	if (tabname) {
		document.getElementById(tabname).style.display="initial";
		document.getElementById("tab-"+tabname).classList.add("selected");
		document.getElementById("tab-"+tabname).classList.remove("new");
	}
}

function ui_new_elm(tabname) {
  if (tabname != current_sel) {
	document.getElementById("tab-"+tabname).classList.add("new");
  }
}

