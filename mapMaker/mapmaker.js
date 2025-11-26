/* -------------------------------------------------------------------------- */
/* Canvas Setup                                           */
/* -------------------------------------------------------------------------- */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 20; // Size of tiles *in the editor*
const ROWS = 32;
const COLS = 32;

canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

/* -------------------------------------------------------------------------- */
/* GAME DEFINITIONS (COPIED FROM BASE.JS)                           */
/* -------------------------------------------------------------------------- */

// These TILE_TYPES are identical to your game's TILE_TYPES
const TILE_TYPES = {
    GROUND: 0,
    WALL: 1,
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

};

// These image paths are identical to your game's imageSources
const imageSources = {
    torradeira: "../IMG/torradeira (2).png",
    notebook: "../IMG/notebook.png",
    liquidificador: "../IMG/liquidificador.png",
    chip: "../IMG/chip.png",
    pc: "../IMG/pc.png",
    celular: "../IMG/celular.png",
    GROUND: "../IMG/fabrica7.png",
    GroundTile1: "../IMG/tile1.png",
    GroundTile2: "../IMG/tile2.png",
    GroundTile3: "../IMG/tile3.png",
    GroundTile4: "../IMG/tile4.png",
    GroundTile5: "../IMG/tile5.png",
    GroundTile6: "../IMG/tile6.png",
    GroundTile7: "../IMG/tile7.png",
    GroundTile8: "../IMG/tile8.png",
    GroundTile9: "../IMG/tile9.png",
    GroundTile10: "../IMG/tile10.png",
    GroundTile11: "../IMG/tile35.png",
    GroundTile12: "../IMG/tile36.png",
    GroundTile13: "../IMG/tile37.png",
    GroundTile14: "../IMG/tile38.png",
    MudTile1: "../IMG/tile39.png",
    RiverTile1: "../IMG/tile10.png",
    RiverTile2: "../IMG/tile11.png",
    RiverTile3: "../IMG/tile12.png",
    RiverTile4: "../IMG/tile13.png",
    RiverTile5: "../IMG/tile14.png",
    RiverTile6: "../IMG/tile15.png",
    RiverTile7: "../IMG/tile16.png",
    RiverTile8: "../IMG/tile17.png",
    RiverTile9: "../IMG/tile18.png",
    MountainTile1: "../IMG/tile19.png",
    MountainTile2: "../IMG/tile20.png",
    MountainTile3: "../IMG/tile21.png",
    MountainTile4: "../IMG/tile22.png",
    MountainTile5: "../IMG/tile23.png",
    MountainTile6: "../IMG/tile24.png",
    MountainTile7: "../IMG/tile25.png",
    MountainTile8: "../IMG/tile26.png",
    MountainTile9: "../IMG/tile27.png",
    MountainTile10: "../IMG/tile28.png",
    MountainTile11: "../IMG/tile29.png",
    MountainTile12: "../IMG/tile30.png",
    MountainTile13: "../IMG/tile31.png",
    MountainTile14: "../IMG/tile32.png",
    MountainTile15: "../IMG/tile33.png",
    MudTile1: "../IMG/tile34.png",
    WorkshopWallTile1: "../IMG/fabrica1.png",
    WorkshopWallTile2: "../IMG/fabrica8.png",
    WorkshopWallTile3: "../IMG/fabrica3.png",
    WorkshopWallTile4: "../IMG/fabrica4.png",
    WorkshopWallTile5: "../IMG/fabrica5.png",
    WorkshopWallTile6: "../IMG/fabrica6.png",
    WorkshopWallTile7: "../IMG/fabrica2.png",
    WorkshopWallTile8: "../IMG/fabrica8.png",
    WorkshopWallTile9: "../IMG/fabrica9.png",
    WorkshopFloorTile1: "../IMG/fabrica7.png",
    repair_station: "../IMG/areia.png",
    destroy_station: "../IMG/2.png",
    exit_door: "../IMG/arrows.png",
};

