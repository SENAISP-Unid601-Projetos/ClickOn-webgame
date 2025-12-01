/* ============================================================================
SECTION 0: MISSING SPRITESHEET CLASS
Your 'base.js' file used a 'Spritesheet' class that was not provided.
I've created a basic version here so the game doesn't crash.
It handles drawing and animating a spritesheet.
============================================================================
*/

class Spritesheet {
    constructor(context, image, rows, cols) {
        this.ctx = context;
        this.image = image;
        this.rows = rows;
        this.cols = cols;
        this.frameWidth = this.image.width / this.cols;
        this.frameHeight = this.image.height / this.rows;
        this.row = 0;
        this.col = 0;
        this.interval = 100; // Milliseconds per frame
        this.lastFrameTime = 0;
    }

    // Call this in your update loop
    nextFrame() {
        const now = Date.now();
        if (now - this.lastFrameTime >= this.interval) {
            this.lastFrameTime = now;
            this.col = (this.col + 1) % this.cols;
        }
    }

    // Call this in your draw loop
    draw(x, y, width, height) {
        if (!this.image.complete || this.image.naturalWidth === 0) {
            // Draw a fallback box if the image is still loading
            this.ctx.fillStyle = 'magenta';
            this.ctx.fillRect(x, y, width, height);
            return;
        }
        
        try {
            this.ctx.drawImage(
                this.image,
                this.col * this.frameWidth,
                this.row * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                x,
                y,
                width,
                height
            );
        } catch (e) {
            console.error("Error drawing spritesheet:", e, this.image.src);
            // Draw a fallback box on error
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(x, y, width, height);
        }
    }
}


/* ============================================================================
SECTION 1: YOUR 'base.js' FILE
This is all the code from your 'base.js', with modifications for the
new game flow.
============================================================================
*/

/* -------------------------------------------------------------------------- */
/* canvas settings                              */
/* -------------------------------------------------------------------------- */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Define a fixed viewport size
const VIEWPORT_WIDTH = 1080;
const VIEWPORT_HEIGHT = 720;
canvas.width = VIEWPORT_WIDTH;
canvas.height = VIEWPORT_HEIGHT;

// Keep track of the full map dimensions
let mapWidth, mapHeight;
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* NEW: Universal Fade Transition Manager       */
/* -------------------------------------------------------------------------- */
const transitionManager = {
    isActive: false,
    alpha: 0,
    direction: 'in', // 'in' (fading in) or 'out' (fading out)
    speed: 2.5, // Fade speed (higher is faster)
    onComplete: null,

    /**
     * Starts a fade transition.
     * @param {'in'|'out'} direction - The direction of the fade.
     * @param {function} [callback] - Function to run when the fade is complete.
     */
    start: function(direction, callback = null) {
        this.direction = direction;
        this.alpha = (direction === 'out') ? 0 : 1;
        this.isActive = true;
        this.onComplete = callback;
    },

    update: function(dt) {
        if (!this.isActive) return;

        const dtSeconds = dt / 1000; // Convert ms to seconds for speed calculation

        if (this.direction === 'out') {
            // Fading to black
            this.alpha += this.speed * dtSeconds;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.isActive = false;
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        } else {
            // Fading in from black
            this.alpha -= this.speed * dtSeconds;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.isActive = false;
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }
    },

    draw: function() {
        if (this.alpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },

    /**
     * Helper function to chain a state change with fades.
 @param {function} setupFunction - The function to run when the screen is black.
     */
    changeState: function(setupFunction) {
        // FIX 1: Simplify the guard to prevent ANY new transition if one is active.
        if (this.isActive) return; // This is a more robust check.

        this.start('out', () => {
            // Screen is now black
            setupFunction(); // Run the state change logic
            
            // Now, fade back in
            this.start('in'); 
        });
    }
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* Image Preloader System                           */
/* -------------------------------------------------------------------------- */
const imageSources = {
  
  torradeira: "./IMG/torradeira (2).png",
  notebook: "./IMG/notebook.png",
  liquidificador: "./IMG/liquidificador.png",
  chip: "./IMG/chip.png",
  pc: "./IMG/pc.png",
  celular: "./IMG/celular.png",
  GROUND: "./IMG/fabrica7.png",

  Chip: "./IMG/chip (1).png",
  Metal:"./IMG/metal.png",
  Vidro:"./IMG/vidro.png",


  GroundTile1: "./IMG/tile1.png",
  GroundTile2: "./IMG/tile2.png",
  GroundTile3: "./IMG/tile3.png",
  GroundTile4: "./IMG/tile4.png",
  GroundTile5: "./IMG/tile5.png",
  GroundTile6: "./IMG/tile6.png",
  GroundTile7: "./IMG/tile7.png",
  GroundTile8: "./IMG/tile8.png",
  GroundTile9: "./IMG/tile9.png",
  GroundTile10: "./IMG/tile10.png",
  GroundTile11: "./IMG/tile35.png",
  GroundTile12: "./IMG/tile36.png",
  GroundTile13: "./IMG/tile37.png",
  GroundTile14: "./IMG/tile38.png",

  MudTile1: "./IMG/tile34.png",



  RiverTile1: "./IMG/tile10.png",
  RiverTile2: "./IMG/tile11.png",
  RiverTile3: "./IMG/tile12.png",
  RiverTile4: "./IMG/tile13.png",
  RiverTile5: "./IMG/tile14.png",
  RiverTile6: "./IMG/tile15.png",
  RiverTile7: "./IMG/tile16.png",
  RiverTile8: "./IMG/tile17.png",
  RiverTile9: "./IMG/tile18.png",

  MountainTile1: "./IMG/tile19.png",
  MountainTile2: "./IMG/tile20.png",
  MountainTile3: "./IMG/tile21.png",
  MountainTile4: "./IMG/tile22.png",
  MountainTile5: "./IMG/tile23.png",
  MountainTile6: "./IMG/tile24.png",
  MountainTile7: "./IMG/tile25.png",
  MountainTile8: "./IMG/tile26.png",
  MountainTile9: "./IMG/tile27.png",
  MountainTile10: "./IMG/tile28.png",
  MountainTile11: "./IMG/tile29.png",
  MountainTile12: "./IMG/tile30.png",
  MountainTile13: "./IMG/tile31.png",
  MountainTile14: "./IMG/tile32.png",
  MountainTile15: "./IMG/tile33.png",

   MudTile1: "./IMG/tile34.png",

   WorkshopWallTile1: "./IMG/fabrica1.png",
  WorkshopWallTile2: "./IMG/fabrica8.png",
   WorkshopWallTile3: "./IMG/fabrica3.png",
   WorkshopWallTile4: "./IMG/fabrica4.png",
   WorkshopWallTile5: "./IMG/fabrica5.png",
   WorkshopWallTile6: "./IMG/fabrica6.png",
    WorkshopWallTile7: "./IMG/fabrica2.png",
    WorkshopWallTile8: "./IMG/fabrica8.png",
    WorkshopWallTile9: "./IMG/fabrica9.png",
    WorkshopWallTile10: "./IMG/fabrica69.png",


   WorkshopFloorTile1: "./IMG/fabrica7.png",


  hammer: "./IMG/hammer.png",
  ewaste_solid: "./IMG/pc.png",
  player: "./IMG/SPRITESHEET.png",
    ewaste_slow: "./IMG/bigorna.png",
    dog_spritesheet: "./IMG/SpritesheetCachorro.png",
     

    rock1: "./IMG/rock1.png",
    rock2: "./IMG/rock2.png",
    rock3: "./IMG/rock3.png",

    repair_station: "./IMG/areia.png", 
    destroy_station: "./IMG/bigorna.png", 

    bateria:"./IMG/bateria.png",
    bateriaNotebook:"./IMG/10.png",
    telaCelular:"./IMG/telaCelular.png",
    telaNotebook:"./IMG/telaNotebook.png",
    baseNotebook:"./IMG/baseNotebook.png",
    cooler:"./IMG/9.png",
    celular_placa_mae:"./IMG/Sem nome (300 x 150 px).png",
    notebook_placa_mae:"./IMG/placa_maaae.png",
    teclado:"./IMG/7.png",
    camera:"./IMG/camera.png",
    celularDeMontar:"./IMG/placa_maae.png",
    notebookDeMontar:"./IMG/baseNotebook.png",
    

};
const images = {};

function loadImages(callback) {
  const keys = Object.keys(imageSources);
  let loadedCount = 0;

  keys.forEach(key => {
    const img = new Image();
    img.src = imageSources[key];
    // Allow cross-origin images from placehold.co
    img.crossOrigin = "Anonymous"; 

    img.onload = () => {
      loadedCount++;
      // Optional: show load progress
      console.log(`✅ Loaded ${key} (${loadedCount}/${keys.length})`);
      if (loadedCount === keys.length) {
        callback(); // All images loaded → start the game
      }
    };

    img.onerror = () => {
      console.warn(`⚠️ Failed to load ${key}`);
      loadedCount++;
      if (loadedCount === keys.length) callback();
    };

    images[key] = img;
  });
}


/* -------------------------------------------------------------------------- */
/* Background Matrix Setup                         */
/* -------------------------------------------------------------------------- */

const TILE_SIZE = 80;
const TILE_TYPES = {
    GROUND: 0,
    WALL: 1,
    // Item definitions (2-6) are removed
    REPAIR_STATION: 7,
    DESTROY_STATION: 8,
    UPGRADE_STATION: 43,
    EXIT_DOOR: 9,

    GroundTile1: 10,
    GroundTile2: 11,
    GroundTile3: 12,
    GroundTile4: 13,
    GroundTile5: 14,
    GroundTile6: 15,
    GroundTile7: 16,
    GroundTile8: 17,
    GroundTile9: 18,
    GroundTile10: 43,
    GroundTile11: 44,
    GroundTile12: 45,
    GroundTile13: 51,
    GroundTile14: 52,

    MudTile1: 55,

    RiverTile1: 19,
    RiverTile2: 20,
    RiverTile3: 21,
    RiverTile4: 22,
    RiverTile5: 23,
    RiverTile6: 24,
    RiverTile7: 25,
    RiverTile8: 26,
    RiverTile9: 27,

    MountainTile1: 28,
    MountainTile2: 29,
    MountainTile3: 30,
    MountainTile4: 31,
    MountainTile5: 32,
    MountainTile6: 33,
    MountainTile7: 34,
    MountainTile8: 35,
    MountainTile9: 36,
    MountainTile10: 37,
    MountainTile11: 38,
    MountainTile12: 39,
    MountainTile13: 40,
    MountainTile14: 41,
    MountainTile15: 42,

    WorkshopWallTile1: 53,
    WorkshopWallTile2: 54,
    WorkshopWallTile3: 56,
    WorkshopWallTile4: 57,
    WorkshopWallTile5: 58,
    WorkshopWallTile6: 59,
    WorkshopWallTile7: 60,
    WorkshopWallTile8: 61,
    WorkshopWallTile9: 62,
    WorkshopWallTile10: 94,

    WorkshopFloorTile1: 63 // Added this
};

// NEW: Add this right after TILE_TYPES
// This map links a tile number to its corresponding key in the `images` object.
const tileImageMap = {
    [TILE_TYPES.GROUND]: 'GROUND',
    [TILE_TYPES.GroundTile1]: 'GroundTile1',
    [TILE_TYPES.GroundTile2]: 'GroundTile2',
    [TILE_TYPES.GroundTile3]: 'GroundTile3',
    [TILE_TYPES.GroundTile4]: 'GroundTile4',
    [TILE_TYPES.GroundTile5]: 'GroundTile5',
    [TILE_TYPES.GroundTile6]: 'GroundTile6',
    [TILE_TYPES.GroundTile7]: 'GroundTile7',
    [TILE_TYPES.GroundTile8]: 'GroundTile8',
    [TILE_TYPES.GroundTile9]: 'GroundTile9',
    [TILE_TYPES.GroundTile10]: 'GroundTile10',
    [TILE_TYPES.GroundTile11]: 'GroundTile11',
    [TILE_TYPES.GroundTile12]: 'GroundTile12',
    [TILE_TYPES.GroundTile13]: 'GroundTile13',
    [TILE_TYPES.GroundTile14]: 'GroundTile14',

    [TILE_TYPES.MudTile1]: 'MudTile1',
    [TILE_TYPES.WorkshopFloorTile1]: 'WorkshopFloorTile1', // Added this

    [TILE_TYPES.RiverTile1]: 'RiverTile1',
    [TILE_TYPES.RiverTile2]: 'RiverTile2',
    [TILE_TYPES.RiverTile3]: 'RiverTile3',
    [TILE_TYPES.RiverTile4]: 'RiverTile4',
    [TILE_TYPES.RiverTile5]: 'RiverTile5',
    [TILE_TYPES.RiverTile6]: 'RiverTile6',
    [TILE_TYPES.RiverTile7]: 'RiverTile7',
    [TILE_TYPES.RiverTile8]: 'RiverTile8',
    [TILE_TYPES.RiverTile9]: 'RiverTile9',

    [TILE_TYPES.MountainTile1]: 'MountainTile1',
    [TILE_TYPES.MountainTile2]: 'MountainTile2',
    [TILE_TYPES.MountainTile3]: 'MountainTile3',
    [TILE_TYPES.MountainTile4]: 'MountainTile4',
    [TILE_TYPES.MountainTile5]: 'MountainTile5',
    [TILE_TYPES.MountainTile6]: 'MountainTile6',
    [TILE_TYPES.MountainTile7]: 'MountainTile7',
    [TILE_TYPES.MountainTile8]: 'MountainTile8',
    [TILE_TYPES.MountainTile9]: 'MountainTile9',
    [TILE_TYPES.MountainTile10]: 'MountainTile10',
    [TILE_TYPES.MountainTile11]: 'MountainTile11',
    [TILE_TYPES.MountainTile12]: 'MountainTile12',
    [TILE_TYPES.MountainTile13]: 'MountainTile13',
    [TILE_TYPES.MountainTile14]: 'MountainTile14',
    [TILE_TYPES.MountainTile15]: 'MountainTile15',

    [TILE_TYPES.WorkshopWallTile1]: 'WorkshopWallTile1',
    [TILE_TYPES.WorkshopWallTile2]: 'WorkshopWallTile2',
    [TILE_TYPES.WorkshopWallTile3]: 'WorkshopWallTile3',
    [TILE_TYPES.WorkshopWallTile4]: 'WorkshopWallTile4',
    [TILE_TYPES.WorkshopWallTile5]: 'WorkshopWallTile5',
    [TILE_TYPES.WorkshopWallTile6]: 'WorkshopWallTile6',
    [TILE_TYPES.WorkshopWallTile7]: 'WorkshopWallTile7',
    [TILE_TYPES.WorkshopWallTile8]: 'WorkshopWallTile8',
    [TILE_TYPES.WorkshopWallTile9]: 'WorkshopWallTile9',


    // Special workshop tiles that use different keys
    [TILE_TYPES.WALL]: null, // Handled by fallback
    [TILE_TYPES.UPGRADE_STATION]: 'chip',
    [TILE_TYPES.REPAIR_STATION]: 'repair_station',
    [TILE_TYPES.DESTROY_STATION]: 'destroy_station',
    [TILE_TYPES.EXIT_DOOR]: 'exit_door',
};

// NEW: Define the different types of collision shapes a tile can have
const COLLISION_SHAPES = {
    EMPTY: 0,            // No collision
    FULL: 1,             // A full, 100% solid tile
    SLOPE_TOP_LEFT: 2,     // Solid triangle at the top-left ( \ )
    SLOPE_TOP_RIGHT: 3,    // Solid triangle at the top-right ( / )
    SLOPE_BOTTOM_LEFT: 4,  // Solid triangle at the bottom-left ( / )
    SLOPE_BOTTOM_RIGHT: 5 // Solid triangle at the bottom-right ( \ )
};
// NEW: Map TILE_TYPES numbers to their COLLISION_SHAPES
const tileCollisionMap = {
    // --- Empty / Passable Tiles ---
    [TILE_TYPES.GROUND]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile1]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile2]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile3]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile4]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile5]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile6]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile7]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile8]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile9]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.GroundTile10]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.MudTile1]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopFloorTile1]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.REPAIR_STATION]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.DESTROY_STATION]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.UPGRADE_STATION]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.EXIT_DOOR]: COLLISION_SHAPES.EMPTY,

    // --- Special Angled Tiles (Example) ---
    [TILE_TYPES.GroundTile11]: COLLISION_SHAPES.EMPTY,    // 44
    [TILE_TYPES.GroundTile12]: COLLISION_SHAPES.EMPTY,     // 45
    [TILE_TYPES.GroundTile13]: COLLISION_SHAPES.EMPTY,  // 51
    [TILE_TYPES.GroundTile14]: COLLISION_SHAPES.EMPTY, // 52

    // --- Full Solid Tiles (from your old isWall function) ---
    [TILE_TYPES.WALL]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile1]: COLLISION_SHAPES.SLOPE_BOTTOM_RIGHT,
    [TILE_TYPES.MountainTile2]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile3]: COLLISION_SHAPES.SLOPE_BOTTOM_LEFT,
    [TILE_TYPES.MountainTile4]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile5]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile6]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile7]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile8]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile9]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile10]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile11]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile12]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile13]: COLLISION_SHAPES.SLOPE_TOP_RIGHT,
    [TILE_TYPES.MountainTile14]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.MountainTile15]: COLLISION_SHAPES.SLOPE_TOP_LEFT,
    [TILE_TYPES.RiverTile1]: COLLISION_SHAPES.SLOPE_BOTTOM_RIGHT,
    [TILE_TYPES.RiverTile2]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.RiverTile3]: COLLISION_SHAPES.SLOPE_BOTTOM_LEFT,
    [TILE_TYPES.RiverTile4]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.RiverTile5]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.RiverTile6]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.RiverTile7]: COLLISION_SHAPES.SLOPE_TOP_RIGHT,
    [TILE_TYPES.RiverTile8]: COLLISION_SHAPES.FULL,
    [TILE_TYPES.RiverTile9]: COLLISION_SHAPES.SLOPE_TOP_LEFT,
    [TILE_TYPES.WorkshopWallTile1]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile2]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile3]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile4]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile5]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile6]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile7]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile8]: COLLISION_SHAPES.EMPTY,
    [TILE_TYPES.WorkshopWallTile9]: COLLISION_SHAPES.EMPTY,
};

