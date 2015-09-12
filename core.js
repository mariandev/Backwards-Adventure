var $ = {

    ts: null,
    lts: null,

    score: 100,

    bs: 64,
    pr: 6,

    init: function() {
        $.cnv = document.getElementById('c');
        $.ctx = $.cnv.getContext('2d');
        $.ctx['mozImageSmoothingEnabled'] = $.ctx['webkitImageSmoothingEnabled'] = $.ctx['msImageSmoothingEnabled'] = $.ctx['imageSmoothingEnabled'] = false;
        $.ctx.scale(1, -1);
        $.ctx.translate(0, -540);

        document.body.addEventListener('keydown', function(e) {
            $.input.down(e);
        });
        document.body.addEventListener('keyup', function(e) {
            $.input.up(e);
        });

        var i=$.gfx.length,j,m,x,y;
        while(i--) {
            $.gfx[i][5] = document.createElement("canvas");
            $.gfx[i][5].width = $.gfx[i][0] * $.gfx[i][2];
            $.gfx[i][5].height = $.gfx[i][1];
            $.gfx[i][6] = $.gfx[i][5].getContext("2d");

            if($.gfx[i][3]) {

                m = [];

                $.gfx[i][3] = $.utils.decode( $.gfx[i][3] );

                for(j=0;j < $.gfx[i][3].length;j++) {

                    x = j % $.gfx[i][0] + Math.floor( j / ( $.gfx[i][0] * $.gfx[i][1] ) ) * $.gfx[i][0];
                    y = Math.floor( ( j % ($.gfx[i][0] * $.gfx[i][1]) ) / $.gfx[i][0] );

                    if(!x) m[y] = [];

                    m[y][x] = $.colors_indexes.indexOf($.gfx[i][3][j]);

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
        var i = e.length, ce, cs, j;
        while(i--) {
            if(typeof e[i][0] == 'string') {
                cs = e[i][0].split(",");
                ce = $.entities[cs[0]];
                for(j=1;j<cs.length;j++)
                    ce = ce[1][cs[j]];
                e[i] = $.utils.merge($.utils.clone(ce), e[i].splice(1));
            }
            console.log(e[i]);
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
        [ // 0: blank entity
            [],
            [],
            [0,0],
            [0, 0]
        ], // 0: blank entity
        [ // 1: sky
            [],
            [],
            [
                1,
                0
            ],
            [
                0, 0, 960, 540
            ]
        ], // 1: sky
        [ // 2: world
            [],
            [],
            [
                2, 0
            ],
            [
                0, 0, 8192, 1408, 1
            ]
        ], // 2: world
        [ // 3: coins
            [],
            [
                [ // 3,0: coin
                    [
                        0
                    ],
                    [],
                    [
                        5,
                        0
                    ],
                    [
                        5.25 * 64,
                        4.25 * 64,
                        32,
                        32,
                        1
                    ],
                    function(self, parent, dt) {
                        if($.utils.isBoxColliding($.entities[$.pr][3][0], $.entities[$.pr][3][1], $.entities[$.pr][3][2], $.entities[$.pr][3][3], 2, $.bs) === 5 &&
                            Math.floor( ( $.entities[$.pr][3][0] + $.entities[$.pr][3][2] / 2 ) / $.bs ) == Math.floor(self[3][0] / $.bs) &&
                            Math.floor( ( $.entities[$.pr][3][1] + $.entities[$.pr][3][3] / 2 ) / $.bs ) == Math.floor(self[3][1] / $.bs) && self[2][1] != 1
                        ) {
                            $.score -= 10;
                            self[2][1] = 1;
                        }

                        if(self[2][1] != 1) {
                            self[0][0] += dt;
                            if(self[0][0] >= 0.75) {
                                self[0][0] = 0;
                                self[2][1] = self[2][1] ? 0 : -1;
                            }
                        }

                    }
                ], // 4,0: coins
                [ '3,0',,,, [8.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [11.25 * 64, 6.25 * 64] ]
            ],
            [
                0,
                0
            ],
            [
                0,
                0,
                0,
                0
            ],
            function(self, parent, dt) {}
        ], // 3: coins
        [  // 4: character
            [],
            [],
            [
                6,
                -1
            ],
            [,0,8,10]
        ], // 4: character
        [  // 5: text
            [
                '',
                function(self) {return self[0][0];},
                function() {},
                ''
            ],
            [],
            [
                0,
                0
            ],
            [
                0, 0, 0, 0
            ],
            function(self, parent, dt) {

                self[0][0] = self[0][1](self);
                if(self[0][0] != self[0][3]) {
                    self[1] = [];
                    for(var i=0;i<self[0][0].length;i++)
                        self[1][i] = $.utils.merge($.utils.clone($.entities[4]), [
                            ,,[,('abcdefghijklmnopqrstuvwxyz0123456789/:><').indexOf(self[0][0][i])], [(8 + 1) * i]
                        ]);

                    self[0][3] = self[0][0];

                }

            }
        ], // 5: text
        [  // 6: player container
            [
                1,    //0: dir
                0,    //1: vel_x
                0,    //2: vel_y
                250,  //3: max_vel_x
                400,  //4: max_vel_y
                0,    //5: on_ground
                500,  //6: g
                500,  //7: friction
                0     //8: frame float
            ],
            [
                [ // 6,0: player body GFX
                    [
                        5, // 0: moving speed
                        6, // 1: max moving distance
                        1, // 2: moving direction (1 up, -1 down)
                        0, // 3: player direction
                        0, // 4: player vel_x normalized
                        1  // 5: animation direction
                    ],
                    [
                        [ // 6,0,0: player face GFX
                            [
                                6,    // 0: base x,
                                0,    // 1: delta x
                                24,   // 2: base y,
                                0,    // 3: delta y
                                5,    // 4: face move distance
                                0.5   // 5: face move speed
                            ],
                            [],
                            [
                                4, 0
                            ],
                            [
                                6, 24, 20, 12
                            ],
                            function(self, parent) {

                                if (parent[0][3] > 0)
                                    self[0][1] = $.utils.clamp(self[0][1] + self[0][5], 0, self[0][4]);
                                else if (parent[0][3] < 0)
                                    self[0][1] = $.utils.clamp(self[0][1] - self[0][5], -self[0][4]);
                                else
                                    self[0][1] = self[0][1] ? $.utils.clamp(Math.abs(self[0][1]) - self[0][5], 0) * Math.abs(self[0][1]) / self[0][1] : 0;

                                self[3][0] = self[0][0] + self[0][1];

                                if (parent[0][4] > 0)
                                    self[0][3] = $.utils.clamp(self[0][3] + self[0][5], 0, self[0][4]);
                                else if (parent[0][4] < 0)
                                    self[0][3] = $.utils.clamp(self[0][3] - self[0][5], -self[0][4]);
                                else
                                    self[0][3] = self[0][3] ? $.utils.clamp(Math.abs(self[0][3]) - self[0][5], 0) * Math.abs(self[0][3]) / self[0][3] : 0;

                                self[3][1] = self[0][2] + self[0][3];

                            }

                        ] // 6,0,0: player face GFX
                    ],
                    [
                        3, 0
                    ],
                    [
                        0, 1, 32, 46
                    ],
                    function(self, parent, dt) {
                        self[0][3] = parent[0][0];
                        self[0][4] = parent[0][2] ? Math.abs(parent[0][2]) / parent[0][2] : 0;
                        if(parent[0][5]) {
                            self[3][1] += self[0][0] * self[0][2] * dt;

                            if( ( self[0][0] > 0 && self[3][1] >= self[0][1] ) || ( self[0][0] < 0 && self[3][1] <= 1 ) )
                                self[0][0] *= -1;

                        }

                        self[2][1] = $.utils.clamp(self[2][1] + 0.1 * self[0][5], 0, 0.9);//TODO: replace 0 in 0.9 'with number of frames - 1'
                        if( self[2][1] == 0 || self[2][1] == 0.9 )//TODO: replace 0 in 0.9 with 'number of frames - 1'
                            self[0][5] *= -1;


                    }
                ], // 6,0: player body GFX
                [  // 6,1: score
                    '5',
                    [
                        ,
                        function() {return 'score: ' + $.score;}
                    ],,,
                    [-70,55]
                ]  // 6,1: score
            ],
            [
                0, 0
            ],
            [
                50, 200, 32, 52, 1
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

                    while( $.utils.isBoxColliding( self[3][0], self[3][1], self[3][2], 0, 2, $.bs ) === 1 )
                        self[3][1]++;


                }else {

                    if( $.utils.isBoxColliding( self[3][0], self[3][1] + self[3][3], self[3][2], 1, 2, $.bs ) === 1 ) {
                        self[0][2] = 0;
                        self[3][1] = Math.floor(self[3][1]);
                        while( $.utils.isBoxColliding( self[3][0], self[3][1] + self[3][3], self[3][2], 1, 2, $.bs ) === 1 )
                            self[3][1]--;
                    }else
                        self[3][1] += self[0][2] * dt;

                    self[0][2] -= self[0][6] * dt;

                }

                var nx = Math.round( self[3][0] + self[0][0] * self[0][1] * ( self[0][5] ? 1 : 0.75 ) * dt );//0.5

                if( $.utils.isBoxColliding(nx, self[3][1], self[3][2], self[3][3] - 1, 2, $.bs) === 1 ) {

                    self[0][1] = 0;

                }else {

                    self[3][0] = nx;

                    self[0][1] -= self[0][7] * ( self[0][5] ? 3 : 1 ) * dt;//3
                    self[0][1] = $.utils.clamp(self[0][1], 0);

                }

                if(!self[0][1])
                    self[0][0] = 0;

                self[0][5] = $.utils.isBoxColliding(self[3][0], self[3][1] - 1, self[3][2], 1, 2, $.bs) === 1 ? 1 : 0;
            }
        ]  // 6: player container

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
        [ // 0: blank gfx
            1,
            1,
            1
            //,'X' //TODO: remove this before release (DEBUG CODE)
        ], // 0: blank gfx
        [  // 1: sky
            960,
            540,
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
        ], // 1: sky
        [  // 2: world
            128,
            22,
            1,
            'b25.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a2.b14.a55.b20.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a3.b14.a57.b17.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a14.b3.a60.b14.a4.b5.a4.b3.a2.b2.a.b2.a2.b12.a15.b2.a54.f.a37.b2.a.b2.a2.b12.a5.b7.a4.b.a57.f.a6.b2.a26.b2.a.b2.a2.b12.a5.b4.a7.b.a60.f.a5.b2.a27.b2.a2.b12.a4.b4.a7.b3.a94.b2.a2.b12.a4.b4.a4.b7.a68.b3.a27.b11.a4.b5.a6.b4.a101.b8.a3.b7.a5.b5.a72.b3.a30.b3.a3.b17.a111.b17.a67.b3.a7.b3.a32.b16.a62.b3.a34.b3.a2.b2.a7.b14.a83.b3.a12.b10.a8.b11.a98.b11.a108.b3.a3.b.a2.b12.a376.b8.a117.b11.a116.b12.a66'
        ], // 2: world
        [  // 3: player body
            16,
            23,
            3,
            'a6.b4.a12.b.e2.b.a6.b3.a.b3.e2.b3.a.b4.e.b.a.b.e6.b.a.b.e.b2.e.b3.e6.b3.e.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b4.e10.b3.a2.b.e10.b.a4.b12.a18.b3.a3.b4.a3.b4.e.b.a3.b.e2.b.a3.b.e.b2.e.b.a.b3.e2.b3.a.b.e.b2.e.b3.e6.b3.e.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b4.e10.b3.a2.b.e10.b.a4.b12.a18.b4.a8.b5.e2.b.a2.b4.a2.b.e2.b2.e2.b.a2.b.e2.b.a2.b.e2.b2.e2.b4.e2.b4.e2.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b2.e14.b4.e10.b3.a2.b.e10.b.a4.b12.a2'
        ], // 3: player body
        [  // 4: player faces
            10,
            6,
            1,
            'a4.b2.a8.b2.a24.b4.a2.b8.a2.b4'
        ], // 4: player faces
        [  // 5: coin
            16,
            16,
            2,
            'a5.b4.c2.a8.b2.a6.b2.a5.c.a10.c.a3.b.a12.b.a2.b.a12.b.a.c.a14.c2.a14.c.b.a14.b2.a14.b.c.a14.c2.a14.c.a.b.a12.b.a2.b.a12.b.a3.c.a10.c.a5.b2.a6.b2.a8.c2.b2.c2.a10.c6.a8.c4.d2.e2.c2.a5.c.b.c.d6.e2.c.a3.c.b.c.d9.e.c.a2.c.b.c.d9.e.c.a.c.b.c.d4.b2.c.d4.e.c2.b.c.d3.b.d3.c.d3.e.c2.b.c.d3.b.d7.e.c2.b.c.d3.b.d7.e.c2.b.c.d3.b.d3.c.d3.e.c2.b.c.d4.b2.c.d4.e.c.a.c.b.c.d9.e.c.a2.c.b.c.d9.e.c.a3.c.b.c.d6.e2.c.a5.c4.d2.e2.c2.a8.c6.a5'
        ], // 5: coin
        [  // 6: font
            4,
            5,
            40,
            'e.a2.e2.a2.e6.a2.e.a.e2.a.e3.a.e.a2.e4.a.e.a2.e4.a2.e4.a3.e.a3.e.a4.e6.a.e.a2.e2.a2.e2.a2.e4.a.e5.a3.e3.a.e.a3.e5.a3.e.a3.e3.a.e.a3.e4.a.e4.a2.e2.a.e3.a4.e4.a2.e2.a2.e6.a2.e2.a2.e.a.e.a3.e.a3.e.a3.e.a3.e.a3.e2.a.e.a2.e.a3.e.a3.e.a3.e2.a2.e2.a.e.a.e2.a2.e.a.e.a.e.a2.e4.a.e.a3.e.a3.e.a3.e.a3.e.a2.e2.a2.e2.a2.e6.a2.e2.a2.e2.a2.e2.a.e4.a.e2.a2.e.a.e2.a.e.a2.e2.a2.e2.a2.e.a.e2.a.e.a3.e.a3.e3.a.e.a2.e4.a2.e4.a.e3.a2.e2.a2.e.a.e2.a.e.a2.e2.a.e.a.e3.a.e.a2.e4.a.e3.a4.e.a.e2.a.e.a4.e3.a.e.a3.e.a3.e.a3.e.a2.e3.a.e5.a2.e2.a2.e2.a2.e2.a2.e.a.e2.a.e.a2.e2.a2.e2.a2.e2.a2.e.a.e2.a.e5.a2.e2.a2.e2.a2.e2.a2.e.a.e2.a2.e2.a.e.a2.e2.a2.e.a.e.a3.e.a2.e3.a.e.a.e.a.e.a.e.a.e4.a.e.a4.e.a4.e5.a.e2.a.e.a2.e2.a2.e2.a2.e.a.e2.a2.e.a3.e.a3.e.a2.e2.a3.e.a2.e4.a.e.a4.e.a.e.a2.e.a.e2.a.e3.a4.e.a.e3.a3.e4.a4.e.a3.e.a.e4.a2.e2.a2.e4.a4.e4.a.e.a3.e4.a.e2.a.e.a2.e4.a.e.a4.e3.a.e.a3.e.a4.e.a4.e10.a2.e6.a2.e8.a4.e.a.e4.a2.e.a.e2.a.e.a4.e.a4.e.a4.e.a9.e.a7.e.a6.e.a4.e.a4.e.a2.e.a2.e.a6.e.a2.e.a2.e.a4.e.a4.e1'
        ]  // 6: font
    ],
    colors: {
        'a': 'transparent',
        'b': '#232d32',
        'c': '#386265',
        'd': '#75a493',
        'e': '#c0dbb4',
        //'f': '#f00', // coins helper
        'X': '#00f'
    },
    colors_indexes: ['a', 'b', 'c', 'd', 'e', 'f'],
    loop: function() {
        window['rFA']($.loop);

        $.ts = Date.now();
        if(!$.lts)
            $.lts = $.ts;
        $.dt = ($.ts - $.lts)/1000;
        $.lts = $.ts;

        $.sx = Math.round(-$.entities[$.pr][3][0] + 960 / 2);
        $.sy = Math.round(-$.entities[$.pr][3][1] + 540 / 2);

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

            var cx = x + e[i][3][0] + $.sx * ( e[i][3][4] || 0 ),
                cy = y + e[i][3][1] + $.sy * ( e[i][3][4] || 0 );

            $.ctx.drawImage(
                $.gfx[ e[i][2][0] ][5],
                $.gfx[ e[i][2][0] ][0] * Math.floor(e[i][2][1]),
                0,
                $.gfx[ e[i][2][0] ][0],
                $.gfx[ e[i][2][0] ][1],
                cx,
                cy,
                e[i][3][2],
                e[i][3][3]
            );
            $.render(e[i][1], e[i], cx, cy);
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
        isBoxColliding: function(x, y, w, h, g, s) {

            return $.utils.isPointColliding(x, y, g, s) || $.utils.isPointColliding(x + w, y, g, s) || $.utils.isPointColliding(x, y + h, g, s) || $.utils.isPointColliding(x + w, y + h, g, s) || $.utils.isPointColliding(x + w / 2, y + h / 2, g, s);

        },
        isPointColliding: function(x, y, g, s) {
            var gy = Math.floor( y / s );
            var gx = Math.floor( x / s );

            if(gx < 0 || gy < 0 || gy >= $.gfx[g][3].length || gx >= $.gfx[g][3][0].length)
                return 0;

            return $.gfx[g][3][ gy ][ gx ];
        },
        clone: function( src ) {
            function mixin(dest, source, copyFunc) {
                var name, s, i, empty = {};
                for(name in source){
                    // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
                    // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
                    // don't overwrite it with the toString() method that source inherited from Object.prototype
                    s = source[name];
                    if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
                        dest[name] = copyFunc ? copyFunc(s) : s;
                    }
                }
                return dest;
            }

            if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
                // null, undefined, any non-object, or function
                return src;	// anything
            }
            if(src.nodeType && "cloneNode" in src){
                // DOM Node
                return src.cloneNode(true); // Node
            }
            if(src instanceof Date){
                // Date
                return new Date(src.getTime());	// Date
            }
            if(src instanceof RegExp){
                // RegExp
                return new RegExp(src);   // RegExp
            }
            var r, i, l;
            if(src instanceof Array){
                // array
                r = [];
                for(i = 0, l = src.length; i < l; ++i){
                    if(i in src){
                        r.push($.utils.clone(src[i]));
                    }
                }
                // we don't clone functions for performance reasons
                //		}else if(d.isFunction(src)){
                //			// function
                //			r = function(){ return src.apply(this, arguments); };
            }else{
                // generic objects
                r = src.constructor ? new src.constructor() : {};
            }
            return mixin(r, src, $.utils.clone);
        },
        merge: function(a, b) {
            for(var i=0;i<4;i++)
                if(b[i] !== undefined)
                    for (var j = 0; j < b[i].length; j++)
                        if (b[i][j] !== undefined)
                            a[i][j] = b[i][j];
            return a;
        }
    }
};

window.onload = $.init;

window['rFA'] = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();