// This map is identical to your game's tileImageMap
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
    [TILE_TYPES.WALL]: null,
    [TILE_TYPES.UPGRADE_STATION]: 'chip',
    [TILE_TYPES.REPAIR_STATION]: 'repair_station',
    [TILE_TYPES.DESTROY_STATION]: 'destroy_station',
    [TILE_TYPES.EXIT_DOOR]: 'exit_door',
};

// NEW: Fallback colors for the editor, based on game's TILE_TYPES
const TILE_COLORS = {
    [TILE_TYPES.GROUND]: '#8b7e56',
    [TILE_TYPES.WALL]: '#333333',
    [TILE_TYPES.REPAIR_STATION]: '#ffc107',
    [TILE_TYPES.DESTROY_STATION]: '#f44336',
    [TILE_TYPES.UPGRADE_STATION]: '#00bcd4',
    [TILE_TYPES.EXIT_DOOR]: '#4caf50',

    [TILE_TYPES.GroundTile1]: '#6d8c3c',
    [TILE_TYPES.GroundTile2]: '#6d8c3c',
    [TILE_TYPES.GroundTile3]: '#6d8c3c',
    [TILE_TYPES.GroundTile4]: '#6d8c3c',
    [TILE_TYPES.GroundTile5]: '#6d8c3c',
    [TILE_TYPES.GroundTile6]: '#6d8c3c',
    [TILE_TYPES.GroundTile7]: '#6d8c3c',
    [TILE_TYPES.GroundTile8]: '#6d8c3c',
    [TILE_TYPES.GroundTile9]: '#6d8c3c',
    [TILE_TYPES.GroundTile10]: '#6d8c3c',
    [TILE_TYPES.GroundTile11]: '#6d8c3c',
    [TILE_TYPES.GroundTile12]: '#6d8c3c',
    [TILE_TYPES.GroundTile13]: '#6d8c3c',
    [TILE_TYPES.GroundTile14]: '#6d8c3c',
    [TILE_TYPES.MudTile1]: '#5d4037',

    [TILE_TYPES.RiverTile1]: '#3f7ee0',
    [TILE_TYPES.RiverTile2]: '#3f7ee0',
    [TILE_TYPES.RiverTile3]: '#3f7ee0',
    [TILE_TYPES.RiverTile4]: '#3f7ee0',
    [TILE_TYPES.RiverTile5]: '#3f7ee0',
    [TILE_TYPES.RiverTile6]: '#3f7ee0',
    [TILE_TYPES.RiverTile7]: '#3f7ee0',
    [TILE_TYPES.RiverTile8]: '#3f7ee0',
    [TILE_TYPES.RiverTile9]: '#3f7ee0',

    [TILE_TYPES.MountainTile1]: '#616161',
    [TILE_TYPES.MountainTile2]: '#616161',
    [TILE_TYPES.MountainTile3]: '#616161',
    [TILE_TYPES.MountainTile4]: '#616161',
    [TILE_TYPES.MountainTile5]: '#616161',
    [TILE_TYPES.MountainTile6]: '#616161',
    [TILE_TYPES.MountainTile7]: '#616161',
    [TILE_TYPES.MountainTile8]: '#616161',
    [TILE_TYPES.MountainTile9]: '#616161',
    [TILE_TYPES.MountainTile10]: '#616161',
    [TILE_TYPES.MountainTile11]: '#616161',
    [TILE_TYPES.MountainTile12]: '#616161',
    [TILE_TYPES.MountainTile13]: '#616161',
    [TILE_TYPES.MountainTile14]: '#616161',
    [TILE_TYPES.MountainTile15]: '#616161',

    [TILE_TYPES.WorkshopWallTile1]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile2]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile3]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile4]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile5]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile6]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile7]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile8]: '#4e342e',
    [TILE_TYPES.WorkshopWallTile9]: '#4e342e',
};


