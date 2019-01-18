function unlock_element(elmname) {
	document.getElementById(elmname).style.visibility = "initial";
	document.getElementById(elmname).style.display = "";
}

function lock_element(elmname) {
	document.getElementById(elmname).style.visibility = "hidden";
	document.getElementById(elmname).style.display = "none";
}

function unlock_building(bname) {
	gameState.buildings[bname].unlocked = true;
	unlock_element(bname+"-qty");
	unlock_element("buy-"+bname);
}

function unlock_upgrade(bname) {
	gameState.upgrades[bname].unlocked = true;
	unlock_element("upgrade-"+bname);
}

function unlock_activity(actname) {
	gameState.activities[actname].unlocked = true;
	unlock_element("manual-"+actname);
}

function loadGame(gs) 
{
	console.log("Loading game...");
	gameState.years = gs.years;
	console.log("-- resources");
	for (var resname in gs.resources) {
		gameState.resources[resname] = gs.resources[resname];
	}
	for (var bname in gs.buildings) {
		console.log("-- buildings")
			if (gs.buildings[bname].unlocked) {
				gameState.buildings[bname].unlocked = true;
				unlock_building(bname);
			}
		gameState.buildings[bname].total = gs.buildings[bname].total;
		for (var resname in gs.resources) {
			gameState.buildings[bname].genmod[resname] = gs.buildings[bname].genmod[resname];
		}
	}
	console.log("-- techs")
		for (var techname in gs.research_tree) {
			gameState.research_tree[techname].prereq = gs.research_tree[techname].prereq;
			if (gs.research_tree[techname].researched) {
				gameState.research_tree[techname].researched = true;
			}
		}

	console.log("-- upgrades")
		for (var upname in gs.upgrades) {
			if (gs.upgrades[upname].unlocked) {
				gameState.upgrades[upname].unlocked = true;
				unlock_upgrade(upname);
			}
			gameState.upgrades[upname].level = gs.upgrades[upname].level;
		}

	console.log("-- activities")
		for (var actname in gs.activities) {
			if (gs.activities[actname].unlocked) {
				gameState.activities[actname].unlocked = true;
				unlock_activity(actname);
			}
			for (var resname in gs.resources) {
				gameState.activities[actname].genmod[resname] = gs.activities[actname].genmod[resname];
			}
		}
}

function saveGame()
{
	console.log("Saving game...");
	if (typeof(Storage) != 'undefined') {
		localStorage.setItem("gameState", JSON.stringify(gameState));
	}
}

