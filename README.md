<div align="center" style="text-align:center;">
	<h1>Command Launcher</h1>
	<p>A launcher extension that manages commands for the command palette and terminal command.</p>
	<div>
		<img alt="Version" src="https://img.shields.io/github/package-json/version/angelmaneuver/command-launcher?color=blue" />
		<img alt="Installs" src="https://img.shields.io/visual-studio-marketplace/i/Angelmaneuver.command-launcher" />
		<a href="https://codeclimate.com/github/Angelmaneuver/command-launcher/maintainability"><img src="https://api.codeclimate.com/v1/badges/423732b5edf0ced05786/maintainability" /></a>
		<a href="https://codeclimate.com/github/Angelmaneuver/command-launcher/test_coverage"><img src="https://api.codeclimate.com/v1/badges/423732b5edf0ced05786/test_coverage" /></a>
		<a href="https://github.com/Angelmaneuver/wallpaper-setting/issues">
			<img alt="Issues" src="https://img.shields.io/github/issues/Angelmaneuver/command-launcher?color=#86D492" />
		</a>
	</div>
</div>

## Usage
### Step1.
Press `⇧⌘P` to bring up the command pallete and enter '`Command Launcher - Edit`'.

![Usage Step1. image](resource/readme/usage1.png)

### Step2.
Customize the menu as you like.

![Usage Step2. image](resource/readme/usage2.png)

### Step3.
Press `⇧⌘P` to bring up the command pallete and enter '`Command Launcher`'.

![Usage Step3-1. image](resource/readme/usage3-1.png)

Your own toolbox is ready!

![Usage Step3-2. image](resource/readme/usage3-2.png)

## Feature
### Easy Setup
Just follow the guide to easily set the menu.

![Easy Setup image](resource/readme/demo1.gif)

### Command - Calling other extension
Check the `Feature Contributions` -> `Commands` -> `Name` of the extension you wish to call.

Set its value as a command.

![Checkout1 image](resource/readme/demo2.png)

### Command - Calling VSCode's command
First, `Command Pallete` -> `Gear` in that order.

![Checkout2-1 image](resource/readme/demo3.png)

The value entered in the filter is the value of the command you wish to call.

![Checkout2-2 image](resource/readme/demo4.png)

### Terminal Command - Execute Terminal's command
You can execute terminal commands from the menu.

![Execute terminal command image](resource/readme/demo7.gif)

#### Singleton
Are there any terminal commands that keep working? (e.g, a command that detects file change and recompiles them etc...)

The singleton feature allows you to have only one process execute that commands.

No more need to switch terminals!

![Singleton image](resource/readme/demo9.gif)

#### History
Having trouble entering the same terminal commands?

The history function eliminates that difficulty.

##### Usage
Press '⇧⌘P' to bring up the command pallete and enter 'Command Launcher - History'.

\* The history function is disabled by default.

![History image](resource/readme/demo8.png)

### Folder
You can create folders to manage commands.

![Folder image](resource/readme/demo5.gif)

### Uninstall
Didn't like this extension?

Sorry for not being able to help you.

Let's uninstall it and erase all settings related to this extension.

It won't pollute your environment.

![Uninstall image](resource/readme/demo6.gif)

## Cautions
### How will this extension affect your environment?
This extension will make changes to the following file.

1. settings.json