/* -------------------------------------------------------------------------- */
/* Map + Controls                                        */
/* -------------------------------------------------------------------------- */
let selectedTile = TILE_TYPES.GROUND;
let isMouseDown = false;
// This is your saved map from the old file, it will load correctly now.
let tileMap =[
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 45, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 44, 14, 14, 14,14, 14, 14, 45, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 45, 17, 17, 44, 14, 14, 14],
  [14, 45, 17, 18, 55, 55, 16, 17, 44, 14, 14, 14, 14, 15, 19, 20, 20, 21, 13, 14, 14, 14, 14, 45, 17, 18, 55, 55, 16, 17, 44, 14,14, 45, 17, 18, 55, 55, 16, 17, 44, 14, 14, 14, 14, 15, 19, 20, 20, 21, 13, 14, 14, 14, 14, 45, 17, 18, 55, 55, 16, 17, 44, 14],
  [14, 15, 55, 55, 28, 29, 30, 55, 16, 44, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 45, 18, 28, 29, 30, 55, 55, 55, 13, 14,14, 15, 55, 55, 28, 29, 30, 55, 16, 44, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 45, 18, 28, 29, 30, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 31, 32, 33, 55, 55, 13, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 15, 55, 31, 32, 33, 55, 55, 55, 13, 14,14, 15, 55, 55, 31, 32, 33, 55, 55, 13, 14, 14, 14, 15, 22, 23, 23, 24, 13, 14, 14, 14, 15, 55, 31, 32, 33, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 34, 35, 36, 55, 55, 16, 17, 17, 17, 18, 25, 26, 26, 27, 16, 17, 17, 17, 55, 55, 34, 35, 36, 55, 55, 55, 13, 14,14, 15, 55, 55, 34, 35, 36, 55, 55, 16, 17, 17, 17, 18, 25, 26, 26, 27, 16, 17, 17, 17, 55, 55, 34, 35, 36, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 37, 38, 39, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 37, 38, 39, 55, 55, 55, 13, 14,14, 15, 55, 55, 37, 38, 39, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 37, 38, 39, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 40, 41, 42, 55, 55, 55, 55, 55, 55, 10, 11, 11, 11, 11, 12, 55, 55, 55, 55, 55, 40, 41, 42, 55, 55, 55, 13, 14,14, 15, 55, 55, 40, 41, 42, 55, 55, 55, 55, 55, 55, 10, 11, 11, 11, 11, 12, 55, 55, 55, 55, 55, 40, 41, 42, 55, 55, 55, 13, 14],
  [14, 51, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 52, 14,14, 51, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 52, 14],
  [14, 14, 51, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 14, 14, 15, 55, 55, 55, 10, 11, 11, 11, 11, 11, 11, 52, 14, 14,14, 14, 51, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 14, 14, 15, 55, 55, 55, 10, 11, 11, 11, 11, 11, 11, 52, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 13, 14, 14, 14, 14, 14, 15, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 13, 14, 14, 14, 14, 14, 15, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 45, 18, 10, 11, 52, 14, 14, 14, 14, 45, 18, 55, 55, 55, 16, 44, 14, 14, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 14, 14, 45, 18, 10, 11, 52, 14, 14, 14, 14, 45, 18, 55, 55, 55, 16, 44, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 45, 18, 55, 13, 14, 14, 14, 14, 14, 14, 15, 55, 55, 28, 29, 30, 16, 44, 14, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 14, 45, 18, 55, 13, 14, 14, 14, 14, 14, 14, 15, 55, 55, 28, 29, 30, 16, 44, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 13, 14, 14, 14, 14, 14, 45, 18, 55, 55, 31, 32, 33, 55, 16, 17, 44, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 13, 14, 14, 14, 14, 14, 45, 18, 55, 55, 31, 32, 33, 55, 16, 17, 44, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 16, 44, 14, 14, 14, 14, 15, 55, 55, 55, 34, 35, 36, 55, 55, 55, 13, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 16, 44, 14, 14, 14, 14, 15, 55, 55, 55, 34, 35, 36, 55, 55, 55, 13, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 45, 18, 55, 55, 55, 55, 55, 16, 44, 14, 14, 14, 15, 55, 55, 55, 37, 38, 39, 55, 55, 55, 16, 44, 14, 14, 14, 14,14, 14, 14, 14, 45, 18, 55, 55, 55, 55, 55, 16, 44, 14, 14, 14, 15, 55, 55, 55, 37, 38, 39, 55, 55, 55, 16, 44, 14, 14, 14, 14],
  [14, 14, 14, 45, 18, 55, 55, 19, 20, 21, 55, 55, 13, 14, 14, 45, 18, 55, 55, 55, 40, 41, 42, 55, 55, 55, 55, 16, 44, 14, 14, 14,14, 14, 14, 45, 18, 55, 55, 19, 20, 21, 55, 55, 13, 14, 14, 45, 18, 55, 55, 55, 40, 41, 42, 55, 55, 55, 55, 16, 44, 14, 14, 14],
  [14, 14, 45, 18, 55, 55, 55, 22, 23, 24, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 44, 14, 14,14, 14, 45, 18, 55, 55, 55, 22, 23, 24, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 44, 14, 14],
  [14, 14, 15, 55, 55, 55, 55, 25, 26, 27, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14,14, 14, 15, 55, 55, 55, 55, 25, 26, 27, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14],
  [14, 45, 18, 55, 55, 10, 11, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 11, 12, 55, 55, 16, 44, 14,14, 45, 18, 55, 55, 10, 11, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 11, 12, 55, 55, 16, 44, 14],
  [14, 15, 55, 55, 55, 13, 14, 14, 51, 12, 55, 55, 10, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 15, 55, 55, 55, 13, 14,14, 15, 55, 55, 55, 13, 14, 14, 51, 12, 55, 55, 10, 11, 11, 11, 11, 11, 11, 12, 55, 55, 10, 52, 14, 14, 15, 55, 55, 55, 13, 14],
  [14, 15, 55, 55, 55, 13, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 15, 55, 55, 55, 13, 14,14, 15, 55, 55, 55, 13, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 14, 14, 14, 51, 11, 11, 52, 14, 14, 14, 15, 55, 55, 55, 13, 14],
  [14, 51, 12, 55, 55, 16, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 55, 13, 14,14, 51, 12, 55, 55, 16, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 18, 55, 55, 55, 13, 14],
  [14, 14, 15, 55, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 10, 52, 14,14, 14, 15, 55, 55, 55, 55, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 55, 55, 55, 55, 10, 52, 14],
  [14, 14, 51, 12, 55, 55, 55, 16, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 18, 55, 55, 55, 10, 52, 14, 14,14, 14, 51, 12, 55, 55, 55, 16, 17, 17, 17, 44, 14, 14, 14, 14, 14, 14, 14, 14, 45, 17, 17, 17, 18, 55, 55, 55, 10, 52, 14, 14],
  [14, 14, 14, 51, 12, 55, 55, 55, 55, 55, 55, 16, 17, 17, 44, 14, 14, 45, 17, 17, 18, 55, 55, 55, 55, 55, 55, 10, 52, 14, 14, 14,14, 14, 14, 51, 12, 55, 55, 55, 55, 55, 55, 16, 17, 17, 44, 14, 14, 45, 17, 17, 18, 55, 55, 55, 55, 55, 55, 10, 52, 14, 14, 14],
  [14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14,14, 14, 14, 14, 15, 55, 55, 55, 55, 55, 55, 55, 55, 55, 16, 17, 17, 18, 55, 55, 55, 55, 55, 55, 55, 55, 55, 13, 14, 14, 14, 14],
  [14, 14, 14, 14, 51, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 52, 14, 14, 14, 14,14, 14, 14, 14, 51, 11, 12, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 10, 11, 52, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 51, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 52, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 51, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 52, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
  
]
/* -------------------------------------------------------------------------- */
/* Editor Settings (Brush & Symmetry)                     */
/* -------------------------------------------------------------------------- */
let brushSize = 1; // 1x1, 2x2, 4x4
let symmetryEnabled = false;

