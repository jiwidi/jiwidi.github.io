// Leica M3 layout in millimetres. Outer body, flange distance and the
// rangefinder base are published figures; internal positions are
// illustrative (see evidence.md).

export const W = 138;
export const D = 33.5;
export const R_END = 13;
export const Y_BOTTOM = -38.5;
export const Y_BASE = -34.5;
export const Y_SEAM = 17;
export const Y_TOP = 38.5;
export const Z_FRONT = -D / 2;
export const Z_BACK = D / 2;
export const AXIS = [0, -3];
export const FILM_Z = Z_FRONT + 27.8;

export const VF = [-40, 27.5];
export const RF = [28.5, 26];
export const FRAMELINE = [-16, 31];
export const OPTIC_Z = -4;

export const CASSETTE = [-53, 3];
export const TAKEUP = [50, 1.5];
export const SPROCKET = [36, 5];
export const DRUMS = [-24, 24];
export const DRUM_Z = 6.8;
export const GEAR_Y = 19.5;

export const LEVER = [50, 4];
export const DIAL = [22, -2];
export const RELEASE = [42, -8];
export const REWIND = CASSETTE;
export const SHOE = [-8, 0];

export const FILM_X0 = -42;
export const FILM_X1 = 44;
export const LEADER_TIP = -50;
export const FILM_LENGTH = 36 * 38 + 170;

/* Mirror swing is drawn larger than life: the real one turns under 3°. */
export const MIRROR_EXAGGERATION = 3;
export const LEVER_STROKE = 2.35;

/* Which parts get a leader label: outside views and X-ray views. */
export const LABELS = {
  outside: ['vfWindow', 'frameline', 'rfWindow', 'speedDial', 'release', 'lever', 'rewindKnob', 'shoe', 'focusRing', 'apertureRing', 'eyepiece', 'mount'],
  inside: ['cassette', 'film', 'gate', 'curtains', 'sprocket', 'takeup', 'gears', 'splitter', 'rfMirror', 'roller', 'focusCam', 'elements', 'iris', 'pressurePlate'],
};

export const PARTS = {
  body: ['Body', 'Die-cast chassis wrapped in vulcanite. Everything else hangs off it.'],
  topPlate: ['Top plate', 'Brass cover over the viewfinder and rangefinder optics.'],
  bottomPlate: ['Baseplate', 'Twist the key and lift it off to load film from below.'],
  backDoor: ['Back flap', 'Opens to thread the leader. It carries the pressure plate.'],
  pressurePlate: ['Pressure plate', 'Holds the film flat, 27.8 mm behind the lens mount.'],
  mount: ['M bayonet', 'The quick bayonet mount the M3 introduced in 1954.'],
  lens: ['50 mm lens', 'Six glass elements on a focusing helicoid. f/2 is a Summicron. f/1 needs a Noctilux.'],
  focusRing: ['Focus ring', 'Turns the helicoid. The optics move forward for near subjects.'],
  apertureRing: ['Aperture ring', 'Sets the iris from f/1 to f/16. Click it to change.'],
  iris: ['Aperture iris', 'Ten blades. A smaller hole gives less light and more depth of field.'],
  elements: ['Lens elements', 'Double-Gauss glass that forms the image on the film.'],
  focusCam: ['Focusing cam', 'Rear ring of the lens. It moves with focus and pushes the roller.'],
  roller: ['Roller follower', 'Reads the lens position and swings the rangefinder mirror.'],
  rfMirror: ['Rangefinder mirror', 'Pivots behind the small window. Its angle measures distance.'],
  splitter: ['Beam splitter', 'Half-silvered prism. It lays the rangefinder image over the finder image.'],
  frameline: ['Bright-line mask', 'Lit by the frosted window, so the 50 mm frame floats in the finder.'],
  vfWindow: ['Viewfinder window', 'The main window you compose through, at 0.91× magnification.'],
  rfWindow: ['Rangefinder window', 'A second view of the subject, 68.5 mm from the first.'],
  eyepiece: ['Eyepiece', 'Where the two images meet your eye.'],
  speedDial: ['Shutter speed dial', '1 s to 1/1000 s. Click it to change speed.'],
  release: ['Shutter release', 'Trips the shutter. It stays locked until you wind on.'],
  lever: ['Advance lever', 'One stroke moves the film one frame and cocks the shutter.'],
  rewindKnob: ['Rewind knob', 'Winds the film back into the cassette. Click it to rewind.'],
  shoe: ['Accessory shoe', 'For a separate finder or meter. The M3 has no light meter.'],
  cassette: ['Film cassette', '135 cassette: 36 frames of ISO 400 black-and-white film.'],
  film: ['Film', 'Exposed frames hold a latent image, shown here as the negative.'],
  gate: ['Film gate', 'The 36 × 24 mm opening that sets the frame.'],
  curtains: ['Shutter curtains', 'Two cloth curtains. The gap between them is the exposure.'],
  sprocket: ['Sprocket', 'Its teeth engage the perforations: 8 holes per frame.'],
  takeup: ['Take-up spool', 'Collects exposed film, one frame per stroke.'],
  gears: ['Transport gears', 'Link the lever to the sprocket, take-up spool and shutter drums.'],
};
