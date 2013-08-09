# box2d-events #

Box2D's collision event listeners only work (more or less) globally: you
create a listener and attach it to the world, which will get called every time
there's a collision.

To make things a little more managable, here's a module which can take a
[box2dweb-commonjs](http://ghub.io/box2dweb-commonjs) world and give you
an `EventEmitter` in return. You can also listen to individual fixtures
for ease of use.

## Installation ##

``` bash
npm install box2d-events
```

## Usage ##

### `events = require('box2d-events')(Box2D, world)` ###

Returns an `EventEmitter` which will emit the following events:

* `begin(fixtureA, fixtureB, info)` when a collision first occurs between
  two objects.
* `end(fixtureA, fixtureB, info)` when a collision stops occurring between two
  objects.

### `events.fixture(fixture)` ###

Returns an `EventEmitter` which will emit the same events as above, except only
when they involve that specific object. Note that the first fixture will
always be the one *not* belonging to the listener.
