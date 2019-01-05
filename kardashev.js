
var gameState = {
  hunters : 0,
  energy: 0,
  energy_per_hunt: 1,
  hunter_cost: 20,
  hunter_cost_alpha: 1.15,
  energy_per_farm: 1000,
  farms : 0,
  farm_cost: 20000,
  farm_cost_alpha: 1.50,
  year : 1,
  research_tree : {
	tool : {
	  cost : 1000,
	  onResearch : function() {
		gameState.energy_per_hunt *= 1.25;
	  },
	  prereq_of : ['fire', 'spear'],
	  prereq : 0,
	},
	fire : {
	  cost : 10000,
	  onResearch : function() {
		gameState.energy_per_hunt *= 1.5;
	  },
	  prereq_of : ['farm'],
	  prereq : 0,
	},
	spear : {
	  cost : 15000,
	  onResearch : function() {
		gameState.energy_per_hunt *= 2;
	  },
	  prereq_of : ['farm'],
	  prereq : 0,
	},
	farm : {
	  cost : 100000,
	  onResearch : function() {
		document.getElementById("buy-farm").style.visibility = "initial";
	  },
	  prereq_of : [],
	  prereq : 0,
	}
  }
};

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
  updateStats();
  var interval = setInterval(tick, 1000);
}

function manual_hunt()
{
  gameState.energy += gameState.energy_per_hunt;
  updateStats();
}

function buy_hunter()
{
  if (gameState.energy >= gameState.hunter_cost) {
	gameState.energy -= gameState.hunter_cost;
	gameState.hunters += 1;
	gameState.hunter_cost *= gameState.hunter_cost_alpha;
  }
  updateStats();
}

function buy_farm()
{
  if (gameState.energy >= gameState.farm_cost) {
	gameState.energy -= gameState.farm_cost;
	gameState.farms += 1;
	gameState.farm_cost *= gameState.farm_cost_alpha;
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


function updateStats()
{
  document.getElementById("stat-energy-qty").innerHTML = formatUnit(gameState.energy, "J");
  document.getElementById("stat-hunters-qty").innerHTML = ""+gameState.hunters;
  document.getElementById("stat-farms-qty").innerHTML = ""+gameState.farms;
  document.getElementById("stat-power-qty").innerHTML = formatUnit(totalPower(), "W");
  document.getElementById("hunt-qty").innerHTML = formatUnit(gameState.energy_per_hunt, "J");
  document.getElementById("hunter-cost").innerHTML = formatUnit(gameState.hunter_cost, "J");
  document.getElementById("hunter-gain").innerHTML = formatUnit(gameState.energy_per_hunt, "W");
  document.getElementById("farm-cost").innerHTML = formatUnit(gameState.farm_cost, "J");
  document.getElementById("farm-gain").innerHTML = ""+formatUnit(gameState.energy_per_farm, "W");
  document.getElementById("stat-year").innerHTML = ""+gameState.year;
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
}

function totalPower()
{
  return gameState.hunters * gameState.energy_per_hunt+
	gameState.farms * gameState.energy_per_farm;
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

