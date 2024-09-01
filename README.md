<img alt="EyeCatch" src="docs/eyecatch.gif" />

<div align="center" style="text-align:center;">
	<h1>Command Launcher</h1>
	<p>Toolbox to manage your extensions and terminal commands.</p>
	<div>
    <img alt="Version" src="https://img.shields.io/visual-studio-marketplace/v/angelmaneuver.command-launcher?color=blue" />
    <img alt="Language" src="https://img.shields.io/badge/Language-en%2Cja-brightgreen?logo=Language">
		<img alt="Installs" src="https://img.shields.io/visual-studio-marketplace/i/Angelmaneuver.command-launcher" />
		<a href="https://codeclimate.com/github/Angelmaneuver/command-launcher/maintainability"><img src="https://api.codeclimate.com/v1/badges/423732b5edf0ced05786/maintainability" /></a>
		<a href="https://codeclimate.com/github/Angelmaneuver/command-launcher/test_coverage"><img src="https://api.codeclimate.com/v1/badges/423732b5edf0ced05786/test_coverage" /></a>
		<a href="https://github.com/Angelmaneuver/wallpaper-setting/issues">
			<img alt="Issues" src="https://img.shields.io/github/issues/Angelmaneuver/command-launcher?color=#86D492" />
		</a>
	</div>
</div>

## Usage

### Step1. Customize menu

Press `⇧⌘P` to bring up the command pallete and enter '`Command Launcher - Edit`'.

![Usage Step1. Customize menu1 image](docs/usage/usage1.png)

and Customize the menu as you like.

![Usage Step1. Customize menu2 image](docs/usage/usage2.png)

### Step2. Run commands

Press `⇧⌘P` to bring up the command pallete and enter '`Command Launcher`'.

![Usage Step2. Run commands](docs/usage/usage3.png)

Your toolbox is ready!

![Usage Step2. Run commands](docs/usage/usage4.png)

## Feature

### Command - Calling other extension

You can call the extensions you have installed.

<details><summary>Click here to see more detail on how to set up.</summary>

#### How to check the value

Check the Extension's page `FEATURES` -> `Commands` -> `ID` of the extension you wish to call.

Set its value as a command.

![Command1 image](docs/feature/command1-1.png)

\* In the image example, `wallpaper-setting.guidance`.

</details>

### Command - Calling VSCode's command

You can call the VSCode's commands.

<details><summary>Click here to see more detail on how to set up.</summary>

#### How to check the value

First, `Command Pallete` -> `You want to set the VSCode's command` -> `Gear (Configure Keybinding)`.

![Command2-1 image](docs/feature/command2-1.png)

The value entered in the filter is the value of the command you wish to call.

![Command2-2 image](docs/feature/command2-2.png)

\* In the image example, `workbench.action.editor.changeLanguageMode`.

</details>

### Terminal Command - Execute Terminal's command

You can execute terminal commands from the menu.

#### Question

Ability to assemble terminal command by typing or selecting from a pre-created set of choices.

#### Confirm

Ability to run terminal command without automatically run them, but only after confirm to see if they should be run.

#### Singleton

Are there any terminal commands that keep working? (e.g, a command that detects file change and recompiles them etc...)

The singleton feature allows you to have only one process execute that commands.

No more need to switch terminals!

#### Tree View

You can executed commands from the Activitybar.

#### History

Having trouble entering the same terminal commands?

The history function eliminates that difficulty.

### Uninstall

Didn't like this extension?

Sorry for not being able to help you.

Let's uninstall it and erase all settings related to this extension.

It won't pollute your environment.

## Cautions

### How will this extension affect your environment?

This extension will make changes to the following file.

1. settings.json

## External libraries used by this extension

1. [lodash](https://github.com/lodash/lodash)
