require("famous-polyfills"); // Add polyfills
require("famous/core/famous"); // Add the default css file

Meteor.startup(function() {
  var Engine = require('famous/core/Engine');
  var Scrollview = require('famous/views/Scrollview');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var ReactiveSurface = require('ReactiveSurface');
  
  var mainCtx = Engine.createContext();

  // Create a 3 horitzontal paned layout
  var layout = new HeaderFooterLayout({
    headerSize: 0,
    footerSize: 50
  });

  // Create a scrollview and array to hold surfaces
  var scrollView = new Scrollview();
  var surfaces = [];

  // Create a surface based on data in document
  function createSurface(doc) {
    var s = new ReactiveSurface({
      size: [undefined, 50],
      template: Template.player,
      data: function() { return Players.findOne(doc._id); },
      classes: ["test-surface"]
    });
  
    return s;
  }

  // Re-actively maintain the surfaces array as players change.
  cursorToArray(
    Players.find({}, {sort: {score: -1, name: 1}}),
    surfaces,
    createSurface
  );

  // Include the surfaces in the scrollview and pipe
  // events to it from the engine
  scrollView.sequenceFrom(surfaces);
  scrollView.subscribe(Engine);

  // Link the scrollview to the layout and add the footer
  layout.content.add(scrollView);
  layout.footer.add(new ReactiveSurface({
    size: [undefined, 50],
    template: Template.leaderboard,
    classes: ['footer']
  }));

  mainCtx.add(layout);
});