// NEW: Add this object right below TILE_TYPES
const OBJECT_TYPES = {
    NONE: 0, // Represents an empty slot
    torradeira: 2,
    notebook: 3,
    liquidificador: 4,
    chip: 5,
    celular: 7 // Added 'celular' which was in your draw/pickup code
};

let objectMap = []; 
// This will store a list of all {row, col} coordinates that are walkable
let walkableTiles = [];

// 0 = Ground, 1 = Wall, 2-7 = Electronics
let tileMap =[
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 45, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 44, 14, 14, 14],
  [14, 45, 17, 18, 55, 55, 16, 17, 44, 14, 14, 14, 14, 15, 19, 20, 20, 21, 13, 14, 14, 14, 14, 45, 17, 18, 55, 55, 16, 17, 44, 14, 14, 45, 17, 18, 55, 55, 16, 17, 44, 14, 14, 14, 14, 15, 19, 20, 20, 21, 13, 14, 14, 14, 14, 45, 17, 18, 55, 55, 16, 17, 44, 14],
  [14, 15, 55, 55, 28, 29, 30, 55, 16, 44, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 45, 18, 28, 29, 30, 55, 55, 55, 13, 14, 14, 15, 55, 55, 28, 29, 30, 55, 16, 44, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 45, 18, 28, 29, 30, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 31, 32, 33, 55, 55, 13, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 15, 55, 31, 32, 33, 55, 55, 55, 13, 14, 14, 15, 55, 55, 31, 32, 33, 55, 55, 13, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 15, 55, 31, 32, 33, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 34, 35, 36, 55, 55, 16, 17, 17, 17, 18, 25, 26, 26, 27, 16, 17, 17, 17, 18, 55, 34, 35, 36, 55, 55, 55, 13, 14, 14, 15, 55, 55, 34, 35, 36, 55, 55, 16, 17, 17, 17, 18, 25, 26, 26, 27, 16, 17, 17, 17, 55, 55, 34, 35, 36, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 37, 38, 39, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 37, 38, 39, 55, 55, 55, 13, 14, 14, 15, 55, 55, 37, 38, 39, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 37, 38, 39, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 40, 41, 42, 55, 55, 55, 55, 55, 55, 10, 11, 11, 11, 11, 12, 55, 55, 55, 55, 55, 40, 41, 42, 55, 55, 55, 13, 14, 14, 15, 55, 55, 40, 41, 42, 55, 55, 55, 55, 55, 55, 10, 11, 11, 11, 11, 12, 55, 55, 55, 55, 55, 40, 41, 42, 55, 55, 55, 13, 14],
  [14, 51, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 52, 14, 14, 51, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 52, 14],
  [14, 14, 51, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 14, 14, 15, 55, 55, 55, 10, 11, 11, 11, 11, 11, 11, 52, 14, 14, 14, 14, 51, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 14, 14, 15, 55, 55, 55, 10, 11, 11, 11, 11, 11, 11, 52, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 13, 14, 14, 14, 14, 14, 15, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 13, 14, 14, 14, 14, 14, 15, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 45, 18, 10, 11, 52, 14, 14, 14, 14, 45, 18, 55, 55, 55, 16, 44, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 45, 18, 10, 11, 52, 14, 14, 14, 14, 45, 18, 55, 55, 55, 16, 44, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 45, 18, 55, 13, 14, 14, 14, 14, 14, 14, 15, 55, 55, 28, 29, 30, 16, 44, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 45, 18, 55, 13, 14, 14, 14, 14, 14, 14, 15, 55, 55, 28, 29, 30, 16, 44, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 13, 14, 14, 14, 14, 14, 45, 18, 55, 55, 31, 32, 33, 55, 16, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 13, 14, 14, 14, 14, 14, 45, 18, 55, 55, 31, 32, 33, 55, 16, 17, 44, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 16, 44, 14, 14, 14, 14, 15, 55, 55, 55, 34, 35, 36, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 16, 44, 14, 14, 14, 14, 15, 55, 55, 55, 34, 35, 36, 55, 55, 55, 13, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 45, 18, 55, 55, 55, 55, 55, 16, 44, 14, 14, 14, 15, 55, 55, 55, 37, 38, 39, 55, 55, 55, 16, 44, 14, 14, 14, 14, 14, 14, 14, 14, 45, 18, 55, 55, 55, 55, 55, 16, 44, 14, 14, 14, 15, 55, 55, 55, 37, 38, 39, 55, 55, 55, 16, 44, 14, 14, 14, 14],
  [14, 14, 14, 45, 18, 55, 55, 19, 20, 21, 55, 55, 13, 14, 14, 45, 18, 55, 55, 55, 40, 41, 42, 55, 55, 55, 55, 16, 44, 14, 14, 14, 14, 14, 14, 45, 18, 55, 55, 19, 20, 21, 55, 55, 13, 14, 14, 45, 18, 55, 55, 55, 40, 41, 42, 55, 55, 55, 55, 16, 44, 14, 14, 14],
  [14, 14, 45, 18, 55, 55, 55, 22, 23, 24, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 44, 14, 14, 14, 14, 45, 18, 55, 55, 55, 22, 23, 24, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 44, 14, 14],
  [14, 14, 15, 55, 55, 55, 55, 25, 26, 27, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14, 15, 55, 55, 55, 55, 25, 26, 27, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14],
  [14, 45, 18, 55, 55, 10, 11, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 11, 12, 55, 55, 16, 44, 14, 14, 45, 18, 55, 55, 10, 11, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 11, 12, 55, 55, 16, 44, 14],
  [14, 15, 55, 55, 55, 13, 14, 14, 51, 12, 55, 55, 10, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 15, 55, 55, 55, 13, 14, 14, 15, 55, 55, 55, 13, 14, 14, 51, 12, 55, 55, 10, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 15, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 55, 13, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 15, 55, 55, 55, 13, 14, 14, 15, 55, 55, 55, 13, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 15, 55, 55, 55, 13, 14],
  [14, 51, 12, 55, 55, 16, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 55, 13, 14, 14, 51, 12, 55, 55, 16, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 55, 13, 14],
  [14, 14, 15, 55, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 10, 52, 14, 14, 14, 15, 55, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 10, 52, 14],
  [14, 14, 51, 12, 55, 55, 55, 16, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 18, 55, 55, 55, 10, 52, 14, 14, 14, 14, 51, 12, 55, 55, 55, 16, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 18, 55, 55, 55, 10, 52, 14, 14],
  [14, 14, 14, 51, 12, 55, 55, 55, 55, 55, 55, 16, 17, 17, 44, 14, 14, 45, 17, 17, 18, 55, 55, 55, 55, 55, 55, 10, 52, 14, 14, 14, 14, 14, 14, 51, 12, 55, 55, 55, 55, 55, 55, 16, 17, 17, 44, 14, 14, 45, 17, 17, 18, 55, 55, 55, 55, 55, 55, 10, 52, 14, 14, 14],
  [14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14],
  [14, 14, 14, 14, 51, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 52, 14, 14, 14, 14, 14, 14, 14, 14, 51, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 52, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 51, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 52, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 51, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 52, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
]



/* -------------------------------------------------------------------------- */
/* workshop                                  */
/* -------------------------------------------------------------------------- */

// --- MODIFICATION ---
// Removed 'mapaDois2' as requested.

/* ----------------------------------- map ---------------------------------- */
const workshopTileMap = [
  [62, 59, 59, 59, 59, 59, 59, 59, 59,59, 59, 59, 59, 59],
  [61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 58],
  [61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 58],
  [61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 58],
  [61, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0,0, 0, 58], // 8 = DESTROY_STATION
  [61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 58],
  [61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 58],
  [61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 58],
  [61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 58],
  [53, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57,57, 57, 60] // 9 = EXIT_DOOR (logic removed)
]
/* -------------------------------------------------------------------------- */
/* Message System                               */
/* -------------------------------------------------------------------------- */

/**
 * Scans the tileMap and finds all tiles that are not solid.
 * Stores the results in the global 'walkableTiles' array.
 */
function findWalkableTiles() {
    walkableTiles = []; // Clear any previous results
    for (let row = 0; row < tileMap.length; row++) {
        for (let col = 0; col < tileMap[row].length; col++) {
            const tileType = tileMap[row][col];
            
            // Check if this tile type has an entry in the collision map
            if (tileCollisionMap.hasOwnProperty(tileType)) {
                const collisionType = tileCollisionMap[tileType];
                
                // If the tile is EMPTY (passable), add it to the list
                if (collisionType === COLLISION_SHAPES.EMPTY) {
                    walkableTiles.push({ row: row, col: col });
                }
            } else {
                // This warning helps you find tiles you forgot to add to the collision map
                console.warn(`Tile type ${tileType} at (${row}, ${col}) has no collision mapping.`);
            }
        }
    }
    console.log(`Found ${walkableTiles.length} walkable tiles.`);
}

/**
 * Creates a new, empty objectMap with the same dimensions as the tileMap,
 * filling it with OBJECT_TYPES.NONE.
 */
function initializeObjectMap() {
    objectMap = tileMap.map(row => 
        new Array(row.length).fill(OBJECT_TYPES.NONE)
    );
}

function createEmptyMap(rows, cols, fillValue = 0) {
  return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
}

// let mapaDois2ObjectMap = createEmptyMap(mapaDois2.length, mapaDois2[0].length, OBJECT_TYPES.NONE); // Removed
let workshopObjectMap = createEmptyMap(workshopTileMap.length, workshopTileMap[0].length, OBJECT_TYPES.NONE);

/**
 * Places collectible items and obstacles randomly on walkable tiles.
 * * @param {Array} itemsToPlace - List of item objects to place, e.g.,
 * [ { type: OBJECT_TYPES.torradeira, count: 5 }, { type: OBJECT_TYPES.notebook, count: 3 } ]
 * @param {Array} obstaclesToPlace - List of obstacle objects to place, e.g.,
 * [ { type: OBSTACLE_TYPES.SOLID, img: images.ewaste_solid, message: "...", count: 10, width: 30, height: 30 } ]
 */
function randomizeWorldObjects(itemsToPlace, obstaclesToPlace) {
    // 1. Find all walkable tiles
    findWalkableTiles();
    
    // 2. Create a shuffled copy of the walkable tiles list.
    // We will "pop" from this list to get unique positions.
    let availableTiles = [...walkableTiles].sort(() => 0.5 - Math.random());

    // 3. Place collectible items (into objectMap)
    itemsToPlace.forEach(item => {
        for (let i = 0; i < item.count; i++) {
            // Get the next available tile
            let tile = availableTiles.pop();
            if (!tile) {
                console.warn(`Ran out of walkable tiles while placing ${item.type}`);
                return; // Stop placing this item type
            }
            
            // Place the item's TYPE in the objectMap at its grid position
            objectMap[tile.row][tile.col] = item.type;
        }
    });

    // 4. Place obstacles (into obstacles array)
    obstaclesToPlace.forEach(obstacleInfo => {
        for (let i = 0; i < obstacleInfo.count; i++) {
            // Get the next available tile
            let tile = availableTiles.pop();
            if (!tile) {
                console.warn(`Ran out of walkable tiles while placing obstacles.`);
                return; // Stop placing this obstacle type
            }
            
            // Calculate pixel position (centered within the tile)
            const obsWidth = obstacleInfo.width || 30; // Default size
            const obsHeight = obstacleInfo.height || 30;
            const x = (tile.col * TILE_SIZE) + (TILE_SIZE - obsWidth) / 2;
            const y = (tile.row * TILE_SIZE) + (TILE_SIZE - obsHeight) / 2;

            // Add to the obstacles array as a pixel-based object
            obstacles.push({
                x: x,
                y: y,
                width: obsWidth,
                height: obsHeight,
                type: obstacleInfo.type,
                img: obstacleInfo.img,
                message: obstacleInfo.message
            });
        }
    });
    
    console.log(`Successfully placed items and obstacles. ${availableTiles.length} tiles remaining.`);
}

