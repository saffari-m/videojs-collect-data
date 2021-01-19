import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';
// import plugin from '../src/plugin';

// const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  // assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-collect-data', {
  beforeEach() {
    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

// QUnit.test('registers itself with video.js', function(assert) {
//   assert.expect(2);

//   assert.strictEqual(typeof Player.prototype.collectData, 'function', 'videojs-collect-data plugin was registered');

//   const collectionDataConfig = {
//     intervalTime: 1000,
//     requiredParameter: [
//       { name: 'require1', value: 'require1_value' },
//       { name: 'require2', value: 2 },
//       { name: 'require3', value: true }
//     ],
//     action: {
//       name: 'Temp',
//       method: 'POST',
//       url: 'https://example.com/api/v1/temp',
//       body: {
//         params: {
//           p1: 'p1_value',
//           p2: 'p2_value',
//           propertyName: {
//             p3: 'FG-VIDEO_HALF_TIME',
//             p4: 'FG-VIDEO_CURRENT_TIME',
//             p5: 'FG-DEVICE_RESOLUTION'
//           }
//         },
//         config: {
//           targetParam: 'propertyName'
//         }
//       }
//     },
//     altAction: [
//       {
//         name: 'Temp2',
//         method: 'POST',
//         url: 'https://example.com/api/v1/temp2',
//         body: {
//           params: {
//             p1: 'FG-VIDEO_HALF_TIME',
//             p2: 'FG-VIDEO_CURRENT_TIME',
//             p3: 'FG-DEVICE_RESOLUTION'
//           }
//         }
//       }
//     ]
//   };

//   this.player.collectData(collectionDataConfig);

//   // Tick the clock forward enough to trigger the player to be "ready".
//   this.clock.tick(1);

//   assert.ok(this.player.hasClass('vjs-collect-data'), 'the plugin adds a class to the player');
// });
