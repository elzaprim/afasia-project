// nutritionUtils.js

export function calculateBMR(heightCm, weightKg, age, gender) {
  const heightM = heightCm / 100;
  if (gender === "male") {
    return 662 - 9.53 * age + 15.91 * weightKg + 539.6 * heightM;
  } else {
    return 354 - 6.91 * age + 9.36 * weightKg + 726 * heightM;
  }
}

export function calculateTDEE(bmr, activityLevel) {
  const activityFactors = {
    sedentary: 1,
    moderate: 1.11,
    active: 1.25,
    very_active: 1.48,
  };
  return bmr * (activityFactors[activityLevel] || 1);
}

export function getMacronutrientRanges(season, weightKg) {
  const ranges = {
    'pre-season': {
      carbs: [3 * weightKg, 7 * weightKg],
      protein: [1.2 * weightKg, 2.5 * weightKg],
      fat: [0.9 * weightKg, 1.3 * weightKg],
    },
    'on-season': {
      carbs: [5 * weightKg, 12 * weightKg],
      protein: [1.4 * weightKg, 2 * weightKg],
      fat: [1 * weightKg, 1.5 * weightKg],
    },
    'off-season': {
      carbs: [3 * weightKg, 4 * weightKg],
      protein: [1.5 * weightKg, 2.3 * weightKg],
      fat: [1 * weightKg, 1.2 * weightKg],
    },
  };
  return ranges[season] || ranges['pre-season'];
}

function isWithinMacroRange(c, p, f, macros, total) {
  if (total === 0) return false;
  const cp = (c * 4 / total) * 100;
  const pp = (p * 4 / total) * 100;
  const fp = (f * 9 / total) * 100;

  const [minC, maxC] = macros.carbs.map(g => (g * 4 / total) * 100);
  const [minP, maxP] = macros.protein.map(g => (g * 4 / total) * 100);
  const [minF, maxF] = macros.fat.map(g => (g * 9 / total) * 100);

  return cp >= minC && cp <= maxC && pp >= minP && pp <= maxP && fp >= minF && fp <= maxF;
}

export function optimizeMeal(foodList, bound, macros, totalCalories) {
  const n = foodList.length;
  const stack = [{ level: -1, c: 0, p: 0, f: 0, cal: 0, items: [] }];
  const results = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (isWithinMacroRange(node.c, node.p, node.f, macros, totalCalories)) {
      results.push(node.items);
    }
    if (node.level < n - 1) {
      const next = node.level + 1;
      const f = foodList[next];
      const newCal = node.cal + f.calories;
      if (newCal <= bound * 1.2) {
        stack.push({
          level: next,
          cal: newCal,
          c: node.c + f.carbs,
          p: node.p + f.protein,
          f: node.f + f.fat,
          items: [...node.items, next]
        });
      }
    }
  }
  if (results.length > 0) return results[Math.floor(Math.random() * results.length)];
  if (foodList.length > 0) return [Math.floor(Math.random() * foodList.length)];
  return [];
}

export function selectSnacks(snackList, targetCalories) {
  const selected = [];
  let remain = targetCalories;
  let maxTry = 4;
  while (remain > 0 && maxTry > 0) {
    const eligible = snackList.filter(s => s.calories <= remain * 1.2);
    if (eligible.length === 0) break;
    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
    selected.push(chosen);
    remain -= chosen.calories;
    maxTry -= 1;
  }
  return selected;
}

