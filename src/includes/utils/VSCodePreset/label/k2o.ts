import { l10n } from 'vscode';

const icons = {
	kebabHorizontal:                      { name: l10n.t('Kebab Horizontal'),         label: '$(kebab-horizontal)',                        },
	kebabVertical:                        { name: l10n.t('Kebab Vertical'),           label: '$(kebab-vertical)',                          },
	key:                                  { name: l10n.t('Key'),                      label: '$(key)',                                     },
	keyboard:                             { name: l10n.t('Keyboard'),                 label: '$(keyboard)',                                },
	law:                                  { name: l10n.t('Law'),                      label: '$(law)',                                     },
  layersActive:                         { name: l10n.t('Layers Active'),            label: '$(layers-active)',                           },
  layersDot:                            { name: l10n.t('Layers Dot'),               label: '$(layers-dot)',                              },
  layers:                               { name: l10n.t('Layers'),                   label: '$(layers)',                                  },
  layoutActivitybarLeft:                { name: l10n.t('Layout Activitybar Left'),  label: '$(layout-activitybar-left)',                 },
  layoutActivitybarRight:               { name: l10n.t('Layout Activitybar Right'), label: '$(layout-activitybar-right)',                },
  layoutCentered:                       { name: l10n.t('Layout Centered'),          label: '$(layout-centered)',                         },
  layoutMenubar:                        { name: l10n.t('Layout Menubar'),           label: '$(layout-menubar)',                          },
  layoutPanelCenter:                    { name: l10n.t('Layout Panel Center'),      label: '$(layout-panel-center)',                     },
  layoutPanelJustify:                   { name: l10n.t('Layout Panel Justify'),     label: '$(layout-panel-justify)',                    },
  layoutPanelLeft:                      { name: l10n.t('Layout Panel Left'),        label: '$(layout-panel-left)',                       },
  layoutPanelRight:                     { name: l10n.t('Layout Panel Right'),       label: '$(layout-panel-right)',                      },
  layoutPanel:                          { name: l10n.t('Layout Panel'),             label: '$(layout-panel)',                            },
  layoutSidebarLeft:                    { name: l10n.t('Layout Sidebar Left'),      label: '$(layout-sidebar-left)',                     },
  layoutSidebarRight:                   { name: l10n.t('Layout Sidebar Right'),     label: '$(layout-sidebar-right)',                    },
  layoutStatusbar:                      { name: l10n.t('Layout Statusbar'),         label: '$(layout-statusbar)',                        },
  layout:                               { name: l10n.t('Layout'),                   label: '$(layout)',                                  },
	library:                              { name: l10n.t('Library'),                  label: '$(library)',                                 },
	lightBulb1:                           { name: l10n.t('Light Bulb'),               label: '$(light-bulb)',                              },
	lightBulb2:                           { name: l10n.t('Ligth Bulb'),               label: '$(lightbulb)',                               },
	ligthbulbAutofix:                     { name: l10n.t('Ligth Bulb Autofix'),       label: '$(lightbulb-autofix)',                       },
	link:                                 { name: l10n.t('Link'),                     label: '$(link)',                                    },
	linkExternal:                         { name: l10n.t('Link External'),            label: '$(link-external)',                           },
	listFilter:                           { name: l10n.t('List Filter'),              label: '$(list-filter)',                             },
	listFlat:                             { name: l10n.t('List Flat'),                label: '$(list-flat)',                               },
	listOrdered:                          { name: l10n.t('List Ordered'),             label: '$(list-ordered)',                            },
	listSelection:                        { name: l10n.t('List Selection'),           label: '$(list-selection)',                          },
	listTree:                             { name: l10n.t('List Tree'),                label: '$(list-tree)',                               },
	listUnordered:                        { name: l10n.t('List Unordered'),           label: '$(list-unordered)',                          },
	liveShare:                            { name: l10n.t('Live Share'),               label: '$(live-share)',                              },
	loading:                              { name: l10n.t('Loading'),                  label: '$(loading)',                                 },
	location:                             { name: l10n.t('Location'),                 label: '$(location)',                                },
  lockSmall:                            { name: l10n.t('Lock Small'),               label: '$(lock-small)',                              },
	lock:                                 { name: l10n.t('Lock'),                     label: '$(lock)',                                    },
	logIn:                                { name: l10n.t('Login'),                    label: '$(log-in)',                                  },
	logOut:                               { name: l10n.t('Logout'),                   label: '$(log-out)',                                 },
	logoGithub:                           { name: l10n.t('Logo Github'),              label: '$(logo-github)',                             },
	magnet:                               { name: l10n.t('Magnet'),                   label: '$(magnet)',                                  },
	mail:                                 { name: l10n.t('Mail'),                     label: '$(mail)',                                    },
	mailRead:                             { name: l10n.t('Mail Read'),                label: '$(mail-read)',                               },
	mailReply:                            { name: l10n.t('Mail Reply'),               label: '$(mail-reply)',                              },
	markGithub:                           { name: l10n.t('Mark Github'),              label: '$(mark-github)',                             },
	markdown:                             { name: l10n.t('Markdown'),                 label: '$(markdown)',                                },
	megaphone:                            { name: l10n.t('Megaphone'),                label: '$(megaphone)',                               },
	mention:                              { name: l10n.t('Mention'),                  label: '$(mention)',                                 },
	menu:                                 { name: l10n.t('Menu'),                     label: '$(menu)',                                    },
	merge:                                { name: l10n.t('Merge'),                    label: '$(merge)',                                   },
  mic:                                  { name: l10n.t('Mic'),                      label: '$(mic)',                                     },
  micFilled:                            { name: l10n.t('Mic Filled'),               label: '$(mic-filled)',                              },
	microScope:                           { name: l10n.t('Microscope'),               label: '$(microscope)',                              },
	milestone:                            { name: l10n.t('Milestone'),                label: '$(milestone)',                               },
	mirror:                               { name: l10n.t('Mirror'),                   label: '$(mirror)',                                  },
	mirrorPrivate:                        { name: l10n.t('Mirror Private'),           label: '$(mirror-private)',                          },
	mirrorPublic:                         { name: l10n.t('Mirror Public'),            label: '$(mirror-public)',                           },
	more:                                 { name: l10n.t('More'),                     label: '$(more)',                                    },
	mortarBoard:                          { name: l10n.t('Mortar Board'),             label: '$(mortar-board)',                            },
	move:                                 { name: l10n.t('Move'),                     label: '$(move)',                                    },
	multipleWindows:                      { name: l10n.t('Multiple Windows'),         label: '$(multiple-windows)',                        },
  music:                                { name: l10n.t('Music'),                    label: '$(music)',                                   },
	mute:                                 { name: l10n.t('Mute'),                     label: '$(mute)',                                    },
	newFile:                              { name: l10n.t('New File'),                 label: '$(new-file)',                                },
	newFolder:                            { name: l10n.t('New Folder'),               label: '$(new-folder)',                              },
  newLine:                              { name: l10n.t('NewLine'),                  label: '$(newline)',                                 },
	noNewline:                            { name: l10n.t('No Newline'),               label: '$(no-newline)',                              },
	note:                                 { name: l10n.t('Note'),                     label: '$(note)',                                    },
	notebook:                             { name: l10n.t('Notebook'),                 label: '$(notebook)',                                },
	notebookTemplate:                     { name: l10n.t('Notebook Template'),        label: '$(notebook-template)',                       },
	octoface:                             { name: l10n.t('Octoface'),                 label: '$(octoface)',                                },
	openPreview:                          { name: l10n.t('Open Preview'),             label: '$(open-preview)',                            },
	organization:                         { name: l10n.t('Organization'),             label: '$(organization)',                            },
	organizationFilled:                   { name: l10n.t('Organization Filled'),      label: '$(organization-filled)',                     },
	organizationOutline:                  { name: l10n.t('Organization Outline'),     label: '$(organization-outline)',                    },
	output:                               { name: l10n.t('Output'),                   label: '$(output)',                                  },
} as const;

export default icons;
