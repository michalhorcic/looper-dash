{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 8,
      "minor": 6,
      "revision": 5,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [
      100,
      100,
      940,
      650
    ],
    "openinpresentation": 1,
    "default_fontname": "Arial",
    "default_fontsize": 13.0,
    "boxes": [
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "patching_rect": [
            20,
            10,
            650,
            25
          ],
          "text": "MULTI LOOPER  /  AUTO DASHBOARD  /  0.12 beta",
          "fontsize": 18.0,
          "presentation": 1,
          "presentation_rect": [
            12,
            8,
            560,
            24
          ]
        }
      },
      {
        "box": {
          "id": "note",
          "maxclass": "comment",
          "patching_rect": [
            20,
            45,
            800,
            35
          ],
          "text": "Automatically finds all Loopers.",
          "presentation": 1,
          "presentation_rect": [
            12,
            36,
            560,
            36
          ]
        }
      },
      {
        "box": {
          "id": "open",
          "maxclass": "textbutton",
          "patching_rect": [
            12,
            100,
            160,
            30
          ],
          "text": "OPEN DASHBOARD",
          "numinlets": 1,
          "numoutlets": 3,
          "outlettype": [
            "",
            "int",
            ""
          ],
          "texton": "OPEN DASHBOARD",
          "mode": 0,
          "parameter_enable": 0,
          "presentation": 1,
          "presentation_rect": [
            12,
            80,
            160,
            32
          ]
        }
      },
      {
        "box": {
          "id": "scan",
          "maxclass": "textbutton",
          "patching_rect": [
            184,
            100,
            90,
            30
          ],
          "text": "RESCAN",
          "numinlets": 1,
          "numoutlets": 3,
          "outlettype": [
            "",
            "int",
            ""
          ],
          "texton": "RESCAN",
          "mode": 0,
          "parameter_enable": 0,
          "presentation": 1,
          "presentation_rect": [
            184,
            80,
            90,
            32
          ]
        }
      },
      {
        "box": {
          "id": "report",
          "maxclass": "textbutton",
          "patching_rect": [
            286,
            100,
            150,
            30
          ],
          "text": "EXPORT REPORT",
          "numinlets": 1,
          "numoutlets": 3,
          "outlettype": [
            "",
            "int",
            ""
          ],
          "texton": "EXPORT REPORT",
          "mode": 0,
          "parameter_enable": 0,
          "presentation": 1,
          "presentation_rect": [
            286,
            80,
            150,
            32
          ]
        }
      },
      {
        "box": {
          "id": "ledopen",
          "maxclass": "textbutton",
          "patching_rect": [
            448,
            100,
            120,
            30
          ],
          "text": "LED TEST",
          "numinlets": 1,
          "numoutlets": 3,
          "outlettype": [
            "",
            "int",
            ""
          ],
          "texton": "LED TEST",
          "mode": 0,
          "parameter_enable": 0,
          "presentation": 1,
          "presentation_rect": [
            448,
            80,
            120,
            32
          ]
        }
      },
      {
        "box": {
          "id": "warning",
          "maxclass": "comment",
          "patching_rect": [
            20,
            150,
            800,
            38
          ],
          "text": "Transport reference. Live API read only. Optional LED test.",
          "presentation": 1,
          "presentation_rect": [
            12,
            122,
            420,
            40
          ]
        }
      },
      {
        "box": {
          "id": "setupopen",
          "maxclass": "textbutton",
          "patching_rect": [
            448,
            150,
            120,
            26
          ],
          "text": "LED SETUP",
          "texton": "LED SETUP",
          "mode": 0,
          "parameter_enable": 0,
          "numoutlets": 3,
          "outlettype": [
            "bang",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            448,
            122,
            120,
            26
          ]
        }
      },
      {
        "box": {
          "id": "setupopenmsg",
          "maxclass": "message",
          "patching_rect": [
            150,
            650,
            90,
            22
          ],
          "text": "setupfront"
        }
      },
      {
        "box": {
          "id": "this",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            220,
            100,
            22
          ],
          "text": "live.thisdevice",
          "numinlets": 1,
          "numoutlets": 3,
          "outlettype": [
            "bang",
            "int",
            "int"
          ]
        }
      },
      {
        "box": {
          "id": "init",
          "maxclass": "message",
          "patching_rect": [
            20,
            260,
            40,
            22
          ],
          "text": "init"
        }
      },
      {
        "box": {
          "id": "trig",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            300,
            55,
            22
          ],
          "text": "t b b"
        }
      },
      {
        "box": {
          "id": "openmsg",
          "maxclass": "message",
          "patching_rect": [
            20,
            340,
            45,
            22
          ],
          "text": "open"
        }
      },
      {
        "box": {
          "id": "front",
          "maxclass": "message",
          "patching_rect": [
            100,
            340,
            45,
            22
          ],
          "text": "front"
        }
      },
      {
        "box": {
          "id": "pc",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            380,
            65,
            22
          ],
          "text": "pcontrol"
        }
      },
      {
        "box": {
          "id": "scanmsg",
          "maxclass": "message",
          "patching_rect": [
            230,
            220,
            45,
            22
          ],
          "text": "scan"
        }
      },
      {
        "box": {
          "id": "dlg",
          "maxclass": "newobj",
          "patching_rect": [
            620,
            220,
            90,
            22
          ],
          "text": "savedialog"
        }
      },
      {
        "box": {
          "id": "export",
          "maxclass": "newobj",
          "patching_rect": [
            620,
            260,
            165,
            22
          ],
          "text": "prepend export_report"
        }
      },
      {
        "box": {
          "id": "defer",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            340,
            70,
            22
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "js",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            385,
            160,
            22
          ],
          "text": "js mld2_core.js",
          "numinlets": 1,
          "numoutlets": 1,
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "ui_route",
          "maxclass": "newobj",
          "patching_rect": [
            520,
            445,
            100,
            22
          ],
          "text": "route report"
        }
      },
      {
        "box": {
          "id": "audioin",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            530,
            70,
            22
          ],
          "text": "plugin~",
          "numinlets": 1,
          "numoutlets": 2,
          "outlettype": [
            "signal",
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "audioout",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            580,
            70,
            22
          ],
          "text": "plugout~",
          "numinlets": 2,
          "numoutlets": 0
        }
      },
      {
        "box": {
          "id": "window",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            445,
            130,
            22
          ],
          "text": "p Dashboard",
          "patcher": {
            "fileversion": 1,
            "appversion": {
              "major": 8,
              "minor": 6,
              "revision": 5,
              "architecture": "x64",
              "modernui": 1
            },
            "classnamespace": "box",
            "rect": [
              110,
              90,
              1040,
              780
            ],
            "openinpresentation": 1,
            "default_fontname": "Arial",
            "default_fontsize": 13.0,
            "boxes": [
              {
                "box": {
                  "id": "in",
                  "maxclass": "inlet",
                  "patching_rect": [
                    20,
                    820,
                    25,
                    25
                  ]
                }
              },
              {
                "box": {
                  "id": "route",
                  "maxclass": "newobj",
                  "patching_rect": [
                    60,
                    820,
                    90,
                    22
                  ],
                  "text": "route front"
                }
              },
              {
                "box": {
                  "id": "frontmsg",
                  "maxclass": "message",
                  "patching_rect": [
                    170,
                    820,
                    220,
                    22
                  ],
                  "text": "front, topmost 1, presentation 1"
                }
              },
              {
                "box": {
                  "id": "tp",
                  "maxclass": "newobj",
                  "patching_rect": [
                    410,
                    820,
                    85,
                    22
                  ],
                  "text": "thispatcher"
                }
              },
              {
                "box": {
                  "id": "ui",
                  "maxclass": "jsui",
                  "patching_rect": [
                    0,
                    0,
                    1040,
                    780
                  ],
                  "filename": "mld2_ui.js",
                  "numinlets": 1,
                  "numoutlets": 1,
                  "outlettype": [
                    ""
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    0,
                    0,
                    1040,
                    780
                  ],
                  "parameter_enable": 0
                }
              },
              {
                "box": {
                  "id": "out",
                  "maxclass": "outlet",
                  "patching_rect": [
                    530,
                    820,
                    25,
                    25
                  ]
                }
              }
            ],
            "lines": [
              {
                "patchline": {
                  "source": [
                    "in",
                    0
                  ],
                  "destination": [
                    "route",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "route",
                    0
                  ],
                  "destination": [
                    "frontmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "frontmsg",
                    0
                  ],
                  "destination": [
                    "tp",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "route",
                    1
                  ],
                  "destination": [
                    "ui",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ui",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              }
            ]
          },
          "numinlets": 1,
          "numoutlets": 1,
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "ledwindow",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            650,
            150,
            22
          ],
          "text": "p LED_Feedback",
          "patcher": {
            "fileversion": 1,
            "appversion": {
              "major": 8,
              "minor": 6,
              "revision": 5,
              "architecture": "x64",
              "modernui": 1
            },
            "classnamespace": "box",
            "rect": [
              140,
              120,
              580,
              300
            ],
            "openinpresentation": 1,
            "default_fontname": "Arial",
            "default_fontsize": 13.0,
            "boxes": [
              {
                "box": {
                  "id": "in",
                  "maxclass": "inlet",
                  "patching_rect": [
                    20,
                    950,
                    25,
                    25
                  ]
                }
              },
              {
                "box": {
                  "id": "commands",
                  "maxclass": "newobj",
                  "patching_rect": [
                    70,
                    950,
                    95,
                    22
                  ],
                  "text": "route front init setupfront"
                }
              },
              {
                "box": {
                  "id": "frontmsg",
                  "maxclass": "message",
                  "patching_rect": [
                    190,
                    950,
                    170,
                    22
                  ],
                  "text": "front, topmost 1, presentation 1"
                }
              },
              {
                "box": {
                  "id": "window",
                  "maxclass": "newobj",
                  "patching_rect": [
                    390,
                    950,
                    85,
                    22
                  ],
                  "text": "thispatcher"
                }
              },
              {
                "box": {
                  "id": "ledtitle",
                  "maxclass": "comment",
                  "patching_rect": [
                    20,
                    650,
                    550,
                    22
                  ],
                  "text": "LCXL3 / LOOPER A / CUSTOM MODE 2 / LED EXPERIMENT",
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    12,
                    550,
                    22
                  ],
                  "fontsize": 12.0
                }
              },
              {
                "box": {
                  "id": "ledport",
                  "maxclass": "umenu",
                  "patching_rect": [
                    20,
                    680,
                    340,
                    22
                  ],
                  "items": [
                    "Select LCXL3 output"
                  ],
                  "parameter_enable": 0,
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    38,
                    340,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "ledchannel",
                  "maxclass": "umenu",
                  "patching_rect": [
                    370,
                    680,
                    190,
                    22
                  ],
                  "items": [
                    "Select protocol channel"
                  ],
                  "parameter_enable": 0,
                  "presentation": 1,
                  "presentation_rect": [
                    364,
                    38,
                    204,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "ledarm",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    12,
                    720,
                    112,
                    26
                  ],
                  "text": "LED OUTPUT",
                  "texton": "LED OUTPUT ON",
                  "mode": 1,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "int",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    70,
                    112,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "ledfollow",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    130,
                    720,
                    96,
                    26
                  ],
                  "text": "FOLLOW A",
                  "texton": "FOLLOW A ON",
                  "mode": 1,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "int",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    130,
                    70,
                    96,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "white",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    238,
                    720,
                    72,
                    26
                  ],
                  "text": "WHITE",
                  "texton": "WHITE",
                  "mode": 0,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "bang",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    238,
                    70,
                    72,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "green",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    316,
                    720,
                    72,
                    26
                  ],
                  "text": "GREEN",
                  "texton": "GREEN",
                  "mode": 0,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "bang",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    316,
                    70,
                    72,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "red",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    394,
                    720,
                    72,
                    26
                  ],
                  "text": "RED",
                  "texton": "RED",
                  "mode": 0,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "bang",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    394,
                    70,
                    72,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "orange",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    472,
                    720,
                    96,
                    26
                  ],
                  "text": "ORANGE",
                  "texton": "ORANGE",
                  "mode": 0,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "bang",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    472,
                    70,
                    96,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "ledstatus",
                  "maxclass": "comment",
                  "patching_rect": [
                    20,
                    760,
                    550,
                    50
                  ],
                  "text": "LED output OFF. Select the DAW output and channel 1; enable LED OUTPUT to test.",
                  "fontsize": 11.0,
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    106,
                    556,
                    50
                  ]
                }
              },
              {
                "box": {
                  "id": "led",
                  "maxclass": "newobj",
                  "patching_rect": [
                    20,
                    830,
                    150,
                    22
                  ],
                  "text": "js mld2_led.js",
                  "varname": "ledTestEngine",
                  "numinlets": 1,
                  "numoutlets": 8,
                  "outlettype": [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                  ]
                }
              },
              {
                "box": {
                  "id": "ledbytes",
                  "maxclass": "newobj",
                  "patching_rect": [
                    20,
                    870,
                    40,
                    22
                  ],
                  "text": "iter"
                }
              },
              {
                "box": {
                  "id": "ledout",
                  "maxclass": "newobj",
                  "patching_rect": [
                    20,
                    910,
                    65,
                    22
                  ],
                  "text": "midiout"
                }
              },
              {
                "box": {
                  "id": "ledrouting",
                  "maxclass": "newobj",
                  "patching_rect": [
                    650,
                    720,
                    90,
                    22
                  ],
                  "text": "live.routing",
                  "numinlets": 1,
                  "numoutlets": 5
                }
              },
              {
                "box": {
                  "id": "ledroutinginit",
                  "maxclass": "message",
                  "patching_rect": [
                    650,
                    650,
                    145,
                    22
                  ],
                  "text": "port midi_outputs"
                }
              },
              {
                "box": {
                  "id": "ledroutingdefer",
                  "maxclass": "newobj",
                  "patching_rect": [
                    650,
                    680,
                    65,
                    22
                  ],
                  "text": "deferlow"
                }
              },
              {
                "box": {
                  "id": "ledportmsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    220,
                    830,
                    170,
                    22
                  ],
                  "text": "prepend choose_type"
                }
              },
              {
                "box": {
                  "id": "ledchannelmsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    220,
                    830,
                    170,
                    22
                  ],
                  "text": "prepend choose_channel"
                }
              },
              {
                "box": {
                  "id": "ledarmmsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    220,
                    830,
                    170,
                    22
                  ],
                  "text": "prepend arm"
                }
              },
              {
                "box": {
                  "id": "ledfollowmsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    220,
                    830,
                    170,
                    22
                  ],
                  "text": "prepend follow"
                }
              },
              {
                "box": {
                  "id": "whitemsg",
                  "maxclass": "message",
                  "patching_rect": [
                    400,
                    830,
                    140,
                    22
                  ],
                  "text": "testcolour WHITE"
                }
              },
              {
                "box": {
                  "id": "greenmsg",
                  "maxclass": "message",
                  "patching_rect": [
                    400,
                    830,
                    140,
                    22
                  ],
                  "text": "testcolour GREEN"
                }
              },
              {
                "box": {
                  "id": "redmsg",
                  "maxclass": "message",
                  "patching_rect": [
                    400,
                    830,
                    140,
                    22
                  ],
                  "text": "testcolour RED"
                }
              },
              {
                "box": {
                  "id": "orangemsg",
                  "maxclass": "message",
                  "patching_rect": [
                    400,
                    830,
                    140,
                    22
                  ],
                  "text": "testcolour ORANGE"
                }
              },
              {
                "box": {
                  "id": "ledrouting0",
                  "maxclass": "newobj",
                  "patching_rect": [
                    650,
                    760,
                    180,
                    22
                  ],
                  "text": "prepend routingtype"
                }
              },
              {
                "box": {
                  "id": "ledrouting1",
                  "maxclass": "newobj",
                  "patching_rect": [
                    650,
                    790,
                    180,
                    22
                  ],
                  "text": "prepend routingchannel"
                }
              },
              {
                "box": {
                  "id": "ledrouting2",
                  "maxclass": "newobj",
                  "patching_rect": [
                    650,
                    820,
                    180,
                    22
                  ],
                  "text": "prepend routingtypes"
                }
              },
              {
                "box": {
                  "id": "ledrouting3",
                  "maxclass": "newobj",
                  "patching_rect": [
                    650,
                    850,
                    180,
                    22
                  ],
                  "text": "prepend routingchannels"
                }
              },
              {
                "box": {
                  "id": "hint",
                  "maxclass": "comment",
                  "patching_rect": [
                    20,
                    1000,
                    550,
                    44
                  ],
                  "text": "Custom CC: MIDI In / channel 15 / CC37. Match On/Off values to Components; colours come from the Custom Mode. FOLLOW: STOP Off, PLAY On, RECORD slow blink, OVERDUB fast blink. Palette/RGB use channel 1 and the colour buttons above.",
                  "fontsize": 11.0,
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    242,
                    556,
                    48
                  ]
                }
              },
              {
                "box": {
                  "id": "ledprotocol",
                  "maxclass": "umenu",
                  "patching_rect": [
                    20,
                    1040,
                    300,
                    22
                  ],
                  "items": [
                    "Palette CC - DAW only",
                    ",",
                    "RGB SysEx - manual test",
                    ",",
                    "Custom CC15/37 - ON/OFF"
                  ],
                  "parameter_enable": 0,
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    164,
                    300,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "ledprotocolmsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    340,
                    1040,
                    125,
                    22
                  ],
                  "text": "prepend protocol"
                }
              },
              {
                "box": {
                  "id": "protocolhint",
                  "maxclass": "comment",
                  "patching_rect": [
                    20,
                    1080,
                    556,
                    22
                  ],
                  "text": "Change protocol with LED OUTPUT off.",
                  "fontsize": 11.0,
                  "presentation": 1,
                  "presentation_rect": [
                    324,
                    164,
                    244,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "customon",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    12,
                    1120,
                    90,
                    26
                  ],
                  "text": "TEST ON",
                  "texton": "TEST ON",
                  "mode": 0,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "bang",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    202,
                    90,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "customonmsg",
                  "maxclass": "message",
                  "patching_rect": [
                    12,
                    1160,
                    100,
                    22
                  ],
                  "text": "testvalue ON"
                }
              },
              {
                "box": {
                  "id": "customoff",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    112,
                    1120,
                    90,
                    26
                  ],
                  "text": "TEST OFF",
                  "texton": "TEST OFF",
                  "mode": 0,
                  "parameter_enable": 0,
                  "numoutlets": 3,
                  "outlettype": [
                    "bang",
                    "",
                    "int"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    112,
                    202,
                    90,
                    26
                  ]
                }
              },
              {
                "box": {
                  "id": "customoffmsg",
                  "maxclass": "message",
                  "patching_rect": [
                    112,
                    1160,
                    100,
                    22
                  ],
                  "text": "testvalue OFF"
                }
              },
              {
                "box": {
                  "id": "onvaluelabel",
                  "maxclass": "comment",
                  "patching_rect": [
                    218,
                    1200,
                    78,
                    22
                  ],
                  "text": "On value",
                  "fontsize": 11.0,
                  "presentation": 1,
                  "presentation_rect": [
                    218,
                    204,
                    78,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "onvalue",
                  "maxclass": "number",
                  "patching_rect": [
                    218,
                    1240,
                    70,
                    22
                  ],
                  "minimum": 0,
                  "maximum": 127,
                  "parameter_enable": 0,
                  "numoutlets": 2,
                  "outlettype": [
                    "int",
                    "bang"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    298,
                    204,
                    70,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "onvalueinit",
                  "maxclass": "newobj",
                  "patching_rect": [
                    218,
                    1280,
                    100,
                    22
                  ],
                  "text": "loadmess 127"
                }
              },
              {
                "box": {
                  "id": "onvaluemsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    218,
                    1320,
                    120,
                    22
                  ],
                  "text": "prepend onvalue"
                }
              },
              {
                "box": {
                  "id": "offvaluelabel",
                  "maxclass": "comment",
                  "patching_rect": [
                    394,
                    1200,
                    78,
                    22
                  ],
                  "text": "Off value",
                  "fontsize": 11.0,
                  "presentation": 1,
                  "presentation_rect": [
                    394,
                    204,
                    78,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "offvalue",
                  "maxclass": "number",
                  "patching_rect": [
                    394,
                    1240,
                    70,
                    22
                  ],
                  "minimum": 0,
                  "maximum": 127,
                  "parameter_enable": 0,
                  "numoutlets": 2,
                  "outlettype": [
                    "int",
                    "bang"
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    474,
                    204,
                    70,
                    22
                  ]
                }
              },
              {
                "box": {
                  "id": "offvalueinit",
                  "maxclass": "newobj",
                  "patching_rect": [
                    394,
                    1280,
                    100,
                    22
                  ],
                  "text": "loadmess 0"
                }
              },
              {
                "box": {
                  "id": "offvaluemsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    394,
                    1320,
                    120,
                    22
                  ],
                  "text": "prepend offvalue"
                }
              },
              {
                "box": {
                  "id": "setup",
                  "maxclass": "newobj",
                  "patching_rect": [
                    860,
                    650,
                    180,
                    22
                  ],
                  "text": "js mld2_led_setup.js",
                  "varname": "ledSetupEngine",
                  "numinlets": 1,
                  "numoutlets": 4,
                  "outlettype": [
                    "",
                    "",
                    "",
                    ""
                  ]
                }
              },
              {
                "box": {
                  "id": "setupstate",
                  "maxclass": "newobj",
                  "patching_rect": [
                    860,
                    690,
                    400,
                    22
                  ],
                  "text": "pattr ledConfiguration @bindto ledSetupEngine @parameter_enable 1",
                  "varname": "ledConfiguration",
                  "parameter_enable": 1,
                  "parameter_mappable": 0,
                  "saved_attribute_attributes": {
                    "valueof": {
                      "parameter_longname": "LED Configuration",
                      "parameter_shortname": "LED Config",
                      "parameter_type": 3,
                      "parameter_invisible": 1
                    }
                  }
                }
              },
              {
                "box": {
                  "id": "setupwindow",
                  "maxclass": "newobj",
                  "patching_rect": [
                    860,
                    730,
                    130,
                    22
                  ],
                  "text": "p LED_Setup",
                  "patcher": {
                    "fileversion": 1,
                    "appversion": {
                      "major": 8,
                      "minor": 6,
                      "revision": 5,
                      "architecture": "x64",
                      "modernui": 1
                    },
                    "classnamespace": "box",
                    "rect": [
                      160,
                      100,
                      1080,
                      640
                    ],
                    "openinpresentation": 1,
                    "default_fontname": "Arial",
                    "default_fontsize": 13.0,
                    "boxes": [
                      {
                        "box": {
                          "id": "in",
                          "maxclass": "inlet",
                          "patching_rect": [
                            10,
                            700,
                            25,
                            25
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "commands",
                          "maxclass": "newobj",
                          "patching_rect": [
                            50,
                            700,
                            90,
                            22
                          ],
                          "text": "route front"
                        }
                      },
                      {
                        "box": {
                          "id": "frontmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            160,
                            700,
                            180,
                            22
                          ],
                          "text": "front, topmost 1, presentation 1"
                        }
                      },
                      {
                        "box": {
                          "id": "window",
                          "maxclass": "newobj",
                          "patching_rect": [
                            360,
                            700,
                            85,
                            22
                          ],
                          "text": "thispatcher"
                        }
                      },
                      {
                        "box": {
                          "id": "out",
                          "maxclass": "outlet",
                          "patching_rect": [
                            470,
                            700,
                            25,
                            25
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "title",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            12,
                            1040,
                            26
                          ],
                          "text": "LED SETUP / LCXL3 CUSTOM MODE / CC FEEDBACK",
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            12,
                            1040,
                            26
                          ],
                          "fontsize": 18.0
                        }
                      },
                      {
                        "box": {
                          "id": "setupPort",
                          "maxclass": "umenu",
                          "patching_rect": [
                            12,
                            46,
                            330,
                            24
                          ],
                          "items": [
                            "Select LCXL3 MIDI In"
                          ],
                          "varname": "setupPort",
                          "parameter_enable": 0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            46,
                            330,
                            24
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "portmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            12,
                            750,
                            150,
                            22
                          ],
                          "text": "prepend choose_port"
                        }
                      },
                      {
                        "box": {
                          "id": "setupRun",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            360,
                            46,
                            130,
                            26
                          ],
                          "text": "SYNC",
                          "texton": "SYNC ON",
                          "mode": 1,
                          "parameter_enable": 0,
                          "varname": "setupRun",
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            360,
                            46,
                            130,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "setupRunmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            360,
                            790,
                            130,
                            22
                          ],
                          "text": "prepend run"
                        }
                      },
                      {
                        "box": {
                          "id": "prev",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            510,
                            46,
                            60,
                            26
                          ],
                          "text": "PREV",
                          "texton": "PREV",
                          "mode": 0,
                          "parameter_enable": 0,
                          "varname": "prev",
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            510,
                            46,
                            60,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "prevmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            510,
                            790,
                            60,
                            22
                          ],
                          "text": "turnpage -1"
                        }
                      },
                      {
                        "box": {
                          "id": "next",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            580,
                            46,
                            60,
                            26
                          ],
                          "text": "NEXT",
                          "texton": "NEXT",
                          "mode": 0,
                          "parameter_enable": 0,
                          "varname": "next",
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            580,
                            46,
                            60,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "nextmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            580,
                            790,
                            60,
                            22
                          ],
                          "text": "turnpage 1"
                        }
                      },
                      {
                        "box": {
                          "id": "legacy",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            920,
                            46,
                            148,
                            26
                          ],
                          "text": "LED TEST",
                          "texton": "LED TEST",
                          "mode": 0,
                          "parameter_enable": 0,
                          "varname": "legacy",
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            920,
                            46,
                            148,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "legacymsg",
                          "maxclass": "message",
                          "patching_rect": [
                            920,
                            790,
                            148,
                            22
                          ],
                          "text": "legacy"
                        }
                      },
                      {
                        "box": {
                          "id": "setupPage",
                          "maxclass": "comment",
                          "patching_rect": [
                            650,
                            48,
                            260,
                            22
                          ],
                          "text": "0 / 0",
                          "varname": "setupPage",
                          "presentation": 1,
                          "presentation_rect": [
                            650,
                            48,
                            260,
                            22
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "setupStatus",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            80,
                            1056,
                            28
                          ],
                          "text": "SYNC OFF. Settings are saved with the Live Set.",
                          "varname": "setupStatus",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            80,
                            1056,
                            28
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "heading12",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            110,
                            260,
                            20
                          ],
                          "text": "TRACK / LOOPER",
                          "fontsize": 11.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            110,
                            260,
                            20
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "heading278",
                          "maxclass": "comment",
                          "patching_rect": [
                            278,
                            110,
                            48,
                            20
                          ],
                          "text": "CH",
                          "fontsize": 11.0,
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            110,
                            48,
                            20
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "heading338",
                          "maxclass": "comment",
                          "patching_rect": [
                            338,
                            110,
                            48,
                            20
                          ],
                          "text": "CC",
                          "fontsize": 11.0,
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            110,
                            48,
                            20
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "heading398",
                          "maxclass": "comment",
                          "patching_rect": [
                            398,
                            110,
                            48,
                            20
                          ],
                          "text": "ON",
                          "fontsize": 11.0,
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            110,
                            48,
                            20
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "heading458",
                          "maxclass": "comment",
                          "patching_rect": [
                            458,
                            110,
                            48,
                            20
                          ],
                          "text": "OFF",
                          "fontsize": 11.0,
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            110,
                            48,
                            20
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "heading520",
                          "maxclass": "comment",
                          "patching_rect": [
                            520,
                            110,
                            64,
                            20
                          ],
                          "text": "ENABLE",
                          "fontsize": 11.0,
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            110,
                            64,
                            20
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "heading814",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            110,
                            250,
                            20
                          ],
                          "text": "STATUS",
                          "fontsize": 11.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            110,
                            250,
                            20
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            136,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row0_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            136,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            136,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row0_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            136,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            136,
                            48,
                            26
                          ],
                          "varname": "row0_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            136,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            850,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 0 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row0_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            136,
                            48,
                            26
                          ],
                          "varname": "row0_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            136,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            850,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 0 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row0_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            136,
                            48,
                            26
                          ],
                          "varname": "row0_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            136,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            850,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 0 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row0_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            136,
                            48,
                            26
                          ],
                          "varname": "row0_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            136,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            850,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 0 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row0_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            136,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row0_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            136,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            880,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 0 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row0_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            136,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row0_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            136,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            880,
                            200,
                            22
                          ],
                          "text": "test 0 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row0_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            136,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row0_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            136,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            880,
                            200,
                            22
                          ],
                          "text": "test 0 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row0_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            136,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row0_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            136,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row0_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            880,
                            200,
                            22
                          ],
                          "text": "forget 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            190,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row1_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            190,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            190,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row1_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            190,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            190,
                            48,
                            26
                          ],
                          "varname": "row1_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            190,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            910,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 1 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            190,
                            48,
                            26
                          ],
                          "varname": "row1_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            190,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            910,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 1 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            190,
                            48,
                            26
                          ],
                          "varname": "row1_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            190,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            910,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 1 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            190,
                            48,
                            26
                          ],
                          "varname": "row1_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            190,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            910,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 1 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            190,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row1_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            190,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            940,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 1 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            190,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row1_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            190,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            940,
                            200,
                            22
                          ],
                          "text": "test 1 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            190,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row1_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            190,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            940,
                            200,
                            22
                          ],
                          "text": "test 1 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row1_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            190,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row1_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            190,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row1_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            940,
                            200,
                            22
                          ],
                          "text": "forget 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            244,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row2_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            244,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            244,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row2_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            244,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            244,
                            48,
                            26
                          ],
                          "varname": "row2_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            244,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            970,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 2 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            244,
                            48,
                            26
                          ],
                          "varname": "row2_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            244,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            970,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 2 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            244,
                            48,
                            26
                          ],
                          "varname": "row2_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            244,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            970,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 2 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            244,
                            48,
                            26
                          ],
                          "varname": "row2_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            244,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            970,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 2 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            244,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row2_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            244,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            1000,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 2 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            244,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row2_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            244,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            1000,
                            200,
                            22
                          ],
                          "text": "test 2 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            244,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row2_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            244,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            1000,
                            200,
                            22
                          ],
                          "text": "test 2 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row2_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            244,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row2_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            244,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row2_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            1000,
                            200,
                            22
                          ],
                          "text": "forget 2"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            298,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row3_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            298,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            298,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row3_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            298,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            298,
                            48,
                            26
                          ],
                          "varname": "row3_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            298,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            1030,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 3 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            298,
                            48,
                            26
                          ],
                          "varname": "row3_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            298,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            1030,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 3 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            298,
                            48,
                            26
                          ],
                          "varname": "row3_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            298,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            1030,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 3 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            298,
                            48,
                            26
                          ],
                          "varname": "row3_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            298,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            1030,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 3 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            298,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row3_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            298,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            1060,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 3 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            298,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row3_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            298,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            1060,
                            200,
                            22
                          ],
                          "text": "test 3 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            298,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row3_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            298,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            1060,
                            200,
                            22
                          ],
                          "text": "test 3 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row3_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            298,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row3_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            298,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row3_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            1060,
                            200,
                            22
                          ],
                          "text": "forget 3"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            352,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row4_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            352,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            352,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row4_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            352,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            352,
                            48,
                            26
                          ],
                          "varname": "row4_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            352,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            1090,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 4 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            352,
                            48,
                            26
                          ],
                          "varname": "row4_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            352,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            1090,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 4 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            352,
                            48,
                            26
                          ],
                          "varname": "row4_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            352,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            1090,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 4 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            352,
                            48,
                            26
                          ],
                          "varname": "row4_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            352,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            1090,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 4 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            352,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row4_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            352,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            1120,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 4 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            352,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row4_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            352,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            1120,
                            200,
                            22
                          ],
                          "text": "test 4 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            352,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row4_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            352,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            1120,
                            200,
                            22
                          ],
                          "text": "test 4 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row4_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            352,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row4_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            352,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row4_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            1120,
                            200,
                            22
                          ],
                          "text": "forget 4"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            406,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row5_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            406,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            406,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row5_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            406,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            406,
                            48,
                            26
                          ],
                          "varname": "row5_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            406,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            1150,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 5 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            406,
                            48,
                            26
                          ],
                          "varname": "row5_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            406,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            1150,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 5 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            406,
                            48,
                            26
                          ],
                          "varname": "row5_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            406,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            1150,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 5 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            406,
                            48,
                            26
                          ],
                          "varname": "row5_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            406,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            1150,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 5 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            406,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row5_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            406,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            1180,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 5 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            406,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row5_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            406,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            1180,
                            200,
                            22
                          ],
                          "text": "test 5 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            406,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row5_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            406,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            1180,
                            200,
                            22
                          ],
                          "text": "test 5 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row5_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            406,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row5_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            406,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row5_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            1180,
                            200,
                            22
                          ],
                          "text": "forget 5"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            460,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row6_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            460,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            460,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row6_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            460,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            460,
                            48,
                            26
                          ],
                          "varname": "row6_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            460,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            1210,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 6 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            460,
                            48,
                            26
                          ],
                          "varname": "row6_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            460,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            1210,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 6 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            460,
                            48,
                            26
                          ],
                          "varname": "row6_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            460,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            1210,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 6 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            460,
                            48,
                            26
                          ],
                          "varname": "row6_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            460,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            1210,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 6 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            460,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row6_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            460,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            1240,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 6 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            460,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row6_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            460,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            1240,
                            200,
                            22
                          ],
                          "text": "test 6 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            460,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row6_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            460,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            1240,
                            200,
                            22
                          ],
                          "text": "test 6 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row6_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            460,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row6_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            460,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row6_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            1240,
                            200,
                            22
                          ],
                          "text": "forget 6"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_label",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            514,
                            260,
                            42
                          ],
                          "text": "",
                          "varname": "row7_label",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            514,
                            260,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_status",
                          "maxclass": "comment",
                          "patching_rect": [
                            814,
                            514,
                            250,
                            42
                          ],
                          "text": "",
                          "varname": "row7_status",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            814,
                            514,
                            250,
                            42
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_channel",
                          "maxclass": "number",
                          "patching_rect": [
                            278,
                            514,
                            48,
                            26
                          ],
                          "varname": "row7_channel",
                          "minimum": 1,
                          "maximum": 16,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            278,
                            514,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_channelmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            278,
                            1270,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 7 channel"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_cc",
                          "maxclass": "number",
                          "patching_rect": [
                            338,
                            514,
                            48,
                            26
                          ],
                          "varname": "row7_cc",
                          "minimum": -1,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            338,
                            514,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_ccmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            338,
                            1270,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 7 cc"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_on",
                          "maxclass": "number",
                          "patching_rect": [
                            398,
                            514,
                            48,
                            26
                          ],
                          "varname": "row7_on",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            398,
                            514,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_onmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            398,
                            1270,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 7 on"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_off",
                          "maxclass": "number",
                          "patching_rect": [
                            458,
                            514,
                            48,
                            26
                          ],
                          "varname": "row7_off",
                          "minimum": 0,
                          "maximum": 127,
                          "parameter_enable": 0,
                          "numoutlets": 2,
                          "outlettype": [
                            "int",
                            "bang"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            458,
                            514,
                            48,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_offmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            458,
                            1270,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 7 off"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_enabled",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            520,
                            514,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "ON",
                          "mode": 1,
                          "varname": "row7_enabled",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "int",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            520,
                            514,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_enabledmsg",
                          "maxclass": "newobj",
                          "patching_rect": [
                            520,
                            1300,
                            200,
                            22
                          ],
                          "text": "prepend rowedit 7 enabled"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_teston",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            596,
                            514,
                            64,
                            26
                          ],
                          "text": "TEST ON",
                          "texton": "TEST ON",
                          "mode": 0,
                          "varname": "row7_teston",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            596,
                            514,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_testonmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            596,
                            1300,
                            200,
                            22
                          ],
                          "text": "test 7 1"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_testoff",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            666,
                            514,
                            64,
                            26
                          ],
                          "text": "OFF",
                          "texton": "OFF",
                          "mode": 0,
                          "varname": "row7_testoff",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            666,
                            514,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_testoffmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            666,
                            1300,
                            200,
                            22
                          ],
                          "text": "test 7 0"
                        }
                      },
                      {
                        "box": {
                          "id": "row7_forget",
                          "maxclass": "textbutton",
                          "patching_rect": [
                            738,
                            514,
                            64,
                            26
                          ],
                          "text": "CLEAR",
                          "texton": "CLEAR",
                          "mode": 0,
                          "varname": "row7_forget",
                          "parameter_enable": 0,
                          "numoutlets": 3,
                          "outlettype": [
                            "bang",
                            "",
                            "int"
                          ],
                          "presentation": 1,
                          "presentation_rect": [
                            738,
                            514,
                            64,
                            26
                          ]
                        }
                      },
                      {
                        "box": {
                          "id": "row7_forgetmsg",
                          "maxclass": "message",
                          "patching_rect": [
                            738,
                            1300,
                            200,
                            22
                          ],
                          "text": "forget 7"
                        }
                      },
                      {
                        "box": {
                          "id": "help",
                          "maxclass": "comment",
                          "patching_rect": [
                            12,
                            580,
                            1056,
                            48
                          ],
                          "text": "CC -1 = unassigned. Use the channel, CC and On/Off values from Components. Test with SYNC off. STOP = Off, PLAY = On, RECORD = slow blink, OVERDUB = fast blink. One Looper per uniquely named track. Missing assignments stay listed; CLEAR removes their settings.",
                          "fontsize": 12.0,
                          "presentation": 1,
                          "presentation_rect": [
                            12,
                            580,
                            1056,
                            48
                          ]
                        }
                      }
                    ],
                    "lines": [
                      {
                        "patchline": {
                          "source": [
                            "in",
                            0
                          ],
                          "destination": [
                            "commands",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "commands",
                            0
                          ],
                          "destination": [
                            "frontmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "frontmsg",
                            0
                          ],
                          "destination": [
                            "window",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "commands",
                            1
                          ],
                          "destination": [
                            "window",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "setupPort",
                            0
                          ],
                          "destination": [
                            "portmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "portmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "setupRun",
                            0
                          ],
                          "destination": [
                            "setupRunmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "setupRunmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "prev",
                            0
                          ],
                          "destination": [
                            "prevmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "prevmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "next",
                            0
                          ],
                          "destination": [
                            "nextmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "nextmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "legacy",
                            0
                          ],
                          "destination": [
                            "legacymsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "legacymsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_channel",
                            0
                          ],
                          "destination": [
                            "row0_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_cc",
                            0
                          ],
                          "destination": [
                            "row0_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_on",
                            0
                          ],
                          "destination": [
                            "row0_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_off",
                            0
                          ],
                          "destination": [
                            "row0_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_enabled",
                            0
                          ],
                          "destination": [
                            "row0_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_teston",
                            0
                          ],
                          "destination": [
                            "row0_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_testoff",
                            0
                          ],
                          "destination": [
                            "row0_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_forget",
                            0
                          ],
                          "destination": [
                            "row0_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row0_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_channel",
                            0
                          ],
                          "destination": [
                            "row1_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_cc",
                            0
                          ],
                          "destination": [
                            "row1_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_on",
                            0
                          ],
                          "destination": [
                            "row1_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_off",
                            0
                          ],
                          "destination": [
                            "row1_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_enabled",
                            0
                          ],
                          "destination": [
                            "row1_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_teston",
                            0
                          ],
                          "destination": [
                            "row1_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_testoff",
                            0
                          ],
                          "destination": [
                            "row1_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_forget",
                            0
                          ],
                          "destination": [
                            "row1_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row1_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_channel",
                            0
                          ],
                          "destination": [
                            "row2_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_cc",
                            0
                          ],
                          "destination": [
                            "row2_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_on",
                            0
                          ],
                          "destination": [
                            "row2_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_off",
                            0
                          ],
                          "destination": [
                            "row2_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_enabled",
                            0
                          ],
                          "destination": [
                            "row2_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_teston",
                            0
                          ],
                          "destination": [
                            "row2_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_testoff",
                            0
                          ],
                          "destination": [
                            "row2_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_forget",
                            0
                          ],
                          "destination": [
                            "row2_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row2_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_channel",
                            0
                          ],
                          "destination": [
                            "row3_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_cc",
                            0
                          ],
                          "destination": [
                            "row3_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_on",
                            0
                          ],
                          "destination": [
                            "row3_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_off",
                            0
                          ],
                          "destination": [
                            "row3_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_enabled",
                            0
                          ],
                          "destination": [
                            "row3_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_teston",
                            0
                          ],
                          "destination": [
                            "row3_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_testoff",
                            0
                          ],
                          "destination": [
                            "row3_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_forget",
                            0
                          ],
                          "destination": [
                            "row3_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row3_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_channel",
                            0
                          ],
                          "destination": [
                            "row4_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_cc",
                            0
                          ],
                          "destination": [
                            "row4_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_on",
                            0
                          ],
                          "destination": [
                            "row4_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_off",
                            0
                          ],
                          "destination": [
                            "row4_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_enabled",
                            0
                          ],
                          "destination": [
                            "row4_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_teston",
                            0
                          ],
                          "destination": [
                            "row4_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_testoff",
                            0
                          ],
                          "destination": [
                            "row4_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_forget",
                            0
                          ],
                          "destination": [
                            "row4_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row4_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_channel",
                            0
                          ],
                          "destination": [
                            "row5_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_cc",
                            0
                          ],
                          "destination": [
                            "row5_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_on",
                            0
                          ],
                          "destination": [
                            "row5_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_off",
                            0
                          ],
                          "destination": [
                            "row5_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_enabled",
                            0
                          ],
                          "destination": [
                            "row5_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_teston",
                            0
                          ],
                          "destination": [
                            "row5_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_testoff",
                            0
                          ],
                          "destination": [
                            "row5_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_forget",
                            0
                          ],
                          "destination": [
                            "row5_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row5_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_channel",
                            0
                          ],
                          "destination": [
                            "row6_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_cc",
                            0
                          ],
                          "destination": [
                            "row6_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_on",
                            0
                          ],
                          "destination": [
                            "row6_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_off",
                            0
                          ],
                          "destination": [
                            "row6_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_enabled",
                            0
                          ],
                          "destination": [
                            "row6_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_teston",
                            0
                          ],
                          "destination": [
                            "row6_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_testoff",
                            0
                          ],
                          "destination": [
                            "row6_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_forget",
                            0
                          ],
                          "destination": [
                            "row6_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row6_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_channel",
                            0
                          ],
                          "destination": [
                            "row7_channelmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_channelmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_cc",
                            0
                          ],
                          "destination": [
                            "row7_ccmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_ccmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_on",
                            0
                          ],
                          "destination": [
                            "row7_onmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_onmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_off",
                            0
                          ],
                          "destination": [
                            "row7_offmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_offmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_enabled",
                            0
                          ],
                          "destination": [
                            "row7_enabledmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_enabledmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_teston",
                            0
                          ],
                          "destination": [
                            "row7_testonmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_testonmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_testoff",
                            0
                          ],
                          "destination": [
                            "row7_testoffmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_testoffmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_forget",
                            0
                          ],
                          "destination": [
                            "row7_forgetmsg",
                            0
                          ]
                        }
                      },
                      {
                        "patchline": {
                          "source": [
                            "row7_forgetmsg",
                            0
                          ],
                          "destination": [
                            "out",
                            0
                          ]
                        }
                      }
                    ]
                  },
                  "numinlets": 1,
                  "numoutlets": 1,
                  "outlettype": [
                    ""
                  ]
                }
              },
              {
                "box": {
                  "id": "setupmidimsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    860,
                    770,
                    150,
                    22
                  ],
                  "text": "prepend setup_midi"
                }
              },
              {
                "box": {
                  "id": "setupclaimmsg",
                  "maxclass": "newobj",
                  "patching_rect": [
                    860,
                    810,
                    150,
                    22
                  ],
                  "text": "prepend setup_claim"
                }
              },
              {
                "box": {
                  "id": "setuproute",
                  "maxclass": "newobj",
                  "patching_rect": [
                    1050,
                    770,
                    100,
                    22
                  ],
                  "text": "route legacy"
                }
              },
              {
                "box": {
                  "id": "setuptrig",
                  "maxclass": "newobj",
                  "patching_rect": [
                    860,
                    850,
                    55,
                    22
                  ],
                  "text": "t b b"
                }
              },
              {
                "box": {
                  "id": "setupopen",
                  "maxclass": "message",
                  "patching_rect": [
                    860,
                    890,
                    45,
                    22
                  ],
                  "text": "open"
                }
              },
              {
                "box": {
                  "id": "setupfront",
                  "maxclass": "message",
                  "patching_rect": [
                    940,
                    890,
                    45,
                    22
                  ],
                  "text": "front"
                }
              },
              {
                "box": {
                  "id": "setuppc",
                  "maxclass": "newobj",
                  "patching_rect": [
                    860,
                    930,
                    65,
                    22
                  ],
                  "text": "pcontrol"
                }
              }
            ],
            "lines": [
              {
                "patchline": {
                  "source": [
                    "in",
                    0
                  ],
                  "destination": [
                    "commands",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "commands",
                    0
                  ],
                  "destination": [
                    "frontmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "frontmsg",
                    0
                  ],
                  "destination": [
                    "window",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledport",
                    0
                  ],
                  "destination": [
                    "ledportmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledportmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledchannel",
                    0
                  ],
                  "destination": [
                    "ledchannelmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledchannelmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledarm",
                    0
                  ],
                  "destination": [
                    "ledarmmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledarmmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledfollow",
                    0
                  ],
                  "destination": [
                    "ledfollowmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledfollowmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "white",
                    0
                  ],
                  "destination": [
                    "whitemsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "whitemsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "green",
                    0
                  ],
                  "destination": [
                    "greenmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "greenmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "red",
                    0
                  ],
                  "destination": [
                    "redmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "redmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "orange",
                    0
                  ],
                  "destination": [
                    "orangemsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "orangemsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting",
                    0
                  ],
                  "destination": [
                    "ledrouting0",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting0",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ],
                  "order": 0
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting",
                    1
                  ],
                  "destination": [
                    "ledrouting1",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting1",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ],
                  "order": 0
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting",
                    2
                  ],
                  "destination": [
                    "ledrouting2",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting2",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ],
                  "order": 0
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting",
                    3
                  ],
                  "destination": [
                    "ledrouting3",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting3",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ],
                  "order": 0
                }
              },
              {
                "patchline": {
                  "source": [
                    "commands",
                    1
                  ],
                  "destination": [
                    "ledroutinginit",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledroutinginit",
                    0
                  ],
                  "destination": [
                    "ledroutingdefer",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledroutingdefer",
                    0
                  ],
                  "destination": [
                    "ledrouting",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "commands",
                    3
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    0
                  ],
                  "destination": [
                    "ledbytes",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledbytes",
                    0
                  ],
                  "destination": [
                    "ledout",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    1
                  ],
                  "destination": [
                    "ledstatus",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    2
                  ],
                  "destination": [
                    "ledport",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    3
                  ],
                  "destination": [
                    "ledchannel",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    4
                  ],
                  "destination": [
                    "ledrouting",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledprotocol",
                    0
                  ],
                  "destination": [
                    "ledprotocolmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledprotocolmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    5
                  ],
                  "destination": [
                    "ledprotocol",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "customon",
                    0
                  ],
                  "destination": [
                    "customonmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "customonmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "customoff",
                    0
                  ],
                  "destination": [
                    "customoffmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "customoffmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "onvalueinit",
                    0
                  ],
                  "destination": [
                    "onvalue",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "onvalue",
                    0
                  ],
                  "destination": [
                    "onvaluemsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "onvaluemsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "offvalueinit",
                    0
                  ],
                  "destination": [
                    "offvalue",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "offvalue",
                    0
                  ],
                  "destination": [
                    "offvaluemsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "offvaluemsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "commands",
                    2
                  ],
                  "destination": [
                    "setuptrig",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setuptrig",
                    1
                  ],
                  "destination": [
                    "setupopen",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setupopen",
                    0
                  ],
                  "destination": [
                    "setuppc",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setuppc",
                    0
                  ],
                  "destination": [
                    "setupwindow",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setuptrig",
                    0
                  ],
                  "destination": [
                    "setupfront",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setupfront",
                    0
                  ],
                  "destination": [
                    "setupwindow",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "commands",
                    3
                  ],
                  "destination": [
                    "setup",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setupwindow",
                    0
                  ],
                  "destination": [
                    "setup",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setup",
                    0
                  ],
                  "destination": [
                    "setupmidimsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setupmidimsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setup",
                    1
                  ],
                  "destination": [
                    "setupwindow",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setup",
                    2
                  ],
                  "destination": [
                    "setuproute",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setuproute",
                    1
                  ],
                  "destination": [
                    "ledrouting",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setuproute",
                    0
                  ],
                  "destination": [
                    "frontmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setup",
                    3
                  ],
                  "destination": [
                    "setupclaimmsg",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setupclaimmsg",
                    0
                  ],
                  "destination": [
                    "led",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    6
                  ],
                  "destination": [
                    "setup",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "led",
                    7
                  ],
                  "destination": [
                    "ledarm",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting0",
                    0
                  ],
                  "destination": [
                    "setup",
                    0
                  ],
                  "order": 1
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting1",
                    0
                  ],
                  "destination": [
                    "setup",
                    0
                  ],
                  "order": 1
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting2",
                    0
                  ],
                  "destination": [
                    "setup",
                    0
                  ],
                  "order": 1
                }
              },
              {
                "patchline": {
                  "source": [
                    "ledrouting3",
                    0
                  ],
                  "destination": [
                    "setup",
                    0
                  ],
                  "order": 1
                }
              }
            ]
          },
          "numinlets": 1,
          "numoutlets": 0
        }
      },
      {
        "box": {
          "id": "ledtrig",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            690,
            55,
            22
          ],
          "text": "t b b"
        }
      },
      {
        "box": {
          "id": "ledopenmsg",
          "maxclass": "message",
          "patching_rect": [
            20,
            730,
            45,
            22
          ],
          "text": "open"
        }
      },
      {
        "box": {
          "id": "ledfrontmsg",
          "maxclass": "message",
          "patching_rect": [
            100,
            730,
            45,
            22
          ],
          "text": "front"
        }
      },
      {
        "box": {
          "id": "ledpc",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            770,
            65,
            22
          ],
          "text": "pcontrol"
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "ledopen",
            0
          ],
          "destination": [
            "ledtrig",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ledtrig",
            1
          ],
          "destination": [
            "ledopenmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ledopenmsg",
            0
          ],
          "destination": [
            "ledpc",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ledpc",
            0
          ],
          "destination": [
            "ledwindow",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ledtrig",
            0
          ],
          "destination": [
            "ledfrontmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ledfrontmsg",
            0
          ],
          "destination": [
            "ledwindow",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "setupopen",
            0
          ],
          "destination": [
            "setupopenmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "setupopenmsg",
            0
          ],
          "destination": [
            "ledwindow",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "init",
            0
          ],
          "destination": [
            "ledwindow",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "js",
            0
          ],
          "destination": [
            "ledwindow",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "this",
            0
          ],
          "destination": [
            "init",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "init",
            0
          ],
          "destination": [
            "defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open",
            0
          ],
          "destination": [
            "trig",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "trig",
            1
          ],
          "destination": [
            "openmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "openmsg",
            0
          ],
          "destination": [
            "pc",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pc",
            0
          ],
          "destination": [
            "window",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "trig",
            0
          ],
          "destination": [
            "front",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "front",
            0
          ],
          "destination": [
            "window",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "scan",
            0
          ],
          "destination": [
            "scanmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "scanmsg",
            0
          ],
          "destination": [
            "defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "report",
            0
          ],
          "destination": [
            "dlg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "dlg",
            0
          ],
          "destination": [
            "export",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "export",
            0
          ],
          "destination": [
            "defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "defer",
            0
          ],
          "destination": [
            "js",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "js",
            0
          ],
          "destination": [
            "window",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "window",
            0
          ],
          "destination": [
            "ui_route",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ui_route",
            0
          ],
          "destination": [
            "dlg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ui_route",
            1
          ],
          "destination": [
            "defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audioin",
            0
          ],
          "destination": [
            "audioout",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audioin",
            1
          ],
          "destination": [
            "audioout",
            1
          ]
        }
      }
    ],
    "devicewidth": 580.0,
    "amxdtype": 1633771873,
    "description": "Read-only Live monitoring with optional experimental LCXL3 LED feedback.",
    "dependency_cache": [
      {
        "name": "mld2_core.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "mld2_ui.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "mld2_led.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "mld2_led_setup.js",
        "type": "TEXT",
        "implicit": 1
      }
    ]
  }
}