/* -------------------------------------------------------------------------- */
/* NEW Image Loader                                       */
/* -------------------------------------------------------------------------- */
const images = {}; // Stores loaded images by key (e.g., 'GroundTile1')
const tileImages = {}; // Stores loaded images by tile ID (e.g., 10)

function loadTileImages(callback) {
  const keys = Object.keys(imageSources);
  let loadedCount = 0;

  if (keys.length === 0) {
    callback();
    return;
  }

  keys.forEach(key => {
    const img = new Image();
    img.src = imageSources[key]; // Use the path from imageSources

    img.onload = () => {
      images[key] = img; // Store in 'images' by key
      loadedCount++;
      if (loadedCount === keys.length) {
        // All images loaded! Now, map them by ID
        Object.entries(tileImageMap).forEach(([tileID, imageKey]) => {
          if (images[imageKey]) {
            tileImages[tileID] = images[imageKey];
          }
        });
        console.log("✅ All tile images loaded and mapped!");
        callback();
      }
    };
    img.onerror = () => {
      console.warn(`⚠️ Failed to load ${key} at ${imageSources[key]}`);
      loadedCount++;
      if (loadedCount === keys.length) {
        // Still map and callback even if some fail
        Object.entries(tileImageMap).forEach(([tileID, imageKey]) => {
          if (images[imageKey]) {
            tileImages[tileID] = images[imageKey];
          }
        });
        callback();
      }
    };
  });
}


