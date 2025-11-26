/**
 * E-Waste Map Generator (v3)
 *
 * This version uses the correct "Grass-on-Mud" autotile logic.
 * - Base ground is Mud (55).
 * - Grass (14) is "drawn" on top in patterns.
 * - An autotile pass then replaces Mud tiles bordering Grass
 * with the correct transition tiles (10, 11, 13, 15, etc.)
 */
class MapGenerator {

    constructor(rows, cols, TILE_TYPES, OBJECT_TYPES) {
        this.rows = rows;
        this.cols = cols;
        this.TILE_TYPES = TILE_TYPES;
        this.OBJECT_TYPES = OBJECT_TYPES;

        // --- 1. LOGIC FLIP: Base tile is Mud, not Grass ---
        this.BASE_TILE = this.TILE_TYPES.MudTile1; // The '55' tile
        this.GRASS_TILE = this.TILE_TYPES.GroundTile5; // The '14' tile
        this.GRASS_MARKER = 4; // A new marker for our grass patterns

        this.WALKABLE_TILES = [
            this.TILE_TYPES.GROUND, this.TILE_TYPES.GroundTile1, this.TILE_TYPES.GroundTile2,
            this.TILE_TYPES.GroundTile3, this.TILE_TYPES.GroundTile4, this.TILE_TYPES.GroundTile5,
            this.TILE_TYPES.GroundTile6, this.TILE_TYPES.GroundTile7, this.TILE_TYPES.GroundTile8,
            this.TILE_TYPES.GroundTile9, this.TILE_TYPES.GroundTile10, this.TILE_TYPES.GroundTile11,
            this.TILE_TYPES.GroundTile12, this.TILE_TYPES.GroundTile13, this.TILE_TYPES.GroundTile14,
            this.TILE_TYPES.MudTile1,
        ];
        this.SCATTER_ITEMS = [
            this.OBJECT_TYPES.torradeira, this.OBJECT_TYPES.notebook, this.OBJECT_TYPES.liquidificador,
            this.OBJECT_TYPES.chip, this.OBJECT_TYPES.pc, this.OBJECT_TYPES.celular,
        ];

        // --- Feature Tile Sets (9-Slice) ---
        this.RIVER_SET = [
            this.TILE_TYPES.RiverTile1, this.TILE_TYPES.RiverTile2, this.TILE_TYPES.RiverTile3,
            this.TILE_TYPES.RiverTile4, this.TILE_TYPES.RiverTile5, this.TILE_TYPES.RiverTile6,
            this.TILE_TYPES.RiverTile7, this.TILE_TYPES.RiverTile8, this.TILE_TYPES.RiverTile9,
        ];
        this.MOUNTAIN_SET = [
            this.TILE_TYPES.MountainTile1, this.TILE_TYPES.MountainTile2, this.TILE_TYPES.MountainTile3,
            this.TILE_TYPES.MountainTile4, this.TILE_TYPES.MountainTile5, this.TILE_TYPES.MountainTile6,
            this.TILE_TYPES.MountainTile7, this.TILE_TYPES.MountainTile8, this.TILE_TYPES.MountainTile9,
        ];

        // --- 2. NEW: Ground Transition Set ---
        // This maps what a MUD (55) tile becomes when it has GRASS (14) neighbors.
        // N=1, S=2, E=4, W=8 (checks for Grass)
// --- 2. NEW: Ground Transition Set ---
// This maps what a MUD (55) tile becomes when it has GRASS (14) neighbors.
// N=1, S=2, E=4, W=8 (checks for Grass)
this.GROUND_TRANSITION_SET = {
    // --- Single Neighbors (Straight Edges) ---
    0: this.TILE_TYPES.MudTile1,    // 0000 (No Grass) -> 55 (Mud)
    1: this.TILE_TYPES.GroundTile8,  // 0001 (Grass N) -> 13 (Bottom Edge)
    2: this.TILE_TYPES.GroundTile2,  // 0010 (Grass S) -> 11 (Top Edge)
    4: this.TILE_TYPES.GroundTile4,  // 0100 (Grass E) -> 15 (Left Edge)
    8: this.TILE_TYPES.GroundTile6,  // 1000 (Grass W) -> 10 (Right Edge) - (Assuming 10 is right edge)

    // --- Concave / "Inner" Corners (The "Bites") ---
    // These were the broken ones.
    5: this.TILE_TYPES.GroundTile11,  // 0101 (Grass N+E) -> 12 (Inner Top-Right)
    6: this.TILE_TYPES.GroundTile14,  // 0110 (Grass S+E) -> 13 (Inner Bottom-Right) - (Substituted 13, no tile)
    9: this.TILE_TYPES.GroundTile12,  // 1001 (Grass N+W) -> 16 (Inner Top-Left)
    10: this.TILE_TYPES.GroundTile13, // 1010 (Grass S+W) -> 10 (Inner Bottom-Left)

    // --- Convex / "Outer" Corners ---
    3: this.TILE_TYPES.GroundTile12, // 0011 (Grass N+S) -> 45 (Outer Top-Left) - (Substituted 45, no tile)
    12: this.TILE_TYPES.GroundTile13,// 1100 (Grass E+W) -> 51 (Outer Bottom-Left) - (Substituted 51, no tile)

    // --- T-Junctions & Isolated ---
    7: this.TILE_TYPES.GroundTile5,  // 0111 (N+S+E) -> 17 (T-Left, open West)
    11: this.TILE_TYPES.GroundTile5, // 1011 (N+S+W) -> 18 (T-Right, open East)
    13: this.TILE_TYPES.GroundTile5, // 1101 (N+E+W) -> 16 (T-Bottom, open South)
    14: this.TILE_TYPES.GroundTile5, // 1110 (S+E+W) -> 12 (T-Top, open North) - (Substituted 12)
    15: this.TILE_TYPES.MudTile1,   // 1111 (N+S+E+W) -> 55 (Isolated Mud tile)
};
        // Note: Your tileset is missing internal corners (e.g., Bottom-Right).
        // I've used substitutes, but this set may need tweaking.
    }

