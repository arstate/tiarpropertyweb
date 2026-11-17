/**
 * KPR calculation utilities and currency formatters.
 * Single Responsibility: Mathematical calculation and string formatting.
 */

export interface KprCalculationParams {
  propertyPrice: number;
  dpPercent: number;
  tenorYears: number;
  interestRateAnnual: number;
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateMonthlyInstallment(
  params: KprCalculationParams
): number {
  const { propertyPrice, dpPercent, tenorYears, interestRateAnnual } = params;
  const dpAmount = (propertyPrice * dpPercent) / 100;
  const principal = propertyPrice - dpAmount;

  if (principal <= 0) return 0;

  const monthlyRate = interestRateAnnual / 100 / 12;
  const totalMonths = tenorYears * 12;

  const installment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return Math.round(installment);
}

export function calculatePromoInstallment(
  regularInstallment: number,
  subsidiPerMonth: number = 1400000
): number {
  return Math.max(0, regularInstallment - subsidiPerMonth);
}
