import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Scale,
} from "lucide-react";
import {
  IslamicStarLatticeBg,
  KhatamRosette,
  MashrabiyaBandBorder,
} from "./IslamicOrnaments";

type CalculatorTab = "zakat" | "profit_sharing";
type CurrencyCode = "USD" | "SAR" | "EUR" | "GBP" | "IDR";
type NisabStandard = "gold" | "silver";
type EquityMethod = "market_value" | "zakatable_assets";
type CalendarBasis = "lunar" | "solar";
type ContractType = "mudarabah" | "musharakah";

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  locale: string;
  defaultCash: number;
  defaultEquities: number;
  defaultGoldValue: number;
  defaultLiabilities: number;
  defaultDividends: number;
  goldGramPrice: number;
  silverGramPrice: number;
  defaultCapital: number;
  capitalStep: number;
  maxCapital: number;
}

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
    defaultCash: 25000,
    defaultEquities: 80000,
    defaultGoldValue: 6500,
    defaultLiabilities: 4000,
    defaultDividends: 3200,
    goldGramPrice: 86,
    silverGramPrice: 1.05,
    defaultCapital: 50000,
    capitalStep: 2500,
    maxCapital: 500000,
  },
  SAR: {
    code: "SAR",
    symbol: "SAR ",
    locale: "en-US",
    defaultCash: 95000,
    defaultEquities: 300000,
    defaultGoldValue: 24000,
    defaultLiabilities: 15000,
    defaultDividends: 12000,
    goldGramPrice: 322,
    silverGramPrice: 3.95,
    defaultCapital: 185000,
    capitalStep: 5000,
    maxCapital: 2000000,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    locale: "en-US",
    defaultCash: 22000,
    defaultEquities: 75000,
    defaultGoldValue: 6000,
    defaultLiabilities: 3500,
    defaultDividends: 2900,
    goldGramPrice: 80,
    silverGramPrice: 0.98,
    defaultCapital: 45000,
    capitalStep: 2500,
    maxCapital: 500000,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    locale: "en-US",
    defaultCash: 20000,
    defaultEquities: 65000,
    defaultGoldValue: 5500,
    defaultLiabilities: 3000,
    defaultDividends: 2600,
    goldGramPrice: 68,
    silverGramPrice: 0.84,
    defaultCapital: 40000,
    capitalStep: 2000,
    maxCapital: 400000,
  },
  IDR: {
    code: "IDR",
    symbol: "Rp ",
    locale: "id-ID",
    defaultCash: 250000000,
    defaultEquities: 750000000,
    defaultGoldValue: 75000000,
    defaultLiabilities: 40000000,
    defaultDividends: 30000000,
    goldGramPrice: 1380000,
    silverGramPrice: 17000,
    defaultCapital: 500000000,
    capitalStep: 25000000,
    maxCapital: 5000000000,
  },
};

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;

function formatAmount(value: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency];
  const rounded = currency === "IDR" ? Math.round(value) : Math.round(value * 100) / 100;
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.code,
    maximumFractionDigits: currency === "IDR" ? 0 : 0,
  }).format(rounded);
}

interface ProjectionYearRow {
  year: number;
  openingCapital: number;
  grossProfitOrLoss: number;
  investorShare: number;
  partnerShare: number;
  zakatDeducted: number;
  closingInvestorCapital: number;
}

