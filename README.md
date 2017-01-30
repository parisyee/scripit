# Script-it

A web based screenplay editor build with React and Rails.

### Stack
- Rails JSON API
- React (react_on_rails gem)

### The problem

There are (at least) 8 distinct *types* of screenplay elements - headings, actions,
characters, dialogue, parentheticals, transitions, shots, and titles.

This tricky part of any screenplay editor is in the challenge of formatting
differnt element types. There are many approaches to this problem, the most
common being matching the whole screenplay text to a Regex to spit it into
elements, and injecting the various elements into differently styled HTML tags.

The problem with this is that if the writer is not dogmatic about whitespace and
capitalization (in accordance with the formatting rules the developer used to
define the Regex) the format can suffere dramatically and make the screenplay
illegable. This happens mostly when text is cut and/or pasted from/to the
screenplay body.

### My approach

Treat the screenplay not as a single text block, but as a collection of distinct
elements. These elements are styled based on their type, and their contents are
not inferred by where and how they fall within the context of the greater
document as a whole.

I do this by injecting a series of contneteditable divs that act as fake
textareas. Each div corresponds to a unique javascript object that is
responsible for tracking the caching of that element along with any attribues
that correspond to how it should be styled. (I would later discover that this
the approach Facebook took when creating their DRAFT editor).

Check out
`client/app/bundles/workspace/components/screenplay-element.jsx` and
`client/app/bundles/workspace/components/screenplay-element-list.jsx` for the
good stuff ;)

### TODO

This is a proof of concept to see if the formatting aspect could be made trivial
by utilizing React. My goal is to use Google Drive to store all screenplay data,
instead of Postgres. The screenwriting community is untrusting of web based
services after a popular one lost terabytes of screenplay data a few years ago.
Using Drive would allow for a user-owned cloud solution that would also provied
local file syncing and backups (working off line is a must have). Additionally,
there are Drive APIs for Android and iOS, and the native mobile application
route is really what drove me to start playing around with this idea.

- Ditch the react_on_rails gem for a custom webpack2 setup
- Users and auth. Right now the heroku app is just behind http basic auth since
  I'm the only one using it.
- Convert components to ES6 classes.
- Transition from Postgres as the primary means of screenplay data storage to
  Google Drive/Dropbox.