const messageBox = {
    isActive: false,
    message: "",
    displayedText: "",
    charIndex: 0,
    timer: 0,
    typeSpeed: 40, // milliseconds per character

    // Call this function to show a new message
    show: function(text) {
        if (this.isActive) return; // Don't interrupt an active message
        this.message = text;
        this.displayedText = "";
        this.charIndex = 0;
        this.timer = 0;
        this.isActive = true;
    },

    // Call this to hide the message box
    hide: function() {
        this.isActive = false;
        this.message = "";
    },

    // Update the typing effect
    update: function(dt) {
        if (!this.isActive || this.charIndex >= this.message.length) {
            return; // Not active or message is fully typed
        }

        this.timer += dt;
        if (this.timer >= this.typeSpeed) {
            this.timer = 0;
            this.charIndex++;
            this.displayedText = this.message.substring(0, this.charIndex);
        }
    },

    // Draw the message box on the canvas
    draw: function() {
        if (!this.isActive) return;

        const boxHeight = 150;
        const boxY = canvas.height - boxHeight - 20;
        const boxX = 20;
        const boxWidth = canvas.width - 40;
        const padding = 25;

        // Black box background
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.beginPath();
        // Use fillRect if roundRect isn't available
        if (ctx.roundRect) {
            ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
            ctx.fill();
        } else {
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        }

        // White border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);


        // Text
        ctx.fillStyle = "white";
        // Use the pixel font we imported
        ctx.font = "24px 'Determination', monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        
        // This helper function wraps text so it doesn't go off-screen
        this.wrapText(this.displayedText, boxX + padding, boxY + padding, boxWidth - padding * 2, 35);
    },
    
    // Helper for word wrapping
    wrapText: function(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for(let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }
};
/* -------------------------------------------------------------------------- */
function handleInteraction() {
    // If a message is showing and is fully typed, pressing E again will hide it.
    if (messageBox.isActive) {
        if (messageBox.charIndex >= messageBox.message.length) {
            messageBox.hide();
        }
        return;
    }

    const INTERACTION_DISTANCE = 90; // The reach of the player, in pixels
    let closestInteractable = null;
    let minDistance = INTERACTION_DISTANCE;

    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    // Find the closest obstacle with a message
    obstacles.forEach(obs => {
        if (obs.message) { // Only check objects that are interactable
            const obsCenterX = obs.x + obs.width / 2;
            const obsCenterY = obs.y + obs.height / 2;
            const distance = Math.hypot(playerCenterX - obsCenterX, playerCenterY - obsCenterY);

            if (distance < minDistance) {
                minDistance = distance;
                closestInteractable = obs;
            }
        }
    });

    // If we found something nearby, show its message
    if (closestInteractable) {
        messageBox.show(closestInteractable.message);
    }
}
/* -------------------------------- workshop -------------------------------- */
function loadWorkshop() {
    gameStage = "workshop";
    
    // Replace the main tileMap with the workshop one
    tileMap = workshopTileMap; 
    objectMap = workshopObjectMap; // <-- ADD THIS LINE
    
    // Update map dimensions
    mapWidth = tileMap[0].length * TILE_SIZE;
    mapHeight = tileMap.length * TILE_SIZE;
    
    // Move player to the workshop's starting position
    player.x = TILE_SIZE * 5; 
    player.y = TILE_SIZE * 5;

    // Reset camera to avoid weird visual glitches
    updateCamera(); 
}

// Set map dimensions based on the tile map
mapWidth = tileMap[0].length * TILE_SIZE;
mapHeight = tileMap.length * TILE_SIZE;

// This variable will hold the text to show the player
let interactionPrompt = null; 

function drawWorkshopUI() {
    if (interactionPrompt) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        
        ctx.fillStyle = "white";
        ctx.font = "24px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText(interactionPrompt, canvas.width / 2, canvas.height - 25);
        ctx.textAlign = "left"; // Reset alignment
    }
}
function checkWorkshopInteractions() {
    // This only runs when in the workshop
    if (gameStage !== "workshop") return;

    // Ensure player row/col are valid for the workshop map
    const playerCol = Math.floor((player.x + player.width / 2) / TILE_SIZE);
    const playerRow = Math.floor((player.y + player.height / 2) / TILE_SIZE);
    
    if (playerRow < 0 || playerRow >= tileMap.length || playerCol < 0 || playerCol >= tileMap[0].length) {
        interactionPrompt = null;
        return;
    }

    const currentTile = tileMap[playerRow][playerCol];

    interactionPrompt = null; // Reset prompt each frame

    if (currentTile === TILE_TYPES.REPAIR_STATION) {
        interactionPrompt = "Pressione [E] para usar a bigorna";
    } else if (currentTile === TILE_TYPES.DESTROY_STATION) {
        interactionPrompt = "Pressione [E] para usar a bigorna";
    } else if (currentTile === TILE_TYPES.EXIT_DOOR) {
        interactionPrompt = "This door is now locked."; // --- MODIFICATION ---
    } else if (currentTile === TILE_TYPES.UPGRADE_STATION) {
        interactionPrompt = "Press [E] to open Upgrades";
    }

}


    function drawWorkshopHUD() {

}
/* -------------------------------------------------------------------------- */
/* Obstacles                                  */
/* -------------------------------------------------------------------------- */

// Usaremos strings para os tipos, fica mais claro de ler
const OBSTACLE_TYPES = {
  SOLID: 'solid',
  SLOW: 'slow',
  DAMAGE: 'damage'
};

// Esta lista vai guardar todos os objetos de obstáculo do mapa
let obstacles = [];

// REPLACE your old function with this
function initializeObstacles() {
    // 1. Reset the world
    obstacles = []; // Clear old obstacles
    initializeObjectMap(); // Clear old items

    // 2. Define what you want to spawn
    const itemsToSpawn = [
        { type: OBJECT_TYPES.torradeira, count: 10 },
        { type: OBJECT_TYPES.notebook, count: 8 },
        { type: OBJECT_TYPES.liquidificador, count: 5 },
        { type: OBJECT_TYPES.chip, count: 15 },
        { type: OBJECT_TYPES.celular, count: 10 }
    ];

    const obstaclesToSpawn = [
       { 
            type: OBSTACLE_TYPES.SOLID, 
            img: images.rock1, // Example using a different image
            message: "Uma pedra MUUUITO grande.", 
            count: 5,
            width: 80, 
            height: 80
        },
        { 
            type: OBSTACLE_TYPES.SOLID, 
            img: images.rock1, // Example using a different image
            message: "Uma pedra grande.", 
            count: 10,
            width: 40, 
            height: 40
        }
        // Add more obstacle types here
    ];

    // 3. Call the function to make it happen!
    randomizeWorldObjects(itemsToSpawn, obstaclesToSpawn);
}
// Nova função para desenhar os obstáculos
function drawObstacles() {
  obstacles.forEach(obstacle => {
    // Usamos a imagem pré-carregada e desenhamos nas coordenadas do obstáculo
    if (obstacle.img && obstacle.img.complete) {
      ctx.drawImage(obstacle.img, obstacle.x-20, obstacle.y, obstacle.width+40, obstacle.height+20);
    } else {
      // Fallback caso a imagem não carregue
      ctx.fillStyle = 'purple';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  });
}
/* -------------------------------------------------------------------------- */
/* Camera Setup                                */
/* -------------------------------------------------------------------------- */
const camera = {
    x: 0,
    y: 0,
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT
};

function updateCamera() {
    // Center camera on player
    camera.x = player.x + player.width / 2 - camera.width / 2;
    camera.y = player.y + player.height / 2 - camera.height / 2;

    // Clamp camera to map boundaries
    camera.x = Math.max(0, Math.min(camera.x, mapWidth - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, mapHeight - camera.height));
}

let animatedRiverSprite;

function drawBackground() {
  const startCol = Math.floor(camera.x / TILE_SIZE);
  const endCol = Math.ceil((camera.x + camera.width) / TILE_SIZE);
  const startRow = Math.floor(camera.y / TILE_SIZE);
  const endRow = Math.ceil((camera.y + camera.height) / TILE_SIZE);

  for (let row = startRow; row < Math.min(endRow, tileMap.length); row++) {
      if (row < 0 || row >= tileMap.length) continue; // Safety check
    for (let col = startCol; col < Math.min(endCol, tileMap[0].length); col++) {
        if (col < 0 || col >= tileMap[0].length) continue; // Safety check
      
      const tile = tileMap[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      // 1. Get the image key (e.g., 'RiverTile1') from our new map
      const imageKey = tileImageMap[tile];
      
      if (imageKey) {
        // 2. Get the actual loaded image from the `images` object
        const img = images[imageKey];

        if (img && img.complete) {
            if (tile >= TILE_TYPES.RiverTile1 && tile <= TILE_TYPES.RiverTile9) {
          if (animatedRiverSprite) {
              // Draw the animated sprite instead
              animatedRiverSprite.draw(x, y, TILE_SIZE, TILE_SIZE);
          } else {
              // Fallback if the sprite didn't load
              ctx.fillStyle = "#0000FF"; // Bright blue
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          }
        }
          // 3. Draw the image if it exists and is loaded
          if (tile === TILE_TYPES.WorkshopWallTile1 || tile === TILE_TYPES.WorkshopWallTile2 || tile === TILE_TYPES.WorkshopWallTile3 || tile === TILE_TYPES.WorkshopWallTile4
            || tile === TILE_TYPES.WorkshopWallTile5 || tile === TILE_TYPES.WorkshopWallTile6|| tile === TILE_TYPES.WorkshopWallTile7 || tile === TILE_TYPES.WorkshopWallTile8 || tile === TILE_TYPES.WorkshopWallTile10 || tile === TILE_TYPES.DESTROY_STATION
          ){ 
            ctx.drawImage(images.WorkshopFloorTile1, x, y, TILE_SIZE, TILE_SIZE);
            ctx.drawImage(img, x, y, TILE_SIZE, TILE_SIZE);
          }else{
            if(images.MudTile1) {
                ctx.drawImage(images.MudTile1, x, y, TILE_SIZE, TILE_SIZE);
            }
            ctx.drawImage(img, x, y, TILE_SIZE, TILE_SIZE);
          }
        } else {
          // 4. Draw a bright pink fallback if the image is missing
          ctx.fillStyle = "#FF00FF"; // Pink = Missing Image
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      } else {
        // 5. Draw a fallback color for tiles not in the map
        // This will handle TILE_TYPES.WALL and the unknown tiles
        let fallbackColor = "#333"; // Dark grey for unknown
        if (tile === TILE_TYPES.WALL) fallbackColor = "#222"; // Black for walls
        
        ctx.fillStyle = fallbackColor;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}


function drawObjects() {
  // Calculate the visible tile range
  const startCol = Math.floor(camera.x / TILE_SIZE);
  const endCol = Math.ceil((camera.x + camera.width) / TILE_SIZE);
  const startRow = Math.floor(camera.y / TILE_SIZE);
  const endRow = Math.ceil((camera.y + camera.height) / TILE_SIZE);

  // Loop through only the visible tiles in the objectMap
  for (let row = startRow; row < Math.min(endRow, objectMap.length); row++) {
    if (row < 0 || row >= objectMap.length) continue; // Safety check
    for (let col = startCol; col < Math.min(endCol, objectMap[0].length); col++) {
      if (col < 0 || col >= objectMap[0].length) continue; // Safety check
      
      const objectType = objectMap[row][col];
      
      // Skip empty slots
      if (objectType === OBJECT_TYPES.NONE) continue; 

      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      let imgToDraw = null;
      let w = TILE_SIZE, h = TILE_SIZE;
      let ox = 0, oy = 0;

      // Draw the object based on its type
      switch (objectType) {
        case OBJECT_TYPES.torradeira:
          imgToDraw = images.torradeira;
          w = TILE_SIZE-20; h = TILE_SIZE-30; ox = 30; oy = 20;
          break;
        case OBJECT_TYPES.notebook:
          imgToDraw = images.notebook;
          break;
        case OBJECT_TYPES.liquidificador:
          imgToDraw = images.liquidificador;
          break;
        case OBJECT_TYPES.chip:
          imgToDraw = images.chip;
          h = TILE_SIZE-10;
          break;
        case OBJECT_TYPES.pc:
          imgToDraw = images.pc;
          w = TILE_SIZE -40; h = TILE_SIZE - 40;
          break;
        case OBJECT_TYPES.celular:
          imgToDraw = images.celular;
          w = TILE_SIZE- 30; h = TILE_SIZE- 30;
          break;
      }
      
      if(imgToDraw && imgToDraw.complete) {
          ctx.drawImage(imgToDraw, x + ox, y + oy, w, h);
      }
    }
  }
}



/* -------------------------------------------------------------------------- */
/* eletronics                                 */
/* -------------------------------------------------------------------------- */
const eletronicsToRecycle = [
    { name: 'torradeira', metal: 1, plastic: 1, glass:1 ,img: "https://placehold.co/100x100/f39c12/000?text=Toaster"},
    { name: 'notebook', metal: 2, plastic: 1, glass: 2  ,img: "https://placehold.co/100x100/3498db/000?text=Laptop"},
    { name: 'liquidificador', metal: 3, plastic: 3, glass: 3 ,img: "https://placehold.co/100x100/2ecc71/000?text=Blender"},
    { name: 'chip', metal: 4, plastic:5, glass: 5 ,img: "https://placehold.co/100x100/9b59b6/000?text=Chip"},
    { name: 'pc', metal: 12, plastic: 15, glass: 13 ,img: "https://placehold.co/100x100/7f8c8d/000?text=PC"}
    ,{ name: 'celular', metal: 10, plastic: 8, glass: 5 ,img: "https://placehold.co/100x100/1abc9c/000?text=Phone"}
];

/* -------------------------------------------------------------------------- */
/* Player Character Setup                     */
/* -------------------------------------------------------------------------- */

    const player = {
    x: 15, // Start position
    y: 15,
    width: 80, // Set this to your desired player size on screen
    height: 80,
    speed: 4,
    lightRadius: 100, //
    materials: {
        metal: 0,
        plastic: 0,
        glass: 0,
        circuit: 0
    
    },
    money: 0,
    inventory: []
};



    let dash = true;

    // This object will track which movement keys are currently held down
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false
    };

    // Listen for key presses
    // A single, unified input handler
window.addEventListener("keydown", function(e) {
    const key = e.key.toLowerCase();
    
    // Switch behavior based on the current game stage
    switch (gameStage) {
        case "stage1":
          
            // --- Player Movement Controls ---
            if (key === 'w' || key === 'arrowup') keys.w = true;
            if (key === 'a' || key === 'arrowleft') keys.a = true;
            if (key === 's' || key === 'arrowdown') keys.s = true;
            if (key === 'd' || key === 'arrowright') keys.d = true;
            if (key === 'shift') keys.shift = true;
                   if (key === 'e') {
                handleInteraction();
            }
            if (key === 'shift') {
                if (dash) {
                    player.speed *= 1.5; // Double the speed
                    dash = false; // Prevent further dashes until key is released
                }
            };
            break; // Added break

         case "workshop":
            // Player movement controls
            if (key === 'w' || key === 'arrowup') keys.w = true;
            if (key === 'a' || key === 'arrowleft') keys.a = true;
            if (key === 's' || key === 'arrowdown') keys.s = true;
            if (key === 'd' || key === 'arrowright') keys.d = true;

            if (key === 'e' && interactionPrompt) {
                // Ensure player row/col are valid
                const playerCol = Math.floor((player.x + player.width / 2) / TILE_SIZE);
                const playerRow = Math.floor((player.y + player.height / 2) / TILE_SIZE);
                if (playerRow < 0 || playerRow >= tileMap.length || playerCol < 0 || playerCol >= tileMap[0].length) {
                    return;
                }
                const currentTile = tileMap[playerRow][playerCol];

                if (currentTile === TILE_TYPES.REPAIR_STATION) {
                    selectedIndex = 0; // Reset selection index
                    gameStage = "crafting"; // ✅ Set the correct stage
                }
                if (currentTile === TILE_TYPES.DESTROY_STATION) {
                    scrapperGame.start(collectedItems); // Launch the new physics scrapper!
                }
                if (currentTile === TILE_TYPES.UPGRADE_STATION) { // <-- ADD THIS
                    selectedIndex = 0; // Reset selection
                    gameStage = "upgrading";
                }
                if (currentTile === TILE_TYPES.EXIT_DOOR) {
                    // --- MODIFICATION ---
                    // Logic to go back to stage1 was removed.
                    // You could show a message here if you want.
                    messageBox.show("This exit is permanently locked.");
                }
            }
            break;
        
         case "scrapping":
            if (key === 'escape') {
                scrapperGame.end(); // This will now go to the sorting game
            }
            break;
        case "recycling": // This state seems unused, but leaving controls
            // --- Recycling Menu Controls ---
            if (key === "arrowup") selectedIndex = Math.max(0, selectedIndex);
            if (key === "arrowdown") selectedIndex = Math.min(collectedItems.length - 1, selectedIndex);
            break;
        
        case "repair": // This state seems unused
        case "destroy": // This state seems unused
            // Navigation handled above in the shared keydown listener
            // Add any menu-specific key handling here if needed
            break;
                
    }
});

// Don't forget to also update the keyup listener to only affect stage 1
window.addEventListener('keyup', function(e) {
    // This listener should ONLY handle stopping player movement.
    if (gameStage !== 'stage1' && gameStage !== 'workshop') return;

    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.w = false;
    if (key === 'a' || key === 'arrowleft') keys.a = false;
    if (key === 's' || key === 'arrowdown') keys.s = false;
    if (key === 'd' || key === 'arrowright') keys.d = false;
    if (key === 'shift') keys.shift = false;

    // ✅ All the old 'r' and 'd' logic has been removed.
    if (key === 'shift') {
        player.speed = 4; // Reset speed
        dash = true; // Allow dashing again
    }
}); 
/* -------------------------------------------------------------------------- */
/* Workshop & Minigame Input Listeners (CORRECTED)                */
/* -------------------------------------------------------------------------- */

// This is the keydown listener for the Workshop Menus (Crafting, Upgrading)
window.addEventListener("keydown", (e) => {
    // Check if we are in one of the menu stages
    if (gameStage !== "crafting" && gameStage !== "destroy" && gameStage !== "upgrading") {
        return;
    }

    // --- NAVIGATION LOGIC ---
    if (e.key === "ArrowUp") {
        selectedIndex = Math.max(0, selectedIndex - 1);
    }

    if (e.key === "ArrowDown") {
        // ⭐ FIX 1: Check the gameStage to use the correct array length
        let maxIndex = 0;
        if (gameStage === "crafting") {
            maxIndex = craftingRecipes.length - 1;
        } else if (gameStage === "upgrading") {
            maxIndex = upgradeList.length - 1;
        }
        selectedIndex = Math.min(maxIndex, selectedIndex + 1);
    }

    // --- ACTION LOGIC ---
    if (e.key === "Enter") {
        if (gameStage === "crafting") {
            const selectedRecipe = craftingRecipes[selectedIndex];
            if (!selectedRecipe) return;

            const cost = selectedRecipe.cost;

            // Check if player has enough materials
            if (player.materials.metal >= cost.metal &&
                player.materials.plastic >= cost.plastic &&
                player.materials.circuit >= cost.circuit) {

                // Subtract the cost BEFORE starting the minigame
                player.materials.metal -= cost.metal;
                player.materials.plastic -= cost.plastic;
                player.materials.circuit -= cost.circuit;

                console.log(`Attempting to craft ${selectedRecipe.name}...`);

                // Start the minigame with the recipe object
                miniGameManager.start(selectedRecipe);

            }
        } else if (gameStage === "upgrading") {
            const key = upgradeList[selectedIndex];
            const upgrade = playerUpgrades[key];

            // Don't buy if it's maxed
            if (!upgrade || upgrade.level >= upgrade.maxLevel) return;

            const currentCost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.level - 1));

            if (player.money >= currentCost) {
                // 1. Pay
                player.money -= currentCost;

                // 2. Level up
                upgrade.level++;

                // 3. Apply the upgrade
                if (key === 'speed') {
                    player.speed += upgrade.bonus;
                } else if (key === 'light') {
                    player.lightRadius += upgrade.bonus;
                }

            } else {
                console.log("Not enough money for this upgrade!");
            }
        }
    }

    // --- EXIT LOGIC ---
    if (e.key === "Escape") {
        gameStage = "workshop";
    }
}); // <-- ⭐ FIX 2: The keydown listener ENDS HERE.

/* -------------------------------------------------------------------------- */
/* Mouse Listeners (Moved outside the keydown listener)                   */
/* -------------------------------------------------------------------------- */

// A single, unified click handler for all game states
canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameStage === "minigame") {
        if (miniGameManager.currentGame && miniGameManager.currentGame.handleClick) {
            miniGameManager.currentGame.handleClick(x, y);
        }
    } else if (gameStage === "scrapping") {
        scrapperGame.handleClick(x, y);
    }
});