    /**
     * Generates the main level map and object map.
     * @returns {{tileMap: Array<Array<number>>, objectMap: Array<Array<number>>}}
     */
    generateLevel() {
        // 1. Start with a map full of MUD (55)
        let tileMap = this._createEmptyMap(this.BASE_TILE);
        
        // 2. Create a "plan" map for complex features
        // 0 = Empty, 1 = River, 2 = Mountain, 4 = Grass
        let markerMap = this._createEmptyMap(0);
        
        // Add 3 river "zones"
        this._addBlobs(markerMap, 1, 3, 4, 3);
        // Add 4 mountain "zones"
        this._addBlobs(markerMap, 2, 4, 3, 6);
        
        // 3. Add GRASS patterns to the marker map
        // This will "draw" 5 grass lines, only on empty land (marker 0)
        this._addRandomWalkFeatures(markerMap, this.GRASS_MARKER, 5, 20, 40, 0);
        // Add some "blobs" of grass
        this._addBlobs(markerMap, this.GRASS_MARKER, 10, 3, 8);

        // 4. "Stamp" the grass (14) onto the mud (55) map
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (markerMap[r][c] === this.GRASS_MARKER) {
                    tileMap[r][c] = this.GRASS_TILE;
                }
            }
        }

        // 5. Run the autotile passes
        tileMap = this._autotilePass(tileMap, markerMap, 1, this.RIVER_SET);
        tileMap = this._autotilePass(tileMap, markerMap, 2, this.MOUNTAIN_SET);
        
        // 6. NEW: Run the ground autotiler
        // This pass converts mud(55) tiles next to grass(14) into borders
        tileMap = this._autotileGround(tileMap, this.GROUND_TRANSITION_SET);
        
        // 7. Create and place objects
        let objectMap = this._createEmptyMap(this.OBJECT_TYPES.NONE);
        this._placeObjects(tileMap, objectMap, 50);

        return { tileMap, objectMap };
    }

    /**
     * The main autotile logic. Creates a new map by replacing markers
     * with the correct 9-slice tiles.
     */
    _autotilePass(baseMap, markerMap, markerId, tileSet) {
        let finalMap = baseMap.map(arr => arr.slice()); // Deep copy

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (markerMap[r][c] === markerId) {
                    finalMap[r][c] = this._get9SliceTile(markerMap, r, c, markerId, tileSet);
                }
            }
        }
        return finalMap;
    }

    /**
     * Checks a tile's neighbors to determine which 9-slice tile to use.
     */
    _get9SliceTile(markerMap, r, c, markerId, tileSet) {
        const isSame = (r, c) => {
            if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return false;
            return markerMap[r][c] === markerId;
        };

        const n = isSame(r - 1, c);
        const s = isSame(r + 1, c);
        const w = isSame(r, c - 1);
        const e = isSame(r, c + 1);

        let colIndex = 1, rowIndex = 1;
        if (n && !s) rowIndex = 2;
        else if (!n && s) rowIndex = 0;
        if (w && !e) colIndex = 2;
        else if (!w && e) colIndex = 0;

        const index = (rowIndex * 3) + colIndex;
        if (index < 0 || index >= tileSet.length) return tileSet[4];
        return tileSet[index];
    }

    // --- 4. NEW Ground Autotiler Functions ---

    /**
     * Runs the 16-slice autotiler for ground transitions.
     */
    _autotileGround(baseMap, tileSet) {
        let finalMap = baseMap.map(arr => arr.slice());

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                // ONLY check tiles that are MUD
                if (baseMap[r][c] === this.BASE_TILE) { // BASE_TILE = Mud (55)
                    finalMap[r][c] = this._getGroundTile(baseMap, r, c, tileSet);
                }
            }
        }
        return finalMap;
    }

    /**
     * Checks a Mud tile's 4 cardinal neighbors for Grass.
     */
    _getGroundTile(baseMap, r, c, tileSet) {
        // Helper to check if a neighbor is GRASS
        const isGrass = (r_n, c_n) => {
            if (r_n < 0 || r_n >= this.rows || c_n < 0 || c_n >= this.cols) return false;
            return baseMap[r_n][c_n] === this.GRASS_TILE; // GRASS_TILE = 14
        };

        const n = isGrass(r - 1, c);
        const s = isGrass(r + 1, c);
        const e = isGrass(r, c + 1);
        const w = isGrass(r, c - 1);

        // Create a 4-bit index
        const index = (n * 1) + (s * 2) + (e * 4) + (w * 8);

        return tileSet[index];
    }


    /**
     * Adds random "blobs" of a single tile.
     */
    _addBlobs(map, tileId, count, minSize, maxSize, onlyOnBase = false) {
        for (let i = 0; i < count; i++) {
            let cR = Math.floor(Math.random() * this.rows);
            let cC = Math.floor(Math.random() * this.cols);
            let size = minSize + Math.floor(Math.random() * (maxSize - minSize));
            
            for (let r = -size; r <= size; r++) {
                for (let c = -size; c <= size; c++) {
                    if (Math.hypot(r, c) > size) continue;
                    
                    let newR = cR + r;
                    let newC = cC + c;
                    
                    if (newR >= 0 && newR < this.rows && newC >= 0 && newC < this.cols) {
                        if (onlyOnBase) {
                            // Only place on base marker (0)
                            if (map[newR][newC] === 0) {
                                map[newR][newC] = tileId;
                            }
                        } else {
                            map[newR][newC] = tileId;
                        }
                    }
                }
            }
        }
    }

    /**
     * Adds features using a "random walk" algorithm onto the marker map.
     */
    _addRandomWalkFeatures(markerMap, markerId, count, minLength, maxLength, walkableMarker = 0) {
        const directions = [{r: -1, c: 0}, {r: 1, c: 0}, {r: 0, c: -1}, {r: 0, c: 1}];
        
        for (let i = 0; i < count; i++) {
            let r, c;
            let attempts = 0;
            do {
                r = Math.floor(Math.random() * this.rows);
                c = Math.floor(Math.random() * this.cols);
                attempts++;
            } while (markerMap[r][c] !== walkableMarker && attempts < 100);

            if (attempts >= 100) continue;

            let dir = this._getRandom(directions);
            let length = minLength + Math.floor(Math.random() * (maxLength - minLength));
            
            for (let j = 0; j < length; j++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && markerMap[r][c] === walkableMarker) {
                    markerMap[r][c] = markerId;
                }
                
                r += dir.r;
                c += dir.c;
                
                if (Math.random() < 0.1) dir = this._getRandom(directions);
                if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) break;
            }
        }
    }

    /**
     * Scatters items randomly onto the object map.
     */
    _placeObjects(tileMap, objectMap, count) {
        let placed = 0;
        let attempts = 0;
        
        while (placed < count && attempts < 1000) {
            let r = Math.floor(Math.random() * this.rows);
            let c = Math.floor(Math.random() * this.cols);
            
            if (this.WALKABLE_TILES.includes(tileMap[r][c]) && objectMap[r][c] === this.OBJECT_TYPES.NONE) {
                objectMap[r][c] = this._getRandom(this.SCATTER_ITEMS);
                placed++;
            }
            attempts++;
        }
        
        if (placed < count) {
            console.warn(`MapGenerator: Only placed ${placed}/${count} items.`);
        }
    }

    // --- Helper Functions ---
    
    _getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    _createEmptyMap(fillValue) {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(fillValue));
    }
}