
var gameState = {
  resources : {
    energy : 0,
	bits : 0,
  },
  year : 1,
  activities : {
	hunt : {
	  energy : 1,
	},
	observe : {
	  bits: 1.0e4,
	},
	fish : {
	  energy : 20
	},
	farming : {
	  energy : 400
	},
	stargaze : {
	  bits: 1.0e7
	}
  },
  research_tree : {
	tool : {
	  name : 'Tool',
	  desc : '+ 25 % hunting power',
	  cost : {bits: 1e6 },
	  onResearch : function() {
		gameState.buildings['hunter'].genmod.energy *= 1.25;
		unlock_element("upgrade-tools");
	  },
	  prereq_of : ['fire', 'spear', 'herbs'],
	  prereq : 0,
	},
	herbs : {
	  name : 'Herbs',
	  desc : '+ 50 % shaman knowledge',
	  cost : {bits: 1e6 },
	  onResearch : function() {
		gameState.buildings['shaman'].genmod.bits*= 1.5;
	  },
	  prereq_of : ['pigments'],
	  prereq : 0
	},
	pigments : {
	  name : 'Pigments',
	  desc : '+ 50 % shaman knowledge',
	  cost : {bits : 1.5e6 },
	  onResearch : function() {
		gameState.buildings['shaman'].genmod.bits*= 1.5;
	  },
	  prereq_of : ['petroglyphs'],
	  prereq : 0
	},
	petroglyphs : {
	  name : 'Petroglyphs',
	  desc : '+ 100 % shaman knowledge',
	  cost : {bits : 2.5e6 },
	  onResearch : function() {
		gameState.buildings['shaman'].genmod.bits *= 2;
	  },
	  prereq_of : ['animalspirit'],
	  prereq : 0
	},
	animalspirit : {
	  name : 'Animal spirits',
	  desc : '- 25 % shaman energy consumption',
	  cost : {bits : 5.0e6},
	  onResearch : function() {
		gameState.buildings['shaman'].genmod.energy *= .75;
	  },
	  prereq_of : ['rituals'],
	  prereq : 0
	},
	rituals : {
	  name : 'Rituals',
	  desc  : '+ 100 % hunter knowledge',
	  cost : {bits : 1.0e7},
	  onResearch : function() {
		gameState.buildings['hunter'].genmod.bits *= 1.1;
	  },
	  prereq_of : ['religion'],
	  prereq : 0
	},
	fire : {
	  name : 'Fire',
	  desc : '+ 25 % hunting power',
	  cost : {bits: 1.5e7},
	  onResearch : function() {
		gameState.buildings['hunter'].genmod.energy *= 1.25;
	  },
	  prereq_of : ['farm', 'rituals'],
	  prereq : 0,
	},
	spear : {
	  name : 'Spear',
	  desc : '+ 50 % hunting power, unlocks atlatl',
	  cost : {bits: 2.0e7},
	  onResearch : function() {
		gameState.buildings['hunter'].genmod.energy *= 1.5;
		unlock_element("upgrade-atlatl");
	  },
	  prereq_of : ['bow', 'fishing'],
	  prereq : 0,
	},
	fishing : {
	  name : 'Fishing',
	  desc : 'unlocks fishermen',
	  cost : {bits: 1.0e8},
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
	  cost : { bits: 1.2e8},
	  onResearch : function () {
		gameState.buildings['fisher'].genmod.energy *= 1.5;
	  },
	  prereq_of : [],
	  prereq : 0,
	},
	bow : {
	  name : 'Bow',
	  desc : '+ 100 % hunting power',
	  cost : { bits: 1.0e8},
	  onResearch : function() {
		gameState.buildings['hunter'].genmod.energy *= 2.;
	  },
	  prereq_of : ['farm'],
	  prereq : 0,
	},
	farm : {
	  name : 'Farming',
	  desc : 'unlocks farms',
	  cost : { bits: 5.0e8},
	  onResearch : function() {
		unlock_building("farm");
		unlock_element("manual-farming");
		unlock_element("upgrade-granary");
	  },
	  prereq_of : ['husbandry', 'plough', 'mills', 'astrology', 'writing'],
	  prereq : 0,
	},
	astrology : {
	  name : 'Astrology',
	  desc : 'write horoscopes, unlocks stargazing',
	  cost : { bits: 5.0e8},
	  onResearch : function() {
		unlock_element("manual-stargaze");
	  },
	  prereq_of : ['religion'],
	  prereq : 0,
	},
	religion : {
	  name : 'Religion',
	  desc : 'Behold! The sacred texts! Unlocks temples',
	  cost : { bits : 6.0e8},
	  onResearch : function() {
		unlock_building("temple");
	  },
	  prereq_of : ['theology'],
	  prereq : 0
	},
	writing : {
	  name : 'Writing',
	  desc : '+ 100 % temple knowledge, - 50 % temple energy consumption, unlocks books',
	  cost : { bits : 5e8 },
	  onResearch : function() {
		gameState.buildings['temple'].genmod.bits *= 2;
		gameState.buildings['temple'].genmod.energy *= .5;
		unlock_element("upgrade-books");
	  },
	  prereq_of : ['theology'],
	  prereq : 0,
	},
	theology : {
	  name : 'Theology',
	  desc : 'unlocks monasteries',
	  cost : { bits : 7.0e8},
	  onResearch : function() {
		unlock_building("monastery");
	  },
	  prereq_of : ['university', 'astronomy'],
	  prereq : 0
	},
	university : {
	  name : 'University',
	  desc : 'unlocks universities',
	  cost : { bits : 2.0e9},
	  onResearch : function() {
		unlock_building("university");
	  },
	  prereq_of : ['scientificmethod'],
	  prereq : 0
	},
	scientificmethod : {
	  name : 'Scientific Method',
	  desc : 'university knowledge x10',
	  cost : {bits : 1e10},
	  onResearch : function() {
		gameState.buildings['university'].genmod.bits *= 10;
	  },
	  prereq_of : ['chemistry'],
	  prereq : 0
	},
	plough : {
	  name : 'Plough',
	  desc : '+ 50 % farming power',
	  cost : { energy: 0, bits: 5.5e8},
	  onResearch : function() {
		gameState.buildings['farm'].genmod.energy*= 1.5;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	husbandry : {
	  name : 'Husbandry',
	  desc : '+ 150 % farming power',
	  cost : { energy: 0, bits: 6.0e8},
	  onResearch : function() {
		gameState.buildings['farm'].genmod.energy*= 2.5;
	  },
	  prereq : 0,
	  prereq_of : ['yoke', 'horses', 'oxen']
	},
	yoke : {
	  name : 'Yoke',
	  desc : '+ 50 % farming power',
	  cost : { energy: 0, bits : 6.5e8},
	  onResearch : function() {
		gameState.buildings['farm'].genmod.energy*= 1.5;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	mills : {
	  name : 'Mill',
	  desc : 'unlocks mills, + 100 % farming power',
	  cost : { energy: 0, bits : 7.0e8},
	  onResearch : function() {
		gameState.buildings['farm'].genmod.energy *= 2;
		unlock_building('mill');
	  },
	  prereq : 0,
	  prereq_of : ['metallurgy']
	},
	horses : {
	  name : 'Horses',
	  desc : '+ 50 % mill power',
	  cost : { energy: 0, bits : 7.5e8},
	  onResearch : function()  {
		gameState.buildings['mill'].genmod.energy *= 1.5;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	oxen : {
	  name : 'Oxen',
	  desc : '+ 100 % mill power, + 500 % farming power',
	  cost : { energy: 0, bits : 8.0e8},
	  onResearch : function() {
		gameState.buildings['mill'].genmod.energy *= 2;
		gameState.buildings['farm'].genmod.energy *= 6;
	  },
	  prereq : 0,
	  prereq_of : []
	},
	astronomy : {
	  name : 'Astronomy',
	  desc : 'proper understanding of the movement of the stars and planets',
	  cost : {bits : 9e9},
	  onResearch : function() {
	  },
	  prereq : 0,
	  prereq_of : []
	},
	metallurgy : {
	  name : 'Metallurgy',
	  desc : 'unlocks smiths',
	  cost : { energy: 0, bits : 8.5e9},
	  onResearch : function() {
		unlock_element('upgrade-smiths');
	  },
	  prereq : 0,
	  prereq_of : ['alchemy']
	},
	alchemy : {
	  name : 'Alchemy',
	  desc : 'try to turn lead into gold',
	  cost : {bits : 9e9},
	  onResearch : function() {
	  },
	  prereq : 0,
	  prereq_of : ['chemistry']
	},
	chemistry : {
	  name : 'Chemistry',
	  desc : 'a better knowledge of matter',
	  cost : {bits : 1e10},
	  onResearch : function() {

	  },
	  prereq : 0,
	  prereq_of : ['steammachine']
	},
	steammachine : {
	  name : 'Steam machine',
	  desc : 'unlocks steam machines',
	  cost : { energy: 0, bits: 5.0e10},
	  onResearch : function() {
		unlock_building('steam');
	  },
	  prereq : 0,
	  prereq_of : ['electricity', 'industry']
	},
	industry : {
	  name : 'Industry',
	  desc : '+ 200 % steam power, unlocks factory upgrade',
	  cost : { energy: 0, bits: 6.5e10},
	  onResearch : function() {
		unlock_element('upgrade-factory');
	  },
	  prereq : 0,
	  prereq_of : ['electricity', 'mining']
	},
	electricity : {
	  name : 'Electricity',
	  desc : '+ 100 % steam power',
	  cost : { energy: 0, bits: 9e10} ,
	  onResearch : function() {
		unlock_building('coal_plant');
	  },
	  prereq : 0,
	  prereq_of : []
	},
	mining : {
	  name : 'Mining',
	  desc : '+ 100 % coal plant power, unlocks mines upgrade',
	  cost : {energy: 0, bits: 7e10},
	  onResearch : function() {
		unlock_element('upgrade-mines');
	  },
	  prereq : 0,
	  prereq_of : []
	}
  },
  upgrades : {
	tools : {
	  name : 'Tools',
	  desc : '+ 10 % manual hunting power',
	  cost : {energy: 500, bits: 0},
	  onUpgrade : function() {
		gameState.activities['hunt'].energy *= 1.1;
	  },
	  alpha : 1.2
	},
	atlatl : {
	  name : 'Atlatl',
	  desc : '+ 5 % hunting power',
	  cost : { energy: 100, bits: 0},
	  onUpgrade : function () {
		gameState.buildings['hunter'].genmod.energy*= 1.05;
	  },
	  alpha : 1.5,
	},
	harpoons : {
	  name : 'Harpoons',
	  desc : '+ 15 % manual fishing power',
	  cost : {energy: 6000, bits: 0},
	  onUpgrade : function() {
		gameState.activities['fish'].energy *= 1.15;
	  },
	  alpha : 1.5
	},
	granary : {
	  name : 'Granaries',
	  desc : '+ 20 % manual farming power',
	  cost : {energy: 60000, bits: 0},
	  onUpgrade : function() {
		gameState.activities['farming'].energy *= 1.20;
	  },
	  alpha : 1.5
	},
	smiths : {
	  name : 'Smiths',
	  desc : '+ 5 % mill power',
	  cost : {energy: 70000, bits: 0},
	  onUpgrade : function() {
		gameState.buildings['mill'].genmod.energy *= 1.05;
	  },
	  alpha : 1.15
	},
	books : {
	  name : 'Books',
	  desc : '+ 5 % monastery knowledge',
	  cost : {energy : 80000},
	  onUpgrade : function() {
		gameState.buildings['monastery'].genmod.bits *= 1.05;
	  },
	  alpha : 1.15
	},
	factory : {
	  name : 'Factories',
	  desc : '+ 5 % steam power',
	  cost : {energy: 10000000},
	  onUpgrade : function() {
		gameState.buildings['steam'].genmod.energy *= 1.05;
	  },
	  alpha : 1.15
	},
	mines : {
	  name : 'Mines',
	  desc : '+ 5 % coal plant power',
	  cost : {energy: 10000000},
	  onUpgrade : function() {
		gameState.buildings['coal_plant'].genmod.energy *= 1.05;
	  },
	  alpha : 1.15
	}
  },
  buildings : {
	hunter : {
	  name : 'Hunters',
	  cost : {energy: 5},
	  alpha : 1.04,
	  gen : {
		energy : 1,
		bits : 1
	  },
	},
	shaman : {
	  name : 'Shamans',
	  cost : {energy : 100},
	  alpha : 1.05,
	  gen : {
		energy : -10,
		bits : 2e4
	  },
	},
	fisher : {
	  name : 'Fishers',
	  cost : {energy: 750},
	  alpha : 1.05,
	  gen : {
		energy: 5,
		bits : 5
	  }
	},
	farm : {
	  name : 'Farms',
	  cost : {energy: 15000},
	  alpha : 1.07,
	  gen : {
		energy : 1000
	  }
	},
	temple : {
	  name : 'Temple',
	  cost : {energy: 1e5},
	  alpha : 1.06,
	  gen : {
		energy : -200,
		bits : 1e6
	  }
	},
	monastery : {
	  name : 'Monastery',
	  cost : {energy: 5e5},
	  alpha : 1.06,
	  gen : {
		energy : -1000,
		bits : 1e5
	  }
	},
	university : {
	  name : 'University',
	  cost : {energy: 1e6},
	  alpha : 1.1,
	  gen : {
		energy : -5000,
		bits : 100000
	  }
	},
	mill : {
	  name : 'Mills',
	  cost : {energy: 50000},
	  alpha : 1.07,
	  gen : {
		energy : 5000
	  }
	},
	steam : {
	  name : 'Steam machines',
	  cost :  {energy: 1000000},
	  alpha : 1.05,
	  gen : {
		energy : 100000
	  }
	},
	coal_plant : {
	  name : 'Coal plants',
	  cost :  {energy: 1000000000},
	  alpha : 1.05,
	  gen : {
		energy : 10000000
	  }
	},
	fission_plant : {
	  name : 'Nuclear fission plants',
	  cost :  {energy: 5000000000},
	  alpha : 1.05,
	  gen : {
		energy : 50000000
	  }
	},
	fusion_plant : {
	  name : 'Nuclear fusion plants',
	  cost :  {energy: 10000000000},
	  alpha : 1.05,
	  gen : {
		energy : 500000000
	  }
	}
  }
};

function unlock_element(elmname) {
  document.getElementById(elmname).style.visibility = "initial";
  document.getElementById(elmname).style.display = "";
}

function lock_element(elmname) {
  document.getElementById(elmname).style.visibility = "hidden";
  document.getElementById(elmname).style.display = "none";
}

function unlock_building(bname) {
  unlock_element(bname+"-qty");
  unlock_element("buy-"+bname);
  unlock_element("stat-"+bname);
}

function loadGame(gs) 
{
  console.log("Loading game...");
  gameState.years = gs.years;
  console.log("-- resources")
  for (var resname in gs.resources) {
	console.log("")
	gameState.resources[resname] = gs.resources[resname];
  }
  for (var bname in gs.buildings) {
  console.log("-- buildings...")
	gameState.buildings[bname].total = gs.buildings[bname].total;
	for (var resname in gs.resources) {
	  gameState.buildings[bname].genmod = gs.buildings[bname].genmod;
	}
  }
}

function saveGame()
{
  if (typeof(Storage) != 'undefined') {
	localStorage.setItem("gameState", gameState);
  }
}

function initGame()
{
  genButtons();
  for (resname in gameState.research_tree) {
	var res = gameState.research_tree[resname];
	for (var i = 0; i < res.prereq_of.length; i++) {
	  var r = gameState.research_tree[res.prereq_of[i]];
	  if (r.prereq) {
		r.prereq += 1;
	  } else {
		r.prereq = 1;
	  }
	}
  }
  for (resname in gameState.upgrades) {
	gameState.upgrades[resname].level = 0;
	lock_element("upgrade-"+resname);
  }
  for (resname in gameState.activities) {
	lock_element("manual-"+resname);
  }

  for (resname in gameState.buildings) {
	gameState.buildings[resname].genmod = {};
	for (rname in gameState.resources) {
	  gameState.buildings[resname].genmod[rname] = 1;
	}
	gameState.buildings[resname].total = 0;
	lock_element("buy-"+resname);
	lock_element("stat-"+resname);
	lock_element(resname+"-qty");
  }
  unlock_element("manual-hunt");
  unlock_element("manual-observe");
  unlock_building("hunter");
  unlock_building("shaman");
  if (typeof(Storage) != 'undefined') {
	var gs = localStorage.getItem("gameState");
	loadGame(gs);
  }

  updateStats();
  var interval_tick = setInterval(tick, 1000);
  var interval_save = setInterval(saveGame, 5000);
}

function activity(a)
{
  var act = gameState.activities[a];
  if (act.energy) {
	gameState.resources.energy += act.energy;
  }
  if (act.bits) {
	gameState.resources.bits += act.bits; 
  }
  updateStats();
}

function tryPay(cost, alpha=1, lvl=0) {
  var costEnergy = 0;
  var costBits = 0;
  if (cost.energy) {
	costEnergy = getCostVal(cost.energy, alpha, lvl);
  }
  if (cost.bits) {
	costBits = getCostVal(cost.bits, alpha, lvl);
  }
  if (gameState.resources.energy >= costEnergy && gameState.resources.bits >= costBits) {
	gameState.resources.energy -= costEnergy;
	gameState.resources.bits -= costBits;
	return true;
  }
  return false;
}

function getCostVal(val, alpha, lvl) {
  return val * Math.pow(alpha, lvl);
}

function buy(b)
{
  var building = gameState.buildings[b];
  if (tryPay(building.cost, building.alpha, building.total)) {
	building.total += 1;
	updateStats();
  }
}

function research(resname)
{
  res = gameState.research_tree[resname];
  if (tryPay(res.cost)) {
	document.getElementById("research-"+resname).remove();
	res.onResearch();
	for (var i = 0; i < res.prereq_of.length; i++) {
	  var rname = res.prereq_of[i];
	  var res2 = gameState.research_tree[rname];
	  res2.prereq -= 1;
	}
	updateStats();
  }
}

function upgrade(resname)
{
  res = gameState.upgrades[resname];
  if (tryPay(res.cost, res.alpha, res.level)) {
	res.onUpgrade();
	res.level += 1;
	updateStats();
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
	  '<div id="buy-'+bname+'" class="buy-building">'+
	  '<span class="building-desc" id="'+bname+'-desc">'+building.name+'</span> '+
	  'cost <span class="cost-qty" id="'+bname+'-cost">0</span>'+
	  ', generates <span class="gain-qty" id="'+bname+'-gain">0</span> '+
	  '<button onclick="buy(\''+bname+'\');">Buy</button>'
	'</div>'
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
	  '<button id="upgrade-'+uname+'" onclick="upgrade(\''+uname+'\')">'+upgrade.name+' (cost '+
	  '<span class="cost-qty" id="upgrade-'+uname+'-cost">0</span>'+
	  '): '+upgrade.desc+' (level'+
	  '<span id="upgrade-'+uname+'-level">0</span>)'+
	  ')</button>'
  }
}

function getSaganKardashevPowerLvl(power)
{
  return (Math.log10(power) - 6) / 10;
}

function getSaganKardashevInfoLvl(bits)
{
  return String.fromCharCode(Math.floor(Math.log10(bits))+'A'.charCodeAt(0));
}

function updateStats()
{
  document.getElementById("stat-energy-qty").innerHTML = formatUnit(gameState.resources.energy, "J");
  document.getElementById("stat-bits-qty").innerHTML = formatUnit(gameState.resources.bits, "b");
  document.getElementById("stat-power-qty").innerHTML = formatUnit(totalPower(), "W");
  document.getElementById("stat-info-qty").innerHTML = formatUnit(totalInfo(), "b/s");
  document.getElementById("stat-year").innerHTML = ""+gameState.year;
  document.getElementById("civ-level").innerHTML = getSaganKardashevPowerLvl(totalPower()).toFixed(3) + '-'+getSaganKardashevInfoLvl(totalInfo());
  for (var bname in gameState.buildings) {
	var b = gameState.buildings[bname];
	document.getElementById(bname+"-qty").innerHTML = b.total;
  }
  for (var upname in gameState.upgrades) {
	var u = gameState.upgrades[upname];
	document.getElementById("upgrade-"+upname+"-cost").innerHTML = formatUnit(getCostVal(u.cost.energy, u.alpha, u.level), "J");
	document.getElementById("upgrade-"+upname+"-level").innerHTML = u.level;
  }
  for (var resname in gameState.research_tree) {
	var res = gameState.research_tree[resname];
	if (res.prereq == 0) {
	  var res_button = document.getElementById("research-"+resname);
	  if (res_button) {
		res_button.style.visibility = "initial";
		res_button.style.display = "";
		var d = document.getElementById("tech-"+resname+"-cost");
		d.innerHTML = "";
		if (res.cost.energy) {
		  d.innerHTML += formatUnit(res.cost.energy, "J");
		}
		if (res.cost.bits) {
		  d.innerHTML += ' ' + formatUnit(res.cost.bits, "b");
		}
	  }
	} else {
	  var res_button = document.getElementById("research-"+resname);
	  if (res_button) {
		res_button.style.visibility = "hidden";
		res_button.style.display = "none";
	  }
	}
  }
  for (var resname in gameState.activities) {
	var res = gameState.activities[resname];
	var d = document.getElementById(resname+"-qty");
	d.innerHTML = "";
	if (res.energy) {
	  d.innerHTML += formatUnit(res.energy, "J");
	}
	if (res.bits) {
	  d.innerHTML += ' ' + formatUnit(res.bits, "b");
	}
  }
  for (var resname in gameState.buildings) {
	var res = gameState.buildings[resname];
	document.getElementById(resname+"-cost").innerHTML = formatUnit(getCostVal(res.cost.energy, res.alpha, res.total), "J");
	var d = document.getElementById(resname+"-gain");
	d.innerHTML = "";
	if (res.gen.energy) {
	  d.innerHTML += formatUnit(res.gen.energy * res.genmod.energy, "W");
	}

	if (res.gen.bits) {
	  d.innerHTML += ' ' + formatUnit(res.gen.bits * res.genmod.bits, "b/s");
	}
  }
}

function totalInfo()
{
  var s = 0;
  for (var bname in gameState.buildings) {
	var building = gameState.buildings[bname];
	if (building.gen.bits) {
	  s += building.total * building.gen.bits * building.genmod.energy;
	}
  }
  return s;
}

function totalPower()
{
  var s = 0;
  for (var bname in gameState.buildings) {
	var building = gameState.buildings[bname];
	if (building.gen.energy) {
	  s += building.total * building.gen.energy * building.genmod.energy;
	}
  }
  return s;
}

function tick() {
  gameState.resources.energy += totalPower();
  gameState.resources.bits += totalInfo();
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
  } else if (range == 5) {
	prefix="P";
	qty /= 1000000000000000;
  } else if (range == 6) {
	prefix="E";
	qty /= 1000000000000000000;
  }
  return qty.toFixed(2)+"&nbsp;"+prefix+unit;
}

