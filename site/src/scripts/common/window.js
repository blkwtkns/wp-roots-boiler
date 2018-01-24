// This minimizes the number of event listeners bound to the window
// Creates a Window singleton that other modules can import
// Can then get the width, height, and scroll position
import $ from 'jquery';
import postal from 'postal';
import throttle from 'lodash/throttle';

import { GLOBAL_CHANNEL } from '../constants/Constants';

const globalChannel = postal.channel(GLOBAL_CHANNEL);
const $window = $(window);
const Window = {
  width: $window.width(),
  height: $window.height(),
  scrollTop: $window.scrollTop()
};

// Throttle the window resize event
// Publish on a channel so other modules can subscribe
// This minimizes the number of event listeners bound to the window
$window.on('resize', throttle(() => {
  const newWidth = $window.width();
  const newHeight = $window.height();

  globalChannel.publish('window.resize', {
    width: newWidth,
    height: newHeight
  });

  Window.width = newWidth;
  Window.height = newHeight;
}, 200));

// Throttle the scroll event and publish
$window.on('scroll', throttle(() => {
  const newScrollTop = $window.scrollTop();

  globalChannel.publish('window.scroll', newScrollTop);

  Window.scrollTop = newScrollTop;
}, 200));

export default Window;
