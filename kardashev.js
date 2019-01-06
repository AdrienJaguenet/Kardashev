
var gameState = {
  energy : 0,
  bits : 0,
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
	  name : 'Tool',
	  desc : '+ 25 % hunting power',
	  cost : 1000,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 1.25;
		unlock_element("upgrade-tools");
	  },
	  prereq_of : ['fire', 'spear'],
	  prereq : 0,
	},
	fire : {
	  name : 'Fire',
	  desc : '+ 25 % hunting power',
	  cost : 10000,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 1.25;
	  },
	  prereq_of : ['farm'],
	  prereq : 0,
	},
	spear : {
	  name : 'Spear',
	  desc : '+ 50 % hunting power, unlocks atlatl',
	  cost : 1500,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 1.5;
		unlock_element("upgrade-atlatl");
	  },
	  prereq_of : ['bow', 'fishing'],
	  prereq : 0,
	},
	fishing : {
	  name : 'Fishing',
	  desc : 'unlocks fishermen',
	  cost : 5000,
	  onResearch : function () {
		unlock_element("manual-fish");
		unlock_building("fisher");
		unlock_element("upgrade-harpoons");
	  },
	  prereq_of : ['boat'],
	  prereq : 0,
	},
	boat : {
	  name : 'Boats',
	  desc : '+ 50 % fishing power',
	  cost : 10000,
	  onResearch : function () {
		gameState.buildings['fisher'].power *= 1.5;
	  },
	  prereq_of : [],
	  prereq : 0,
	},
	bow : {
	  name : 'Bow',
	  desc : '+ 100 % hunting power',
	  cost : 30000,
	  onResearch : function() {
		gameState.buildings['hunter'].power *= 2.;
	  },
	  prereq_of : ['farm'],
	  prereq : 0,
	},
	farm : {
	  name : 'Farming',
	  desc : 'unlocks farms',
	  cost : 100000,
	  onResearch : function() {
		unlock_building("farm");
		unlock_element("manual-farming");
		unlock_element("upgrade-granary");
	  },
	  prereq_of : ['husbandry', 'plough', 'mills'],
	  prereq : 0,
	},
	plough : {
	  name : 'Plough',
	  desc : '+ 50 % farming power',
	  cost : 150000,
	  onResearch : function() {
		gameState.buildings['farm'].power *= 1.5;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	husbandry : {
	  name : 'Husbandry',
	  desc : '+ 150 % farming power',
	  cost : 130000,
	  onResearch : function() {
		gameState.buildings['farm'].power *= 2.5;
	  },
	  prereq : 0,
	  prereq_of : ['yoke', 'horses', 'oxen']
	},
	yoke : {
	  name : 'Yoke',
	  desc : '+ 50 % farming power',
	  cost : 200000,
	  onResearch : function() {
		gameState.buildings['farm'].power *= 1.5;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	mills : {
	  name : 'Mill',
	  desc : 'unlocks mills, + 100 % farming power',
	  cost : 100000,
	  onResearch : function() {
		gameState.buildings['farm'].power *= 2;
		unlock_building('mill');
	  },
	  prereq : 0,
	  prereq_of : ['metallurgy']
	},
	horses : {
	  name : 'Horses',
	  desc : '+ 50 % mill power',
	  cost : 200000,
	  onResearch : function()  {
		gameState.buildings['mill'].power *= 1.5;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	oxen : {
	  name : 'Oxen',
	  desc : '+ 100 % mill power, + 500 % farming power',
	  cost : 500000,
	  onResearch : function() {
		gameState.buildings['mill'].power *= 2;
		gameState.buildings['farm'].power *= 6;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	metallurgy : {
	  name : 'Metallurgy',
	  desc : 'unlocks smiths',
	  cost : 1000000,
	  onResearch : function() {
		unlock_element('upgrade-smiths');
	  },
	  prereq : 0,
	  prereq_of : ['steammachine']
	},
	steammachine : {
	  name : 'Steam machine',
	  desc : 'unlocks steam machines',
	  cost : 10000000,
	  onResearch : function() {
		unlock_building('steam');
	  },
	  prereq : 0,
	  prereq_of : ['electricity', 'industry']
	},
	industry : {
	  name : 'Industry',
	  desc : '+ 200 % steam power, unlocks factory upgrade',
	  cost : 25000000,
	  onResearch : function() {
		unlock_element('upgrade-factory');
	  },
	  prereq : 0,
	  prereq_of : ['electricity']
	},
	electricity : {
	  name : 'Electricity',
	  desc : '+ 100 % steam power',
	  cost : 50000000,
	  onResearch : function() {
		unlock_building('coal_plant');
	  },
	  prereq : 0,
	  prereq_of : []
	}
  },
  upgrades : {
	tools : {
	  name : 'Tools',
	  desc : '+ 10 % manual hunting power',
	  cost : 500,
	  level : 0,
	  onUpgrade : function() {
		gameState.activities['hunt'].energy *= 1.1;
	  },
	  alpha : 1.2
	},
	atlatl : {
	  name : 'Atlatl',
	  desc : '+ 10 % hunting power',
	  cost : 100,
	  level : 0,
	  onUpgrade : function () {
		gameState.buildings['hunter'].power *= 1.1;
	  },
	  alpha : 1.1,
	},
	harpoons : {
	  name : 'Harpoons',
	  desc : '+ 15 % manual fishing power',
	  cost : 6000,
	  level : 0,
	  onUpgrade : function() {
		gameState.activities['fish'].energy *= 1.15;
	  },
	  alpha : 1.1
	},
	granary : {
	  name : 'Granaries',
	  desc : '+ 20 % manual farming power',
	  cost : 60000,
	  level : 0,
	  onUpgrade : function() {
		gameState.activities['farming'].energy *= 1.20;
	  },
	  alpha : 1.1
	},
	smiths : {
	  name : 'Smiths',
	  desc : '+ 10 % mill power',
	  cost : 70000,
	  level : 0,
	  onUpgrade : function() {
		gameState.buildings['mill'].power *= 1.1;
	  },
	  alpha : 1.06
	},
	factory : {
	  name : 'Factories',
	  desc : '+ 10 % steam power',
	  cost : 10000000,
	  level : 0,
	  onUpgrade : function() {
		gameState.buildings['steam'].power *= 1.5
	  },
	  alpha : 1.11
	}
  },
  buildings : {
	hunter : {
	  name : 'Hunters',
	  total : 0,
	  cost : 5,
	  alpha : 1.05,
	  power : 1
	},
	fisher : {
	  name : 'Fishers',
	  total : 0,
	  cost : 750,
	  alpha : 1.05,
	  power : 5
	},
	farm : {
	  name : 'Farms',
	  total : 0,
	  cost : 15000,
	  alpha : 1.07,
	  power : 1000
	},
	mill : {
	  name : 'Mills',
	  total : 0,
	  cost : 50000,
	  alpha : 1.07,
	  power : 5000
	},
	steam : {
	  name : 'Steam machines',
	  total : 0,
	  cost : 1000000,
	  alpha : 1.05,
	  power : 100000
	},
	coal_plant : {
	  name : 'Coal plants',
	  total : 0,
	  cost :  10000000000,
	  alpha : 1.05,
	  power : 100000000
	},
	fission_plant : {
	  name : 'Nuclear fission plants',
	  total : 0,
	  cost :  50000000000,
	  alpha : 1.05,
	  power : 500000000
	},
	fusion_plant : {
	  name : 'Nuclear fusion plants',
	  total : 0,
	  cost :  1000000000000,
	  alpha : 1.05,
	  power : 5000000000
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
  genButtons();
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

function genButtons()
{
  var stats_elm = document.getElementById("stats-main");
  var buy_elm = document.getElementById("controls-buy");
  var tech_elm = document.getElementById("controls-tech");
  var up_elm = document.getElementById("controls-upgrades");
  for (var bname in gameState.buildings) {
	var building = gameState.buildings[bname];
	stats_elm.innerHTML +=
	  '<div id="stat-'+bname+'">'+
		'<span class="stat-name" id="hunter-name">'+building.name+': </span>'+
		'<span class="stat-qty" id="'+bname+'-qty">0</span>'+
		'</div>'
	buy_elm.innerHTML += 
	  '<button id="buy-'+bname+'" onclick="buy(\''+bname+'\');">Buy '+bname+' (cost '+
		'<span class="cost-qty" id="'+bname+'-cost">0</span>'+
		', <span class="gain-qty" id="'+bname+'-gain">0</span>'+
		')</button>'
  }
  for (var tname in gameState.research_tree) {
	var tech = gameState.research_tree[tname];
	  tech_elm.innerHTML += 
	  '<button id="research-'+tname+'" onclick="research(\''+tname+'\')">'+tech.name+' (cost '+
		'<span class="cost-qty" id="tech-'+tname+'-cost">0</span>'+
		'): '+tech.desc+'</button>'
  }
  for (var uname in gameState.upgrades) {
	var upgrade = gameState.upgrades[uname];
	up_elm.innerHTML +=
	  '<button id="upgrade-'+uname+'" onclick="upgrade(\''+uname+'\')">"'+upgrade.name+'" (cost '+
		'<span class="cost-qty" id="upgrade-'+uname+'-cost">0</span>'+
		'): '+upgrade.desc+' (level'+
		'<span id="upgrade-'+uname+'-level">0</span>)'+
	  ')</button>'
  }
}

function getSaganKardashevLvl(power)
{
  return (Math.log10(power) - 6) / 10;
}

function updateStats()
{
  document.getElementById("stat-energy-qty").innerHTML = formatUnit(gameState.energy, "J");
  document.getElementById("stat-power-qty").innerHTML = formatUnit(totalPower(), "W");
  document.getElementById("stat-year").innerHTML = ""+gameState.year;
  document.getElementById("civ-level").innerHTML = getSaganKardashevLvl(totalPower()).toFixed(3);
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

