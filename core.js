var $ = {

	ts: null,
	lts: null,

	init: function() {
		$.cnv = document.getElementById('c');
		$.ctx = $.cnv.getContext('2d');
		$.ctx.imageSmoothingEnabled = false;
		$.ctx.scale(1, -1);
		$.ctx.translate(0, -720);

		document.body.addEventListener('keydown', function(e) {
			$.input.down(e);
		});
		document.body.addEventListener('keyup', function(e) {
			$.input.up(e);
		});

		var i=$.gfx.length,j,m,x,y;
		while(i--) {
			$.gfx[i][5] = document.createElement("canvas");
			$.gfx[i][5].width = $.gfx[i][0];
			$.gfx[i][5].height = $.gfx[i][1];
			$.gfx[i][6] = $.gfx[i][5].getContext("2d");

			if($.gfx[i][3]) {
				
				m = [];

				$.gfx[i][3] = $.utils.decode( $.gfx[i][3] );

				for(j=0;j < $.gfx[i][3].length;j++) {

					x = j % $.gfx[i][0] + Math.floor( j / ( $.gfx[i][0] * $.gfx[i][1] ) ) * $.gfx[i][0];
					y = Math.floor( ( j % ($.gfx[i][0] * $.gfx[i][1]) ) / $.gfx[i][0] );

					if(!x) m[y] = [];

					m[y][x] = $.gfx[i][3][j] == 'a' ? 0 : 1;

					$.gfx[i][6].fillStyle = $.colors[ $.gfx[i][3][j] ];
					$.gfx[i][6].fillRect( 
						x,
						y,
						1,
						1
					);

				}

				$.gfx[i][3] = m;

			}

			if($.gfx[i][4])
				$.gfx[i][4]($.gfx[i]);

			document.body.appendChild($.gfx[i][5]);//TODO: remove for release
		}

		$.init_entities($.entities);

		$.loop();
	},
	init_entities: function(e) {
		var i = e.length;
		while(i--) {
			//clone childs
			if(e[i][5])
				e[i][5](e[i]);
			$.init_entities(e[i][1]);
		}
	},
	entities: [
		/*
			Entity:
				0: [ // DATA
					...
				]
				1: [ // CHILDRENS
					...
				]
				2: [ // GRAPHICS
					0: gfx (int)
					1: frame (int|float)
				]
				3: [ // POSITION & SIZE
					0: x (float)
					1: y (float)
					2: w (float)
					3: h (float)
					4: affected by player position (bool)
				]
				4: update (function)
				5: init (function)
		*/
		[
			[],
			[],
			[0,0],
			[0, 0]
		],
		[ // sky
			[],
			[],
			[
				1,
				0
			],
			[
				0, 0, 1280, 720
			]
		],
		[ // world
			[],
			[],
			[
				2, 0
			],
			[
				0, 0, 8192, 1408, 1
			]
		],
		[ // player container
			[
				1,    //0: dir
				0,    //1: vel_x
				0,    //2: vel_y
				250,  //3: max_vel_x
				250,  //4: max_vel_y
				0,    //5: on_ground
				150,  //6: g
				500,  //7: friction
				0     //8: frame float
			],
			[
				[ // player body GFX
					[
						5, // 0: moving speed
						6, // 1: max moving distance
						1, // 2: moving direction (1 up, -1 down)
						0  // 3: player direction
					],
					[
						[ // player face GFX
							[
								6,    // 0: base x,
								0,    // 1: delta x
								5,    // 2: face move distance
								0.5  // 3: face move speed
							],
							[],
							[
								4, 0
							],
							[
								6, 16, 20, 20
							],
							function(self, parent) {

								if (parent[0][3] > 0)
									self[0][1] = $.utils.clamp(self[0][1] + self[0][3], 0, self[0][2]);
								else if (parent[0][3] < 0)
									self[0][1] = $.utils.clamp(self[0][1] - self[0][3], -self[0][2]);
								else
									self[0][1] = self[0][1] ? $.utils.clamp(Math.abs(self[0][1]) - self[0][3], 0) * Math.abs(self[0][1]) / self[0][1] : 0;

								self[3][0] = self[0][0] + self[0][1];

							}

						]
					],
					[
						3, 0
					],
					[
						0, 1, 32, 46
					],
					function(self, parent, dt) {
						self[0][3] = parent[0][0];
						if(parent[0][5]) {
							self[3][1] += self[0][0] * self[0][2] * dt;

							if( ( self[0][0] > 0 && self[3][1] >= self[0][1] ) || ( self[0][0] < 0 && self[3][1] <= 1 ) )
								self[0][0] *= -1;

						}
					}
				]
			],
			[
				0, 0
			],
			[
				50, 200, 32, 52, 0
			],
			function(self, parent, dt) {
				if( $.input.isDown('a') || $.input.isDown('d') ) {
					if( $.input.isDown('a') )
						self[0][0] = -1;
					if( $.input.isDown('d') )
						self[0][0] = 1;

					self[0][1] = $.utils.clamp( self[0][1] + self[0][3], 0, self[0][3] );

				}

				if( $.input.isDown('w') && self[0][5]) {

					self[0][2] = self[0][4];

					self[0][5] = false;

				}

				if( self[0][5] ) {

					self[0][2] = 0;

					self[3][1] = Math.floor(self[3][1]);

					while( $.utils.isBoxColliding( self[3][0], self[3][1], self[3][2], 0 ) )
						self[3][1]++;


				}else {

					if( $.utils.isBoxColliding( self[3][0], self[3][1] + self[3][3], self[3][2], 1 ) ) {
						self[0][2] = 0;
						self[3][1] = Math.floor(self[3][1]);
						while( $.utils.isBoxColliding( self[3][0], self[3][1] + self[3][3], self[3][2], 1 ) )
							self[3][1]--;
					}else
						self[3][1] += self[0][2] * dt;

					self[0][2] -= self[0][6] * dt;

				}

				var nx = Math.round( self[3][0] + self[0][0] * self[0][1] * ( self[0][5] ? 1 : 1 ) * dt );//0.5

				if( $.utils.isBoxColliding(nx, self[3][1], self[3][2], self[3][3] - 1) ) {

					self[0][1] = 0;

				}else {

					self[3][0] = nx;

					self[0][1] -= self[0][7] * ( self[0][5] ? 3 : 1 ) * dt;//3
					self[0][1] = $.utils.clamp(self[0][1], 0);

				}

				if(!self[0][1])
					self[0][0] = 0;

				self[0][5] = $.utils.isBoxColliding(self[3][0], self[3][1] - 1, self[3][2], 1);
			}
		]
	],
	gfx: [
		/*

			Graphics:
				0: w
				1: h
				2: frames
				3: encoded image data
				4: post-processing function
				5: canvas
				6: ctx

		*/
		[ // blank
			1,
			1,
			1
			//,'X' //TODO: remove this before release (DEBUG CODE)
		],
		[ // sky
			1280,
			720,
			1,
			0,
			function(self) {
				var g = self[6].createLinearGradient(0, 0, 0, 720);
				g.addColorStop(0, $.colors['d']);
				g.addColorStop(1, $.colors['c']);
				self[6].fillStyle = g;
				self[6].fillRect(0, 0, 1280, 720);
				/*for(var i=0;i<1280*720;i++) {
					self[6].fillStyle = 'rgba(255, 255, 255, ' + ( Math.random() / 10 ) + ')';
					self[6].fillRect(i%1280, Math.floor(i/1280), 1, 1);
				}*/ //TODO: enable for textured background
			}
		],
		[ // world
			128,
			22,
			1,
			'b25.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a2.b14.a55.b20.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a3.b14.a57.b17.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a14.b3.a60.b14.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a15.b2.a92.b2.a.b2.a2.b12.a5.b7.a4.b.a92.b2.a.b2.a2.b12.a5.b4.a7.b.a65.b3.a27.b2.a2.b12.a4.b4.a7.b3.a94.b2.a2.b12.a4.b4.a4.b7.a68.b3.a27.b11.a4.b5.a6.b4.a101.b8.a3.b7.a5.b5.a72.b3.a30.b3.a3.b17.a111.b17.a67.b3.a7.b3.a32.b16.a62.b3.a34.b3.a2.b2.a7.b14.a83.b3.a12.b10.a8.b11.a98.b11.a108.b3.a3.b.a2.b12.a376.b8.a117.b11.a116.b12.a66'
		],
		[ // player body
			16,
			23,
			1,
			'a6.b4.a12.b.e2.b.a6.b3.a.b3.e2.b3.a.b4.e.b.a.b.e6.b.a.b.e.b2.e.b3.e6.b3.e.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b4.e10.b3.a2.b.e10.b.a4.b12.a2'
		],
		[ // player faces
			10,
			10,
			1,
			'a2.b6.a4.b6.a4.b6.a4.b6.a4.b6.a4.b6.a22.b2.a6.b4.a6.b2'
		]
	],
	colors: {
		'a': 'transparent',
		'b': '#232d32',
		'c': '#386265',
		'd': '#75a493',
		'e': '#c0dbb4',
		'X': '#00f'
	},
	loop: function() {
		window.rFA($.loop);

		$.ts = Date.now();
		if(!$.lts)
			$.lts = $.ts;
		$.dt = ($.ts - $.lts)/1000;
		$.lts = $.ts;

		$.update($.entities,$.entities[0]);
		$.render($.entities,$.entities[0], 0, 0);
	},
	update: function(e, p) {
		var i=e.length;
		while(i--){
			if(e[i][4])
				e[i][4]( e[i], p, $.dt );
			$.update( e[i][1], e[i] );
		}
	},
	render: function(e, p, x, y) {
		for(var i=0;i<e.length;i++){
			$.ctx.drawImage(
				$.gfx[ e[i][2][0] ][5],
				$.gfx[ e[i][2][0] ][0] * e[i][2][1],
				0,
				$.gfx[ e[i][2][0] ][0],
				$.gfx[ e[i][2][0] ][1],
				x + e[i][3][0],
				y + e[i][3][1],
				e[i][3][2],
				e[i][3][3]
			);
			$.render(e[i][1], e[i], x + e[i][3][0], y + e[i][3][1]);
		}
	},
	input: {
		keys: {
			"w": [87, 0],
			"a": [65, 0],
			"s": [83, 0],
			"d": [68, 0]
		},
		down: function(e) {
			for(var key in $.input.keys)
				if(e.which == $.input.keys[key][0])
					$.input.keys[key][1] = $.utils.clamp( ++$.input.keys[key][1], 0, 2 );
		},
		up:  function(e) {
			for(var key in $.input.keys)
				if(e.which == $.input.keys[key][0])
					$.input.keys[key][1] = 0;
		},
		isDown: function(k) {return $.input.keys[k][1];},
		isJustPressed: function(k) {return $.input.keys[k][1] === 1;}
	},
	utils: {
		decode: function(s) {
			s = s.split('.');
			var e, k, sn = '';
			for(e in s){
				k = ( isNaN(parseInt(s[e].substr(1), 10)) ? 1 : parseInt(s[e].substr(1), 10) );
				while(k--)
					sn+=s[e][0];
			}
			return sn;
		},
		clamp: function(a, b, c) {
			a = a < b ? b : a;
			return c ? ( a > c ? c : a ) : a;
		},
		isBoxColliding: function(x, y, w, h) {

			return $.utils.isPointColliding(x, y) || $.utils.isPointColliding(x + w, y) || $.utils.isPointColliding(x, y + h) || $.utils.isPointColliding(x + w, y + h);

		},
		isPointColliding: function(x, y) {
			var bs = 64;// block size
			var gy = Math.floor( y / bs );
			var gx = Math.floor( x / bs );

			if(gx < 0 || gy < 0 || gx >= $.gfx[3][3].length || gy >= $.gfx[3][3][0].length)
				return 0;

			return $.gfx[2][3][ gy ][ gx ];
		}
	}
};

window.onload = function() {
	$.init();
};

window['rFA'] = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();