export function generateDailyMealPlan(foodList, sayurList, snackList, totalCalories, macros) {
  const rice = foodList.find(f => f.nama_makanan === "Nasi putih");
  const noRice = foodList.filter(f => f.nama_makanan !== "Nasi putih");
  if (!rice) return "Nasi putih tidak ditemukan.";
  const portion = 1;

  const sarapanTarget = totalCalories * 0.25;
  const siangTarget = totalCalories * 0.35;
  const malamTarget = totalCalories * 0.25;
  const snackTarget = totalCalories * 0.15;
  const tolerance = 0.2;

  const meals = [];
  let totalConsumed = 0;

  for (let [label, target] of [["Sarapan", sarapanTarget], ["Makan Siang", siangTarget], ["Makan Malam", malamTarget]]) {
    const baseCal = rice.calories * portion;
    const baseCarb = rice.carbs * portion;
    const baseProt = rice.protein * portion;
    const baseFat = rice.fat * portion;
    const best = optimizeMeal(noRice, (target - baseCal) * 1.2, macros, totalCalories);
    const dishes = best.map(i => noRice[i]);
    dishes.push(sayurList[Math.floor(Math.random() * sayurList.length)]);

    const tCal = baseCal + dishes.reduce((s, x) => s + x.calories, 0);
    const tC = baseCarb + dishes.reduce((s, x) => s + x.carbs, 0);
    const tP = baseProt + dishes.reduce((s, x) => s + x.protein, 0);
    const tF = baseFat + dishes.reduce((s, x) => s + x.fat, 0);

    meals.push({
      name: label,
      items: [rice, ...dishes],
      calories: tCal,
      carbs: tC,
      protein: tP,
      fat: tF
    });
    totalConsumed += tCal;
  }

  const snackRemain = totalCalories - totalConsumed;
  const minSnack = snackTarget * (1 - tolerance);
  const maxSnack = snackTarget * (1 + tolerance);

  if (snackRemain < minSnack) {
    const maxMeal = meals.reduce((a, b) => a.calories > b.calories ? a : b);
    maxMeal.calories -= (minSnack - snackRemain);
    totalConsumed -= (minSnack - snackRemain);
  }

  const snacks = selectSnacks(snackList, Math.min(snackRemain, maxSnack));
  const snackCal = snacks.reduce((s, x) => s + x.calories, 0);
  totalConsumed += snackCal;

  let totalC = meals.reduce((s, m) => s + m.carbs, 0) + snacks.reduce((s, x) => s + x.carbs, 0);
  let totalP = meals.reduce((s, m) => s + m.protein, 0) + snacks.reduce((s, x) => s + x.protein, 0);
  let totalF = meals.reduce((s, m) => s + m.fat, 0) + snacks.reduce((s, x) => s + x.fat, 0);

  let result = `\n=============================================\n`;
  result += `Rencana Makan Harian (Target: ${totalCalories.toFixed(2)} kal | Aktual: ${totalConsumed.toFixed(2)} kal)\n`;
  result += `- Sarapan (25%): ${sarapanTarget.toFixed(2)} kal\n- Makan Siang (35%): ${siangTarget.toFixed(2)} kal\n- Makan Malam (25%): ${malamTarget.toFixed(2)} kal\n- Snack (15%): ${snackTarget.toFixed(2)} kal\n=============================================\n`;
  result += `\nTarget Makronutrien Harian:\n- Karbohidrat: ${macros.carbs[0].toFixed(1)}-${macros.carbs[1].toFixed(1)}g\n- Protein: ${macros.protein[0].toFixed(1)}-${macros.protein[1].toFixed(1)}g\n- Lemak: ${macros.fat[0].toFixed(1)}-${macros.fat[1].toFixed(1)}g\n`;
  result += `\nAktual Makronutrien:\n- Karbo: ${totalC.toFixed(1)}g (${((totalC*4)/totalConsumed*100).toFixed(1)}%)\n- Protein: ${totalP.toFixed(1)}g (${((totalP*4)/totalConsumed*100).toFixed(1)}%)\n- Lemak: ${totalF.toFixed(1)}g (${((totalF*9)/totalConsumed*100).toFixed(1)}%)\n`;

  meals.forEach(meal => {
    result += `\n${meal.name} (Aktual: ${meal.calories.toFixed(2)} kal):\n`;
    meal.items.forEach(i => {
      result += `- ${i.nama_makanan}, Kalori: ${i.calories}, Karbo: ${i.carbs}g, Protein: ${i.protein}g, Lemak: ${i.fat}g\n`;
    });
    result += `  Total: ${meal.calories.toFixed(2)} kal | Karbo: ${meal.carbs}g | Protein: ${meal.protein}g | Lemak: ${meal.fat}g\n`;
  });

  result += `\nSnack (Aktual: ${snackCal.toFixed(2)} kal):\n`;
  snacks.forEach(s => {
    result += `- ${s.nama_makanan}, Kalori: ${s.calories}, Karbo: ${s.carbs}g, Protein: ${s.protein}g, Lemak: ${s.fat}g\n`;
  });

  result += `\nTotal Kalori: ${totalConsumed.toFixed(2)} (Target: ${totalCalories.toFixed(2)}) | Selisih: ${(totalConsumed - totalCalories).toFixed(2)} kal (${(((totalConsumed - totalCalories)/totalCalories)*100).toFixed(2)}%)`;
  return result;
}
