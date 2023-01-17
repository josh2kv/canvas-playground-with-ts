export const radianToRoundedDegree = (radian: number): number => {
  return Math.round((radian / Math.PI) * 180);
};

export const degreeToRadian = (degree: number): number => {
  return (degree / 180) * Math.PI;
};
