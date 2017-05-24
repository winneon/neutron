# neutron

![demo](http://i.imgur.com/u8Ph9W6.gif)

Neutron (name to be changed) is a desktop front-end for Spansh's popular [Neutron Router](https://www.spansh.co.uk/) for the space exploration, trading, and combat game, Elite: Dangerous. In addition to everything the Neutron Router offers, this front-end also provides real-time updates as you play, automatically copying new systems into your clipboard, and updating the remaining jump counts.

## Features

* Long-range route plotting.
* Less time per route by plotting to discovered neutron stars.
* Real-time updates on remaining jumps and upcoming systems.
* Auto-replotting when a detour is detected.
* Manual route controls.
* A sexy interface.

## Installation

Currently, Neutron is Windows x64 only, however I will expand it to macOS in the near future. The primary Elite: Dangerous user base is Windows, so I don't feel *too* bad about my laziness.

### Stable

To install, go to the [latest release]( https://github.com/winneon/neutron/releases/latest), download the neutron.exe file, and run it! It's that simple! Neutron should be available as shortcuts on your desktop and start menu afterwards.

### Dev

Clone this repository and build the application. Run the following commands to do just that. Afterwards, the executable along with accompanying files will be found in `dist/win-unpacked`.

```bash
$ git clone https://github.com/winneon/neutron
$ cd neutron && npm install
$ npm run pack
```

## Troubleshooting

If you are having any problems that are not listed below, feel free to create an issue detailing your problem. Please try to provide as much information as possible, as I am not an omniscient being.

### I got a scary Windows error saying it protected my PC!

This is because I don't have upwards of $200 to pay for a code-signing certificate right now. Windows sees that the application is unsigned, and does the logical thing: blocks it. That's okay. If you got a Windows error, click "More Info" and a "Run Anyway" button should appear. Try that and see how it goes. If you got an antivirus error, try allowing the application to go through the antivirus temporarily.

### My antivirus came up when installing this!

See the above.

### My location says "Unknown" when I'm in a system in-game!

First try restarting the app, and if that fails, jump to a new system. I'm currently unsure as to why this issue is occurring, but trying those two fixes seems to do the job for now.

### My jumps left and total jumps left both show "???"!

This is because either EDSM does not know the coordinates of the system you're in, or you're not in the system you set as the source system. The app has already taken care of this. Jump to your "Next System" and the app should update accordingly with the proper info.

## Credit

Obviously, I could not have done this without Spansh's amazing [Neutron Router](https://www.spansh.co.uk/) tool. I've used his/her tool countless times, and it has saved me so much time when going on a long trip across the galaxy. Be sure to check it out!
