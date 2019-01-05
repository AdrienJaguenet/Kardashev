
var gameState = {
  energy: 0,
  year : 1,
  activities : {
	hunt : {
	  energy : 1
	},
	fish : {
	  energy : 20
	},
	farming : {
	  energy : 400
	}
  },
  research_tree : {
	tool : {
	  cost : 1000,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 1.25;
		unlock_element("upgrade-tools");
	  },
	  prereq_of : ['fire', 'spear'],
	  prereq : 0,
	},
	fire : {
	  cost : 10000,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 1.25;
	  },
	  prereq_of : ['farm'],
	  prereq : 0,
	},
	spear : {
	  cost : 15000,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 1.5;
	  },
	  prereq_of : ['bow', 'fishing'],
	  prereq : 0,
	},
	fishing : {
	  cost : 25000,
	  onResearch : function () {
		unlock_element("manual-fish");
		unlock_building("fisher");
		unlock_element("upgrade-harpoons");
	  },
	  prereq_of : ['boat'],
	  prereq : 0,
	},
	boat : {
	  cost : 40000,
	  onResearch : function () {
		gameState.buildings['fisher'].power *= 1.5;
	  },
	  prereq_of : ['rope'],
	  prereq : 0,
	},
	bow : {
	  cost : 30000,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 2.;
	  },
	  prereq_of : ['farm'],
	  prereq : 0,
	},
	farm : {
	  cost : 1000000,
	  onResearch : function() {
		unlock_building("farm");
		unlock_element("manual-farming");
		unlock_element("upgrade-granary");
	  },
	  prereq_of : ['husbandry', 'plough'],
	  prereq : 0,
	},
	plough : {
	  cost : 1500000,
	  onResearch : function() {
		gameState.buildings['farm'].power *= 1.5;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	husbandry : {
	  cost : 1300000,
	  onResearch : function() {
		gameState.buildings['farm'].power *= 2.5;
	  },
	  prereq : 0,
	  prereq_of : ['yoke']
	},
	yoke : {
	  cost : 2000000,
	  onResearch : function() {
		gameState.buildings['farm'].power *= 1.5;
	  },
	  prereq : 0,
	  prereq_of : ['rope']
	},
	rope : {
	  cost : 100000000,
	  onResearch : function() {
	  },
	  prereq : 0,
	  prereq_of : []
	}
  },
  upgrades : {
	tools : {
	  cost : 500,
	  level : 0,
	  onUpgrade : function() {
		gameState.activities['hunt'].energy *= 1.1;
	  },
	  alpha : 1.2
	},
	harpoons : {
	  cost : 6000,
	  level : 0,
	  onUpgrade : function() {
		gameState.activities['fish'].energy *= 1.15;
	  },
	  alpha : 1.2
	},
	granary : {
	  cost : 60000,
	  level : 0,
	  onUpgrade : function() {
		gameState.activities['farming'].energy *= 1.20;
	  },
	  alpha : 1.2
	},
  },
  buildings : {
	hunter : {
	  total : 0,
	  cost : 20,
	  alpha : 1.05,
	  power : 1
	},
	fisher : {
	  total : 0,
	  cost : 750,
	  alpha : 1.05,
	  power : 5
	},
	farm : {
	  total : 0,
	  cost : 15000,
	  alpha : 1.1,
	  power : 1000
	}
  }
};

function unlock_element(elmname) {
		document.getElementById(elmname).style.visibility = "initial";
}

function unlock_building(bname) {
  unlock_element(bname+"-qty");
  unlock_element("buy-"+bname);
  unlock_element("stat-"+bname);
}

