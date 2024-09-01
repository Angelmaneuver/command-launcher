# Change Log

## 1.1.1

- Fixed a bug that do not executed commands from tree view

## 1.1.0

- Added the feature for command list tree view

## 1.0.2

- Fixed a bug that sometimes prevented a name exist check from working

## 1.0.1

- Fixed incorrect initial value for confirmation, autoRun and singleton when editing terminal commands

## 1.0.0

- Refactoring in anticipation of feature additions
- Added Japanese as supported language
- Activation event changed from immediately after VSCode start-up to when it is invoked from the command palette
- Review control of terminal commands (Fixed to not send commands to terminals executing singleton commands)
- Added the feature to confirm run of terminal commands

## 0.10.3

- Fixed to replace multiple question variable

## 0.10.2

- Fixed a bug related to a Question

## 0.10.1

- Added the "Clear History" function

## 0.10.0

- Commands can now be managed in both user settings and profiles
- Run in VSCode's local extension host (Installation is no longer required with devContainer etc)

## 0.0.9

- Added the "Singleton" function

## 0.0.8

- Added the "History" function (Reflects from issue [#3](https://github.com/Angelmaneuver/command-launcher/issues/3))

## 0.0.7

- Added the "Question" function to assemble terminal commands interactively (Reflects from part of issue [#2](https://github.com/Angelmaneuver/command-launcher/issues/2))

## 0.0.6

- Added the function to configure whether terminal commands should be executed automaticaly or just paste

## 0.0.5

- Fixed typo (Reflects from issue [#1](https://github.com/Angelmaneuver/command-launcher/issues/1))
- Code Review (No additional functions or fixes)

## 0.0.4

- Added the function to also manage commands to be executed in the terminal

## 0.0.3

- Added the function to set the order of commands or folders

## 0.0.2

- Existence check does not work when in rename
- Fixed bug in which using single byte brackets in the name that does not work correctly

## 0.0.1 (Preview)

- Initial release
