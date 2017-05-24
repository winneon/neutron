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

### Beta

To install, go to the [latest release]( https://github.com/winneon/neutron/releases/latest), download the neutron-setup.exe file, and run it! It's that simple! Neutron should be available as shortcuts on your desktop and start menu afterwards.

### Dev

Clone this repository and build the application. Run the following commands to do just that. Afterwards, the executable along with accompanying files will be found in `dist/win-unpacked`.

```bash
$ git clone https://github.com/winneon/neutron
$ cd neutron && npm install
$ npm run pack
```

## Credit

Obviously, I could not have done this without Spansh's amazing [Neutron Router](https://www.spansh.co.uk/) tool. I've used his/her tool countless times, and it has saved me so much time when going on a long trip across the galaxy. Be sure to check it out!
