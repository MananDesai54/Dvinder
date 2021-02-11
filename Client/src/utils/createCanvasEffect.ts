export const colorArray = [
  "#909bd9",
  "#3b5a9b",
  "#006599",
  "#2b97f1",
  "#e84713",
  "#001b47",
  "#007bff",
  "#ffffff",
  "#4d5664d8",
];

export const createCanvasEffect = (canvas: HTMLCanvasElement): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.background = "#151e29";
  const context = canvas.getContext("2d");

  let mouse: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  class Circle {
    defaultRadius: number;
    maxRadius: number;
    context: CanvasRenderingContext2D = context as CanvasRenderingContext2D;
    constructor(
      public x: number,
      public y: number,
      public dx: number,
      public dy: number,
      public radius: number,
      public color: string
    ) {
      this.defaultRadius = radius;
      this.maxRadius = 2;
    }

    draw() {
      this.context.fillStyle = this.color;
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.context.fill();
    }
    update() {
      if (
        this.x + this.radius > window.innerWidth ||
        this.x - this.radius < 0
      ) {
        this.dx = -this.dx;
      }
      if (
        this.y + this.radius > window.innerHeight ||
        this.y - this.radius < 0
      ) {
        this.dy = -this.dy;
      }

      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }

  let circle;
  let circleArray: Circle[] = [];

  function init() {
    circleArray = [];
    for (let i = 0; i < 200; i++) {
      let radius = Math.random() + 0.5;
      let x = Math.random() * (window.innerWidth - radius * 2) + radius;
      let dx = Math.random() - 0.5;
      let y = Math.random() * (window.innerHeight - radius * 2) + radius;
      let dy = Math.random() - 0.5;
      let color = colorArray[Math.floor(Math.random() * colorArray.length)];
      circle = new Circle(x, y, dx, dy, radius, color);
      circleArray.push(circle);
    }
  }
  init();

  function anime() {
    context!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    circleArray.forEach((circle) => {
      circle.update();
    });

    requestAnimationFrame(anime);
  }
  anime();
};
