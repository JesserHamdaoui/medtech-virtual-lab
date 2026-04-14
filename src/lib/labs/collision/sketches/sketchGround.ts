import p5 from "p5";

export const sketchGround = (p: p5, yReference: number) => {
  p.noStroke();
  p.fill(26, 108, 136);
  p.square(0, yReference, p.width);
  p.fill(0);
};
