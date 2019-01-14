var gameState = {
  resources : {
    energy : 0,
	bits : 0,
	wood : 0,
  },
  units : {
	energy : "J",
	bits : "b",
	wood : "g"
  },
  resourcenames : {
	energy : "energy",
	bits : "information",
	wood : "wood"
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
	},
	gather : {
	  wood: 1e3
	}
  },
  research_tree : {
	tool : {
	  name : 'Tool',
	  desc : '+ 25 % hunting power',
	  cost : {bits: 1e6 },
	  onResearch : function() {
		gameState.buildings['hunter'].genmod.energy *= 1.25;
		unlock_upgrade('tools');
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
		unlock_upgrade('atlatl');
	  },
	  prereq_of : ['bow', 'fishing'],
	  prereq : 0,
	},
	fishing : {
	  name : 'Fishing',
	  desc : 'unlocks fishermen',
	  cost : {bits: 1.0e8},
	  onResearch : function () {
		unlock_activity('fish');
		unlock_building("fisher");
		unlock_upgrade('harpoons');
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
		unlock_activity('farming');
		unlock_upgrade('granary');
	  },
	  prereq_of : ['husbandry', 'plough', 'mills', 'astrology', 'writing'],
	  prereq : 0,
	},
	astrology : {
	  name : 'Astrology',
	  desc : 'write horoscopes, unlocks stargazing',
	  cost : { bits: 5.0e8},
	  onResearch : function() {
		unlock_activity('stargaze');
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
		unlock_upgrade('books');
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
		unlock_upgrade('smiths');
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
		unlock_upgrade('factory');
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
		unlock_upgrade('mines');
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
		gameState.activities['hunt'].genmod.energy *= 1.1;
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
		gameState.activities['fish'].genmod.energy *= 1.15;
	  },
	  alpha : 1.5
	},
	granary : {
	  name : 'Granaries',
	  desc : '+ 20 % manual farming power',
	  cost : {energy: 60000, bits: 0},
	  onUpgrade : function() {
		gameState.activities['farming'].genmod.energy *= 1.20;
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


