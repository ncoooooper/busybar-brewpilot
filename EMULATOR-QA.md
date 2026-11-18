# Firmware verification

BUSY Bar Emulator 0.1.0-beta.5, firmware 1.3.1.

Ran a complete French press session at 16 g coffee and 240 g water. Tested pause, resume, advancing the emulator clock past the first deadline, all three steps and clean exit (70.8 KiB peak).

The app was typechecked, built, installed and exercised on the emulator. Native captures are under screenshots/. The tested installable archive is in packages/.

Firmware motion pass: up, ok, up, ok. 24 distinct frames in the controls recording. App io.ncoooooper.brewpilot exited: finished; heap peak 81.2 of 128 KiB.
