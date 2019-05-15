"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHappoRun = exports.setDefaultDelay = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _client = _interopRequireDefault(require("@storybook/core/client"));

var time = window.happoTime || {
  originalDateNow: Date.now,
  originalSetTimeout: window.setTimeout.bind(window)
};
var ASYNC_TIMEOUT = 100;
var examples;
var currentIndex = 0;
var defaultDelay;

function waitForContent(_x) {
  return _waitForContent.apply(this, arguments);
}

function _waitForContent() {
  _waitForContent = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(elem) {
    var start,
        html,
        duration,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            start = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : time.originalDateNow();
            html = elem.innerHTML.trim();
            duration = time.originalDateNow() - start;

            if (!(html === '' && duration < ASYNC_TIMEOUT)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", new Promise(function (resolve) {
              return time.originalSetTimeout(function () {
                return resolve(waitForContent(elem, start));
              }, 10);
            }));

          case 5:
            return _context2.abrupt("return", html);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _waitForContent.apply(this, arguments);
}

function getExamples() {
  var storyStore = __STORYBOOK_CLIENT_API__._storyStore;
  var result = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = __STORYBOOK_CLIENT_API__.getStorybook()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var story = _step.value;
      var component = story.kind;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = story.stories[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var example = _step2.value;
          var variant = example.name;
          var delay = defaultDelay;

          if (storyStore.getStoryAndParameters) {
            var _storyStore$getStoryA = storyStore.getStoryAndParameters(story.kind, variant),
                _storyStore$getStoryA2 = _storyStore$getStoryA.parameters.happo,
                happo = _storyStore$getStoryA2 === void 0 ? {} : _storyStore$getStoryA2;

            if (happo === false) {
              continue;
            }

            delay = happo.delay || defaultDelay;
          }

          var storyId = (_client.default.toId || function () {
            return undefined;
          })(story.kind, variant);

          result.push({
            component: component,
            variant: variant,
            delay: delay,
            storyId: storyId
          });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
}

window.happo = {};

window.happo.initChunk = function (_ref) {
  var index = _ref.index,
      total = _ref.total;
  var all = getExamples();
  var examplesPerChunk = Math.ceil(all.length / total);
  var startIndex = index * examplesPerChunk;
  var endIndex = startIndex + examplesPerChunk;
  examples = all.slice(startIndex, endIndex);
};

window.happo.nextExample =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var _examples$currentInde, component, variant, storyId, delay, rootElement;

  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!examples) {
            examples = getExamples();
          }

          if (!(currentIndex >= examples.length)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          _examples$currentInde = examples[currentIndex], component = _examples$currentInde.component, variant = _examples$currentInde.variant, storyId = _examples$currentInde.storyId, delay = _examples$currentInde.delay;
          _context.prev = 4;
          rootElement = document.getElementById('root');
          rootElement.setAttribute('data-happo-ignore', 'true');

          __STORYBOOK_ADDONS_CHANNEL__.emit('setCurrentStory', {
            kind: component,
            story: variant,
            storyId: storyId
          });

          _context.next = 10;
          return new Promise(function (resolve) {
            return time.originalSetTimeout(resolve, 0);
          });

        case 10:
          _context.next = 12;
          return waitForContent(rootElement);

        case 12:
          if (!/sb-show-errordisplay/.test(document.body.className)) {
            _context.next = 16;
            break;
          }

          // It's possible that the error is from unmounting the previous story. We
          // can try re-rendering in this case.
          __STORYBOOK_ADDONS_CHANNEL__.emit('forceReRender');

          _context.next = 16;
          return waitForContent(rootElement);

        case 16:
          _context.next = 18;
          return new Promise(function (resolve) {
            return time.originalSetTimeout(resolve, delay);
          });

        case 18:
          return _context.abrupt("return", {
            component: component,
            variant: variant
          });

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](4);
          console.warn(_context.t0);
          return _context.abrupt("return", {
            component: component,
            variant: variant
          });

        case 25:
          _context.prev = 25;
          currentIndex++;
          return _context.finish(25);

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[4, 21, 25, 28]]);
}));

var setDefaultDelay = function setDefaultDelay(delay) {
  defaultDelay = delay;
};

exports.setDefaultDelay = setDefaultDelay;

var isHappoRun = function isHappoRun() {
  return window.__IS_HAPPO_RUN;
};

exports.isHappoRun = isHappoRun;
