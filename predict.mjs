export function predict(model, input) {
  const values = {};
  for (const field of model.schema) {
    const raw = input[field.name];
    if (raw === null || raw === undefined || raw === '') throw new Error(`Enter ${field.name}.`);
    const value = Number(raw);
    if (!Number.isFinite(value) || !Number.isInteger(value)) throw new Error(`${field.name} must be a whole number.`);
    if (field.type === 'category' && !field.choices.includes(value)) throw new Error(`Invalid category for ${field.name}.`);
    if (field.min !== null && field.min !== undefined && value < field.min) throw new Error(`${field.name} must be at least ${field.min}.`);
    if (field.max !== null && field.max !== undefined && value > field.max) throw new Error(`${field.name} must be at most ${field.max}.`);
    values[field.name] = value;
  }
  if ([0, 5, 6].includes(values.EDUCATION)) values.EDUCATION = 4;
  if (values.MARRIAGE === 0) values.MARRIAGE = 3;
  const features = model.numeric.map(name => Math.fround(values[name]));
  model.categorical.forEach((name, index) => {
    features.push(...model.categories[index].map(category => Number(values[name] === category)));
  });
  let sum = 0;
  for (const tree of model.trees) {
    let node = 0;
    while (tree.left[node] !== -1) {
      node = features[tree.feature[node]] <= tree.threshold[node] ? tree.left[node] : tree.right[node];
    }
    sum += tree.probability[node];
  }
  const score = sum / model.trees.length;
  return {score, flag: score >= model.threshold};
}