// A single, unified mouse move handler
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameStage === "minigame") {
        if (miniGameManager.currentGame && miniGameManager.currentGame.handleMouseMove) {
            miniGameManager.currentGame.handleMouseMove(x, y);
        }
    } else if (gameStage === "scrapping") {
        scrapperGame.handleMouseMove(x, y);
    }
});

// Mousedown handler (only for minigames like Wiring)
canvas.addEventListener('mousedown', function(e) {
    if (gameStage !== "minigame") return;

    if (miniGameManager.currentGame && miniGameManager.currentGame.handleMouseDown) {
        const rect = canvas.getBoundingClientRect();
        miniGameManager.currentGame.handleMouseDown(e.clientX - rect.left, e.clientY - rect.top);
    }
});

// Mouseup handler (only for minigames like Wiring)
canvas.addEventListener('mouseup', function(e) {
    if (gameStage !== "minigame") return;

    if (miniGameManager.currentGame && miniGameManager.currentGame.handleMouseUp) {
        const rect = canvas.getBoundingClientRect();
        miniGameManager.currentGame.handleMouseUp(e.clientX - rect.left, e.clientY - rect.top);
    }
});
/* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /* Player Update and Draw Functions             */
    /* -------------------------------------------------------------------------- */

    /**
 * Checks if a specific pixel coordinate (x, y) is inside a solid object.
 * This is the new, more realistic collision function.
 */
function isSolid(x, y) {
    // Treat out-of-bounds as solid
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
        return true;
    }
    
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);

    // Treat out-of-bounds as solid
    if (row < 0 || row >= tileMap.length || col < 0 || col >= tileMap[0].length) {
        return true;
    }

    // 1. Get the tile type and its collision shape
    const tileType = tileMap[row][col];
    const shape = tileCollisionMap[tileType];

    // 2. Get the coordinate *within* the tile (from 0 to TILE_SIZE)
    const localX = x - (col * TILE_SIZE);
    const localY = y - (row * TILE_SIZE);

    // 3. Perform the collision check based on the shape
    switch (shape) {
        case COLLISION_SHAPES.EMPTY:
            return false;

        case COLLISION_SHAPES.FULL:
            return true;

        // Diagonal line from (0, 0) to (80, 80) -> Equation: y = x
        case COLLISION_SHAPES.SLOPE_BOTTOM_LEFT: // Solid part is *below* the line (y > x)
            return localY > localX;
        case COLLISION_SHAPES.SLOPE_TOP_RIGHT: // Solid part is *above* the line (y < x)
            return localY < localX;

        // Diagonal line from (80, 0) to (0, 80) -> Equation: y = -x + 80
        case COLLISION_SHAPES.SLOPE_TOP_LEFT: // Solid part is *above* the line (y < -x + 80)
            return localY < -localX + TILE_SIZE;
        case COLLISION_SHAPES.SLOPE_BOTTOM_RIGHT: // Solid part is *below* the line (y > -x + 80)
            return localY > -localX + TILE_SIZE;

        default:
            return false; // Default to empty if shape isn't defined
    }
}

function checkItemPickup() {
  const playerCenterX = player.x + player.width /2;
  const playerCenterY = player.y + player.height/2;

  const col = Math.floor(playerCenterX / TILE_SIZE);
  const row = Math.floor(playerCenterY / TILE_SIZE);

  // Check against the objectMap boundaries
  if (row >= 0 && row < objectMap.length && col >= 0 && col < objectMap[0].length) {
    
    const objectType = objectMap[row][col]; // <-- Read from objectMap
    let itemPickedUp = null;

    // Match object type to item name
    switch (objectType) { // <-- Check objectType
      case OBJECT_TYPES.torradeira: itemPickedUp = 'torradeira'; break;
      case OBJECT_TYPES.notebook: itemPickedUp = 'notebook'; break;
      case OBJECT_TYPES.liquidificador: itemPickedUp = 'liquidificador'; break;
      case OBJECT_TYPES.chip: itemPickedUp = 'chip'; break;
      case OBJECT_TYPES.pc: itemPickedUp = 'pc'; break;
      case OBJECT_TYPES.celular: itemPickedUp = 'celular'; break;
    }

    if (itemPickedUp) {
      // Add item to inventory and remove from object map
      player.inventory.push(itemPickedUp);
      objectMap[row][col] = OBJECT_TYPES.NONE; // <-- Set objectMap cell to empty
    }
  }
}

function updatePlayer() {
    let newX = player.x;
    let newY = player.y;
    let isMoving = false;

    // --- LÓGICA DE INTERAÇÃO COM OBSTÁCULOS (NOVO SISTEMA) ---
    let currentSpeed = player.speed;
    const DAMAGE_COOLDOWN = 1500; // 1.5 segundos

    // Verifica interações com obstáculos que não bloqueiam (slow, damage)
    obstacles.forEach(obstacle => {
      if (checkAABBCollision(player, obstacle)) {
        if (obstacle.type === OBSTACLE_TYPES.SLOW) {
          currentSpeed = player.speed * 0.5; // Reduz a velocidade
        }
        if (obstacle.type === OBSTACLE_TYPES.DAMAGE) {
          const now = Date.now();
          if (now - player.lastDamageTimestamp > DAMAGE_COOLDOWN) {
            timeLeft -= 3;
            player.lastDamageTimestamp = now;
            console.log("Dano recebido! Tempo restante: ", timeLeft);
          }
        }
      }
    });

    // Movimentação baseada na velocidade atual (que pode ter sido alterada)
    if (keys.w) { newY -= currentSpeed; if(player.animation) player.animation.row = 1; isMoving = true; }
    if (keys.s) { newY += currentSpeed; if(player.animation) player.animation.row = 0; isMoving = true; }
    if (keys.a) { newX -= currentSpeed; if(player.animation) player.animation.row = 2; isMoving = true; }
    if (keys.d) { newX += currentSpeed; if(player.animation) player.animation.row = 3; isMoving = true; }
    if (keys.shift && dash) { /* lógica de dash inalterada */ }

    // --- NOVA LÓGICA DE COLISÃO COM OBSTÁCULOS SÓLIDOS ---
    
    // Colisão no eixo Y
    if (newY !== player.y) {
        let proposedYRect = { ...player, y: newY };
        let collisionY = false;
        
        // ⬇️ --- REPLACE isWall with isSolid --- ⬇️
        // Also, use 'player.height - 1' for the bottom check
        if ((newY < player.y && (isSolid(player.x, newY) || isSolid(player.x + player.width - 1, newY))) ||
            (newY > player.y && (isSolid(player.x, newY + player.height - 1) || isSolid(player.x + player.width - 1, newY + player.height - 1)))) {
            collisionY = true;
        }
        // ⬆️ --- END OF CHANGE --- ⬆️

        // Verifica colisão com OBSTÁCULOS sólidos
        for (const obstacle of obstacles) {
            if (obstacle.type === OBSTACLE_TYPES.SOLID && checkAABBCollision(proposedYRect, obstacle)) {
                collisionY = true;
                break;
            }
        }
        if (!collisionY) player.y = newY;
    }

    // Colisão no eixo X
    if (newX !== player.x) {
        let proposedXRect = { ...player, x: newX };
        let collisionX = false;

        // ⬇️ --- REPLACE isWall with isSolid --- ⬇️
        if ((newX < player.x && (isSolid(newX, player.y) || isSolid(newX, player.y + player.height - 1))) ||
            (newX > player.x && (isSolid(newX + player.width, player.y) || isSolid(newX + player.width, player.y + player.height - 1)))) {
            collisionX = true;
        }
        // ⬆️ --- END OF CHANGE --- ⬆️
        
        // Verifica colisão com OBSTÁCULOS sólidos
        for (const obstacle of obstacles) {
            if (obstacle.type === OBSTACLE_TYPES.SOLID && checkAABBCollision(proposedXRect, obstacle)) {
                collisionX = true;
                break;
            }
        }
        if (!collisionX) player.x = newX;
    }

    // Animação e outras verificações

    if (player.animation) {
        if (isMoving) {
            player.animation.nextFrame();
        } else {
            player.animation.col = 0;
        }
    }
    checkItemPickup();
    checkWorkshopInteractions();
}


function drawPlayer() {
    // Pass the player's position and dimensions to the draw method
    if(player.animation) {
        player.animation.draw(player.x, player.y, player.width +20 , player.height +20);
    }
}
/* -------------------------------------------------------------------------- */
/* Light System                                */
/* -------------------------------------------------------------------------- */

function drawLightMask() {
    // Calculate the player's center position *on the screen* (viewport)
    const playerScreenX = player.x + player.width / 2 - camera.x;
    const playerScreenY = player.y + player.height / 2 - camera.y;
    
    // Define the outer radius of the darkness (it should cover the whole screen)
    const outerRadius = Math.max(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    // Create a radial gradient centered on the player
    const gradient = ctx.createRadialGradient(
        playerScreenX, playerScreenY, // Center of the gradient (player's screen position)
        player.lightRadius,           // Inner radius (fully transparent)
        playerScreenX, playerScreenY, // Center of the gradient
        outerRadius                   // Outer radius (fully dark)
    );

    // Add the color stops for the "fog" effect
    // 0% (at lightRadius): Fully transparent
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    // 70% (between lightRadius and outerRadius): Very dark
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.9)');
    // 100% (at outerRadius): Almost completely black
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

    // Draw a rectangle over the entire screen, filled with this gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
}

/* -------------------------------------------------------------------------- */
/* Dogs                                    */
/* -------------------------------------------------------------------------- */

class Dog {
  /**
   * Creates a new Dog instance.
   * @param {number} x - The initial x-coordinate.
   * @param {number} y - The initial y-coordinate.
   * @param {number} [chaseRange=300] - The radius within which the dog will chase the player.
   * @param {number} [speed=2] - The movement speed of the dog.
   */
  constructor(x, y, chaseRange = 300, speed = 2) {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.width = 85;
    this.height = 85;
    this.speed = speed;
    this.chaseRange = chaseRange;
    this.animation = null;

    // --- NEW PROPERTIES FOR COLLISION ---
    this.attackCooldown = 2000;
    this.lastAttackTimestamp = 0;
    
    // --- FIX 1: STATE FOR LEASH LOGIC ---
    this.isReturning = false;
  }

