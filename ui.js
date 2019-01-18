var tabs = [
	'overview',
	'buildings',
	'techs',
	'upgrades'
]

function select_tab(tabname) {
	for (var i in tabs) {
		document.getElementById(tabs[i]).style.display="none";
		document.getElementById("tab-"+tabs[i]).classList.remove("selected");
	}
	if (tabname) {
		document.getElementById(tabname).style.display="initial";
		document.getElementById("tab-"+tabname).classList.add("selected");
	}
}

