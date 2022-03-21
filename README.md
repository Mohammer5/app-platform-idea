# Advantages

* No more copying files into a `.d2` folder
* Leverage on `create-react-app` for jest tests and starting the app in dev
  mode
* Use `yarn pack` instead of our own custom logic for packing the apps
* Apps can be put on npm instead of us having to store them
* Much leaner code base in `cli-app-scripts`
* Nudging instead of IoC
  * Provides an escape hatch if really needed
  * Allows us to put anything into CRA's `public` folder
* `d2-app-scripts init` is a wrapper for `create-react-app init --template dhis2-app`
  * Plus some preflight scripts for translations
* Apps are build as npm modules, making it easier to release apps that can be
  widgets, too
* Apps will be subject to the npm audit process, making security issues more
  visible
* Provides a clear way forward for a true app shell that can load the different
  apps
* Changes to files like the `index.js` can be applied with code-mods
* Easier to use the building blocks of the app shell as escape hatch
* Easier usage to update legacy apps with old react versions as react 17 has
  the batteries included for that

## Notes on the "nudging instead of IoC"

IoC allows us to "force" users of our tools to do it the way we want it. The
nudging approach goes the same direction. Modifying CRA code makes it a lot
harder to reproduce what we're providing (with the `<Shell />`), so users will
naturally rely on keep using things the way they are.

# Remarks

## Transition period

For a (long) time we would have to support botht he old app-platform way and the
new one. This would be the case regardless of whether we go for the new
approach of the old one, either way, we'll have to have some way to support
both ways.

If we don't want to go down that route, we can just use what `create-react-app
build` provides to have a working app that includes the headbar, etc