  /**
   * Updates the dog's position and checks for collision with the player.
   * @param {object} player - The player object.
   */
  update(player) {
    const oldX = this.x; // Store old position
    const oldY = this.y; // Store old position

    // --- DISTANCE CALCULATIONS ---
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.hypot(dx, dy);
    const fromSpawn = Math.hypot(this.x - this.spawnX, this.y - this.spawnY);

    const backDx = this.spawnX - this.x;
    const backDy = this.spawnY - this.y;
    const backDist = Math.hypot(backDx, backDy);

    // --- FIX 1: UPDATED MOVEMENT LOGIC ---
    
    // Check if the dog *must* return (leash stretched)
    if (fromSpawn >= this.chaseRange) {
      this.isReturning = true;
    }
    
    // Check if the dog has *finished* returning (within 5px of spawn)
    if (backDist < 5) {
      this.isReturning = false;
    }
    
    // 1. If returning, ONLY return to spawn
    if (this.isReturning) {
      // ... inside Dog.update() ...
      const angle = Math.atan2(backDy, backDx);
      const newX = this.x + Math.cos(angle) * this.speed;
      const newY = this.y + Math.sin(angle) * this.speed;
      
      // ⬇️ --- REPLACE isWall with isSolid --- ⬇️
      if (typeof isSolid !== 'undefined' && !isSolid(newX, this.y)) this.x = newX;
      else if (typeof isSolid === 'undefined') this.x = newX;

      if (typeof isSolid !== 'undefined' && !isSolid(this.x, newY)) this.y = newY;
      else if (typeof isSolid === 'undefined') this.y = newY;
      // ⬆️ --- END OF CHANGE --- ⬆️
    } 
    // 2. If NOT returning AND player is close, chase
    else if (distance < this.chaseRange && this.checkCollision) {
      const angle = Math.atan2(dy, dx);
      const newX = this.x + Math.cos(angle) * this.speed;
      const newY = this.y + Math.sin(angle) * this.speed;
      
      // ⬇️ --- REPLACE isWall with isSolid --- ⬇️
      if (typeof isSolid !== 'undefined' && !isSolid(newX, this.y)) this.x = newX;
      else if (typeof isSolid === 'undefined') this.x = newX;
      
      if (typeof isSolid !== 'undefined' && !isSolid(this.x, newY)) this.y = newY;
      else if (typeof isSolid === 'undefined') this.y = newY;
      // ⬆️ --- END OF CHANGE --- ⬆️
    }
    // 3. (Implicit) If not returning and player is far, do nothing.

    // --- FIX 2: UPDATED ANIMATION LOGIC ---
    if (this.animation) {
      const movedX = this.x - oldX;
      const movedY = this.y - oldY;

      if (movedX !== 0 || movedY !== 0) {
        // Dog moved
        if (Math.abs(movedX) > Math.abs(movedY)) {
          // Horizontal movement is dominant
          // Spritesheet: Row 1 = Walk Right, Row 2 = Walk Left
          this.animation.row = (movedX > 0) ? 2 : 1; // This was backward in your code
          this.animation.nextFrame(); // Animate walk
        } else {
          // Vertical movement is dominant
          // Spritesheet: Row 0 = Idle Front, Row 3 = Idle Back
          this.animation.row = (movedY > 0) ? 0 : 3;
          this.animation.col = 0; // Hold the first frame of the idle animation
        }
      } else {
        // Dog didn't move
        // Stay on the first frame of the current idle animation
        this.animation.col = 0;
        // If we were walking, default to front-idle
        if (this.animation.row === 1 || this.animation.row === 2) {
            this.animation.row = 0;
        }
      }
    }

    // --- TRIGGER COLLISION CHECK ---
    this.checkCollision(player);
  }
  
  /**
   * Checks for collision with the player and applies a penalty if one occurs.
   * @param {object} player - The player object, expected to have x, y, width, height.
   */
  checkCollision(player) {
    // AABB (Axis-Aligned Bounding Box) collision detection
    const isColliding = 
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y;
      
    if (isColliding) {
      const currentTime = Date.now();
   
      console.log("Dog collided with player!");
      
      // Check if the cooldown period has passed
      if (currentTime - this.lastAttackTimestamp > this.attackCooldown) {
        this.lastAttackTimestamp = currentTime; // Reset the attack timer
        
        if (typeof timeLeft !== 'undefined') {
          timeLeft -= 5; // Subtract 5 seconds
          console.log(`Dog hit player! Time left: ${timeLeft}`);
        } else {
          console.error("Collision with dog, but a 'timeLeft' variable was not found!");
        }
      }
    }else{
      // Reset player speed when not colliding
        player.speed == 2;
    }
  }

