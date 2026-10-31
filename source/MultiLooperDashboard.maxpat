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
          "text": "MULTI LOOPER  /  AUTO DASHBOARD  /  0.6 beta",
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
          "id": "warning",
          "maxclass": "comment",
          "patching_rect": [
            20,
            150,
            800,
            38
          ],
          "text": "Estimated timing follows transport. Read only.",
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
      }
    ],
    "lines": [
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
    "description": "Automatic read-only dashboard for every built-in Looper in the Live Set.",
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
      }
    ]
  }
}
