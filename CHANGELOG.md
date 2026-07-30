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
