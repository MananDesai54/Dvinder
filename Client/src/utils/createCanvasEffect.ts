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
};