  /**
   * Draws the leash connecting the dog to its spawn point.
   */
  drawLeash() {
    ctx.beginPath();
    ctx.moveTo(this.spawnX + this.width / 2, this.spawnY + this.height / 2);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#9c0404ff";
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * Draws the dog on the canvas.
   */
  draw() {
    this.drawLeash();

    if (this.animation) {
        this.animation.draw(this.x, this.y, this.width, this.height);
    } else {
      // Fallback if animation wasn't loaded
      ctx.fillStyle = "brown";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
let dogs = [];
/* -------------------------------------------------------------------------- */
/* Game Timer                                    */
/* -------------------------------------------------------------------------- */

// total time in seconds
let totalTime = 60; // 2 minutes

let timeLeft = totalTime;
let timerInterval = null;
let isPaused = false;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateUI() {
  const text = formatTime(timeLeft);

  // Position relative to camera (top left corner of the screen)
  const x =  20;
  const y =  40;

    // Draw material counters
ctx.font = "24px 'Press Start 2P', monospace";
ctx.fillStyle = "#fff";
ctx.textAlign = "left";
ctx.shadowColor = "black";
ctx.shadowBlur = 4;


  // Timer background box
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; 
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(x - 10, y - 30, 120, 50, 10); // rounded rectangle
        ctx.fill();
    } else {
        ctx.fillRect(x - 10, y - 30, 120, 50);
    }
  ctx.strokeRect(x - 10, y - 30, 120, 50);

  // Timer text color based on urgency
  if (timeLeft > totalTime * 0.5) {
    ctx.fillStyle = "#4CAF50"; // green
  } else if (timeLeft > totalTime * 0.25) {
    ctx.fillStyle = "#FFC107"; // yellow
  } else {
    ctx.fillStyle = "#F44336"; // red
  }

  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Add glow effect
  ctx.shadowColor = "black";
  ctx.shadowBlur = 6;

  ctx.fillText(text, x + 50, y - 5);

  // Reset shadow after drawing
  ctx.shadowBlur = 0;
}

function startTimer() {
  if (timerInterval) return; // avoid duplicate intervals
  
  // FIX: Don't start the timer if time is already up!
  if (timeLeft <= 0) return; 

  updateUI();

  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;

      updateUI();

      if (timeLeft <= 0) {
        gameOver();
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function pauseTimer() {
  isPaused = true;
}

function resumeTimer() {
  isPaused = false;
}

function resetTimer() {
  stopTimer();
  timeLeft = totalTime;
  updateUI();
}

function gameOver() {

    if (transitionManager.isActive) return;
  console.log("⛔ Time’s up! Game Over.");

  stopTimer();

  // 🔹 Sort & group inventory
  let sortedInventory = [...player.inventory].sort();
  let counted = {};
  sortedInventory.forEach(item => {
    counted[item] = (counted[item] || 0) + 1;
  });
  let inventoryLines = Object.entries(counted).map(([item, count]) =>
    count > 1 ? `${item} x${count}` : item
  );

  // ----- UI is now drawn in SCREEN SPACE -----
  ctx.save();

  // Dark overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

  // Title
  ctx.fillStyle = "#c1f436";
  ctx.font = "bold 72px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 15;
  ctx.fillText("FINALIZADO!", VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 - 150);

  // Subtitle
  ctx.font = "28px Arial";
  ctx.fillStyle = "white";
  ctx.shadowBlur = 8;
  ctx.fillText("Itens coletados:", VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 - 80);

  // Inventory list
  ctx.font = "20px Arial";
  ctx.fillStyle = "#f1f1f1";
  ctx.shadowBlur = 4;
  inventoryLines.forEach((line, i) => {
    ctx.fillText(line, VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 - 40 + i * 30);
  });

  // Restart hint
  ctx.font = "22px Arial";
  ctx.fillStyle = "#FFD700";
  ctx.shadowBlur = 6;

  ctx.restore();
  endGame()
}
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* stage 2                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------- variables ------------------------------- */

let gameStage = "stage1"; // or "stage2" after game over
let collectedItems = [];   // from stage 1
let craftedProducts = [];
let playerUpgrades = {
    speed: {
        name: "Player Speed",
        level: 1,
        maxLevel: 5,
        cost: 150, // Base cost
        bonus: 0.5, // How much speed per level
        description: "Move faster in the field."
    },
    light: {
        name: "Light Radius",
        level: 1,
        maxLevel: 4,
        cost: 100,
        bonus: 50, // How many pixels per level
        description: "See further in the dark."
    },
    // You could add more upgrades here, like inventory size
};

// This makes the menu navigation easier
const upgradeList = Object.keys(playerUpgrades);
// This object now matches the items in your game
const itemTypes = {
  torradeira:     { materials: { metal: 1, plastic: 1, circuit: 0 }, minigame: 'cleaning' },
  notebook:       { materials: { metal: 2, plastic: 2, circuit: 3 }, minigame: 'wiring' },
  liquidificador: { materials: { metal: 3, plastic: 3, circuit: 1 }, minigame: 'cleaning' },
  chip:           { materials: { metal: 0, plastic: 1, circuit: 2 }, minigame: 'soldering' }, // New minigame
  pc:             { materials: { metal: 5, plastic: 4, circuit: 4 }, minigame: 'wiring' },
  celular:        { materials: { metal: 1, plastic: 1, circuit: 2 }, minigame: 'soldering' }  // New minigame
};
const craftingRecipes = [
  { 
    name: "Drone", 
    cost: { metal: 10, plastic: 5, circuit: 8 }, 
    reward: 300, 
    minigame: 'wiring' 
  },
  { 
    name: "Auto-Cleaner Bot", 
    cost: { metal: 5, plastic: 12, circuit: 4 }, 
    reward: 250, 
    minigame: 'cleaning' 
  },
  { 
    name: "Soldering Station", 
    cost: { metal: 8, plastic: 3, circuit: 10 }, 
    reward: 400, 
    minigame: 'soldering' 
  },
  { 
    name: "Portable Speaker", 
    cost: { metal: 2, plastic: 8, circuit: 5 }, 
    reward: 150, 
    minigame: 'soldering' 
  },
];
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* Mini-Game Manager                            */
/* -------------------------------------------------------------------------- */

const miniGameManager = {
    currentGame: null,
    currentItem: null,

start: function(recipe) {
    this.currentItem = recipe; // Store the whole recipe object
    const gameType = recipe.minigame;

    if (gameType === 'cleaning') {
        this.currentGame = new CleaningGame();
    } else if (gameType === 'wiring') {
        this.currentGame = new WiringGame();
    } else if (gameType === 'soldering') {
        this.currentGame = new SolderingGame();
    }

    if (this.currentGame) {
        gameStage = "minigame";
        // Pass the item name to the setup function for UI text
        this.currentGame.setup(recipe.name); 
    }
},

    update: function(dt) {
        if (this.currentGame) {
            this.currentGame.update(dt);
        }
    },

    draw: function() {
        if (this.currentGame) {
            this.currentGame.draw();
        }
    },

    handleMouseClick: function(x, y) {
        if (this.currentGame && this.currentGame.handleClick) {
            this.currentGame.handleClick(x, y);
        }
    },
    
// Called by a minigame when it's over
    onComplete: function(success) {
        // Check if we're in the post-sorting crafting sequence
        if (craftingSequenceManager.isInSequence) {
            console.log(`Sequence game ${this.currentGame.constructor.name} finished.`);
            
            // Clean up and tell the manager to run the next game
            this.currentGame = null;
            this.currentItem = null;
            craftingSequenceManager.next(); 
        } else {
            // --- This is the ORIGINAL logic for the workshop ---
            if (success) {
                console.log(`✅ Successfully crafted ${this.currentItem.name}!`);
                craftedProducts.push(this.currentItem.name);
                player.money += this.currentItem.reward;
            } else {
                console.log(`❌ Crafting failed for ${this.currentItem.name}. Materials lost!`);
            }
            
            // Clean up and return to the workshop
            this.currentGame = null;
            this.currentItem = null;
            
        }
}};
/* -------------------------------------------------------------------------- */
/* NEW: Crafting Sequence Manager (Add this entire block)             */
/* -------------------------------------------------------------------------- */
const craftingSequenceManager = {
    gamesToRun: ['cleaning', 'wiring', 'soldering'], // The sequence
    currentGameIndex: 0,
    isInSequence: false,

    start: function() {
        console.log("Starting crafting minigame sequence...");
        this.isInSequence = true;
        this.currentGameIndex = 0;
        
        // Hide the sorting game container
        const gameContainer = document.getElementById("game-container");
        if (gameContainer) gameContainer.style.display = "none";
        
        // Show the main canvas for the minigames
        const mainCanvas = document.getElementById("canvas");
        if (mainCanvas) mainCanvas.style.display = "block";
        
        // Hide the phone canvas just in case
        const phoneCanvas = document.getElementById("gameCanvas");
        if (phoneCanvas) phoneCanvas.style.display = "none";

        this.runNext();
    },

    runNext: function() {
        if (this.currentGameIndex >= this.gamesToRun.length) {
            // Sequence is finished!
            this.end();
            return;
        }

        const gameType = this.gamesToRun[this.currentGameIndex];
        console.log(`Começando sequência de montagem!: ${gameType}`);

        // We use a "dummy" recipe just to start the minigame
        const dummyRecipe = {
            name: ``,
            minigame: gameType,
            reward: 0, // No reward for these
            cost: { metal: 0, plastic: 0, circuit: 0 } // No cost
        };
        
        // Manually set the game stage and start the minigame
        gameStage = "minigame";
        miniGameManager.currentItem = dummyRecipe; // Set the item
        
        if (gameType === 'cleaning') {
            miniGameManager.currentGame = new CleaningGame();
        } else if (gameType === 'wiring') {
            miniGameManager.currentGame = new WiringGame();
        } else if (gameType === 'soldering') {
            miniGameManager.currentGame = new SolderingGame();
        }
        
        if (miniGameManager.currentGame) {
             miniGameManager.currentGame.setup(dummyRecipe.name);
        } else {
            console.error(`Unknown minigame type in sequence: ${gameType}`);
            this.next(); // Skip to next
        }
    },

    next: function() {
        this.currentGameIndex++;
        this.runNext();
    },

    end: function() {
        console.log("Crafting sequence finished. Starting phone building.");
        this.isInSequence = false;
        this.currentGameIndex = 0;
        
        // Hide the main canvas
        const mainCanvas = document.getElementById("canvas");
        if (mainCanvas) mainCanvas.style.display = "none";
        
        // Show the phone canvas
        const phoneCanvas = document.getElementById("gameCanvas");
        if (phoneCanvas) phoneCanvas.style.display = "block";
        
        // Start the phone building game
        // Pass empty materials, as this is just the final assembly
        startPhoneBuildingSequence({}); 
    }
};

// This function will be called by the sorting game
function startCraftingMinigameSequence() {
    craftingSequenceManager.start();
}
/* -------------------------------------------------------------------------- */
class CleaningGame {
    setup(item) {
        this.rustSpots = [];
        this.timeLimit = 10000; // 10 seconds
        this.clicksToClean = 5;

        // 1. Define the area of the phone (Must match the coordinates in draw())
        // In draw() you used: canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 400
        const screenX = (canvas.width / 2) - 100;
        const screenY = (canvas.height / 2) - 100;
        const screenW = 200;
        const screenH = 400;
        
        // 2. Add padding so the spots (radius ~20-40) don't hang off the edge
        const padding = 35; 

        // Create 5 random rust spots INSIDE the phone boundaries
        for (let i = 0; i < 5; i++) {
            this.rustSpots.push({
                // Random X between left edge + padding AND right edge - padding
                x: screenX + padding + Math.random() * (screenW - (padding * 2)),
                
                // Random Y between top edge + padding AND bottom edge - padding
                y: screenY + padding + Math.random() * (screenH - (padding * 2)),
                
                radius: 20 + Math.random() * 20,
                clicksLeft: this.clicksToClean
            });
        }
    }

    update(dt) {
        this.timeLimit -= dt;
        if (this.timeLimit <= 0) {
            miniGameManager.onComplete(false); // Failed
        }
    }

    draw() {
        ctx.fillStyle = "#5a4d41"; // Workshop background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the item being cleaned (using its image)
        // Note: This relies on the recipe name matching an image key
        if (images[miniGameManager.currentItem.name]) {
             ctx.drawImage(images.telaCelular, canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 400);
        } else {
            ctx.fillStyle = "gray";
            ctx.drawImage(images.telaCelular, canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 400);
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(miniGameManager.currentItem.name, canvas.width / 2, canvas.height / 2);
            ctx.textAlign = "left";
        }

        // Draw rust spots
        this.rustSpots.forEach(spot => {
            ctx.fillStyle = `rgba(120, 100, 62, ${spot.clicksLeft / this.clicksToClean})`;
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // UI
        ctx.fillStyle = "white";
        ctx.font = "24px 'Press Start 2P', monospace";
        ctx.fillText(`Limpe a tela!`, 50, 50);
        ctx.fillText(`Tempo restante: ${(this.timeLimit / 1000).toFixed(1)}s`, 50, 80);
    }

    handleClick(x, y) {
        for (let i = this.rustSpots.length - 1; i >= 0; i--) {
            const spot = this.rustSpots[i];
            const distance = Math.hypot(x - spot.x, y - spot.y);
            if (distance < spot.radius) {
                spot.clicksLeft--;
                if (spot.clicksLeft <= 0) {
                    this.rustSpots.splice(i, 1); // Remove the cleaned spot
                    if (this.rustSpots.length === 0) {
                        miniGameManager.onComplete(true); // Success!
                    }
                }
                break; // Only click one spot at a time
            }
        }
    }
}
/* -------------------------------------------------------------------------- */
class WiringGame {
    setup(item) {
        this.nodes = [];
        this.timeLimit = 10000; // 15 seconds
        this.isDragging = false;
        this.startNode = null;
        this.mousePos = { x: 0, y: 0 };

        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
        const startY = canvas.height / 2 - 100;
        const endY = canvas.height / 2 + 100;
        
        colors.forEach((color, i) => {
            const xPos = canvas.width / 2 - 150 + (i * 100);
            this.nodes.push({ x: xPos, y: startY, color: color, isStart: true, isConnected: false, connectedTo: null });
            this.nodes.push({ x: xPos, y: endY, color: color, isStart: false, isConnected: false, connectedTo: null });
        });
        // Shuffle the bottom nodes for a puzzle
        for (let i = 0; i < 4; i++) {
             let rand = Math.floor(Math.random() * 4);
             let tempX = this.nodes[i*2+1].x;
             this.nodes[i*2+1].x = this.nodes[rand*2+1].x;
             this.nodes[rand*2+1].x = tempX;
        }
    }

    update(dt) {
        this.timeLimit -= dt;
        if (this.timeLimit <= 0) {
            miniGameManager.onComplete(false); // Failed
        }
    }

    draw() {
        ctx.fillStyle = "#1d1f21"; // Circuit board background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.nodes.forEach(node => {
            // Draw connections
            if (node.connectedTo) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(node.connectedTo.x, node.connectedTo.y);
                ctx.strokeStyle = node.color;
                ctx.lineWidth = 5;
                ctx.stroke();
            }
            // Draw nodes
            ctx.beginPath();
            ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            if (!node.isConnected) {
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
        
        if (this.isDragging && this.startNode) {
             ctx.beginPath();
             ctx.moveTo(this.startNode.x, this.startNode.y);
             ctx.lineTo(this.mousePos.x, this.mousePos.y);
             ctx.strokeStyle = this.startNode.color;
             ctx.lineWidth = 5;
             ctx.stroke();
        }
        
        // UI
        ctx.fillStyle = "white";
        ctx.font = "24px 'Press Start 2P', monospace";
        ctx.fillText(`Conecte os fios!`, 50, 50);
        ctx.fillText(`Tempo restante: ${(this.timeLimit / 1000).toFixed(1)}s`, 50, 80);
    }
    
    // We need mouse move, down, and up for this game
    handleMouseDown(x, y) {
        this.nodes.forEach(node => {
            if (node.isStart && !node.isConnected && Math.hypot(x - node.x, y - node.y) < 15) {
                this.isDragging = true;
                this.startNode = node;
            }
        });
    }
    
    handleMouseUp(x, y) {
        if (!this.isDragging) return;
        
        let success = false;
        this.nodes.forEach(node => {
            if (!node.isStart && !node.isConnected && node.color === this.startNode.color && Math.hypot(x - node.x, y - node.y) < 15) {
                 this.startNode.isConnected = true;
                 node.isConnected = true;
                 this.startNode.connectedTo = node;
                 success = true;
            }
        });

        this.isDragging = false;
        this.startNode = null;
        
        // Check for win
        const allConnected = this.nodes.filter(n => n.isStart && n.isConnected).length === 4;
        if(allConnected) {
            miniGameManager.onComplete(true);
        }
    }
    
    handleMouseMove(x, y) {
        this.mousePos = {x, y};
    }
}
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
class SolderingGame {
    setup(item) {
        this.timeLimit = 10000; // 10 seconds
        this.bar = {
            x: 150,
            y: canvas.height / 2 - 25,
            width: 20,
            height: 50,
            speed: 5,
        };
        this.track = {
            x: 150,
            y: canvas.height / 2 - 10,
            width: canvas.width - 300,
            height: 20
        };
        this.targetZone = {
            x: this.track.x + this.track.width * 0.7, // Position it 70% of the way along the track
            y: this.track.y,
            width: 50,
            height: 20
        };
    }

    update(dt) {
        this.timeLimit -= dt;
        if (this.timeLimit <= 0) {
            miniGameManager.onComplete(false); // Failed due to time
        }

        // Move the bar
        this.bar.x += this.bar.speed;
        if (this.bar.x <= this.track.x || this.bar.x + this.bar.width >= this.track.x + this.track.width) {
            this.bar.speed *= -1; // Reverse direction
        }
    }

    draw() {
        ctx.fillStyle = "#333"; // Dark workshop background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw track
        ctx.fillStyle = "#222";
        ctx.fillRect(this.track.x, this.track.y, this.track.width, this.track.height);
        
        // Draw target zone
        ctx.fillStyle = "#00ffaa";
        ctx.fillRect(this.targetZone.x, this.targetZone.y, this.targetZone.width, this.targetZone.height);

        // Draw moving bar
        ctx.fillStyle = "#ffc107";
        ctx.fillRect(this.bar.x, this.bar.y, this.bar.width, this.bar.height);
        
        // UI
        ctx.fillStyle = "white";
        ctx.font = "24px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`Pare a barra na linha verde!`, canvas.width / 2, 50);
        ctx.fillText(`Tempo restante: ${(this.timeLimit / 1000).toFixed(1)}s`, canvas.width / 2, 80);
        ctx.textAlign = "left"; // Reset alignment
    }

    handleClick(x, y) {
        // Check if the bar is within the target zone
        if (this.bar.x > this.targetZone.x && this.bar.x + this.bar.width < this.targetZone.x + this.targetZone.width) {
            miniGameManager.onComplete(true); // Success!
        } else {
            miniGameManager.onComplete(false); // Failed!
        }
    }
}
/* -------------------------------------------------------------------------- */
/* ------------------------------- transition ------------------------------- */
function endGame() {
transitionManager.changeState(() => {
        // This code runs when the screen is black
        loadWorkshop(); // This sets gameStage = "workshop", resets maps, etc.
        collectedItems = player.inventory;
    });
}
/* -------------------------------------------------------------------------- */
/* ---------------------------------- Menu ---------------------------------- */
let selectedIndex = 0;

/* -------------------------------------------------------------------------- */
/* Workshop Action Menus                          */
/* -------------------------------------------------------------------------- */

// Shared visual helper
function drawMenuBackground(title, subtitle, accentColor) {
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0a0a0f");
  gradient.addColorStop(1, "#1a1a1f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, 0, canvas.width, 100);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 30, canvas.width - 100, 70);

  // Title
  ctx.fillStyle = accentColor;
  ctx.font = "bold 28px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.fillText(title, canvas.width / 2, 70);

  // Subtitle
  ctx.font = "18px 'Press Start 2P', monospace";
  ctx.fillStyle = "#ccc";
  ctx.fillText(subtitle, canvas.width / 2, 110);
  ctx.textAlign = "left";
}

// -------------------------- REPAIR MENU ----------------------------------- //
function drawCraftingMenu() {
    // 1. Draw a dim, full-screen background overlay (MUST be first)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Define the main menu box dimensions (centered)
    const MENU_WIDTH = 900;
    const MENU_HEIGHT = 650;
    const menuX = (canvas.width / 2) - (MENU_WIDTH / 2);
    const menuY = (canvas.height / 2) - (MENU_HEIGHT / 2);
    
    // Draw the main menu box
    ctx.fillStyle = "#2a2a2a"; // Dark background for the menu box
    ctx.strokeStyle = "#ffc107";
    ctx.lineWidth = 4;
    ctx.fillRect(menuX, menuY, MENU_WIDTH, MENU_HEIGHT);
    ctx.strokeRect(menuX, menuY, MENU_WIDTH, MENU_HEIGHT);

    // Menu Title
    ctx.textAlign = "center";
    ctx.font = "bold 30px 'Press Start 2P', monospace";
    ctx.fillStyle = "#ffc107";
    ctx.fillText("🛠 Crafting Bench", canvas.width / 2, menuY + 50);

    // Menu Subtitle
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.fillStyle = "#ccc";
    ctx.fillText("Create new products", canvas.width / 2, menuY + 85);
    
    ctx.textAlign = "left"; // Reset for list items
    
    const startY = menuY + 150; // Start drawing recipes inside the menu box
    const spacing = 75;

    if (craftingRecipes.length === 0) {
        ctx.fillStyle = "#777";
        ctx.font = "22px 'Press Start 2P', monospace";
        // Adjusted X coordinate to be inside the menu
        ctx.fillText("No recipes!", menuX + 40, startY);
        return;
    }

    craftingRecipes.forEach((recipe, i) => {
        const y = startY + i * spacing;
        const isSelected = i === selectedIndex;
        
        // Check if the player can afford this recipe
        const canAfford = player.materials.metal >= recipe.cost.metal &&
                          player.materials.plastic >= recipe.cost.plastic &&
                          player.materials.circuit >= recipe.cost.circuit;

        // Selection highlight
        if (isSelected) {
            ctx.fillStyle = `rgba(255, 193, 7, 0.15)`;
            // Adjusted coordinates relative to the menu box
            ctx.fillRect(menuX + 30, y - 30, MENU_WIDTH - 60, 65);
            ctx.strokeStyle = "#ffc107";
            ctx.lineWidth = 2;
            ctx.strokeRect(menuX + 30, y - 30, MENU_WIDTH - 60, 65);
        }

        // Recipe name
        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = isSelected ? "#fff" : "#ccc";
        // Adjusted X coordinate
        ctx.fillText(`✨ ${recipe.name}`, menuX + 50, y);

        // Material cost
        ctx.font = "16px 'Press Start 2P', monospace";
        ctx.fillStyle = canAfford ? "#a7d1a8" : "#d1a7a7"; 
        const costText = `COST: 🔩 ${recipe.cost.metal}, 🧴 ${recipe.cost.plastic}, 💡 ${recipe.cost.circuit}`;
        // Adjusted X coordinate
        ctx.fillText(costText, menuX + 50, y + 25);
    });

    // Footer
    ctx.textAlign = "center";
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = "#888";
    ctx.fillText("ENTER = Craft | ESC = Exit", canvas.width / 2, canvas.height - 40);
    ctx.textAlign = "left";
}
/* -------------------------------------------------------------------------- */
/* Upgrade Menu                               */
/* -------------------------------------------------------------------------- */
function drawUpgradeMenu() {
    // 1. Draw a dim, full-screen background overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Define the main menu box dimensions
    const MENU_WIDTH = 900;
    const MENU_HEIGHT = 650;
    const menuX = (canvas.width / 2) - (MENU_WIDTH / 2);
    const menuY = (canvas.height / 2) - (MENU_HEIGHT / 2);
    
    // Draw the main menu box
    ctx.fillStyle = "#2a2a2a";
    ctx.strokeStyle = "#4CAF50"; // Green for upgrades
    ctx.lineWidth = 4;
    ctx.fillRect(menuX, menuY, MENU_WIDTH, MENU_HEIGHT);
    ctx.strokeRect(menuX, menuY, MENU_WIDTH, MENU_HEIGHT);

    // Menu Title
    ctx.textAlign = "center";
    ctx.font = "bold 30px 'Press Start 2P', monospace";
    ctx.fillStyle = "#4CAF50";
    ctx.fillText("⬆️ Upgrade Station", canvas.width / 2, menuY + 50);

    // Menu Subtitle
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.fillStyle = "#ccc";
    ctx.fillText("Spend money to improve gear", canvas.width / 2, menuY + 85);
    
    // Show Player Money
    ctx.font = "bold 24px 'Press Start 2P', monospace";
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`$${player.money}`, canvas.width / 2, menuY + 125);
    
    ctx.textAlign = "left"; // Reset for list items
    
    const startY = menuY + 190;
    const spacing = 100; // More spacing for upgrades

    upgradeList.forEach((key, i) => {
        const upgrade = playerUpgrades[key];
        const y = startY + i * spacing;
        const isSelected = i === selectedIndex;
        
        // Calculate cost based on level (increases 1.5x per level)
        const currentCost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.level - 1));
        const canAfford = player.money >= currentCost;
        const isMaxLevel = upgrade.level >= upgrade.maxLevel;

        // Selection highlight
        if (isSelected) {
            ctx.fillStyle = `rgba(76, 175, 80, 0.15)`;
            ctx.fillRect(menuX + 30, y - 40, MENU_WIDTH - 60, 90);
            ctx.strokeStyle = "#4CAF50";
            ctx.lineWidth = 2;
            ctx.strokeRect(menuX + 30, y - 40, MENU_WIDTH - 60, 90);
        }

        // Upgrade Name & Level
        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = isSelected ? "#fff" : "#ccc";
        ctx.fillText(`🔧 ${upgrade.name} (Lvl ${upgrade.level}/${upgrade.maxLevel})`, menuX + 50, y);

        // Description
        ctx.font = "16px 'Press Start 2P', monospace";
        ctx.fillStyle = "#aaa";
        ctx.fillText(upgrade.description, menuX + 50, y + 25);
        
        // Cost
        if (isMaxLevel) {
            ctx.font = "bold 20px 'Press Start 2P', monospace";
            ctx.fillStyle = "#FFD700";
            ctx.fillText("MAX LEVEL", menuX + 650, y + 15);
        } else {
            ctx.font = "bold 20px 'Press Start 2P', monospace";
            ctx.fillStyle = canAfford ? "#a7d1a8" : "#d1a7a7";
            ctx.fillText(`Cost: $${currentCost}`, menuX + 650, y + 15);
        }
    });

    // Footer
    ctx.textAlign = "center";
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = "#888";
    ctx.fillText("ENTER = Buy | ESC = Exit", canvas.width / 2, canvas.height - 40);
    ctx.textAlign = "left";
}
// -------------------------- DESTROY MENU ---------------------------------- //

/* -------------------------------------------------------------------------- */
/* NEW: Physics Scrapper Minigame                      */
/* -------------------------------------------------------------------------- */
class PhysicsScrapper {
    constructor() {
        this.items = [];
        this.gravity = 0.3;
        this.mousePos = { x: 0, y: 0 };
        // --- MODIFICATION ---
        this.scrappedMaterials = { metal: 0, plastic: 0, circuit: 0 };
    }

    start(inventory) {
        this.items = []; // Clear previous items
        // --- MODIFICATION ---
        this.scrappedMaterials = { metal: 0, plastic: 0, circuit: 0 };
        
        // Create physics objects for each item in the inventory
        inventory.forEach(itemName => {
            this.items.push({
                x: Math.random() * (canvas.width - 100) + 50,
                y: Math.random() * -200 - 50, // Start above the screen
                vx: Math.random() * 6 - 3,    // Horizontal velocity
                vy: Math.random() * 5 + 2,     // Vertical velocity
                rotation: 0,
                angularVelocity: Math.random() * 0.1 - 0.05,
                width: 80,
                height: 80,
                name: itemName,
                img: images[itemName] || images.rock1, // Use fallback image
                hitsLeft: 2 // Requires two clicks to break
            });
        });
        
        gameStage = "scrapping"; // Set the new game stage
    }

    update() {
        this.items.forEach(item => {
            // Apply gravity
            item.vy += this.gravity;
            
            // Update position
            item.x += item.vx;
            item.y += item.vy;
            item.rotation += item.angularVelocity;

            // Collision with floor
            if (item.y + item.height > canvas.height) {
                item.y = canvas.height - item.height;
                item.vy *= -0.6; // Bounce with energy loss
                item.angularVelocity *= 0.9;
            }

            // Collision with walls
            if (item.x + item.width > canvas.width || item.x < 0) {
                item.x = Math.max(0, Math.min(item.x, canvas.width - item.width));
                item.vx *= -0.7; // Bounce
            }
        });
    }

  
    
    handleClick(x, y) {
        // Loop backwards to click the top-most item
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (x > item.x && x < item.x + item.width && y > item.y && y < item.y + item.height) {
                item.hitsLeft--;
                
                // Add a little "kick" when hit
                item.vy = -5;
                item.vx += Math.random() * 4 - 2;

                if (item.hitsLeft <= 0) {
                    // --- MODIFICATION ---
                    // Item is broken, add materials to temp list
                    const itemData = itemTypes[item.name];
                    if (itemData) {
                        this.scrappedMaterials.metal += itemData.materials.metal || 0;
                        this.scrappedMaterials.plastic += itemData.materials.plastic || 0;
                        this.scrappedMaterials.circuit += itemData.materials.circuit || 0;
                    }
                    this.items.splice(i, 1); // Remove from array
                }
                break; // Stop after hitting one item
            }
        }
        
        // Check for win condition
        if (this.items.length === 0) {
            this.end();
        }
    }

    handleMouseMove(x, y) {
        this.mousePos = { x, y };
    }
    
    end() {
        // --- MODIFICATION ---
        // Transition to the sorting game instead of returning to workshop
        
        console.log("Scrapping complete. Starting sorting game...");
        console.log("Materials to sort:", this.scrappedMaterials);

        // Important: Update the collectedItems list to be empty
        collectedItems = [];
        selectedIndex = 0;
        
        // Hide the main canvas
        canvas.style.display = "none";
        
        // Show the sorting game container
        const gameContainer = document.getElementById("game-container");
        if (gameContainer) {
            gameContainer.style.display = "flex"; // Use flex to make it layout properly
        } else {
            console.error("Sorting game container not found!");
            gameStage = "workshop"; // Fallback
            return;
        }

        // Call the global startSortingGame function (from wtf.js)
        // and pass the materials we just scrapped.
        startSortingGame(this.scrappedMaterials); 
    }

    draw() {
        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#4a4a5a");
        gradient.addColorStop(1, "#2a2a3a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw each item
        this.items.forEach(item => {
            ctx.save();
            ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
            ctx.rotate(item.rotation);
            if (item.img && item.img.complete) {
                ctx.drawImage(item.img, -item.width / 2, -item.height / 2, item.width, item.height);
            }
            // Show damage effect on first hit
            if (item.hitsLeft === 1) {
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
                ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
            }
            ctx.restore();
        });

        // Draw UI
        ctx.fillStyle = "white";
        ctx.font = "24px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("ESMAGUE TODOS! Para pegar sua matéria prima!", canvas.width / 2, 50);
        ctx.font = "18px 'Press Start 2P', monospace";
        ctx.fillText(`${this.items.length} Itens faltando`, canvas.width / 2, 80);
        ctx.textAlign = "left";

        // Draw hammer
        if(images.hammer && images.hammer.complete) {
            ctx.drawImage(images.hammer, this.mousePos.x - 30, this.mousePos.y - 30, 60, 60);
        }
    }
}

const scrapperGame = new PhysicsScrapper();




    /* -------------------------------------------------------------------------- */
    /* Main Game Loop                               */
    /* -------------------------------------------------------------------------- */

    let started = true

   let lastTime = 0;
let dt = 0;
let startingMessage = true;

function gameLoop(timestamp) {
    // Calculate delta time (dt) for smooth animations and timers
    if (!lastTime) {
        lastTime = timestamp;
    }
    dt = timestamp - lastTime;
    lastTime = timestamp;
    transitionManager.update(dt);

    // Clear the canvas once at the beginning of the frame
    ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    // --- STATE MACHINE ---
    // Run different logic based on the current game stage
    if (gameStage === "stage1") {
        // --- UPDATE LOGIC for STAGE 1 ---
        
        if (lastTime < 2000 && started && startingMessage) {         
        messageBox.isActive = true;
        messageBox.displayedText = "Colete  itens  antes  que  o  tempo  acabe!";
        messageBox.message = "Colete itens antes que o tempo acabe!       WASD para mover e [shift] pra correr.     Evite cachorros!      Pressione [E] para fechar ou interagir com os obstáculos do mapa!";
        startingMessage = false;
        }else{// FIX: Only start timer if we are NOT transitioning
        if (!transitionManager.isActive) {
            startTimer();
        }

        
        startTimer()
        dogs.forEach(dog => dog.update(player));
        updateCamera();
        if (messageBox.isActive) {
          stopTimer(); // Pause timer when message box is active
        } else {
          resumeTimer(); // Resume timer when message box is closed
          updatePlayer();

        }
        
        // --- DRAW LOGIC for STAGE 1 ---
       ctx.save();
        ctx.translate(-camera.x, -camera.y); // Apply camera
        
        drawBackground();
        drawObjects(); // <-- ADD THIS LINE
        drawObstacles();
        dogs.forEach(dog => dog.draw());
        drawPlayer();
        ctx.restore();
        drawLightMask();
        updateUI(); 
        

        }
        messageBox.update(dt);
        messageBox.draw();

        
     } else if (gameStage === "workshop") {
        // --- UPDATE & DRAW for WORKSHOP ---
        updatePlayer();
        updateCamera();
        obstacles = []; // No obstacles in workshop
    
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        // ✅ CORREÇÃO 2: Ordem invertida
        drawBackground();
        drawObjects(); // <-- ADD THIS LINE
        drawPlayer();
    
        ctx.restore(); // Restore from camera translation
    
        // --- DRAW UI ON TOP OF THE SCREEN ---
         drawWorkshopHUD();
        drawWorkshopUI();
       
        // ✅ ADD THESE TWO LINES
        messageBox.update(dt);
        messageBox.draw();
    } else if (gameStage === "repair") {
        drawCraftingMenu();
    } else if (gameStage === "crafting") {
        drawCraftingMenu();
    } else if (gameStage === "upgrading") {
        drawUpgradeMenu();
    } else if (gameStage === "scrapping") {
        scrapperGame.update();
        scrapperGame.draw();
    } else if (gameStage === "minigame") {
        // The mini-game manager handles everything from here
        miniGameManager.update(dt);
        miniGameManager.draw();
    }  
    
    // Note: The new game stages "sorting" and "building"
    // are handled by their own loops/listeners, not the main 'gameLoop'.
    
    transitionManager.draw();
    requestAnimationFrame(gameLoop);
}


    // Start the game
    
// ... (inside base.js, at the end of the file)
console.log("🔄 Loading images...");
loadImages(() => {
    initializeObstacles(); // <-- This line is already here
  
  // ✅ ADD THIS BLOCK
  // Attach the player animation *after* the image has loaded
  if (images.player) {
    player.animation = new Spritesheet(ctx, images.player, 4, 4); // 4 rows, 4 columns
    player.animation.interval = 150; // Animation speed (150ms per frame)
  } else {
    // This prevents a crash if the player image fails to load
    console.error("Player spritesheet failed to load! Animation will not work.");
    player.animation = {
      draw: (x, y, w, h) => {
        ctx.fillStyle = 'magenta'; // Draw a fallback box
        ctx.fillRect(x, y, w, h);
      },
      nextFrame: () => {},
      row: 0,
      col: 0
    };
  }
  // ✅ END OF ADDED BLOCK

  // --- ADD THIS NEW BLOCK TO INITIALIZE DOGS ---
  dogs = [
    new Dog(700, 2000, 250, 5),
    new Dog(1300, 100, 350, 4),
    new Dog(2000, 900, 300, 6),
    new Dog(3000, 1500, 400, 3),
    new Dog(4000, 500, 350, 4),
    new Dog(4500, 2500, 300, 5),
  ];

  if (images.dog_spritesheet) {
    dogs.forEach(dog => {
      // The dog spritesheet has 4 rows and 4 columns
      dog.animation = new Spritesheet(ctx, images.dog_spritesheet, 4, 4); 
      dog.animation.interval = 150; // Set animation speed
    });
  } else {
    console.error("Dog spritesheet failed to load! Animations will not work.");
  }
  if (images.animatedRiver) {
      // Your river1.png has 1 row and 3 columns
      animatedRiverSprite = new Spritesheet(ctx, images.animatedRiver, 1, 3);
      animatedRiverSprite.interval = 200; // 200ms per frame, adjust to your liking!
  } else {
      console.error("Animated river spritesheet (river1.png) failed to load!");
  }


  console.log("🚀 All images ready — starting game!");

  gameLoop(); // or gameLoop(), or whatever function starts your game
  
});
function checkAABBCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}



/* ============================================================================
SECTION 2: YOUR 'wtf.js' (SORTING GAME)
This code is merged from 'wtf.js' and is called by the Scrapper minigame.
============================================================================
*/

// --- DOM Elements ---
const sortingConveyorBelt = document.querySelector('.conveyor-belt');
const sortingCorrectSortsElement = document.getElementById('correct-sorts');
const sortingComboCounterElement = document.getElementById('combo-counter');
const sortingScoreElement = document.getElementById('score');
const sortingSpeedDisplayElement = document.getElementById('speed-display');
const sortingRestartBtn = document.getElementById('restart-btn');

// --- Game state for sorting ---
let sortingGameState = {
    correctSorts: 0,
    combo: 0,
    score: 0,
    speed: 1.0,
    items: [],
    itemIntervals: [],
    isGameActive: false // Start as false
};
let itemsToGenerateList = [];
let totalMaterialsToSort = 0;
// This will store the *output* of the sorting game
let sortedMaterialsCount = { metal: 0, plastic: 0, glass: 0, hazardous: 0, electronics: 0 };


// 1. This is the NEW "START" function called by base.js
function startSortingGame(materials) {
    // materials = { metal: 5, plastic: 4, circuit: 3 }

    // Reset counts and UI
    initSortingGame(); // This is your old initGame, but renamed
    sortedMaterialsCount = { metal: 0, plastic: 0, glass: 0, hazardous: 0, electronics: 0 };
    itemsToGenerateList = [];
    sortingGameState.isGameActive = true;

    // Create the list of items to spawn from the inventory
    for (let i = 0; i < (materials.metal || 0); i++) {
        itemsToGenerateList.push({ 
            type: 'metal', 
            name: 'Metal Scrap', 
            text:"Metal",
            image: images.Metal, // <-- Use the preloaded image
            
        });
    }
    for (let i = 0; i < (materials.plastic || 0); i++) {
        itemsToGenerateList.push({ 
            type: 'plastic', 
            name: 'Plastic Part',
            text:"Vidro", 
            image: images.Vidro, // <-- Use the preloaded image
           
        });
    }
    for (let i = 0; i < (materials.circuit || 0); i++) {
        itemsToGenerateList.push({ 
            type: 'circuit', 
            name: 'Circuit Board', 
            text:"Chip",
            image: images.Chip, // <-- Use the preloaded image
            
        });
    }

    // Shuffle the items
    itemsToGenerateList.sort(() => 0.5 - Math.random());
    
    totalMaterialsToSort = itemsToGenerateList.length;
    
    // Update the "Correct: 0/15" display
    if (sortingCorrectSortsElement) {
        sortingCorrectSortsElement.textContent = `0/${totalMaterialsToSort}`;
    }
    
    if (totalMaterialsToSort === 0) {
        console.log("No materials to sort, skipping to phone building.");
        // Call endSortingGame, which will trigger the transition
        setTimeout(endSortingGame, 500); // Short delay so it's not instant
        return; // Don't start item generation
    }else if(totalMaterialsToSort > 50){
        totalMaterialsTosort = 50
    }

    // Start spawning items from our new list
    startItemGeneration();
}

// 2. This is the old 'resetGame', but renamed and using the correct state
function initSortingGame() {
    // Clear any existing items and intervals
    if (sortingGameState.items) {
        sortingGameState.items.forEach(itemEl => itemEl.remove());
    }
    if (sortingGameState.itemIntervals) {
        sortingGameState.itemIntervals.forEach(interval => clearInterval(interval));
    }
   
    // Reset game state
    sortingGameState.correctSorts = 0;
    sortingGameState.combo = 0;
    sortingGameState.score = 0;
    sortingGameState.speed = 1.0;
    sortingGameState.items = [];
    sortingGameState.itemIntervals = [];
    sortingGameState.isGameActive = false;
   
    // Update UI
    if (sortingCorrectSortsElement) sortingCorrectSortsElement.textContent = '0/0';
    if (sortingComboCounterElement) sortingComboCounterElement.textContent = '0';
    if (sortingScoreElement) sortingScoreElement.textContent = '0';
    if (sortingSpeedDisplayElement) sortingSpeedDisplayElement.textContent = '1.0';

    setupBins();
}

// 3. Set up bin event listeners
function setupBins() {
    const bins = document.querySelectorAll('.bin');
    bins.forEach(bin => {
        bin.addEventListener('dragover', (e) => e.preventDefault());
        bin.addEventListener('drop', (e) => handleDrop(e, bin.dataset.type));
    });
}

// 4. Start generating items from the list
function startItemGeneration() {
    if (itemsToGenerateList.length > 0) {
        generateSortingItem();
    }
    
    const generationInterval = setInterval(() => {
        if (sortingGameState.isGameActive && itemsToGenerateList.length > 0) {
            generateSortingItem();
        } else if (itemsToGenerateList.length === 0) {
            clearInterval(generationInterval);
        }
    }, 2000 / sortingGameState.speed);
}

// 5. Generate a sorting item
function generateSortingItem() {
    if (!sortingGameState.isGameActive || itemsToGenerateList.length === 0 || !sortingConveyorBelt) {
        return;
    }
    
    const itemData = itemsToGenerateList.shift();
    const item = document.createElement('div');
    item.className = `sorting-item ${itemData.type}`;
    item.draggable = true;
    item.dataset.type = itemData.type;
    item.style.backgroundColor = itemData.color;
    item.style.left = '-60px';

    // --- THIS IS THE NEW PART ---
    item.innerHTML = ''; // Clear any default text
    if (itemData.image && itemData.image.src) {
        const imgEl = document.createElement('img');
        imgEl.src = itemData.image.src;
        imgEl.draggable = false; // Prevents dragging the image instead of the box
        item.appendChild(imgEl);
    } else {
        // Fallback if image is missing
        item.innerHTML = '❓'; 
    }
    // --- END OF NEW PART ---
   
    item.addEventListener('dragstart', (e) => {
        if (!sortingGameState.isGameActive) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('text/plain', itemData.type);
        item.style.opacity = '0.7';
    });
   
    item.addEventListener('dragend', () => {
        item.style.opacity = '1';
    });
   
    sortingConveyorBelt.appendChild(item);
    sortingGameState.items.push(item);
   
    let position = -60;
    const moveInterval = setInterval(() => {
        if (!sortingGameState.isGameActive) {
            clearInterval(moveInterval);
            return;
        }
       
        position += sortingGameState.speed;
        item.style.left = position + 'px';
       
        if (position > sortingConveyorBelt.clientWidth + 60) {
            clearInterval(moveInterval);
            item.remove();
           
            const index = sortingGameState.items.indexOf(item);
            if (index > -1) {
                sortingGameState.items.splice(index, 1);
            }
           
            if (sortingGameState.combo > 0) {
                sortingGameState.combo = 0;
                if(sortingComboCounterElement) sortingComboCounterElement.textContent = '0';
                showComboFeedback("Errou! Combo resetou");
            }
            
            // Check if that was the last item
            if (itemsToGenerateList.length === 0 && sortingGameState.items.length === 0) {
                endSortingGame();
            }
        }
    }, 16); // ~60fps
   
    sortingGameState.itemIntervals.push(moveInterval);
   
    if (sortingGameState.speed < 3.0) {
        sortingGameState.speed += 0.02;
        if(sortingSpeedDisplayElement) sortingSpeedDisplayElement.textContent = sortingGameState.speed.toFixed(1);
    }
}

// 6. Handle dropping an item into a bin
function handleDrop(e, binType) {
    e.preventDefault();
    if (!sortingGameState.isGameActive) return;
   
    const itemType = e.dataTransfer.getData('text/plain');
    const draggedItem = sortingGameState.items.find(item => item.style.opacity === '0.7');
   
    if (itemType === binType) {
        // Correct sort
        sortingGameState.correctSorts++;
        sortingGameState.combo++;
        sortingGameState.score += 10 + (sortingGameState.combo * 2);
       
        if(sortingCorrectSortsElement) sortingCorrectSortsElement.textContent = `${sortingGameState.correctSorts}/${totalMaterialsToSort}`;
        if(sortingComboCounterElement) sortingComboCounterElement.textContent = sortingGameState.combo;
        if(sortingScoreElement) sortingScoreElement.textContent = sortingGameState.score;
       
        if (sortedMaterialsCount.hasOwnProperty(itemType)) {
            sortedMaterialsCount[itemType]++;
        }
        
        showComboFeedback(`Correto! +${10 + (sortingGameState.combo * 2)} pontos`);
       
        if (draggedItem) {
            draggedItem.remove();
            const index = sortingGameState.items.indexOf(draggedItem);
            if (index > -1) {
                sortingGameState.items.splice(index, 1);
            }
        }
       
        // Check if game is complete
        if (sortingGameState.correctSorts >= totalMaterialsToSort) {
            // Also add the sorted materials to the player's main inventory
            player.materials.metal += sortedMaterialsCount.metal || 0;
            player.materials.plastic += sortedMaterialsCount.plastic || 0;
            player.materials.circuit += sortedMaterialsCount.electronics || 0; // Note: 'electronics' type maps to 'circuit'
            
            console.log("Added sorted materials to player:", sortedMaterialsCount);
            
            endSortingGame();
        }
    } else {
        // Incorrect sort
        sortingGameState.combo = 0;
        sortingGameState.score = Math.max(0, sortingGameState.score - 5);
        if(sortingComboCounterElement) sortingComboCounterElement.textContent = '0';
        if(sortingScoreElement) sortingScoreElement.textContent = sortingGameState.score;
        showComboFeedback("Lixeira errada! -5 points");
    }
}

// 7. Show combo feedback
function showComboFeedback(message) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'absolute';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    feedback.style.color = 'white';
    feedback.style.padding = '10px 20px';
    feedback.style.borderRadius = '10px';
    feedback.style.zIndex = '100';
    feedback.style.fontSize = '1.2rem';
    feedback.style.fontWeight = 'bold';
    feedback.style.fontFamily = "'Press Start 2P', monospace";
   
    document.body.appendChild(feedback);
   
    setTimeout(() => {
        feedback.remove();
    }, 1500);
}

// 8. End the sorting game
function endSortingGame() {
    sortingGameState.isGameActive = false;
    sortingGameState.itemIntervals.forEach(interval => clearInterval(interval));
    
    // Hide the sorting game
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        gameContainer.style.display = "none";
    }

    // Show the canvas again for the final phase
    const phoneCanvas = document.getElementById("gameCanvas");
    if (phoneCanvas) {
        phoneCanvas.style.display = "block";
    }
    
    // Call the final function IN base.js
startCraftingMinigameSequence();
} 

// --- Event Listeners ---
if (sortingRestartBtn) {
    sortingRestartBtn.addEventListener('click', () => {
        initSortingGame();
        alert("Restarting empty state. To play properly, restart from Phase 1.");
    });
}

// Run setup once
setupBins();


/* ============================================================================
SECTION 3: YOUR 'buildcellphone.js' (PHONE BUILD GAME)
This code is merged from 'buildcellphone.js' and is called by the
Sorting game.
============================================================================
*/

// This function is now the entry point, called by endSortingGame()
function startPhoneBuildingSequence(materials) {
// ===============================
// CONFIGURAÇÃO GERAL
// ===============================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentGame = "celular"; // alterna entre celular, notebook e pc
let fading = false;
let fadeAlpha = 0;

// ===============================
// DADOS DO CELULAR
// ===============================
const phoneParts = [
    { name: 'placa_mae', x: 10, y: 0, width: 250, height: 150, color: '#4a4a4a', correctX: 830, correctY: 380, image:images.celular_placa_mae },
    { name: 'bateria', x: 10, y: 150, width: 150, height: 300, color: '#2c3e50', correctX: 830, correctY: 100, image:images.bateria  },
    { name: 'camera', x: 10, y: 500, width: 60, height: 60, color: '#1a1a1a', correctX: 1055, correctY: 105 , image:images.camera },
    { name: 'tela', x: 370, y: 30, width: 340, height: 630, color: '#34495e', correctX: 800, correctY: 20, locked: true, image:images.telaCelular  }
];

// ===============================
// DADOS DO NOTEBOOK
// ===============================
const notebookParts = [
     { name: 'bateria', x:570, y: 400, width: 100, height: 162, color: '#2c3e50', correctX: 100, correctY: 520, image:images.bateriaNotebook  },
    { name: 'placa_mae', x: 620, y: 0, width: 180, height: 280, color: '#4a4a4a', correctX: 100, correctY: 410 , image:images.notebook_placa_mae },
    { name: 'cooler', x: 900, y: 0, width: 240, height: 255, color: '#1a1a1a', correctX: 270, correctY: 415, image:images.cooler  },
    { name: 'teclado', x: 700, y: 350, width: 430, height: 295, color: '#7f8c8d', correctX:100, correctY: 400 , image:images.teclado },
    { name: 'tela', x: 180, y: 60, width: 430, height: 310, color: '#34495e', correctX: 100, correctY: 90, locked: true , image:images.telaNotebook }
];

// ===============================
// DADOS DO PC
// ===============================
const pcParts = [
    { name: 'placa_mae', x: 600, y: 550, width: 300, height: 180, color: '#4a4a4a', correctX: 260, correctY: 250 , image:images.placa_mae },
    { name: 'processador', x: 0, y: 62, width: 80, height: 80, color: '#8e44ad', correctX: 330, correctY: 300, image:images.processador  },
    { name: 'placa_de_video', x: 700, y: 100, width: 200, height: 80, color: '#16a085', correctX: 280, correctY: 400 , image:images.placa_de_video },
    { name: 'fonte', x: 50, y: 300, width: 120, height: 120, color: '#2c3e50', correctX: 500, correctY: 420, image:images.fonte  },
    { name: 'gabinete', x: 50, y: 100, width: 250, height: 180, color: '#7f8c8d', correctX: 240, correctY: 180, locked: true, image:images.gabinete  }
];

// ===============================
// ESTADO DO JOGO
// ===============================
const gameState = {
    phase: 'selecting',
    currentPiece: null,
    placedPieces: [],
    pieces: [],
    completed: false
};

// ===============================
// FUNÇÕES DE CONFIGURAÇÃO
// ===============================
function getCurrentParts() {
    if (currentGame === "celular") return phoneParts;
    if (currentGame === "notebook") return notebookParts;
    return pcParts;
}

function initPieces() {
    gameState.pieces = getCurrentParts().map(piece => ({
        ...piece,
        dragged: false,
        placed: false
    }));
    gameState.placedPieces = [];
    gameState.completed = false;
}

// ===============================
// FUNÇÕES DE DESENHO
// ===============================
function drawBaseFrame() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    if (currentGame === "celular" && images.celularDeMontar){
        ctx.drawImage(images.celularDeMontar,750, 20, 450, 630)
    }else if(currentGame === "notebook" && images.notebookDeMontar){
        ctx.drawImage(images.notebookDeMontar,100, 400, 430,295)
    }

}

function drawPieces() {
    gameState.pieces.forEach(piece => {
        if (!piece.placed) {
            if(piece.image){
                ctx.drawImage(piece.image,piece.x, piece.y, piece.width, piece.height)
            }else{
            ctx.fillStyle = piece.color;
            ctx.fillRect(piece.x, piece.y, piece.width, piece.height);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(piece.name, piece.x + 5, piece.y + 15);
            }
        }
        else if (piece.placed) {
            // Desenha a peça no local correto com uma borda verde
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 3;
            if(piece.image){
            ctx.drawImage(piece.image,piece.correctX, piece.correctY, piece.width, piece.height);
            }else{
            ctx.fillStyle = piece.color;
            ctx.fillRect(piece.correctX, piece.correctY, piece.width, piece.height);
            }
            ctx.strokeRect(piece.correctX, piece.correctY, piece.width, piece.height);
        }
    });


}

// ===============================
// INTERAÇÃO E LÓGICA
// ===============================
function getPieceAt(x, y) {
    for (let i = gameState.pieces.length - 1; i >= 0; i--) {
        const piece = gameState.pieces[i];
        if (!piece.placed && x >= piece.x && x <= piece.x + piece.width && y >= piece.y && y <= piece.y + piece.height) {
            return piece;
        }
    }
    return null;
}

function isInCorrectPosition(piece, x, y) {
    const tolerance = 20;
    return Math.abs(x - piece.correctX) < tolerance &&
           Math.abs(y - piece.correctY) < tolerance;
}

function checkCompletion() {
    if (gameState.placedPieces.length === getCurrentParts().length - 1) {
        const lastPiece = gameState.pieces.find(p => p.locked);
        if (lastPiece && !lastPiece.placed) lastPiece.locked = false;
    }

    if (gameState.placedPieces.length === getCurrentParts().length) {
        gameState.completed = true;
    }
}

// ===============================
// INTERFACE VISUAL
// ===============================
function drawUI() {
    if (gameState.completed) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        if(currentGame === "celular"){
        ctx.textAlign = 'center';
        }else{
        ctx.textAlign = 'left';
        }
        if(currentGame === "celular"){
        ctx.fillText(
            "Celular Montado com Sucesso!", 500, 310
        );
        }else if(currentGame === "notebook"){
        ctx.fillText(
            currentGame === "notebook" ? "Notebook Montado com Sucesso!" :
            "PC Montado com Sucesso!",
            600, 310
        )
    }
        ctx.font = '20px Arial';
        if(currentGame === "celular"){
        ctx.fillText(
            "Clique para avançar para a próxima fase", 500, 345
        );
        }else if(currentGame === "notebook"){
        ctx.fillText(
            currentGame === "notebook" ? "Clique para finalizar o jogo" :
            "Clique para finalizar o jogo",
            630, 345
        )
    }
        ctx.textAlign = 'start';
    }

    ctx.fillStyle = "#ffffffff";
     ctx.font = "24px 'Determination', monospace";
    ctx.fillText(
        currentGame === "celular" ? " Montagem do Celular" :
        currentGame === "notebook" ? "Montagem do Notebook" :
        "🖥️ Montagem do PC",
        320, 30
    );
}

// ===============================
// TRANSIÇÃO VISUAL
// ===============================
function fadeToNext() {
    fading = true;
}
function drawFade() {
    if (fading) {
        fadeAlpha += 0.02;
        ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (fadeAlpha >= 1) {
            if (currentGame === "celular") currentGame = "notebook";
            else if (currentGame === "notebook") window.location.href = "faseFinal.html";

            initPieces();
            fading = false;
            fadeAlpha = 0;
        }

        if (fadeAlpha >= 1) {
    if (currentGame === "celular") {
        // Go from phone to notebook
        currentGame = "notebook";
        initPieces();
        fading = false;
        fadeAlpha = 0;
    } else if (currentGame === "notebook") {
        // Go from notebook to PC
        currentGame = "pc";
        initPieces();
        fading = false;
        fadeAlpha = 0;
    } else {
        // We just finished the "pc", so redirect to the final page
        window.location.href = "faseFinal.html";
    }
}
    }
}

// ===============================
// EVENTOS DO MOUSE
// ===============================
canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameState.completed) {
        fadeToNext();
        return;
    }

    const piece = getPieceAt(x, y);
    if (piece && !piece.locked) {
        gameState.phase = 'dragging';
        gameState.currentPiece = piece;
        piece.dragged = true;
        piece.offsetX = x - piece.x;
        piece.offsetY = y - piece.y;
    }
});

canvas.addEventListener('mousemove', e => {
    if (gameState.phase === 'dragging' && gameState.currentPiece) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gameState.currentPiece.x = x - gameState.currentPiece.offsetX;
        gameState.currentPiece.y = y - gameState.currentPiece.offsetY;
    }
});

canvas.addEventListener('mouseup', e => {
    if (gameState.phase === 'dragging' && gameState.currentPiece) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - gameState.currentPiece.offsetX;
        const y = e.clientY - rect.top - gameState.currentPiece.offsetY;

        if (isInCorrectPosition(gameState.currentPiece, x, y)) {
            gameState.currentPiece.placed = true;
            ctx.drawImage(gameState.currentPiece.image,gameState.currentPiece.correctX, gameState.currentPiece.correctY, gameState.currentPiece.width, gameState.currentPiece.height);
            gameState.placedPieces.push(gameState.currentPiece);
            
            checkCompletion();
        }

        gameState.currentPiece = null;
        gameState.phase = 'selecting';
    }
});

// ===============================
// LOOP PRINCIPAL
// ===============================
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBaseFrame();
    drawUI();
    drawPieces();
    drawFade();
    requestAnimationFrame(gameLoop);
}

initPieces();
gameLoop();
}