/* -------------------------------------------------------------------------- */
/* Draw Tiles                                            */
/* -------------------------------------------------------------------------- */
function drawTile(tile, x, y, size) {
  // If image exists, draw it; else use color
  if (tileImages[tile]) {
    ctx.drawImage(tileImages[tile], x, y, size, size);
  } else {
    ctx.fillStyle = TILE_COLORS[tile] || "#FF00FF"; // Bright pink fallback
    ctx.fillRect(x, y, size, size);
  }

  // Grid lines
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x, y, size, size);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = tileMap[r][c];
      drawTile(tile, c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Painting Logic (Unchanged)                             */
/* -------------------------------------------------------------------------- */
function setTileFromMouseEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / TILE_SIZE);
  const row = Math.floor(y / TILE_SIZE);

  const half = Math.floor(brushSize / 2);

  for (let r = -half; r < brushSize - half; r++) {
    for (let c = -half; c < brushSize - half; c++) {
      const rr = row + r;
      const cc = col + c;

      if (rr >= 0 && cc >= 0 && rr < ROWS && cc < COLS) {
        tileMap[rr][cc] = selectedTile;
      }

      // Symmetry paint (horizontal)
      if (symmetryEnabled) {
        const mirrorC = COLS - 1 - cc;
        if (rr >= 0 && mirrorC >= 0 && rr < ROWS && mirrorC < COLS) {
          tileMap[rr][mirrorC] = selectedTile;
        }
      }
    }
  }

  draw();
}


canvas.addEventListener("mousedown", e => {
  isMouseDown = true;
  setTileFromMouseEvent(e);
});
canvas.addEventListener("mousemove", e => {
  if (isMouseDown) setTileFromMouseEvent(e);
});
canvas.addEventListener("mouseup", () => (isMouseDown = false));
canvas.addEventListener("mouseleave", () => (isMouseDown = false));

/* -------------------------------------------------------------------------- */
/* Toolbar UI (Unchanged)                                 */
/* -------------------------------------------------------------------------- */
const toolbar = document.getElementById("toolbar");
function createTileButtons() {
  Object.entries(TILE_TYPES).forEach(([name, id]) => {
    const btn = document.createElement("button");
    btn.style.background = TILE_COLORS[id];
    btn.dataset.tileName = name; // <-- ADD: Store the name here
    btn.classList.add("tile-button"); // <-- ADD: Add a class for selection
    btn.addEventListener("click", () => {
      selectedTile = id;
      updateSelectedButton();
    });
    toolbar.appendChild(btn);
  });
}