export function ZakatAndProfitCalculator() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("zakat");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [copied, setCopied] = useState(false);

  // Zakat & Purification state
  const [cashSavings, setCashSavings] = useState<number>(CURRENCIES.USD.defaultCash);
  const [shariahEquities, setShariahEquities] = useState<number>(CURRENCIES.USD.defaultEquities);
  const [goldSilverValue, setGoldSilverValue] = useState<number>(CURRENCIES.USD.defaultGoldValue);
  const [shortTermLiabilities, setShortTermLiabilities] = useState<number>(
    CURRENCIES.USD.defaultLiabilities
  );
  const [nisabStandard, setNisabStandard] = useState<NisabStandard>("gold");
  const [equityMethod, setEquityMethod] = useState<EquityMethod>("market_value");
  const [calendarBasis, setCalendarBasis] = useState<CalendarBasis>("lunar");
  const [dividendsReceived, setDividendsReceived] = useState<number>(
    CURRENCIES.USD.defaultDividends
  );
  const [purificationRatioPct, setPurificationRatioPct] = useState<number>(1.8);

  // Mudarabah / Musharakah Profit-Sharing state
  const [contractType, setContractType] = useState<ContractType>("mudarabah");
  const [investorCapital, setInvestorCapital] = useState<number>(CURRENCIES.USD.defaultCapital);
  const [partnerCapital, setPartnerCapital] = useState<number>(20000);
  const [investorProfitRatio, setInvestorProfitRatio] = useState<number>(70);
  const [expectedAnnualReturnPct, setExpectedAnnualReturnPct] = useState<number>(10);
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [applyAnnualZakat, setApplyAnnualZakat] = useState<boolean>(true);

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    const cfg = CURRENCIES[nextCurrency];
    setCurrency(nextCurrency);
    setCashSavings(cfg.defaultCash);
    setShariahEquities(cfg.defaultEquities);
    setGoldSilverValue(cfg.defaultGoldValue);
    setShortTermLiabilities(cfg.defaultLiabilities);
    setDividendsReceived(cfg.defaultDividends);
    setInvestorCapital(cfg.defaultCapital);
    setPartnerCapital(Math.round(cfg.defaultCapital * 0.4));
  };

  const handleReset = () => {
    handleCurrencyChange(currency);
    setNisabStandard("gold");
    setEquityMethod("market_value");
    setCalendarBasis("lunar");
    setPurificationRatioPct(1.8);
    setContractType("mudarabah");
    setInvestorProfitRatio(70);
    setExpectedAnnualReturnPct(10);
    setHorizonYears(5);
    setApplyAnnualZakat(true);
  };

  // Zakat Calculations
  const zakatStats = useMemo(() => {
    const cfg = CURRENCIES[currency];
    const effectiveEquityBase =
      equityMethod === "market_value" ? shariahEquities : shariahEquities * 0.25;
    const grossZakatableAssets =
      Math.max(0, cashSavings) +
      Math.max(0, effectiveEquityBase) +
      Math.max(0, goldSilverValue);
    const netZakatableWealth = Math.max(
      0,
      grossZakatableAssets - Math.max(0, shortTermLiabilities)
    );

    const nisabThreshold =
      nisabStandard === "gold"
        ? GOLD_NISAB_GRAMS * cfg.goldGramPrice
        : SILVER_NISAB_GRAMS * cfg.silverGramPrice;

    const meetsNisab = netZakatableWealth >= nisabThreshold && netZakatableWealth > 0;
    const zakatRate = calendarBasis === "lunar" ? 0.025 : 0.02577;
    const zakatDue = meetsNisab ? netZakatableWealth * zakatRate : 0;

    const cleanRatio = Math.min(5, Math.max(0, purificationRatioPct)) / 100;
    const tathirPurification = Math.max(0, dividendsReceived) * cleanRatio;
    const totalEthicalOutflow = zakatDue + tathirPurification;
    const retainedAfterObligations = Math.max(0, netZakatableWealth - zakatDue);

    return {
      effectiveEquityBase,
      grossZakatableAssets,
      netZakatableWealth,
      nisabThreshold,
      meetsNisab,
      zakatRate,
      zakatDue,
      tathirPurification,
      totalEthicalOutflow,
      retainedAfterObligations,
    };
  }, [
    currency,
    cashSavings,
    shariahEquities,
    goldSilverValue,
    shortTermLiabilities,
    nisabStandard,
    equityMethod,
    calendarBasis,
    dividendsReceived,
    purificationRatioPct,
  ]);

  // Profit-Sharing Calculations (Mudarabah & Musharakah)
  const profitProjection = useMemo(() => {
    const invCap = Math.max(0, investorCapital);
    const partCap = contractType === "mudarabah" ? 0 : Math.max(0, partnerCapital);
    const totalPoolInitial = invCap + partCap;
    const invCapitalWeight = totalPoolInitial > 0 ? invCap / totalPoolInitial : 1;
    const partCapitalWeight = totalPoolInitial > 0 ? partCap / totalPoolInitial : 0;

    const invShareRatio = Math.min(100, Math.max(0, investorProfitRatio)) / 100;
    const partShareRatio = 1 - invShareRatio;

    const rows: ProjectionYearRow[] = [];
    let currentInvestorCap = invCap;
    let cumulativePartnerShare = 0;
    let cumulativeZakat = 0;

    for (let yr = 1; yr <= horizonYears; yr++) {
      // Scale pool proportionally around investor capital + fixed partner stake
      const poolThisYear = currentInvestorCap + partCap;
      const grossReturn = poolThisYear * (expectedAnnualReturnPct / 100);

      let investorAllocation = 0;
      let partnerAllocation = 0;

      if (grossReturn >= 0) {
        // Profits distributed strictly by pre-agreed Shariah ratio
        investorAllocation = grossReturn * invShareRatio;
        partnerAllocation = grossReturn * partShareRatio;
      } else {
        // Losses distributed by Shariah contract rule:
        // Mudarabah: Rab al-Mal bears 100% financial loss; Mudarib forfeits labor
        // Musharakah: Losses shared strictly pro-rata to capital contribution
        if (contractType === "mudarabah") {
          investorAllocation = grossReturn;
          partnerAllocation = 0;
        } else {
          investorAllocation = grossReturn * invCapitalWeight;
          partnerAllocation = grossReturn * partCapitalWeight;
        }
      }

      const preZakatInvestor = Math.max(0, currentInvestorCap + investorAllocation);
      const zakatThisYear = applyAnnualZakat ? preZakatInvestor * 0.025 : 0;
      const closingInvestorCap = Math.max(0, preZakatInvestor - zakatThisYear);

      cumulativePartnerShare += partnerAllocation;
      cumulativeZakat += zakatThisYear;

      rows.push({
        year: yr,
        openingCapital: currentInvestorCap,
        grossProfitOrLoss: grossReturn,
        investorShare: investorAllocation,
        partnerShare: partnerAllocation,
        zakatDeducted: zakatThisYear,
        closingInvestorCapital: closingInvestorCap,
      });

      currentInvestorCap = closingInvestorCap;
    }

    const finalInvestorCapital =
      rows.length > 0 ? rows[rows.length - 1].closingInvestorCapital : invCap;
    const netInvestorProfit = finalInvestorCapital - invCap;
    const maxChartVal = Math.max(
      invCap,
      ...rows.map((r) => Math.max(r.closingInvestorCapital, r.openingCapital)),
      1
    );

    return {
      invCap,
      partCap,
      invCapitalWeight,
      partCapitalWeight,
      finalInvestorCapital,
      netInvestorProfit,
      cumulativePartnerShare,
      cumulativeZakat,
      rows,
      maxChartVal,
    };
  }, [
    contractType,
    investorCapital,
    partnerCapital,
    investorProfitRatio,
    expectedAnnualReturnPct,
    horizonYears,
    applyAnnualZakat,
  ]);

  const handleCopySummary = async () => {
    const summaryText =
      activeTab === "zakat"
        ? [
            `QUWARIR Islamic Zakat & Purification Projection (${currency})`,
            `Net Zakatable Wealth: ${formatAmount(zakatStats.netZakatableWealth, currency)}`,
            `Nisab Threshold (${nisabStandard === "gold" ? "85g Gold" : "595g Silver"}): ${formatAmount(zakatStats.nisabThreshold, currency)} — ${zakatStats.meetsNisab ? "Above Nisab" : "Below Nisab"}`,
            `Annual Zakat Due (${(zakatStats.zakatRate * 100).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}%): ${formatAmount(zakatStats.zakatDue, currency)}`,
            `Dividend Purification (Tathir at ${purificationRatioPct.toFixed(1)}%): ${formatAmount(zakatStats.tathirPurification, currency)}`,
            `Total Zakat & Tathir Commitment: ${formatAmount(zakatStats.totalEthicalOutflow, currency)}`,
          ].join("\n")
        : [
            `QUWARIR ${contractType === "mudarabah" ? "Mudarabah" : "Musharakah"} Projection (${currency}, ${horizonYears} Years)`,
            `Investor Initial Capital: ${formatAmount(profitProjection.invCap, currency)}`,
            `Agreed Profit Split: ${investorProfitRatio}% Investor / ${100 - investorProfitRatio}% Partner`,
            `Projected Return Scenario: ${expectedAnnualReturnPct}% p.a.`,
            `Projected Final Investor Capital: ${formatAmount(profitProjection.finalInvestorCapital, currency)}`,
            `Cumulative Zakat Provisioned: ${formatAmount(profitProjection.cumulativeZakat, currency)}`,
            `Note: Illustrative Shariah-compliant projection; returns are non-guaranteed.`,
          ].join("\n");

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="calculator"
      className="relative bg-[#051F20] text-[#DAF1DE] pb-24 lg:pb-32 border-b border-[#8EB69B]/15 overflow-hidden"
    >
      <MashrabiyaBandBorder className="mb-20" strokeColor="#8EB69B" />
      <IslamicStarLatticeBg opacity={0.05} strokeColor="#8EB69B" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 w-[760px] h-[460px] rounded-full bg-[#235347]/35 blur-3xl"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          data-gsap-reveal="headline"
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                Islamic Financial Calculators
              </span>
              <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
              <span lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                حاسبة الزكاة والمضاربة
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4.2vw,3.6rem)] font-medium leading-[1.06] text-[#DAF1DE] text-balance">
              Transparent Zakat &amp; Profit-Sharing Projections.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#8EB69B] max-w-md leading-relaxed">
            Model annual Zakat al-Mal obligations, dividend purification (Tathir), and Shariah
            Mudarabah or Musharakah profit-and-loss outcomes without hidden assumptions.
          </p>
        </div>

        {/* Main Interactive Shell */}
        <div
          data-gsap-reveal="container"
          className="rounded-2xl bg-[#0B2B26]/95 backdrop-blur-md border border-[#8EB69B]/25 overflow-hidden"
        >
          {/* Top Control Bar */}
          <div className="p-5 sm:p-7 border-b border-[#8EB69B]/20 flex flex-wrap items-center justify-between gap-4">
            {/* Mode Switcher */}
            <div
              role="tablist"
              aria-label="Islamic Financial Calculator Mode"
              className="inline-flex flex-wrap rounded-xl bg-[#051F20] p-1 border border-[#8EB69B]/20 gap-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "zakat"}
                onClick={() => setActiveTab("zakat")}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === "zakat"
                    ? "text-[#051F20]"
                    : "text-[#8EB69B] hover:text-[#DAF1DE]"
                }`}
              >
                {activeTab === "zakat" && (
                  <motion.span
                    layoutId="calc-active-tab"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#DAF1DE]"
                  />
                )}
                <Calculator className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">Zakat &amp; Tathir</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "profit_sharing"}
                onClick={() => setActiveTab("profit_sharing")}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === "profit_sharing"
                    ? "text-[#051F20]"
                    : "text-[#8EB69B] hover:text-[#DAF1DE]"
                }`}
              >
                {activeTab === "profit_sharing" && (
                  <motion.span
                    layoutId="calc-active-tab"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#DAF1DE]"
                  />
                )}
                <Scale className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">Profit-Sharing Projection</span>
              </button>
            </div>

            {/* Currency & Utility Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl bg-[#051F20] p-1 border border-[#8EB69B]/20">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleCurrencyChange(code)}
                    className={`px-2.5 py-1.5 rounded-lg font-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                      currency === code
                        ? "bg-[#235347] text-[#DAF1DE] font-semibold"
                        : "text-[#8EB69B] hover:text-[#DAF1DE]"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#8EB69B]/30 text-xs font-medium text-[#DAF1DE] hover:border-[#DAF1DE] transition-colors whitespace-nowrap shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Summary"}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#8EB69B]/20 text-xs font-medium text-[#8EB69B] hover:text-[#DAF1DE] hover:border-[#8EB69B]/50 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Tab Body */}
          <AnimatePresence mode="wait">
            {activeTab === "zakat" ? (
              <motion.div
                key="zakat-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Left Column: Inputs */}
                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#8EB69B]/20 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-1">
                      01. Zakatable Holdings (Hawl Completed)
                    </p>
                    <p className="text-xs text-[#8EB69B]/80">
                      Enter liquid and investment assets held for one full lunar year.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="zakat-cash"
                        className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB69B] mb-2"
                      >
                        Cash &amp; Savings ({currency})
                      </label>
                      <input
                        id="zakat-cash"
                        type="number"
                        min={0}
                        value={cashSavings}
                        onChange={(e) => setCashSavings(Math.max(0, Number(e.target.value) || 0))}
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-2.5 font-mono text-sm text-[#DAF1DE] tabular-nums focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="zakat-equities"
                        className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB69B] mb-2"
                      >
                        Halal Equities Value ({currency})
                      </label>
                      <input
                        id="zakat-equities"
                        type="number"
                        min={0}
                        value={shariahEquities}
                        onChange={(e) =>
                          setShariahEquities(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-2.5 font-mono text-sm text-[#DAF1DE] tabular-nums focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="zakat-gold"
                        className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB69B] mb-2"
                      >
                        Gold &amp; Silver Holdings ({currency})
                      </label>
                      <input
                        id="zakat-gold"
                        type="number"
                        min={0}
                        value={goldSilverValue}
                        onChange={(e) =>
                          setGoldSilverValue(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-2.5 font-mono text-sm text-[#DAF1DE] tabular-nums focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="zakat-liabilities"
                        className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB69B] mb-2"
                      >
                        Short-Term Liabilities ({currency})
                      </label>
                      <input
                        id="zakat-liabilities"
                        type="number"
                        min={0}
                        value={shortTermLiabilities}
                        onChange={(e) =>
                          setShortTermLiabilities(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-2.5 font-mono text-sm text-[#DAF1DE] tabular-nums focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>
                  </div>

                  {/* Jurisprudential Methodology Options */}
                  <div className="pt-4 border-t border-[#8EB69B]/15 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs uppercase tracking-[0.14em] text-[#8EB69B] mb-2">
                          Equity Valuation Basis
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#051F20] p-1 border border-[#8EB69B]/20">
                          <button
                            type="button"
                            onClick={() => setEquityMethod("market_value")}
                            className={`py-2 px-2 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                              equityMethod === "market_value"
                                ? "bg-[#235347] text-[#DAF1DE]"
                                : "text-[#8EB69B] hover:text-[#DAF1DE]"
                            }`}
                          >
                            100% Trading
                          </button>
                          <button
                            type="button"
                            onClick={() => setEquityMethod("zakatable_assets")}
                            className={`py-2 px-2 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                              equityMethod === "zakatable_assets"
                                ? "bg-[#235347] text-[#DAF1DE]"
                                : "text-[#8EB69B] hover:text-[#DAF1DE]"
                            }`}
                          >
                            25% Proxy
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs uppercase tracking-[0.14em] text-[#8EB69B] mb-2">
                          Nisab &amp; Calendar Basis
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#051F20] p-1 border border-[#8EB69B]/20">
                          <button
                            type="button"
                            onClick={() =>
                              setNisabStandard((prev) => (prev === "gold" ? "silver" : "gold"))
                            }
                            className="py-2 px-2 rounded-lg text-[11px] font-medium bg-[#235347] text-[#DAF1DE] hover:bg-[#163832] transition-colors whitespace-nowrap"
                          >
                            {nisabStandard === "gold" ? "85g Gold" : "595g Silver"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCalendarBasis((prev) => (prev === "lunar" ? "solar" : "lunar"))
                            }
                            className="py-2 px-2 rounded-lg text-[11px] font-medium bg-[#163832] text-[#DAF1DE] hover:bg-[#235347] transition-colors whitespace-nowrap"
                          >
                            {calendarBasis === "lunar" ? "Hijri 2.5%" : "Solar 2.577%"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dividend Purification (Tathir) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div>
                        <label
                          htmlFor="tathir-dividends"
                          className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB69B] mb-2"
                        >
                          Annual Dividends Received ({currency})
                        </label>
                        <input
                          id="tathir-dividends"
                          type="number"
                          min={0}
                          value={dividendsReceived}
                          onChange={(e) =>
                            setDividendsReceived(Math.max(0, Number(e.target.value) || 0))
                          }
                          className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-2.5 font-mono text-sm text-[#DAF1DE] tabular-nums focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#8EB69B] mb-2">
                          <label htmlFor="tathir-ratio">Tathir Purification Ratio</label>
                          <span className="font-mono text-[#DAF1DE] tabular-nums">
                            {purificationRatioPct.toFixed(1)}%
                          </span>
                        </div>
                        <input
                          id="tathir-ratio"
                          type="range"
                          min={0}
                          max={5}
                          step={0.1}
                          value={purificationRatioPct}
                          onChange={(e) => setPurificationRatioPct(Number(e.target.value))}
                          className="w-full accent-[#DAF1DE] cursor-pointer mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Transparent Calculation Output */}
                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 bg-[#163832]/45 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B]">
                        02. Transparent Zakat &amp; Purification Breakdown
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DAF1DE]">
                        {zakatStats.meetsNisab ? (
                          <>
                            <ShieldCheck className="w-4 h-4 text-[#8EB69B]" />
                            <span>Above Nisab — Zakat Obligatory</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-[#8EB69B]" />
                            <span>Below Nisab — Zakat Not Obligatory</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Primary Obligation Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 mb-6 border-b border-[#8EB69B]/20">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#8EB69B] mb-2">
                          Annual Zakat Due ({calendarBasis === "lunar" ? "2.5%" : "2.577%"})
                        </p>
                        <p className="font-serif text-3xl sm:text-4xl font-medium text-[#DAF1DE] tabular-nums">
                          {formatAmount(zakatStats.zakatDue, currency)}
                        </p>
                      </div>

                      <div className="sm:border-l sm:border-[#8EB69B]/20 sm:pl-6">
                        <p className="text-xs uppercase tracking-[0.16em] text-[#8EB69B] mb-2">
                          Dividend Purification (Tathir)
                        </p>
                        <p className="font-serif text-3xl sm:text-4xl font-medium text-[#8EB69B] tabular-nums">
                          {formatAmount(zakatStats.tathirPurification, currency)}
                        </p>
                      </div>
                    </div>

                    {/* Transparent Step-by-Step Ledger */}
                    <dl className="divide-y divide-[#8EB69B]/15 border-t border-b border-[#8EB69B]/15 text-sm">
                      <div className="py-3 flex items-center justify-between gap-4">
                        <dt className="text-[#8EB69B]">
                          Effective Equities Base (
                          {equityMethod === "market_value" ? "100% Market" : "25% Asset Proxy"})
                        </dt>
                        <dd className="font-mono text-[#DAF1DE] tabular-nums">
                          {formatAmount(zakatStats.effectiveEquityBase, currency)}
                        </dd>
                      </div>

                      <div className="py-3 flex items-center justify-between gap-4">
                        <dt className="text-[#8EB69B]">Net Zakatable Wealth (Assets − Debt)</dt>
                        <dd className="font-mono text-[#DAF1DE] tabular-nums">
                          {formatAmount(zakatStats.netZakatableWealth, currency)}
                        </dd>
                      </div>

                      <div className="py-3 flex items-center justify-between gap-4">
                        <dt className="text-[#8EB69B]">
                          Nisab Reference ({nisabStandard === "gold" ? "85g Gold" : "595g Silver"})
                        </dt>
                        <dd className="font-mono text-[#DAF1DE] tabular-nums">
                          {formatAmount(zakatStats.nisabThreshold, currency)}
                        </dd>
                      </div>

                      <div className="py-3 flex items-center justify-between gap-4">
                        <dt className="font-medium text-[#DAF1DE]">
                          Total Ethical Outflow (Zakat + Tathir)
                        </dt>
                        <dd className="font-mono font-semibold text-[#DAF1DE] tabular-nums">
                          {formatAmount(zakatStats.totalEthicalOutflow, currency)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <p className="text-xs text-[#8EB69B] leading-relaxed">
                    <span className="text-[#DAF1DE] font-semibold">Jurisprudential Note: </span>
                    Trading portfolios generally assess Zakat on 100% of market value, whereas
                    long-term dividend holdings may use underlying net zakatable corporate assets
                    (~25% proxy per AAOIFI guidance). Tathir removes incidental non-permissible
                    income (&lt;5%) separately from Zakat.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="profit-sharing-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Left Column: Contract & Scenario Parameters */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#8EB69B]/20 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2">
                      01. Shariah Contract Structure
                    </p>
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#051F20] p-1 border border-[#8EB69B]/20">
                      <button
                        type="button"
                        onClick={() => setContractType("mudarabah")}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                          contractType === "mudarabah"
                            ? "bg-[#DAF1DE] text-[#051F20]"
                            : "text-[#8EB69B] hover:text-[#DAF1DE]"
                        }`}
                      >
                        Mudarabah
                      </button>
                      <button
                        type="button"
                        onClick={() => setContractType("musharakah")}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                          contractType === "musharakah"
                            ? "bg-[#DAF1DE] text-[#051F20]"
                            : "text-[#8EB69B] hover:text-[#DAF1DE]"
                        }`}
                      >
                        Musharakah
                      </button>
                    </div>
                    <p className="mt-2.5 text-xs text-[#8EB69B] leading-relaxed">
                      {contractType === "mudarabah"
                        ? "Trust financing: Investor (Rab al-Mal) supplies 100% of capital; Manager (Mudarib) contributes management expertise."
                        : "Joint equity partnership: Both partners contribute capital. Profits follow agreed ratio; losses strictly follow capital share."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="ps-investor-capital"
                        className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB69B] mb-2"
                      >
                        Investor Capital ({currency})
                      </label>
                      <input
                        id="ps-investor-capital"
                        type="number"
                        min={0}
                        step={CURRENCIES[currency].capitalStep}
                        value={investorCapital}
                        onChange={(e) =>
                          setInvestorCapital(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-2.5 font-mono text-sm text-[#DAF1DE] tabular-nums focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="ps-partner-capital"
                        className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8EB69B] mb-2"
                      >
                        Partner Capital ({currency})
                      </label>
                      <input
                        id="ps-partner-capital"
                        type="number"
                        min={0}
                        disabled={contractType === "mudarabah"}
                        value={contractType === "mudarabah" ? 0 : partnerCapital}
                        onChange={(e) =>
                          setPartnerCapital(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-2.5 font-mono text-sm text-[#DAF1DE] tabular-nums disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>
                  </div>

                  {/* Agreed Profit Sharing Ratio */}
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#8EB69B] mb-2">
                      <label htmlFor="ps-ratio">Pre-Agreed Profit Ratio</label>
                      <span className="font-mono text-[#DAF1DE] tabular-nums">
                        {investorProfitRatio}% Investor · {100 - investorProfitRatio}% Partner
                      </span>
                    </div>
                    <input
                      id="ps-ratio"
                      type="range"
                      min={10}
                      max={95}
                      step={5}
                      value={investorProfitRatio}
                      onChange={(e) => setInvestorProfitRatio(Number(e.target.value))}
                      className="w-full accent-[#DAF1DE] cursor-pointer"
                    />
                  </div>

                  {/* Projected Return Scenario */}
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#8EB69B] mb-2">
                      <label htmlFor="ps-return">Projected Annual Return Scenario</label>
                      <span className="font-mono text-[#DAF1DE] tabular-nums">
                        {expectedAnnualReturnPct > 0 ? "+" : ""}
                        {expectedAnnualReturnPct}% p.a.
                      </span>
                    </div>
                    <input
                      id="ps-return"
                      type="range"
                      min={-10}
                      max={25}
                      step={1}
                      value={expectedAnnualReturnPct}
                      onChange={(e) => setExpectedAnnualReturnPct(Number(e.target.value))}
                      className="w-full accent-[#DAF1DE] cursor-pointer mb-3"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Stress -5%", val: -5 },
                        { label: "Conservative 6%", val: 6 },
                        { label: "Balanced 10%", val: 10 },
                        { label: "Growth 15%", val: 15 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setExpectedAnnualReturnPct(preset.val)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-colors whitespace-nowrap shrink-0 ${
                            expectedAnnualReturnPct === preset.val
                              ? "bg-[#DAF1DE] text-[#051F20] border-[#DAF1DE] font-semibold"
                              : "bg-[#051F20] text-[#8EB69B] border-[#8EB69B]/25 hover:border-[#DAF1DE]"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horizon & Annual Zakat Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#8EB69B] mb-2">
                        <label htmlFor="ps-horizon">Horizon</label>
                        <span className="font-mono text-[#DAF1DE] tabular-nums">
                          {horizonYears} {horizonYears === 1 ? "Year" : "Years"}
                        </span>
                      </div>
                      <input
                        id="ps-horizon"
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={horizonYears}
                        onChange={(e) => setHorizonYears(Number(e.target.value))}
                        className="w-full accent-[#DAF1DE] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setApplyAnnualZakat((prev) => !prev)}
                        aria-pressed={applyAnnualZakat}
                        className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap ${
                          applyAnnualZakat
                            ? "bg-[#235347] border-[#8EB69B] text-[#DAF1DE]"
                            : "bg-[#051F20] border-[#8EB69B]/25 text-[#8EB69B]"
                        }`}
                      >
                        {applyAnnualZakat
                          ? "Annual Zakat (2.5%): Deducted"
                          : "Annual Zakat (2.5%): Excluded"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Projection Chart & Transparent Year-by-Year Schedule */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-[#163832]/45 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B]">
                        02. Multi-Year Net Projection (Post-Split
                        {applyAnnualZakat ? " & Post-Zakat" : ""})
                      </p>
                      <span className="text-xs font-mono text-[#8EB69B] tabular-nums">
                        Loss Rule:{" "}
                        {contractType === "mudarabah"
                          ? "100% Rab al-Mal Capital"
                          : `${Math.round(profitProjection.invCapitalWeight * 100)}% / ${Math.round(profitProjection.partCapitalWeight * 100)}% Pro-Rata`}
                      </span>
                    </div>

                    {/* Top Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 mb-6 border-b border-[#8EB69B]/20">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8EB69B] mb-1">
                          Projected Investor Value
                        </p>
                        <p className="font-serif text-2xl sm:text-3xl font-medium text-[#DAF1DE] tabular-nums">
                          {formatAmount(profitProjection.finalInvestorCapital, currency)}
                        </p>
                      </div>

                      <div className="sm:border-l sm:border-[#8EB69B]/20 sm:pl-6">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8EB69B] mb-1">
                          Investor Net {profitProjection.netInvestorProfit >= 0 ? "Gain" : "Loss"}
                        </p>
                        <p className="font-serif text-2xl sm:text-3xl font-medium text-[#8EB69B] tabular-nums">
                          {profitProjection.netInvestorProfit >= 0 ? "+" : ""}
                          {formatAmount(profitProjection.netInvestorProfit, currency)}
                        </p>
                      </div>

                      <div className="sm:border-l sm:border-[#8EB69B]/20 sm:pl-6">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8EB69B] mb-1">
                          Partner Share · Zakat Paid
                        </p>
                        <p className="font-mono text-sm font-semibold text-[#DAF1DE] tabular-nums mt-2">
                          {formatAmount(profitProjection.cumulativePartnerShare, currency)} ·{" "}
                          <span className="text-[#8EB69B]">
                            {formatAmount(profitProjection.cumulativeZakat, currency)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Visual Bar Progression */}
                    <div className="pb-6 mb-6 border-b border-[#8EB69B]/20">
                      <div className="flex items-end gap-2 sm:gap-3 h-32">
                        {profitProjection.rows.map((row) => {
                          const heightPct = Math.max(
                            8,
                            Math.round((row.closingInvestorCapital / profitProjection.maxChartVal) * 100)
                          );
                          return (
                            <div
                              key={row.year}
                              className="flex-1 flex flex-col items-center justify-end h-full gap-1.5"
                            >
                              <div
                                className="w-full rounded-t-md bg-gradient-to-t from-[#235347] to-[#8EB69B] transition-all duration-300"
                                style={{ height: `${heightPct}%` }}
                                title={`Year ${row.year}: ${formatAmount(row.closingInvestorCapital, currency)}`}
                              />
                              <span className="font-mono text-[10px] text-[#8EB69B] tabular-nums">
                                Y{row.year}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Transparent Year-by-Year Ledger Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="text-[#8EB69B] uppercase tracking-wider border-b border-[#8EB69B]/20">
                            <th className="py-2.5 px-3 font-medium">Year</th>
                            <th className="py-2.5 px-3 font-medium">Investor Share</th>
                            <th className="py-2.5 px-3 font-medium">Partner Share</th>
                            <th className="py-2.5 px-3 font-medium">Zakat (2.5%)</th>
                            <th className="py-2.5 px-3 font-medium text-right">Closing Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#8EB69B]/15 font-mono tabular-nums">
                          {profitProjection.rows.map((row) => (
                            <tr key={row.year} className="hover:bg-[#051F20]/40">
                              <td className="py-2.5 px-3 text-[#8EB69B]">Y{row.year}</td>
                              <td className="py-2.5 px-3 text-[#DAF1DE]">
                                {row.investorShare >= 0 ? "+" : ""}
                                {formatAmount(row.investorShare, currency)}
                              </td>
                              <td className="py-2.5 px-3 text-[#8EB69B]">
                                {formatAmount(row.partnerShare, currency)}
                              </td>
                              <td className="py-2.5 px-3 text-[#8EB69B]">
                                {formatAmount(row.zakatDeducted, currency)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-[#DAF1DE]">
                                {formatAmount(row.closingInvestorCapital, currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="text-xs text-[#8EB69B] leading-relaxed">
                    <span className="text-[#DAF1DE] font-semibold">Shariah Projection Notice: </span>
                    Islamic finance prohibits fixed, guaranteed interest (Riba). Mudarabah and
                    Musharakah projections illustrate variable profit-and-loss outcomes strictly for
                    financial education and transparency.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
