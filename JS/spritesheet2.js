// Spritesheet.js
class Spritesheet {
  constructor(context, image, rows, cols) {
    this.context = context;
    this.image = image;
    this.rows = rows;
    this.cols = cols;

    this.frameWidth = this.image.width / this.cols;
    this.frameHeight = this.image.height / this.rows;

    this.interval = 100; // Time in ms between frames
    this.lastTime = 0;
    
    this.row = 0; // Current row (direction)
    this.col = 0; // Current column (frame)
  }

  // Advances to the next frame in the animation
  nextFrame() {
    const now = new Date().getTime();

    if (!this.lastTime) this.lastTime = now;
    if (now - this.lastTime < this.interval) return;

    if (this.col < this.cols - 1) {
      this.col++;
    } else {
      this.col = 0; // Loop back to the first frame
    }
    
    this.lastTime = now;
  }

  // Draws the current frame to the canvas
  draw(x, y, width, height) {
    this.context.drawImage(
      this.image,
      this.frameWidth * this.col,   // Source X (from spritesheet)
      this.frameHeight * this.row,  // Source Y (from spritesheet)
      this.frameWidth,              // Source Width
      this.frameHeight,             // Source Height
      x,                            // Destination X (on canvas)
      y,                            // Destination Y (on canvas)
      width,                        // Destination Width
      height                        // Destination Height
    );
  }
}