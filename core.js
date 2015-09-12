var $ = {

    ts: null,
    lts: null,

    score: 100,
    last_score: 100,

    level: 4,
    exp: 100,
    exp_per_level: [10, 25, 50, 100],

    downgrade_check: 0,

    jump_level: 2,
    speed_level: 2,

    jump_levels: [1, 1.25, 1.5, 2],
    speed_levels: [1, 1.25, 1.5, 2],

    bs: 64,
    pr: 8,

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
        $.cnv.addEventListener('click', function(e) {
            $.input.click(
                e.pageX - $.cnv.offsetLeft,
                540 - e.pageY + $.cnv.offsetTop,
                $.entities,
                [],
                0,
                0,
                ''
            );
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
                2, 0, 0.25
            ],
            [
                0, 0, 16384, 2048, 1
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
                        251.25 * 64,
                        24.25 * 64,
                        32,
                        32,
                        1
                    ],
                    function(self, parent, dt) {
                        if($.utils.isBoxColliding($.entities[$.pr][3][0], $.entities[$.pr][3][1], $.entities[$.pr][3][2], $.entities[$.pr][3][3], 2, $.bs) === 9 &&
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
                ], // 3,0: coins
                //[ '3,0',,,, [251.25 * 64, 24.25 * 64] ],
                [ '3,0',,,, [240.25 * 64, 26.25 * 64] ],
                [ '3,0',,,, [239.25 * 64, 15.25 * 64] ],
                [ '3,0',,,, [233.25 * 64, 28.25 * 64] ],
                [ '3,0',,,, [229.25 * 64, 28.25 * 64] ],
                [ '3,0',,,, [223.25 * 64, 16.25 * 64] ],
                [ '3,0',,,, [221.25 * 64, 16.25 * 64] ],
                [ '3,0',,,, [205.25 * 64, 25.25 * 64] ],
                [ '3,0',,,, [202.25 * 64, 14.25 * 64] ],
                [ '3,0',,,, [200.25 * 64, 14.25 * 64] ],
                [ '3,0',,,, [193.25 * 64, 26.25 * 64] ],
                [ '3,0',,,, [179.25 * 64, 26.25 * 64] ],
                [ '3,0',,,, [172.25 * 64, 25.25 * 64] ],
                [ '3,0',,,, [160.25 * 64, 24.25 * 64] ],
                [ '3,0',,,, [147.25 * 64, 26.25 * 64] ],
                [ '3,0',,,, [134.25 * 64, 28.25 * 64] ],
                [ '3,0',,,, [118.25 * 64, 27.25 * 64] ],
                [ '3,0',,,, [116.25 * 64, 27.25 * 64] ],
                [ '3,0',,,, [124.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [122.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [120.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [118.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [116.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [102.25 * 64, 27.25 * 64] ],
                [ '3,0',,,, [100.25 * 64, 27.25 * 64] ],
                [ '3,0',,,, [93.25 * 64, 17.25 * 64] ],
                [ '3,0',,,, [79.25 * 64, 27.25 * 64] ],
                [ '3,0',,,, [71.25 * 64, 20.25 * 64] ],
                [ '3,0',,,, [13.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [12.25 * 64, 5.25 * 64] ]
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
            [,0,16,20,0,1],
            function(){},
            function(self) {
                self[3][2] *= self[3][5];
                self[3][3] *= self[3][5];
            }
        ], // 4: character
        [  // 5: text
            [
                '',
                function() {},
                ''
            ],
            [],
            [
                0,
                0,
                1
            ],
            [
                0, 0, 0, 0, 0, 1
            ],
            function(self, parent, dt) {

                self[0][1](self, dt);
                if(self[0][0] != self[0][2]) {
                    self[1].splice(0, self[0][2].length);
                    for(var i= 0,e;i<self[0][0].length;i++) {
                        e = $.utils.merge($.utils.clone($.entities[4]), [
                            ,,[,('abcdefghijklmnopqrstuvwxyz0123456789/:><-+?!').indexOf(self[0][0][i])], [($.entities[4][3][2] * self[3][5] + 2) * i,,,,,self[3][5]]
                        ]);
                        if(e[5]) e[5](e);
                        self[1].unshift(e);
                    }
                    self[3][2] = ($.entities[4][3][2] * self[3][5] + 2) * i;
                    self[3][3] =  $.entities[4][3][3] * self[3][5];

                    self[0][2] = self[0][0];

                }

            }
        ], // 5: text
        [  // 6: particle
            [0,0,0],
            [],
            [0,0],
            [0,0,0,0],
            function(self, parent, dt) {
                self[0][0] -= dt;
                self[3][0] += self[0][1] * dt;
                self[3][1] += self[0][2] * dt;
            }
        ], // 6: particle
        [  // 7: particle source
            [
                100,   // 0: particles per second
                2,     // 1: max lifespan
                2,     // 2: w
                2,     // 3: h
                ['b', 'c', 'd', 'e'], // 4: colors
                0.1,     // 5: min opacity
                0.5,     // 6: max opacity,
                -10,     // 7: min velocity x
                10,     // 8: max velocity x
                -10,     // 9: min velocity y
                10      // 10: max velocity y
            ],
            [],
            [0,0],
            [0,0,960,540],
            function(self, parent, dt) {
                var i = 0;
                for (; i < self[1].length; i++)
                    if (self[1][i][0][0] <= 0)
                        self[1].splice(i--, 1);

                i=Math.round(Math.random() * self[0][0] * dt);
                while(i--)
                    self[1].push(
                        $.utils.merge($.utils.clone($.entities[6]),[
                            [
                                Math.random() * self[0][1],
                                Math.random() * (self[0][8] - self[0][7]) + self[0][7],
                                Math.random() * (self[0][10] - self[0][9]) + self[0][9]
                            ],,
                            [
                                ({'b': 7, 'c': 8, 'd': 9, 'e': 8})[ self[0][4][ Math.floor(Math.random() * self[0][4].length) ] ],
                                0,
                                Math.random() * (self[0][6] - self[0][5]) + self[0][5]
                            ],[
                                Math.random() * self[3][2],
                                Math.random() * self[3][3],
                                self[0][2],
                                self[0][3]
                            ]
                        ])
                    );

            }
        ], // 7: particle source
        [  // 8: player container
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
                [ // 8,0: player body GFX
                    [
                        5, // 0: moving speed
                        6, // 1: max moving distance
                        1, // 2: moving direction (1 up, -1 down)
                        0, // 3: player direction
                        0, // 4: player vel_x normalized
                        1  // 5: animation direction
                    ],
                    [
                        [ // 8,0,0: player face GFX
                            [
                                6,    // 0: base x,
                                0,    // 1: delta x
                                22,   // 2: base y,
                                0,    // 3: delta y
                                5,    // 4: face move distance
                                0.5   // 5: face move speed
                            ],
                            [],
                            [
                                4, 0
                            ],
                            [
                                6, 22, 20, 12
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

                        ] // 8,0,0: player face GFX
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

                        /*self[2][1] = $.utils.clamp(self[2][1] + 0.1 * self[0][5], 0, 0.9);//TODO: replace 0 in 0.9 'with number of frames - 1'
                        if( self[2][1] == 0 || self[2][1] == 0.9 )//TODO: replace 0 in 0.9 with 'number of frames - 1'
                            self[0][5] *= -1;*/


                    }
                ] // 8,0: player body GFX
            ],
            [
                0, 0
            ],
            [
                15383, 200, 32, 52, 1
            ],
            function(self, parent, dt) {
                if( $.input.isPressed('a') || $.input.isPressed('d') ) {
                    if( $.input.isPressed('a') )
                        self[0][0] = -1;
                    if( $.input.isPressed('d') )
                        self[0][0] = 1;

                    self[0][1] = $.utils.clamp( self[0][1] + self[0][3], 0, self[0][3] );

                }

                if( $.input.isPressed('w') && self[0][5]) {

                    self[0][2] = self[0][4] * $.jump_levels[$.jump_level];

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

                    self[0][2] -= self[0][6] * ( $.input.isPressed('s') ? 4 : 1 ) * dt;
                    self[0][2] = $.utils.clamp(self[0][2], -self[0][4], self[0][4])

                }

                var nx = Math.round( self[3][0] + self[0][0] * self[0][1] * ( self[0][5] ? 1 : 0.75 ) * $.speed_levels[$.speed_level] * dt );//0.5

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
        ], // 8: player container
        [  // 9: score
            '5',
            [,
                function(self) {

                    if($.last_score != $.score) {
                        var diff = ($.score - $.last_score) + '';
                        $.last_score = $.score;
                        self[1].push(
                            $.utils.merge($.utils.clone($.entities[5]), [
                                [diff, function(self, dt) {
                                    self[2][2] -= 2 * dt;
                                    self[2][2] = $.utils.clamp(self[2][2], 0);
                                    self[3][1] += 40 * dt;
                                }],,,[($.entities[4][3][2] * self[3][5]+2)*(4 - diff.length), 5,,,0, self[3][5]]
                            ])
                        );
                    }

                    self[0][0] = ($.score < 1000 ? '0' : '') + ($.score < 100 ? '0' : '') + $.score + ' points';
                    self[3][0] = 960 - 10 - ($.entities[4][3][2] * self[3][5] + 2) * self[0][0].length;
                }
            ],,,
            [,10]
        ], // 9: score
        [  // 10: level
            '5',
            [,
                function(self) {
                    self[0][0] = 'level ' + $.level;
                }
            ],,,
            [10,40]
        ], // 10: level
        [  // 11: exp
            '5',
            [,
                function(self) {
                    self[0][0] = 'exp ' + $.exp + '/' + $.exp_per_level[$.level-1];
                }
            ],,,
            [10,10]
        ], // 11: exp
        [  // 12: disappearing blocks
            ,
            [
                [  // 10,0: block
                    [
                        1,
                        0,
                        1
                    ],
                    [
                        [
                            '7',
                            [
                                200,
                                0.2,
                                2,
                                2,
                                ['b','c','d','e'],
                                0.25,
                                0.5,
                                0,
                                0,
                                -150,
                                -150
                            ],,,
                            [0,0,,,0]
                        ]
                    ],
                    [
                        7,
                        0,
                        0.25
                    ],[],
                    function(self, parent, dt) {
                        self[0][0] -= 0.75 * dt;
                        if(self[0][0] > 1) {
                            $.gfx[2][3][ self[0][2] ][ self[0][1] ] = 0;
                            self[3][1] = (self[0][2]+1) * $.bs;
                            self[3][3] = 0;

                            self[1][0][0][0] = 0;

                        }else if(self[0][0] >= 0) {
                            $.gfx[2][3][ self[0][2] ][ self[0][1] ] = 1;
                            self[3][1] = ( self[0][2] + 1 - self[0][0] ) * $.bs;
                            self[3][3] = $.bs * self[0][0];

                            self[1][0][0][0] = 200;

                        }else {
                            self[0][0] = 2;
                        }

                        self[1][0][3][2] = self[3][2];
                        self[1][0][3][3] = 1;

                    },
                    function(self) {
                        self[3][0] = self[0][1] * $.bs;
                        self[3][1] = self[0][2] * $.bs;
                        self[3][2] = self[3][3] = $.bs;
                    }
                ]  // 10,0: block
            ],
            [0,0],
            [0,0,0,0,1]
        ], // 12: disappearing blocks
        [  // 13: stats gui
            [
                0,
                0,
                640//135
            ],
            [
                [
                    [
                        0,
                        0,
                        640
                    ],
                    [],
                    [
                        8,
                        0,
                        0.5
                    ],
                    [
                        10, 10, 460, 250
                    ]
                ],
                [
                    '5',
                    ['level down!'],,,
                    [130,190,,,,1.25]
                ],
                [
                    '5',
                    [
                        '',
                        function(self) {
                            self[0][0] = 'you have reached level ' + $.level;
                        }
                    ],,,
                    [125,160,,,,0.5]
                ],
                [
                    '5',
                    ['please downgrade'],,,
                    [130,90,,,,0.8]
                ],
                [
                    '5',
                    [
                        'jump',
                        function(self) {
                            if(!$.jump_level)
                                self[2][2] = 0.5
                        }
                    ],,,
                    [130,50,,,,0.8],,
                    function (self) {
                        console.log("INIT JUMP");
                        $.input.addClickListener(self);
                    },
                    function(self, parent) {
                        console.log('JUMP');
                        if($.downgrade_check) {
                            $.downgrade_check = 0;
                            $.jump_level--;
                            parent[0][2] = 640;
                            parent[0][0] = 1;
                        }
                    }
                ],
                [
                    '5',
                    ['or'],,,
                    [230,50,,,,0.8]
                ],
                [
                    '5',
                    [
                        'speed',
                        function(self) {
                            if(!$.speed_level)
                                self[2][2] = 0.5
                        }
                    ],,,
                    [290,50,,,,0.8],,
                    function (self) {
                        console.log("INIT SPEED");
                        $.input.addClickListener(self);
                    },
                    function(self, parent) {
                        console.log('SPEED');
                        if($.downgrade_check) {
                            $.downgrade_check = 0;
                            $.speed_level--;
                            parent[0][2] = 640;
                            parent[0][0] = 1;
                        }
                    }
                ]
            ],
            [
                7,
                0,
                0.5
            ],
            [
                240,
                640,
                480,
                270
            ],
            function(self, parent, dt) {
                if( self[0][0] ) {
                    if(self[3][1] <= self[0][2]) {
                        self[0][1] += 1500 * dt;
                        self[3][1] += self[0][1] * dt;
                    }else {
                        self[0][1] = 0;
                        self[3][1] = self[0][2]
                    }
                }else {
                    if(self[3][1] >= self[0][2]) {
                        self[0][1] -= 1500 * dt;
                        self[3][1] += self[0][1] * dt;
                    }else {
                        self[0][1] = 0;
                        self[3][1] = self[0][2]
                    }
                }
            }
        ], // 13: stats gui
        [  // 14: flags
            [],
            [
                [ // 14,0: flag
                    [
                        0
                    ],
                    [],
                    [
                        11,
                        0
                    ],
                    [
                        5 * 64,
                        4 * 64,
                        64,
                        64,
                        1
                    ],
                    function(self, parent, dt) {
                        if($.utils.isBoxColliding($.entities[$.pr][3][0], $.entities[$.pr][3][1], $.entities[$.pr][3][2], $.entities[$.pr][3][3], 2, $.bs) === 5 &&
                            Math.floor( ( $.entities[$.pr][3][0] + $.entities[$.pr][3][2] / 2 ) / $.bs ) == Math.floor(self[3][0] / $.bs) &&
                            self[0][0] != 1
                        ) {
                            self[0][0] = 1;
                        }

                        if(self[0][0] == 1) {
                            self[3][3] = $.utils.clamp(self[3][3] - 100 * dt, 0);
                        }

                    }
                ]  // 14,0: flag
                /*[ '3,0',,,, [8.25 * 64, 5.25 * 64] ],
                [ '3,0',,,, [11.25 * 64, 6.25 * 64] ]*/
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
        ], // 14: flags
        [  // 15: exp orbs
            [],
            [
                [ // 15,0: exp orb
                    [
                        0
                    ],
                    [],
                    [
                        12,
                        0
                    ],
                    [
                        237.25 * 64,
                        3.25 * 64,
                        32,
                        32,
                        1
                    ],
                    function(self, parent, dt) {
                        if($.utils.isBoxColliding($.entities[$.pr][3][0], $.entities[$.pr][3][1], $.entities[$.pr][3][2], $.entities[$.pr][3][3], 2, $.bs) === 7 &&
                            Math.floor( ( $.entities[$.pr][3][0] + $.entities[$.pr][3][2] / 2 ) / $.bs ) == Math.floor(self[3][0] / $.bs) &&
                            Math.floor( ( $.entities[$.pr][3][1] + $.entities[$.pr][3][3] / 2 ) / $.bs ) == Math.floor(self[3][1] / $.bs) && self[2][1] != 1
                        ) {
                            $.exp -= 5;
                            self[2][1] = 1;
                        }

                        if(self[2][1] != 1) {
                            self[0][0] += dt;
                            if(self[0][0] >= 0.75) {
                                self[0][0] = 0;
                                self[2][1] = self[2][1] ? 0 : -1;
                            }
                        }else {
                            if($.exp <= 0) {
                                $.exp = $.exp_per_level[--$.level];
                                $.downgrade_check = 1;
                                $.entities[13][0][0] = 0;
                                $.entities[13][0][2] = 135;
                            }
                        }

                    }
                ], // 15,0: exp orb
                //[ '15,0',,,, [237.25 * 64, 3.25 * 64] ],
                [ '15,0',,,, [223.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [220.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [217.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [221.25 * 64, 26.25 * 64] ],
                [ '15,0',,,, [194.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [191.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [190.25 * 64, 16.25 * 64] ],
                [ '15,0',,,, [186.25 * 64, 16.25 * 64] ],
                [ '15,0',,,, [167.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [165.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [155.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [152.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [146.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [143.25 * 64, 6.25 * 64] ],
                [ '15,0',,,, [117.25 * 64, 28.25 * 64] ],
                [ '15,0',,,, [101.25 * 64, 4.25 * 64] ],
                [ '15,0',,,, [101.25 * 64, 28.25 * 64] ],
                [ '15,0',,,, [73.25 * 64, 3.25 * 64] ],
                [ '15,0',,,, [69.25 * 64, 20.25 * 64] ],
                [ '15,0',,,, [64.25 * 64, 27.25 * 64] ],
                [ '15,0',,,, [61.25 * 64, 26.25 * 64] ],
                [ '15,0',,,, [57.25 * 64, 7.25 * 64] ],
                [ '15,0',,,, [56.25 * 64, 28.25 * 64] ],
                [ '15,0',,,, [37.25 * 64, 27.25 * 64] ],
                [ '15,0',,,, [33.25 * 64, 8.25 * 64] ],
                [ '15,0',,,, [33.25 * 64, 27.25 * 64] ],
                [ '15,0',,,, [27.25 * 64, 5.25 * 64] ],
                [ '15,0',,,, [17.25 * 64, 5.25 * 64] ],
                [ '15,0',,,, [15.25 * 64, 5.25 * 64] ],
                [ '15,0',,,, [14.25 * 64, 18.25 * 64] ],
                [ '15,0',,,, [13.25 * 64, 18.25 * 64] ],
                [ '15,0',,,, [12.25 * 64, 17.25 * 64] ],
                [ '15,0',,,, [11.25 * 64, 17.25 * 64] ],
                [ '15,0',,,, [10.25 * 64, 17.25 * 64] ],
                [ '15,0',,,, [9.25 * 64, 18.25 * 64] ],
                [ '15,0',,,, [8.25 * 64, 18.25 * 64] ]
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
        ]  // 15: exp orbs
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
                /*for(var i=0;i<960*540;i++) {
                    self[6].fillStyle = 'rgba(255, 255, 255, ' + ( Math.random() / 50 ) + ')';
                    self[6].fillRect(i%960, Math.floor(i/960), 2, 2);
                }*/ //TODO: enable for textured background
            }
        ], // 1: sky
        [  // 2: world
            256,
            32,
            1,
            'b78.f3.b2.f3.b2.f2.b6.f2.b31.f10.b33.f7.b64.f2.b32.f3.b43.f5.b3.a25.b29.a10.b22.f.b9.a9.b47.f.b10.a9.b28.a7.b36.f2.b3.a35.b24.a5.g.a2.g.a2.g.a2.b17.a6.b6.a4.g.a3.g.a11.b37.a3.b4.a15.b20.f2.b4.a11.b23.a3.b6.a4.b.a2.b3.a2.h.a18.b2.a9.b12.a26.b15.a8.b4.a22.b35.a12.h.a11.b18.a19.b13.f3.b.a3.b.a5.b5.a19.b.a9.b6.a5.h.a2.b8.a37.i.a52.b14.a34.b17.a.j2.a.h.a.h.a9.h.a4.b10.a15.b.a21.b3.a7.b10.a6.b5.a6.j.a.j.a.j.a.j.a.j.a24.i.a19.b2.a34.i.a45.b15.a25.b6.a10.b.a13.b.a5.b4.a3.b25.a40.h.a2.h.a2.i.a2.h.a2.h.a9.h.a.h.a23.h.a2.h.a10.i.a11.h.a2.h.a2.h.a29.b12.a27.b4.a10.b3.a4.h.a6.b2.a5.b33.a45.i.a22.b2.a31.i.a42.b2.a3.b12.a24.h.a3.b3.a9.b5.a9.b4.a3.b33.a46.i.a46.b14.a43.b13.a28.b.a10.b6.a5.b42.a47.i.a25.b2.a18.b18.a32.b2.a6.b17.a34.b52.a49.i.a44.b20.a39.b18.a31.b53.a50.i.a28.b2.a13.b22.a7.b2.a18.b2.a8.b23.a26.b53.a51.i.a42.b8.a3.b12.a6.b4.a27.b24.a23.b45.a2.b7.a52.i.a31.b2.a.g.a.g.a.g.a.g.a3.b4.a8.b10.a4.b5.a.g.a3.g.a3.g.a3.b3.a11.b27.a19.b43.a6.b5.a53.i.a50.j.a.j.a4.b9.a35.b29.a16.b18.a5.b21.a65.i.a59.b8.a22.j.a9.b15.a7.b13.a9.b17.a12.b11.a72.i.a36.h.a3.h.a2.b2.a2.b4.a9.b7.a4.j.a.j.a24.b9.a9.h3.a4.b14.a4.b17.a15.b6.a20.j.a55.i.a6.b4.a4.b8.a20.b12.a7.b7.a29.b9.a8.h2.a3.h2.a3.b14.a2.b17.a85.b6.a5.b5.a.b55.a4.b10.a25.b9.a20.b30.a71.b6.a5.b76.a5.b11.a3.b4.a10.b15.a26.b23.a20.h.a.j.a27.b2.a17.b92.a4.b18.a8.b16.a27.b21.a5.b6.a6.b.a31.b7.a12.b52.f.b29.a5.b8.a4.b41.a28.b19.a3.b17.a27.b13.a3.b48.a5.b4.a5.b11.a5.b8.a8.b5.a7.b33.a5.b2.a29.b16.a4.b19.a24.b30.a3.b.a3.b2.f2.b5.f2.b12.a3.b.a17.b6.a2.b.a8.b5.a10.b2.a12.b27.a9.b.a32.b11.a9.b9.a.b7.a30.b21.a13.b4.a10.b.a12.j.a16.b.a13.b3.a26.b3.a3.b9.f2.b8.a6.j.a37.b5.a15.b6.a4.b7.a2.b2.a2.b2.a.g.a.b2.a2.g.a2.b2.a10.b19.a15.b2.a36.j.a32.j.a21.b8.a56.i.a20.b.a4.h.a5.b2.a34.b13.a18.b.a12.j.a31.j.a13.j.a27.h.a7.b5.a6.j.a48.h.a.i.a.h.a26.h.a14.j.a20.j.a.j.a.b11.a.j.a.j.a28.b.a23.b.a26.b.a16.b3.a37.b.a35.i.a20.h.a44.h.a2.b11.a2.h.a7.b.a8.j.a4.b2.a4.b7.a7.b3.a8.b8.a19.b15.a2.b7.a8.j.a3.j.a19.b3.a35.i.a13.b3.a21.b.a9.b8.a12.b13.a8.b6.a8.b4.a2.b8.a6.b5.a3.b14.a2.b.a11.b28.a3.b.a14.b.a5.b2.a3.b5.a35.i.a10.b7.a6.b3.a.b.a2.b9.a5.b14.a2.b3.a.b17.a4.b11.a5.b16.a3.b28.a6.b37.a12.b17.a35.i.a8.b185.a2.b2.a5.b18'
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
            'a5.c6.a8.c2.a6.c2.a5.c.a10.c.a3.c.a12.c.a2.c.a12.c.a.c.a14.c2.a14.c2.a14.c2.a14.c2.a14.c2.a14.c.a.c.a12.c.a2.c.a12.c.a3.c.a10.c.a5.c2.a6.c2.a8.c6.a10.b6.a8.b4.d2.e2.b2.a5.b.c.b.d6.e2.b.a3.b.c.b.d9.e.b.a2.b.c.b.d9.e.b.a.b.c.b.d4.c2.b.d4.e.b2.c.b.d3.c.d3.b.d3.e.b2.c.b.d3.c.d7.e.b2.c.b.d3.c.d7.e.b2.c.b.d3.c.d3.b.d3.e.b2.c.b.d4.c2.b.d4.e.b.a.b.c.b.d9.e.b.a2.b.c.b.d9.e.b.a3.b.c.b.d6.e2.b.a5.b4.d2.e2.b2.a8.b6.a5'
        ], // 5: coin
        [  // 6: font
            4,
            5,
            44,
            'e.a2.e2.a2.e6.a2.e.a.e2.a.e3.a.e.a2.e4.a.e.a2.e4.a2.e4.a3.e.a3.e.a4.e6.a.e.a2.e2.a2.e2.a2.e4.a.e5.a3.e3.a.e.a3.e5.a3.e.a3.e3.a.e.a3.e4.a.e4.a2.e2.a.e3.a4.e4.a2.e2.a2.e6.a2.e2.a2.e.a.e.a3.e.a3.e.a3.e.a3.e.a3.e2.a.e.a2.e.a3.e.a3.e.a3.e2.a2.e2.a.e.a.e2.a2.e.a.e.a.e.a2.e4.a.e.a3.e.a3.e.a3.e.a3.e.a2.e2.a2.e2.a2.e6.a2.e2.a2.e2.a2.e2.a.e4.a.e2.a2.e.a.e2.a.e.a2.e2.a2.e2.a2.e.a.e2.a.e.a3.e.a3.e3.a.e.a2.e4.a2.e4.a.e3.a2.e2.a2.e.a.e2.a.e.a2.e2.a.e.a.e3.a.e.a2.e4.a.e3.a4.e.a.e2.a.e.a4.e3.a.e.a3.e.a3.e.a3.e.a2.e3.a.e5.a2.e2.a2.e2.a2.e2.a2.e.a.e2.a.e.a2.e2.a2.e2.a2.e2.a2.e.a.e2.a.e5.a2.e2.a2.e2.a2.e2.a2.e.a.e2.a2.e2.a.e.a2.e2.a2.e.a.e.a3.e.a2.e3.a.e.a.e.a.e.a.e.a.e4.a.e.a4.e.a4.e5.a.e2.a.e.a2.e2.a2.e2.a2.e.a.e2.a3.e.a3.e.a3.e.a2.e2.a3.e.a.e4.a.e.a4.e.a.e.a2.e.a.e2.a.e3.a4.e.a.e3.a3.e4.a4.e.a3.e.a.e4.a2.e2.a2.e4.a4.e4.a.e.a3.e4.a.e2.a.e.a2.e4.a.e.a4.e3.a.e.a3.e.a4.e.a4.e10.a2.e6.a2.e8.a4.e.a.e4.a2.e.a.e2.a.e.a4.e.a4.e.a4.e.a9.e.a7.e.a6.e.a4.e.a4.e.a2.e.a2.e.a6.e.a2.e.a2.e.a4.e.a4.e.a8.e3.a14.e.a2.e3.a2.e.a8.e.a7.e.a.e.a2.e.a.e2.a2.e.a7.e.a3.e.a3.e.a2'
        ], // 6: font
        [  // 7: block / particle color b
            1,
            1,
            1,
            'b'
        ], // 7: block / particle color b
        [  // 8: particle color c
            1,
            1,
            1,
            'c'
        ], // 8: particle color c
        [  // 9: particle color d
            1,
            1,
            1,
            'd'
        ], // 9: particle color d
        [  // 10: particle color e
            1,
            1,
            1,
            'e'
        ], // 10: particle color e
        [  // 11: flag
            32,
            32,
            1,
            'a14.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a30.b2.a4.f.d5.a20.b2.f2.d.f.d5.e.d.e3.a16.b2.f3.d.f.d5.e.d.e2.a16.b2.f2.d.f.d5.e.d.e3.a16.b2.f3.d.f.d5.e.d.e2.a16.b2.f2.d.f.d5.e.d.e3.a16.b2.f3.d.f.d5.e.d.e2.a16.b2.f2.d.f.d5.e.d.e3.a16.b2.f3.d.f.d5.e.d.e2.a16.b2.f2.d.f.d5.e.d.e3.a16.b2.f3.d.a6.e.d.e2.a66'
        ], // 11: flag
        [  // 12: exp
            16,
            16,
            2,
            'a7.c2.a13.c.a2.c.a11.c.a4.c.a9.c.a6.c.a7.c.a8.c.a5.c.a10.c.a3.c.a12.c.a.c.a14.c2.a14.c.a.c.a12.c.a3.c.a10.c.a5.c.a8.c.a7.c.a6.c.a9.c.a4.c.a11.c.a2.c.a13.c2.a14.c.e.a13.c.d2.e.a11.c.d4.e.a9.c.d6.e.a7.b.d8.e.a5.b.d4.c2.b.d3.e.a3.b.d4.c.d7.e.a.b.d5.c2.b.d6.e.b.d5.c.d8.e.a.b.d5.c2.b.d4.e.a3.b.d10.e.a5.b.d8.e.a7.c.d6.e.a9.c.d4.e.a11.c.d2.e.a13.c.e.a7'
        ]  // 12: exp
    ],
    colors: {
        'a': 'transparent',
        'b': '#232d32',
        'c': '#386265',
        'd': '#75a493',
        'e': '#c0dbb4',
        "f":"#ff00ff",
        "g":"#0000ff",
        "h":"#00ff00",
        "i":"#ffff00",
        "j":"#ff0000",
        'X': '#00f'
    },
    colors_indexes: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    loop: function() {
        window['rFA']($.loop);

        $.ts = Date.now();
        if(!$.lts || $.ts - $.lts > 1000/15) {
            $.input.reset();
            $.lts = $.ts;
        }
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
            $.ctx.save();
            if(e[i][2][2] !== undefined)
                $.ctx.globalAlpha = e[i][2][2];
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
            $.ctx.restore();
        }
    },
    input: {
        clickListeners: [],
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
        reset: function(e) {
            for(var key in $.input.keys)
                $.input.keys[key][1] = 0;
        },
        isPressed: function(k) {return $.input.keys[k][1];},
        isDown: function(k) {return $.input.keys[k][1] === 1;},
        addClickListener: function(el) {
            $.input.clickListeners.push(el);
        },
        click: function(mx, my, e, p, gx, gy, d) {
            for(var i=0;i<e.length;i++) {

                if($.input.clickListeners.indexOf(e[i]) >= 0 &&
                    gx + e[i][3][0] <= mx &&
                    gx + e[i][3][0] + e[i][3][2] >= mx &&
                    gy + e[i][3][1] <= my &&
                    gy + e[i][3][1] + e[i][3][3] >= my
                ) {
                    e[i][6](e[i], p);
                    //console.log(gx + ' x ' + gy);
                    //console.log(mx + ' x ' + my);
                }
                $.input.click(mx, my, e[i][1], e[i], gx + e[i][3][0], gy + e[i][3][1], d+','+i);

            }
        }
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
            for(var i=0;i< b.length;i++)
                if(b[i] !== undefined) {
                    if(typeof b[i] != 'object')
                        a[i] = b[i];
                    else
                        for (var j = 0; j < b[i].length; j++)
                            if (b[i][j] !== undefined)
                                a[i][j] = b[i][j];
                }
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