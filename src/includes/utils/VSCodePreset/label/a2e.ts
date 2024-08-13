import { l10n } from 'vscode';

const icons = {
	account:                              { name: l10n.t('Account'),                                  label: '$(account)',                                 },
	activateBreakpoints:                  { name: l10n.t('Activate Breakpoints'),                     label: '$(activate-breakpoints)',                    },
	add:                                  { name: l10n.t('Add'),                                      label: '$(add)',                                     },
	alert:                                { name: l10n.t('Alert'),                                    label: '$(alert)',                                   },
	archive:                              { name: l10n.t('Archive'),                                  label: '$(archive)',                                 },
	array:                                { name: l10n.t('Array'),                                    label: '$(array)',                                   },
	arrowBoth:                            { name: l10n.t('Arrow Both'),                               label: '$(arrow-both)',                              },
  arrowCircleDown:                      { name: l10n.t('Arrow Circle Down'),                        label: '$(arrow-circle-down)',                       },
  arrowCircleLeft:                      { name: l10n.t('Arrow Circle Left'),                        label: '$(arrow-circle-left)',                       },
  arrowCircleRight:                     { name: l10n.t('Arrow Circle Right'),                       label: '$(arrow-circle-right)',                      },
  arrowCircleUp:                        { name: l10n.t('Arrow Circle Up'),                          label: '$(arrow-circle-up)',                         },
	arrowDown:                            { name: l10n.t('Arrow Down'),                               label: '$(arrow-down)',                              },
	arrowLeft:                            { name: l10n.t('Arrow Left'),                               label: '$(arrow-left)',                              },
	arrowRight:                           { name: l10n.t('Arrow Right'),                              label: '$(arrow-right)',                             },
	arrowSmallDown:                       { name: l10n.t('Arrow Small Down'),                         label: '$(arrow-small-down)',                        },
	arrowSmallLeft:                       { name: l10n.t('Arrow Small Left'),                         label: '$(arrow-small-left)',                        },
	arrowSmallRight:                      { name: l10n.t('Arrow Small Right'),                        label: '$(arrow-small-right)',                       },
	arrowSmallUp:                         { name: l10n.t('Arrow Small Up'),                           label: '$(arrow-small-up)',                          },
  arrowSwap:                            { name: l10n.t('Arrow Swap'),                               label: '$(arrow-swap)',                              },
	arrowUp:                              { name: l10n.t('Arrow Up'),                                 label: '$(arrow-up)',                                },
  azure:                                { name: l10n.t('Azure'),                                    label: '$(azure)',                                   },
  beakerStop:                           { name: l10n.t('Beaker Stop'),                              label: '$(beaker-stop)',                             },
	beaker:                               { name: l10n.t('Beaker'),                                   label: '$(beaker)',                                  },
	bell:                                 { name: l10n.t('Bell'),                                     label: '$(bell)',                                    },
	bellDot:                              { name: l10n.t('Bell Dot'),                                 label: '$(bell-dot)',                                },
  bellSlash:                            { name: l10n.t('Bell Slash'),                               label: '$(bell-slash)',                              },
  bellSlashDot:                         { name: l10n.t('Bell Slash Dot'),                           label: '$(bell-slash-dot)',                          },
	bold:                                 { name: l10n.t('Bold'),                                     label: '$(bold)',                                    },
	book:                                 { name: l10n.t('Book'),                                     label: '$(book)',                                    },
	bookmark:                             { name: l10n.t('Bookmark'),                                 label: '$(bookmark)',                                },
  bracketDot:                           { name: l10n.t('Bracket Dot'),                              label: '$(bracket-dot)',                             },
  bracketError:                         { name: l10n.t('Bracket Error'),                            label: '$(bracket-error)',                           },
	briefcase:                            { name: l10n.t('Briefcase'),                                label: '$(briefcase)',                               },
	broadcast:                            { name: l10n.t('Broadcast'),                                label: '$(broadcast)',                               },
	browser:                              { name: l10n.t('Browser'),                                  label: '$(browser)',                                 },
	bug:                                  { name: l10n.t('Bug'),                                      label: '$(bug)',                                     },
	calendar:                             { name: l10n.t('Calendar'),                                 label: '$(calendar)',                                },
	callIncoming:                         { name: l10n.t('Call In Coming'),                           label: '$(call-incoming)',                           },
	callOutgoing:                         { name: l10n.t('Call Out going'),                           label: '$(call-outgoing)',                           },
	caseSensitive:                        { name: l10n.t('Case Sensitive'),                           label: '$(case-sensitive)',                          },
	check:                                { name: l10n.t('Check'),                                    label: '$(check)',                                   },
	checkAll:                             { name: l10n.t('Check All'),                                label: '$(check-all)',                               },
	checklist:                            { name: l10n.t('Checklist'),                                label: '$(checklist)',                               },
	chevronDown:                          { name: l10n.t('Chevron Down'),                             label: '$(chevron-down)',                            },
	chevronLeft:                          { name: l10n.t('Chevron Left'),                             label: '$(chevron-left)',                            },
	chevronRight:                         { name: l10n.t('Chevron Right'),                            label: '$(chevron-right)',                           },
	chevronUp:                            { name: l10n.t('Chevron Up'),                               label: '$(chevron-up)',                              },
  chip:                                 { name: l10n.t('Chip'),                                     label: '$(chip)',                                    },
	chromeClose:                          { name: l10n.t('Chrome Close'),                             label: '$(chrome-close)',                            },
	chromeMaximize:                       { name: l10n.t('Chrome Maximize'),                          label: '$(chrome-maximize)',                         },
	chromeMinimize:                       { name: l10n.t('Cherme Minimize'),                          label: '$(chrome-minimize)',                         },
	chromeRestore:                        { name: l10n.t('Chrome Restore'),                           label: '$(chrome-restore)',                          },
	circleFilled:                         { name: l10n.t('Chrome Filled'),                            label: '$(circle-filled)',                           },
	circleLargeFilled:                    { name: l10n.t('Circle Large Filled'),                      label: '$(circle-large-filled)',                     },
	circleLargeOutline:                   { name: l10n.t('Circle Large Outline'),                     label: '$(circle-large-outline)',                    },
	circleOutline:                        { name: l10n.t('Circle Outline'),                           label: '$(circle-outline)',                          },
	circleSlash:                          { name: l10n.t('Circle Slash'),                             label: '$(circle-slash)',                            },
	circuitBoard:                         { name: l10n.t('Circuit Board'),                            label: '$(circuit-board)',                           },
	clearAll:                             { name: l10n.t('Clear All'),                                label: '$(clear-all)',                               },
	clippy:                               { name: l10n.t('Clippy'),                                   label: '$(clippy)',                                  },
	clock:                                { name: l10n.t('Clock'),                                    label: '$(clock)',                                   },
	clone:                                { name: l10n.t('Clone'),                                    label: '$(clone)',                                   },
	close:                                { name: l10n.t('Close'),                                    label: '$(close)',                                   },
	closeAll:                             { name: l10n.t('Close All'),                                label: '$(close-all)',                               },
	closeDirty:                           { name: l10n.t('Close Dirty'),                              label: '$(close-dirty)',                             },
	cloud:                                { name: l10n.t('Cloud'),                                    label: '$(cloud)',                                   },
	cloudDownload:                        { name: l10n.t('Cloud Download'),                           label: '$(cloud-download)',                          },
	cloudUpload:                          { name: l10n.t('Cloud Upload'),                             label: '$(cloud-upload)',                            },
	code:                                 { name: l10n.t('Code'),                                     label: '$(code)',                                    },
  coffee:                               { name: l10n.t('Coffee'),                                   label: '$(coffee)',                                  },
	collapseAll:                          { name: l10n.t('Collapse All'),                             label: '$(collapse-all)',                            },
	colorMode:                            { name: l10n.t('Color Mode'),                               label: '$(color-mode)',                              },
	combine:                              { name: l10n.t('Combine'),                                  label: '$(combine)',                                 },
	comment:                              { name: l10n.t('Comment'),                                  label: '$(comment)',                                 },
	commentAdd:                           { name: l10n.t('Comment Add'),                              label: '$(comment-add)',                             },
	commentDiscussion:                    { name: l10n.t('Comment Disucussion'),                      label: '$(comment-discussion)',                      },
  commentDraft:                         { name: l10n.t('Comment Draft'),                            label: '$(comment-draft)',                           },
  commentUnresolved:                    { name: l10n.t('Comment Unresolved'),                       label: '$(comment-unresolved)',                      },
	compareChanges:                       { name: l10n.t('Compare Change'),                           label: '$(compare-changes)',                         },
  compassActive:                        { name: l10n.t('Compass Active'),                           label: '$(compass-active)',                          },
  compassDot:                           { name: l10n.t('Compass Dot'),                              label: '$(compass-dot)',                             },
  compass:                              { name: l10n.t('Compass'),                                  label: '$(compass)',                                 },
	console:                              { name: l10n.t('Console'),                                  label: '$(console)',                                 },
  copilot:                              { name: l10n.t('Copilot'),                                  label: '$(copilot)',                                 },
	creditCard:                           { name: l10n.t('Credit Card'),                              label: '$(credit-card)',                             },
	dash:                                 { name: l10n.t('Dash'),                                     label: '$(dash)',                                    },
	dashboard:                            { name: l10n.t('Dashboard'),                                label: '$(dashboard)',                               },
	database:                             { name: l10n.t('Datebase'),                                 label: '$(database)',                                },
  debugAll:                             { name: l10n.t('Debug All'),                                label: '$(debug-all)',                               },
	debug:                                { name: l10n.t('Debug'),                                    label: '$(debug)',                                   },
	debugAlt:                             { name: l10n.t('Debug Alt'),                                label: '$(debug-alt)',                               },
	debugAltSmall:                        { name: l10n.t('Debug Alt Small'),                          label: '$(debug-alt-small)',                         },
	debugBreakpoint:                      { name: l10n.t('Debug Breakpoint'),                         label: '$(debug-breakpoint)',                        },
	debugBreakpointConditional:           { name: l10n.t('Debug Breakpoint Conditional'),             label: '$(debug-breakpoint-conditional)',            },
	debugBreakpointConditionalDisabled :  { name: l10n.t('Debug Breakpoint Conditional Disabled'),    label: '$(debug-breakpoint-conditional-disabled)',   },
	debugBreakpointConditionalUnverified: { name: l10n.t('Debug Breakpoint Conditional Univerified'), label: '$(debug-breakpoint-conditional-unverified)', },
	debugBreakpointData:                  { name: l10n.t('Debug Breakpoint Data'),                    label: '$(debug-breakpoint-data)',                   },
	debugBreakpointDataDisabled:          { name: l10n.t('Debug Breakpoint Data Disbaled'),           label: '$(debug-breakpoint-data-disabled)',          },
	debugBreakpointDataUnverified:        { name: l10n.t('Debug Breakpoint Data Unverified'),         label: '$(debug-breakpoint-data-unverified)',        },
	debugBreakpointDisabled:              { name: l10n.t('Debug Breakpoint Disabled'),                label: '$(debug-breakpoint-disabled)',               },
	debugBreakpointFunction:              { name: l10n.t('Debug Breakpoint Function'),                label: '$(debug-breakpoint-function)',               },
	debugBreakpointFunctionDisabled:      { name: l10n.t('Debug Breakpoint Function Disabled'),       label: '$(debug-breakpoint-function-disabled)',      },
	debugBreakpointFunctionUnverified:    { name: l10n.t('Debug Breakpoint Function Unverified'),     label: '$(debug-breakpoint-function-unverified)',    },
	debugBreakpointLog:                   { name: l10n.t('Debug Breakpoint Log'),                     label: '$(debug-breakpoint-log)',                    },
	debugBreakpointLogDisabled:           { name: l10n.t('Debug Breakpoint Log Disabled'),            label: '$(debug-breakpoint-log-disabled)',           },
	debugBreakpointLogUnverified:         { name: l10n.t('Debug Breakpoint Log Unverified'),          label: '$(debug-breakpoint-log-unverified)',         },
	debugBreakpointUnsupported:           { name: l10n.t('Debug Breakpoint Unsupported'),             label: '$(debug-breakpoint-unsupported)',            },
	debugBreakpointUnverified:            { name: l10n.t('Debug Breakpoint Unverified'),              label: '$(debug-breakpoint-unverified)',             },
	debugConsole:                         { name: l10n.t('Debug Console'),                            label: '$(debug-console)',                           },
  debugContinueSmall:                   { name: l10n.t('Debug Continue Small'),                     label: '$(debug-continue-small)',                    },
	debugContinue:                        { name: l10n.t('Debug Continue'),                           label: '$(debug-continue)',                          },
  debugCoverage:                        { name: l10n.t('Debug Coverage'),                           label: '$(debug-coverage)',                          },
	debugDisconnect:                      { name: l10n.t('Debug Disconnect'),                         label: '$(debug-disconnect)',                        },
	debugHint:                            { name: l10n.t('Debug Hint'),                               label: '$(debug-hint)',                              },
  debugLineByLine:                      { name: l10n.t('Debug Line By Line'),                       label: '$(debug-line-by-line)',                      },
	debugPause:                           { name: l10n.t('Debug Pause'),                              label: '$(debug-pause)',                             },
	debugRerun:                           { name: l10n.t('Debug Rerun'),                              label: '$(debug-rerun)',                             },
  debugRestart:                         { name: l10n.t('Debug Restart'),                            label: '$(debug-restart)',                           },
	debugRestertFrame:                    { name: l10n.t('Debug Restart Frame'),                      label: '$(debug-restart-frame)',                     },
	debugReverseContinue:                 { name: l10n.t('Debug Reverse Continue'),                   label: '$(debug-reverse-continue)',                  },
	debugStackframe:                      { name: l10n.t('Debug Stackframe'),                         label: '$(debug-stackframe)',                        },
	debugStackframeActive:                { name: l10n.t('Debug Stackframe Active'),                  label: '$(debug-stackframe-active)',                 },
	debugStackframeDot:                   { name: l10n.t('Debug Stackframe Dot'),                     label: '$(debug-stackframe-dot)',                    },
	debugStackframeFocused:               { name: l10n.t('Debug Stackframe Focused'),                 label: '$(debug-stackframe-focused)',                },
	debugStart:                           { name: l10n.t('Debug Start'),                              label: '$(debug-start)',                             },
	debugStepBack:                        { name: l10n.t('Debug Step Back'),                          label: '$(debug-step-back)',                         },
	debugStepInto:                        { name: l10n.t('Debug Step Into'),                          label: '$(debug-step-into)',                         },
	debugStepOut:                         { name: l10n.t('Debug Step Out'),                           label: '$(debug-step-out)',                          },
	debugStepOver:                        { name: l10n.t('Debug Step Over'),                          label: '$(debug-step-over)',                         },
	debugStop:                            { name: l10n.t('Debug Stop'),                               label: '$(debug-stop)',                              },
	desktopDownload:                      { name: l10n.t('Desktop Download'),                         label: '$(desktop-download)',                        },
	deviceCamera:                         { name: l10n.t('Device Camera'),                            label: '$(device-camera)',                           },
	deviceCameraVideo:                    { name: l10n.t('Device Camera Video'),                      label: '$(device-camera-video)',                     },
	deviceDesktop:                        { name: l10n.t('Device Desktop'),                           label: '$(device-desktop)',                          },
	deviceMobile:                         { name: l10n.t('Device Mobile'),                            label: '$(device-mobile)',                           },
	diff:                                 { name: l10n.t('Diff'),                                     label: '$(diff)',                                    },
	diffAdded:                            { name: l10n.t('Diff Added'),                               label: '$(diff-added)',                              },
	diffIgnored:                          { name: l10n.t('Diff Ignored'),                             label: '$(diff-ignored)',                            },
	diffModified:                         { name: l10n.t('Diff Modified'),                            label: '$(diff-modified)',                           },
	diffRemoved:                          { name: l10n.t('Diff Removed'),                             label: '$(diff-removed)',                            },
	diffRenamed:                          { name: l10n.t('Diff Renamed'),                             label: '$(diff-renamed)',                            },
	discard:                              { name: l10n.t('Discard'),                                  label: '$(discard)',                                 },
	edit:                                 { name: l10n.t('Edit'),                                     label: '$(edit)',                                    },
	editorLayout:                         { name: l10n.t('Editor Layout'),                            label: '$(editor-layout)',                           },
	ellipsis:                             { name: l10n.t('Ellipsis'),                                 label: '$(ellipsis)',                                },
	emptyWindow:                          { name: l10n.t('Empty Window'),                             label: '$(empty-window)',                            },
  errorSmall:                           { name: l10n.t('Error Small'),                              label: '$(error-small)',                             },
	error:                                { name: l10n.t('Error'),                                    label: '$(error)',                                   },
	exclude:                              { name: l10n.t('Exclude'),                                  label: '$(exclude)',                                 },
	expandAll:                            { name: l10n.t('Expand All'),                               label: '$(expand-all)',                              },
	export:                               { name: l10n.t('Export'),                                   label: '$(export)',                                  },
	extensions:                           { name: l10n.t('Extensions'),                               label: '$(extensions)',                              },
	eye:                                  { name: l10n.t('Eye'),                                      label: '$(eye)',                                     },
	eyeClosed:                            { name: l10n.t('Eye Closed'),                               label: '$(eye-closed)',                              },
	eyeUnwatch:                           { name: l10n.t('Eye Unwatch'),                              label: '$(eye-unwatch)',                             },
	eyeWatch:                             { name: l10n.t('Eye Watch'),                                label: '$(eye-watch)',                               },
} as const;

export default icons;