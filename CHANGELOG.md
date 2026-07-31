# Change Log

All notable changes to the "tinynpm" extension will be documented in this file.

This project adheres to [Keep a Changelog](http://keepachangelog.com/) conventions.

## [0.0.1] - Initial release

- Hover on a dependency version to see the latest published version and a "buffered" (age-gated) safer version, with one-click update actions
- Hover on a dependency name to see its description, dependency count, staleness, and weekly download count, each with a security-oriented warning indicator
- `.npmrc`-aware resolution for packages hosted on private registries
- Configurable `tinynpm.versionBufferPeriod` setting

## [0.1.2] - Socker.dev and bug patch

- Now shows a link (as a shield) to the socket.dev page for a package
- Removes an annoying popup everytime you updated a packages version

## [0.1.3] - Reduce size of demo gif

- Reduced the size of the demo gif as it inflated the package size

## [0.1.4] - Better documentation

- README didnt really describe the project well so i updated it

## [0.1.5] - Add License

- We need a license to publish to open-vsx

## [0.2.0] - UI Overhaul

- The old UI clashed with the built in npm extension supplied by VS Code. A core feature of this project is that it shouldn't clash with any other extensions (except other package.json version keepers). So 0.2.0 comes with a complete overhaul of the hover menu and what triggers it to show up.
- Now the security analysis and version change hover menu have been combined. The new menu will only showup when you hover over the version colored decorator.
- Improvemts to the hover menu ui to make it more fluid and less like a wall of text.
- Various performance improvements
- We now publish to open-vsx as well as the vs code extension store!

## [0.2.2] - Better error handling

- Gracefully handle errors and log to output channel