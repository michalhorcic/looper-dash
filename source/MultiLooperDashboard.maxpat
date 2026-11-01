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
          "text": "MULTI LOOPER  /  AUTO DASHBOARD  /  0.8 beta",
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
            560,
            40
          ]
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
              210
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
                  "text": "route front init"
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
                  "text": "LCXL3 / LOOPER A / EXPERIMENTAL - Custom Mode 2",
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
                    "Select LCXL3 DAW In"
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
                    "Select channel 1"
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
                    "",
                    "int",
                    ""
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
                    "",
                    "int",
                    ""
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
                    "",
                    "int",
                    ""
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
                    "",
                    "int",
                    ""
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
                    "",
                    "int",
                    ""
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
                    "",
                    "int",
                    ""
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
                  "numinlets": 1,
                  "numoutlets": 5,
                  "outlettype": [
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
                    42
                  ],
                  "text": "DAW In / channel 1 only. No mode switches or CC15/37 output. If colours do not change in Custom Mode 2, stop and report the result.",
                  "fontsize": 11.0,
                  "presentation": 1,
                  "presentation_rect": [
                    12,
                    164,
                    556,
                    40
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
                    1
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
                    1
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
                  ]
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
                  ]
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
                  ]
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
                    2
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
      }
    ]
  }
}
