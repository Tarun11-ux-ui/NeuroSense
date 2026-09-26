export const MODULE_TASKS: Record<string, string[]> = {
  keystroke: [
    "Please type the following paragraph as naturally as possible: 'The quick brown fox jumps over the lazy dog. It was a bright cold day in April, and the clocks were striking thirteen.'",
    "Type the following sentence: 'Pack my box with five dozen liquor jugs. The five boxing wizards jump quickly.'",
    "Type this out carefully: 'How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow.'"
  ],
  mouse_dfl: [
    "Move your cursor fluidly between the four corners of the capture area below, then draw a continuous figure-8 pattern.",
    "Draw a large circle clockwise, then counter-clockwise inside the capture area.",
    "Trace an imaginary square repeatedly inside the capture area for 10 seconds."
  ],
  mouse_balabit: [
    "Click rapidly inside the capture area 10 times, moving your mouse from the edges to the center.",
    "Click the top-left corner, then the bottom-right corner, alternating 5 times.",
    "Perform 5 double-clicks at random locations within the capture area."
  ],
  voice: [
    "Read the following sentence aloud clearly: 'The steady drip of rain on the tin roof was a comforting sound.' (External microphone telemetry required, load demo to simulate)",
    "Say the days of the week backwards, starting from Sunday. (External microphone telemetry required, load demo to simulate)",
    "Take a deep breath and say 'Ahhhh' for as long as you can. (External microphone telemetry required, load demo to simulate)"
  ],
  gait: [
    "Place your mobile device in your pocket and walk 20 steps forward, turn around, and return. (External accelerometer telemetry required, load demo to simulate)",
    "Walk in a figure-8 pattern around two markers placed 10 feet apart. (External accelerometer telemetry required, load demo to simulate)",
    "Walk heel-to-toe in a straight line for 10 steps. (External accelerometer telemetry required, load demo to simulate)"
  ],
  spiral: [
    "Using a stylus or your finger on a touchscreen device, trace an expanding spiral from the center outwards.",
    "Draw a continuous Archimedean spiral starting from the outside moving inwards.",
    "Draw three concentric circles without lifting your stylus."
  ],
  facial: [
    "Look directly at the camera with a neutral expression for 10 seconds.",
    "Read the provided text while looking at the camera.",
    "Blink naturally while observing the screen."
  ],
  reaction: [
    "Wait for the red box to turn green, then click/tap it as quickly as possible.",
    "Focus on the indicator and tap immediately when the color changes.",
    "Prepare your finger/mouse and click the box the moment it turns green."
  ]
};
