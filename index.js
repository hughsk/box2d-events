var EventEmitter = require('events').EventEmitter

module.exports = box2dEvents

function box2dEvents(Box2D, world) {
  var b2ContactListener = Box2D.Dynamics.b2ContactListener
  var b2Fixture = Box2D.Dynamics.b2Fixture

  var destroy = b2Fixture.prototype.Destroy
  var listener = new b2ContactListener
  var emitter = new EventEmitter
  var fixtures = []
  var fixcount = 0

  if (world.__events) {
    return world.__events
  }

  b2Fixture.prototype.Destroy = function() {
    var idx = fixtures.indexOf(this)
    if (idx !== -1) {
      fixtures[idx].emitter.emit('destroy')
      fixtures.splice(idx, 1)
      delete fixtures.emitter
      destroy.call(this)
    }
  }

  listener.BeginContact = function(contact) {
    emitter.emit('begin'
      , contact.m_fixtureA
      , contact.m_fixtureB
      , contact
    )

    for (var i = 0; i < fixcount; i += 1) {
      if (contact.m_fixtureA === fixtures[i]) {
        fixtures[i].emitter.emit('begin'
          , contact.m_fixtureB
          , contact.m_fixtureA
          , contact
        )
      } else
      if (contact.m_fixtureB === fixtures[i]) {
        fixtures[i].emitter.emit('begin'
          , contact.m_fixtureA
          , contact.m_fixtureB
          , contact
        )
      }
    }
  }

  listener.EndContact = function(contact) {
    emitter.emit('end'
      , contact.m_fixtureA
      , contact.m_fixtureB
      , contact
    )

    for (var i = 0; i < fixcount; i += 1) {
      if (contact.m_fixtureA === fixtures[i]) {
        fixtures[i].emitter.emit('end'
          , contact.m_fixtureB
          , contact.m_fixtureA
          , contact
        )
      } else
      if (contact.m_fixtureB === fixtures[i]) {
        fixtures[i].emitter.emit('end'
          , contact.m_fixtureA
          , contact.m_fixtureB
          , contact
        )
      }
    }
  }

  emitter.fixture = function(fixture) {
    var fixtureEmitter = new EventEmitter

    fixcount += 1
    fixture.emitter = fixtureEmitter
    fixtures.push(fixture)

    return fixtureEmitter
  }

  world.SetContactListener(listener)
  world.__events = emitter

  return emitter
}
