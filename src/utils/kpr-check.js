// Self-check runnable test for KPR calculation logic
const assert = require('assert');

function calculateMonthlyInstallment(propertyPrice, dpPercent, interestRate, tenorYears) {
  const dpAmount = (propertyPrice * dpPercent) / 100;
  const principal = propertyPrice - dpAmount;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenorYears * 12;
  return Math.round(
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
}

// Test case: 350 Juta, DP 0%, 3.4% bunga, 20 tahun
const monthly = calculateMonthlyInstallment(350000000, 0, 3.4, 20);
assert(monthly > 1900000 && monthly < 2200000, `Expected ~2jt/bln, got ${monthly}`);

// Test case: Subsidi 1.4 Jt
const afterSubsidi = monthly - 1400000;
assert(afterSubsidi > 500000 && afterSubsidi < 800000, `Expected ~600k/bln, got ${afterSubsidi}`);

console.log('KPR Calculator self-check: PASS (Monthly:', monthly, 'After Subsidi:', afterSubsidi, ')');
