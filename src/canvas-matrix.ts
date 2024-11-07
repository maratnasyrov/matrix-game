const CHARACTERS =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';

export class CanvasMatrixManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private animationId: number | null = null;
  private isPaused: boolean = false;
  private drops: number[] = [];
  private readonly fontSize: number = 20;
  private readonly offsetX: number = 0;

  constructor(containerId: string) {
    const canvasContainer = this.getCanvasContainer(containerId);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.id = 'matrix-canvas';
    canvasContainer.append(this.canvas);

    if (!this.context) {
      throw new Error('Failed to get 2D context');
    }
    this.resizeCanvas();
    this.initializeDrops();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  private getCanvasContainer = (containerId: string): HTMLDivElement => {
    const canvasContainer = document.querySelector<HTMLDivElement>(containerId);
    if (!canvasContainer) {
      throw new Error(`Canvas container ${containerId} not found`);
    }
    return canvasContainer;
  };

  private initializeDrops() {
    this.drops = new Array(Math.floor(this.canvas.width / this.fontSize)).fill(
      0
    );
  }

  public resizeCanvas = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initializeDrops();
  };

  public matrixEffect() {
    if (this.animationId) {
      return;
    }

    const animate = () => {
      if (!this.context) return;

      if (!this.isPaused) {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.font = `${this.fontSize}px monospace`;

        for (let i = this.drops.length; i > 0; i--) {
          const text = CHARACTERS.charAt(
            Math.floor(Math.random() * CHARACTERS.length)
          );

          if (this.drops[i] === 0) {
            this.context.fillStyle = '#FFFFFF';
          } else {
            this.context.fillStyle = '#00FF00';
          }

          this.context.fillText(
            text,
            i * this.fontSize + this.offsetX,
            this.drops[i] * this.fontSize
          );

          if (
            this.drops[i] * this.fontSize > this.canvas.height &&
            Math.random() > 0.975
          ) {
            this.drops[i] = 0;
          }
          this.drops[i]++;
        }
      }

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  public pauseAnimation(timeout?: number, callback?: () => void) {
    if (timeout) {
      setTimeout(() => {
        this.isPaused = true;
        if (callback) {
          callback();
        }
      }, timeout);
    } else {
      this.isPaused = true;
      if (callback) {
        callback();
      }
    }
  }

  public resumeAnimation() {
    if (this.isPaused) {
      this.isPaused = false;
      if (!this.animationId) {
        this.matrixEffect();
      }
    }
  }

  public stopAnimation(timeout?: number, callback?: () => void) {
    const stop = () => {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      if (callback) {
        callback();
      }
    };

    if (timeout) {
      setTimeout(stop, timeout);
    } else {
      stop();
    }
  }
}