function initGame()
{
  document.getElementById("buy-farm").style.visibility = "hidden";
  for (resname in gameState.research_tree) {
	var res = gameState.research_tree[resname];
	for (var i = 0; i < res.prereq_of.length; i++) {
	  var r = gameState.research_tree[res.prereq_of[i]];
	  r.prereq += 1;
	}
  }
  for (resname in gameState.upgrades) {
	document.getElementById("upgrade-"+resname).style.visibility = "hidden";
  }
  for (resname in gameState.activities) {
	document.getElementById("manual-"+resname).style.visibility = "hidden";
  }

  for (resname in gameState.buildings) {
	document.getElementById("buy-"+resname).style.visibility = "hidden";
	document.getElementById("stat-"+resname).style.visibility = "hidden";
	document.getElementById(resname+"-qty").style.visibility = "hidden";
  }
  unlock_element("manual-hunt");
  unlock_building("hunter");
  updateStats();
  var interval = setInterval(tick, 1000);
}

function activity(a)
{
  gameState.energy += gameState.activities[a].energy;
  updateStats();
}

function buy(b)
{
  var building = gameState.buildings[b];
  if (gameState.energy >= building.cost) {
	gameState.energy -= building.cost;
	building.total += 1;
	building.cost *= building.alpha;
  }
  updateStats();
}

function research(resname)
{
  res = gameState.research_tree[resname];
  if (gameState.energy >= res.cost) {
	document.getElementById("research-"+resname).remove();
	gameState.energy -= res.cost;
	res.onResearch();
	for (var i = 0; i < res.prereq_of.length; i++) {
	  var rname = res.prereq_of[i];
	  var res2 = gameState.research_tree[rname];
	  res2.prereq -= 1;
	}
  }
}

function upgrade(resname)
{
  res = gameState.upgrades[resname];
  if (gameState.energy >= res.cost) {
	gameState.energy -= res.cost;
	res.onUpgrade();
	res.cost *= res.alpha;
	res.level += 1;
  }
}

function updateStats()
{
  document.getElementById("stat-energy-qty").innerHTML = formatUnit(gameState.energy, "J");
  document.getElementById("stat-power-qty").innerHTML = formatUnit(totalPower(), "W");
  document.getElementById("stat-year").innerHTML = ""+gameState.year;
  for (var bname in gameState.buildings) {
	var b = gameState.buildings[bname];
	document.getElementById(bname+"-qty").innerHTML = b.total;
  }
  for (var upname in gameState.upgrades) {
	var u = gameState.upgrades[upname];
	document.getElementById("upgrade-"+upname+"-cost").innerHTML = formatUnit(u.cost, "J");
	document.getElementById("upgrade-"+upname+"-level").innerHTML = u.level;
  }
  for (var resname in gameState.research_tree) {
	var res = gameState.research_tree[resname];
	if (res.prereq == 0) {
	  var res_button = document.getElementById("research-"+resname);
	  if (res_button) {
		res_button.style.visibility = "initial";
		document.getElementById("tech-"+resname+"-cost").innerHTML = formatUnit(res.cost, "J");
	  }
	} else {
	  var res_button = document.getElementById("research-"+resname);
	  if (res_button) {
		res_button.style.visibility = "hidden";
	  }
	}
  }
  for (var resname in gameState.activities) {
	var res = gameState.activities[resname];
	document.getElementById(resname+"-qty").innerHTML = formatUnit(res.energy, "J");
  }
  for (var resname in gameState.buildings) {
	var res = gameState.buildings[resname];
	document.getElementById(resname+"-cost").innerHTML = formatUnit(res.cost, "J");
	document.getElementById(resname+"-gain").innerHTML = formatUnit(res.power, "W");
  }
}

function totalPower()
{
  var s = 0;
  for (var bname in gameState.buildings) {
	var building = gameState.buildings[bname];
	s += building.total * building.power;
  }
  return s;
}

function tick() {
  gameState.energy += totalPower();
  gameState.year += 1;
  updateStats();
}

function formatUnit(qty, unit) {
  range = Math.floor(Math.log10(qty) / 3);
  var prefix = "";

  if (range == 1) {
	prefix="k";
	qty /= 1000;
  } else if (range == 2) {
	prefix="M";
	qty /= 1000000;
  } else if (range == 3) {
	prefix="G";
	qty /= 1000000000;
  } else if (range == 4) {
	prefix="T";
	qty /= 1000000000000;
  }
  return qty.toFixed(2)+"&nbsp;"+prefix+unit;
}

