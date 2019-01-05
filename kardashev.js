
var gameState = {
  hunters : 0,
  energy: 0,
  energy_per_hunt: 500,
  hunter_cost: 20000,
  hunter_cost_alpha: 1.15,
  energy_per_farm: 10000,
  farms : 0,
  farm_cost: 200000,
  farm_cost_alpha: 1.50,
  year : 1,
  research_tree : {
	tool : {
	  cost : 10000,
	  onResearch : function() {
		gameState.energy_per_hunt *= 1.25;
	  }
	},
	farm : {
	  cost : 100000,
	  onResearch : function() {
		document.getElementById("buy-farm").style.visibility = "initial";
	  }
	}
  }
};

function initGame()
{
  updateStats();
  document.getElementById("buy-farm").style.visibility = "hidden";
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
	document.getElementById("research-"+resname).style.visibility = "hidden";
	gameState.energy -= res.cost;
	res.onResearch();
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
	document.getElementById("tech-"+resname+"-cost").innerHTML = formatUnit(res.cost, "J");
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