function initGame()
{
	select_tab('overview');
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
	for (actname in gameState.activities) {
		gameState.activities[actname].genmod = {}
		for (resname in gameState.resources) {
			gameState.activities[actname].genmod[resname] = 1;
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
		lock_element(resname+"-qty");
	}
	unlock_activity('hunt');
	unlock_activity('observe');
	unlock_activity('gather');
	unlock_building("hunter");
	unlock_building("shaman");
	if (typeof(Storage) != 'undefined') {
		var gs = localStorage.getItem("gameState");
		if (gs) {
			loadGame(JSON.parse(gs));
		}
	}

	updateStats();
	var interval_tick = setInterval(tick, 1000);
	var interval_save = setInterval(saveGame, 5000);
}

function activity(a)
{
	var act = gameState.activities[a];
	for (resname in gameState.resources) {
		if (act[resname]) {
			gameState.resources[resname] += act[resname] * act.genmod[resname];
		}
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

function buy(b, qty=1)
{
	var building = gameState.buildings[b];
	var n = 0;
	while (tryPay(building.cost, building.alpha, building.total) && n < qty) {
		building.total += 1;
		++n;
	}
	updateStats();
}

function research(resname)
{
	res = gameState.research_tree[resname];
	if (tryPay(res.cost)) {
		res.researched = true;
		res.onResearch();
		for (var i = 0; i < res.prereq_of.length; i++) {
			var rname = res.prereq_of[i];
			var res2 = gameState.research_tree[rname];
			res2.prereq -= 1;
		}
		updateStats();
	}
}

function upgrade(resname, qty=1)
{
	res = gameState.upgrades[resname];
	var n = 0;
	while (tryPay(res.cost, res.alpha, res.level) && n < qty) {
		res.onUpgrade();
		res.level += 1;
		updateStats();
		++n;
	}
}

function destroy(bname) {
	if (gameState.buildings[bname].total > 0) {
		gameState.buildings[bname].total --;
	}
	updateStats();
}

function genButtons()
{
	var stats_elm = document.getElementById("overview");
	var buy_elm = document.getElementById("buildings-table");
	var tech_elm = document.getElementById("techs");
	var up_elm = document.getElementById("upgrades-table");
	for (var bname in gameState.buildings) {
		var building = gameState.buildings[bname];
			buy_elm.innerHTML += 
			'<tr id="buy-'+bname+'" class="buy-building">'+
			'<td class="building-desc" id="'+bname+'-desc">'+building.name+'</td>'+
			'<td class="stat-qty" id="'+bname+'-qty">0</td>'+
			'<td class="cost-qty" id="'+bname+'-cost">0</td>'+
			'<td class="gain-qty" id="'+bname+'-gain">0</td>'+
			'<td>'+
			'<button onclick="destroy(\''+bname+'\');">destroy</button>'+
			'<button onclick="buy(\''+bname+'\');">Buy</button>'+
			'<button onclick="buy(\''+bname+'\', 10);">Buy x10</button>'+
			'</td>'+
			'</tr>'
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
			'<tr id="upgrade-'+uname+'">'+
			'<td>'+upgrade.name+'</td>'+
			'<td id="upgrade-'+uname+'-level">0</td>'+
			'<td class="cost-qty" id="upgrade-'+uname+'-cost">0</td>'+
			'<td>'+upgrade.desc+'</td>'+
			'<td>'+
			'<button id="upgrade-'+uname+'-x1" onclick="upgrade(\''+uname+'\')">Upgrade</button>'+
			'<button id="upgrade-'+uname+'-x10" onclick="upgrade(\''+uname+'\', 10)">x10</button></td>'+
			'</tr>'
	}
}

function getSaganKardashevPowerLvl(power)
{
	return (Math.log10(power) - 6) / 10;
}

function getSaganKardashevInfoLvl(bits)
{
	return String.fromCharCode(Math.floor(Math.log10(bits) - 6)+'A'.charCodeAt(0));
}

function writeUnit(id, qty, unit) {
	var elm = document.getElementById(id);
	elm.innerHTML = formatUnit(qty, unit); 
	if (qty > 0) {
		elm.classList.remove("negative");
		elm.classList.remove("neutral");
		elm.classList.add("positive");
	} else if (qty < 0) {
		elm.classList.remove("neutral");
		elm.classList.remove("positive");
		elm.classList.add("negative");
	} else {
		elm.classList.remove("negative");
		elm.classList.remove("positive");
		elm.classList.add("neutral");
	}
}

function updateStats()
{
	for (resname in gameState.resources) {
		writeUnit("stat-"+resname+"-qty", gameState.resources[resname], gameState.units[resname]);
		if (resname == "energy") {
			writeUnit(resname+"-delta", getDelta(resname), "W");
		} else {
			writeUnit(resname+"-delta", getDelta(resname), gameState.units[resname]+"/s");
		}
	}
	document.getElementById("stat-year").innerHTML = ""+gameState.year;
	document.getElementById("civ-level").innerHTML = getSaganKardashevPowerLvl(getDelta('energy')).toFixed(2)+getSaganKardashevInfoLvl(getDelta('bits'));
	for (var bname in gameState.buildings) {
		var b = gameState.buildings[bname];
		document.getElementById(bname+"-qty").innerHTML = b.total;
	}
	for (var upname in gameState.upgrades) {
		var u = gameState.upgrades[upname];
		writeUnit("upgrade-"+upname+"-cost", getCostVal(u.cost.energy, u.alpha, u.level), "J");
		document.getElementById("upgrade-"+upname+"-level").innerHTML = u.level;
	}
	for (var resname in gameState.research_tree) {
		var res = gameState.research_tree[resname];
		if (res.prereq == 0 && ! res.researched) {
			var res_button = document.getElementById("research-"+resname);
			if (res_button) {
				res_button.style.visibility = "initial";
				res_button.style.display = "";
				var d = document.getElementById("tech-"+resname+"-cost");
				d.innerHTML = "";
				for (resource in gameState.resources) {
					if (res.cost[resource]) {
						d.innerHTML += formatUnit(res.cost[resource], gameState.units[resource]) + " of " + gameState.resourcenames[resource] + " ";
					}
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
		for (resource in gameState.resources) {
			if (res[resource]) {
				d.innerHTML += formatUnit(res[resource] * res.genmod[resource], gameState.units[resource])+ " of " + gameState.resourcenames[resource] + " ";
			}
		}
	}
	for (var resname in gameState.buildings) {
		var res = gameState.buildings[resname];
		document.getElementById(resname+"-cost").innerHTML = formatUnit(getCostVal(res.cost.energy, res.alpha, res.total), "J");
		var d = document.getElementById(resname+"-gain");
		d.innerHTML = "";
		for (resource in gameState.resources) {
			if (res.gen[resource]) {
				d.innerHTML += formatUnit(res.gen[resource] * res.genmod[resource], gameState.units[resource])+ " of " + gameState.resourcenames[resource] + " ";
			}
		}
	}
}

function getDelta(resource)
{
	var s = 0;
	for (var bname in gameState.buildings) {
		var building = gameState.buildings[bname];
		if (building.gen[resource]) {
			s += building.total * building.gen[resource] * building.genmod[resource];
		}
	}
	return s;
}

function tick() {
	for (resource in gameState.resources) {
		gameState.resources[resource] += getDelta(resource);
	}
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