/* -------------------------------------------------------------------------- */
/* Extra Tool Buttons (Unchanged)                         */
/* -------------------------------------------------------------------------- */
function createToolButtons() {
  const toolDiv = document.createElement("div");
  toolDiv.id = "tools";
  toolDiv.style.marginTop = "10px";

  // Brush size buttons
  [1, 2, 4].forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = `${size}x${size}`;
    btn.addEventListener("click", () => {
      brushSize = size;
      updateToolButtons();
    });
    toolDiv.appendChild(btn);
  });

  // Symmetry toggle
  const symBtn = document.createElement("button");
  symBtn.textContent = "↔️ Symmetry";
  symBtn.addEventListener("click", () => {
    symmetryEnabled = !symmetryEnabled;
    updateToolButtons();
  });
  toolDiv.appendChild(symBtn);

  toolbar.appendChild(toolDiv);
}

function updateToolButtons() {
  const buttons = document.querySelectorAll("#tools button");
  buttons.forEach(btn => {
    if (btn.textContent.includes("x")) {
      const size = parseInt(btn.textContent);
      btn.classList.toggle("selected", size === brushSize);
    } else if (btn.textContent.includes("Symmetry")) {
      btn.classList.toggle("selected", symmetryEnabled);
    }
  });
}


function updateSelectedButton() {
  // Use the new class to select *only* the tile buttons
  document.querySelectorAll(".tile-button").forEach(btn => {
    // Get the name from the data attribute, not textContent
    const name = btn.dataset.tileName;
    const id = TILE_TYPES[name];

    if (id === undefined) return; // Safety check

    const buttonImg = tileImages[id];
    
    if (buttonImg) {
      btn.style.backgroundImage = `url(${buttonImg.src})`;
      btn.style.backgroundSize = "cover";
      btn.textContent = ""; // <-- SET text to empty to show image
    } else {
      btn.style.backgroundImage = "";
      btn.style.background = TILE_COLORS[id] || "#FF00FF"; // <-- Make sure color is set
      btn.textContent = name; // <-- SET text for non-image tiles
    }
    
    const btnSize = 40; // Smaller buttons to fit more
    btn.style.width = btnSize + "px";
    btn.style.height = btnSize + "px";
    btn.classList.toggle("selected", selectedTile === id);
  });
}
createTileButtons();
createToolButtons();


/* -------------------------------------------------------------------------- */
/* Keyboard Shortcuts (Unchanged)                         */
/* -------------------------------------------------------------------------- */
window.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  
  // This hotkey system is a bit basic, but we'll leave it
  const entries = Object.entries(TILE_TYPES);
  const index = (parseInt(key) || (key >= "a" ? key.charCodeAt(0) - 87 : -1)) - 1;
  if (entries[index]) {
    selectedTile = entries[index][1];
    updateSelectedButton();
  }
  
  // Brush size shortcuts (1, 2, 3)
  if (["1", "2", "3"].includes(key)) {
    brushSize = key === "1" ? 1 : key === "2" ? 2 : 4;
    updateToolButtons();
  }

  // Toggle symmetry (S)
  if (key === "s") {
    symmetryEnabled = !symmetryEnabled;
    updateToolButtons();
  }

});

/* -------------------------------------------------------------------------- */
/* Export / Clear Buttons (Unchanged)                     */
/* -------------------------------------------------------------------------- */
document.getElementById("btn-export").addEventListener("click", () => {
  const output = document.getElementById("output");
  let out = "[\n" + tileMap.map(r => "  [" + r.join(", ") + "]").join(",\n") + "\n]";
  output.value = out;
  
  // Also log to console for easy copy-pasting
  console.log(out);
  alert("Map exported to text area and console!");
});

document.getElementById("btn-clear").addEventListener("click", () => {
  tileMap = Array(ROWS).fill().map(() => Array(COLS).fill(TILE_TYPES.GROUND));
  draw();
});

/* -------------------------------------------------------------------------- */
/* Start (after images load)                             */
/* -------------------------------------------------------------------------- */
console.log("🔄 Loading tile images...");
loadTileImages(() => {
  console.log("🚀 Editor ready!");
  updateSelectedButton();
  draw();
});