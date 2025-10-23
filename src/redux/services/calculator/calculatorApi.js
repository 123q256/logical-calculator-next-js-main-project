import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const calculatorApi = createApi({
  reducerPath: "calculatorApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    getSingleCalculatorLanguage: builder.query({
      query: (tech_calculator_link) => ({
        url: `/calculator_detail/calculator_lang/${tech_calculator_link}`,
        method: "GET",
      }),
    }),
    getSingleCalculatorDetails: builder.mutation({
      query: (data) => ({
        url: `/calculator_detail/`,
        method: "POST",
        body: data, // Send the `tech_calculator_link` in the body
      }),
    }),

    dogPregnancyCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dog-pregnancy-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    benadrylForDogsCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/benadryl-for-dogs-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    catCalorieCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cat-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    puppyweightCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/puppy-weight-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    pearsonAgeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pearson-age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    dogAgeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dog-age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    catAgeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cat-age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    dogCrateSizeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dog-crate-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    dogFoodCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dog-food-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    // timedate calculator

    timeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    timecardCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/time-card-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    timespanCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/time-span-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    timedurationCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/time-duration-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    addtimeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/add-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    millitarytimeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/military-time-converter`,
        method: "POST",
        body: data,
      }),
    }),
    readingtimeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/reading-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    elapsedtimeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/elapsed-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    timeuntilCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/time-until-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    hoursagoCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/hours-ago-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    dateCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/date-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    businessdaysCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/business-days-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    leadtimeCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/lead-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    datedurationCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/date-duration-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    monthCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/month-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    deadlineCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/deadline-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    workingdaysCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/working-days-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    todaysdateCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/todays-date`,
        method: "POST",
        body: data,
      }),
    }),
    birthyearCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/birth-year-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    daysuntilCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/days-until-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    weekCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/week-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    weeksfromtodayCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weeks-from-today`,
        method: "POST",
        body: data,
      }),
    }),
    yearsfromtodayCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/years-from-today`,
        method: "POST",
        body: data,
      }),
    }),
    hoursfromnowCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/hours-from-now`,
        method: "POST",
        body: data,
      }),
    }),
    yearsagoCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/years-ago-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    weeksagoCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weeks-ago-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    daysagoCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/days-ago-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    daysleftintheyearCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/days-left-in-the-year`,
        method: "POST",
        body: data,
      }),
    }),
    juliansdateCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/julians-date-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    monthsfromnowCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/months-from-now`,
        method: "POST",
        body: data,
      }),
    }),
    weeksleftintheyearCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weeks-left-in-the-year`,
        method: "POST",
        body: data,
      }),
    }),
    monthsleftintheyearCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/months-left-in-the-year`,
        method: "POST",
        body: data,
      }),
    }),
    howmanydaysuntilmybirthdayCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/how-many-days-until-my-birthday`,
        method: "POST",
        body: data,
      }),
    }),
    dayssincedateCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/days-since-date-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    // MATH
    roundedToTheNearestCent: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/round-to-the-nearest-cent`,
        method: "POST",
        body: data,
      }),
    }),

    AbsoluteChangeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/absolute-change-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CircumferenceToDiameterCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/circumference-to-diameter-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ComparingDecimalsCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/comparing-decimals-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DoublingTimeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/doubling-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FibonacciCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/fibonacci-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    LogBase2Calculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/log-base-2-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PercentErrorCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/percent-error-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    VolumeOfSquare: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/volume-of-square`,
        method: "POST",
        body: data,
      }),
    }),
    SquareRootCurveCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/square-root-curve-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    VariationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/variation-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    // Finance

    // Finance
    EnterpriseValueCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/enterprise-value-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EBITDACalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ebitda-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EbitCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ebit-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CapRateCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cap-rate-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ROICalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/roi-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CostOfEquityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cost-of-equity-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ROASCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/roas-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BetaCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/beta-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CashBackCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cash-back-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CurrentRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/current-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    NPSCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/nps-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OpportunityCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/opportunity-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BasisPointCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/basis-point-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MACRSDepreciationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/macrs-depreciation-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FutureValueOfAnnuityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/future-value-of-annuity`,
        method: "POST",
        body: data,
      }),
    }),
    EarningsPerShareCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/earnings-per-share-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FIFOAndLIFOCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/fifo-lifo-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DepreciationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/depreciation-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CarDepreciationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/car-depreciation-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PropertyDepreciationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/property-depreciation-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    NPVCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/npv-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CostBasisCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cost-basis-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DiscountedCashFlowCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/discounted-cash-flow-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OutTheDoorPriceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/out-the-door-price-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SalaryCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/salary-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OvertimeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/overtime-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PayRaiseCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pay-raise-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AGICalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/agi-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GrossIncomeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gross-income-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TimeAndHalfCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/time-and-a-half`,
        method: "POST",
        body: data,
      }),
    }),
    LaborCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/labor-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MonthlyIncomeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/monthly-income-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MoneyCounterCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/money-counter-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    VADisabilityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/va-disability-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TipCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tip-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HourlyToSalaryCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/hourly-to-salary-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SalaryToHourlyCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/salary-to-hourly-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GratuityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gratuity-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    IncomeTaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tax-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    StampDutyCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stamp-duty-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    VATCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/vat-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SalesTaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/salestax-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PayPalFeeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/paypal-fee-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ReverseSalesTaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/reverse-sales-tax-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WaterBillCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/water-bill-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ZakatCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/zakat-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DiscountCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/discount-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MarginCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/profit-margin-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MarginOfErrorCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/margin-of-error-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MarginalCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/marginal-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MaximumProfitCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/maximum-profit-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TuroCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/turo-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    VariableCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/variable-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MarginalRevenueCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/marginal-revenue-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DeadweightLossCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/deadweight-loss-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CostOfGoodsSoldCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cost-of-goods-sold-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ContributionMarginCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/contribution-margin-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PaybackPeriodCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/payback-period-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EmployeeCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/employee-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PriceElasticityOfDemandCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/price-elasticity-demand-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    ConsumerSurplusCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/consumer-surplus-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MPCCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/mpc-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CrossPriceElasticityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cross-price-elasticity-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BuyingPowerCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/buying-power-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RentIncreaseCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/rent-increase-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CPCCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cpc-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CPMCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cpm-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    StockCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stock-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MarkdownCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/markdown-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CommissionCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/commission-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DividendYieldCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dividend-yield-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OptionsProfitCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/options-profit-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PriceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/price-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SalesPercentageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/percent-of-sales-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    YoutubeRevenueCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/youtube-revenue-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CTRCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ctr-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ActualCashValueCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/actual-cash-value-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RealEstateCommissionCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/real-estate-commission-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SalvageValueCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/salvage-value-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BookValueCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/book-value-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WeddingBudgetCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/wedding-budget-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RentSplitCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/rent-split-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    UnemploymentRateCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/unemployment-rate-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GrowthRateCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/growth-rate-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ComparativeAdvantageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/comparative-advantage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GDPPerCapitaCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gdp-per-capita-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GDPCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gdp-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CAGRCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cagr-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    IncomeElasticityOfDemandCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/income-elasticity-of-demand-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MpcCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/mpc-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CrossPriceElasticityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cross-price-elasticity-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RentIncreaseCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/rent-increase-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MarkupCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/markup-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WaccCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/wacc-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CapmCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/capm-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BondPriceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bond-price-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    NetWorthCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/net-worth-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ArvCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/arv-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ConsumerSurplusCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/consumer-surplus-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    // end Finance

    // health start

    BMICalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bmi-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    WaistToHipRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/waist-to-hip-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BodyShapeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/body-shape-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BraSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bra-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    JumpRopeCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/jump-rope-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    StepsToMilesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/steps-to-miles-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ArmyBodyFatCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/army-body-fat-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BenchPressCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bench-press-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WilksCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/wilks-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    Vo2MaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/vo2-max-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    IdealWeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ideal-weight-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WaistToHeightRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/waist-to-height-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ApftCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/apft-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CaloriesBurnedBikingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/calories-burned-biking-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WalkingCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/walking-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FatBurningHeartRate: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/fat-burning-heart-rate`,
        method: "POST",
        body: data,
      }),
    }),
    NavyBodyFatCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/navy-body-fat-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BodyFatPercentageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/body-fat-percentage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PaceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pace-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/height-calculatoR`,
        method: "POST",
        body: data,
      }),
    }),
    LeanBodyMassCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/lean-body-mass-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FfmiCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ffmi-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    IpptCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ippt-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    StepsToCaloriesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/steps-to-calories-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TreadmillCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/treadmill-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EllipticalCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/elliptical-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AdjustedBodyWeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/adjusted-body-weight-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TargetHeartRateCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/target-heart-rate-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AcftCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/acft-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SwimmingCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/swimming-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WeightlossCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weightloss-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RmrCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/rmr-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WeightLossPercentageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weight-loss-percentage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MealPlanner: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/meal-planner`,
        method: "POST",
        body: data,
      }),
    }),
    MacroCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/macro-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WeightWatchersPointsCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weight-watchers-points-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MaintenanceCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/maintenance-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TdeeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tdee-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BmrCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bmr-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HarrisBenedictCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/harris-benedict-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BulkingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bulking-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EerCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/eer-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ProteinCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/protein-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BreastfeedingCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/breastfeeding-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CalorieDeficitCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/calorie-deficit-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FoodCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/food-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    NetCarbsCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/net-carbs-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MealCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/meal-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WeightGainCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weight-gain-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OvulationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ovulation-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HcgCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/hcg-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PregnancyCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pregnancy-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PregnancyWeightGainCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pregnancy-weight-gain-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ImplantationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/implantation-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WeightPercentileCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weight-percentile-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SixminuteWalkTest: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/6-minute-walk-test`,
        method: "POST",
        body: data,
      }),
    }),
    AncCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/anc-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CentorScoreCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/centor-score-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MelatoninDosageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/melatonin-dosage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TinettiCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tinetti-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CholesterolRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cholesterol-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    StrokeVolumeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stroke-volume-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PediatricDoseCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pediatric-dose-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BsaCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bsa-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AlcCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/alc-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ChildPughCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/child-pugh-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ProstateVolumeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/prostate-volume-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DripRateCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/drip-rate-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ParacetamolDosageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/paracetamol-dosage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    NntCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/nnt-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    UrineOutputCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/urine-output-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DrugHalfLifeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/drug-half-life-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CorrectedCalciumCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/corrected-calcium-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ReticulocyteCountCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/reticulocyte-count-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DosageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dosage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AmoxicillinPediatricDosageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/amoxicillin-pediatric-dosage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AstAltRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ast-alt-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BishopScoreCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bishop-score-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CarboplatinCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/carboplatin-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BloodTypeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/blood-type-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BiologicalAgeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/biological-age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DihybridCrossCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dihybrid-cross-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AlleleFrequencyCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/allele-frequency-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HeightPercentileCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/height-percentile-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    UogGpaCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/uog-gpa-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    A1cCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/a1c-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    BunCreatinineRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bun-creatinine-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    GramsToCaloriesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/grams-to-calories-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    IncidenceRateCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/incidence-rate-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ItRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/it-ratio`,
        method: "POST",
        body: data,
      }),
    }),
    LdlCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ldl-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MapCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/map-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MaxHeartRateCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/max-heart-rate-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OneRepMaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/one-rep-max-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OneRepMaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/one-rep-max-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PackYearCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pack-year-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RuckingCalorieCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/rucking-calorie-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SvrCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/svr-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TacoBarCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/taco-bar-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WaterIntakeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/water-intake-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    // every day

    VisaChanceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/visa-chance-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SleepCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/sleep-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    DistanceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/distance-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TeslaChargingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tesla-charging-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DriveTimeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/drive-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FreightClassCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/freight-class-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    FuelCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/fuel-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MpgCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/mpg-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TravelTimeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/travel-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CostPerMileDrivingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cost-per-mile-driving-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GasCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gas-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AspectRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/aspect-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RingSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ring-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CurtainSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/curtain-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TaperCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/taper-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CbmCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cbm-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TireSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tire-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BoardFootCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/board-foot-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ShoeSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/shoe-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TvSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tv-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    ScreenSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/screen-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BikeSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bike-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    DeskHeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/desk-height-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PantSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pant-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    CeilingFanSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ceiling-fan-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RecessedLightingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/recessed-lighting-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BlindSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/blind-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    DilutionRatioCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dilution-ratio-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MoistureContentCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/moisture-content-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WaterWeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/water-weight-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TurkeySizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/turkey-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EdpiCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/edpi-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    DrawLengthCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/draw-length-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    MagicNumberCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/magic-number-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BattingAverageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/batting-average-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WinningPercentageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/winning-percentage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    OnBasePercentageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/on-base-percentage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DunkCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/dunk-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BowlingCcoreCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bowling-score-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    KdCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/kd-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SluggingPercentageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/slugging-percentage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PointBuyCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/point-buy-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AgeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SobrietyCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/sobriety-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HalfBirthdayCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/half-birthday-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AgeDifferenceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/age-difference-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HouseAgeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/house-age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AnniversaryCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/anniversary-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    KoreanAgeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/korean-age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BirthdayCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/birthday-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HourlyPayCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/hourly-pay-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PopulationDensityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/population-density-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ShadedAreaCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/shaded-area-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    PlantSpacingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/plant-spacing-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    McgToMgCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/mcg-to-mg-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    MagnificationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/magnification-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    YardsToTonsCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/yards-to-tons-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    StairCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stair-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WordsperminuteCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/words-per-minute-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SemestergradeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/semester-grade-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AveragetimeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/average-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ProratedrentCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/prorated-rent-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    SplitbillCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/split-bill-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    LawnmowingCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/lawn-mowing-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GoldCostPerPoundCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gold-cost-per-pound-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EngineHoursToMilesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/engine-hours-to-miles-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BoxFillCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/box-fill-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BatteryLifeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/battery-life-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    TonnageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tonnage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CfmCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cfm-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    AcBtuCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ac-btu-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    VoriciChromaticCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/vorici-chromatic-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    NetherPortalCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/nether-portal-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    RiverRockCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/river-rock-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CircleSkirtCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/circle-skirt-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    FabricCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/fabric-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    EraCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/era-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DownloadCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/download-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    DataFransferCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/data-transfer-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    CompressionHeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/compression-height-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    GpmCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gpm-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BotoxCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/botox-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    LogWeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/log-weight-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    AquariumCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/aquarium-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    LoveCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/love-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    
// Statistics

  ProbabilityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/probability-calculator`,
    method: "POST",
    body: data,
  }),
}),
  HypergeometricCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/hypergeometric-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PoissonDistributionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/poisson-distribution-calculator`,
    method: "POST",
    body: data,
  }),
}),
  BinomialDistributionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/binomial-distribution-calculator`,
    method: "POST",
    body: data,
  }),
}),
  CoinFlipCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/coin-flip-calculator`,
    method: "POST",
    body: data,
  }),
}),
  EmpiricalProbabilityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/empirical-probability-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PHatCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/p-hat-calculator`,
    method: "POST",
    body: data,
  }),
}),
  EmpiricalRuleCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/empirical-rule-calculator`,
    method: "POST",
    body: data,
  }),
}),
  StemLeafPlotCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/stem-leaf-plot-calculator`,
    method: "POST",
    body: data,
  }),
}),
  BoxPlotCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/box-plot-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ScatterPlotMaker: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/scatter-plot-maker`,
    method: "POST",
    body: data,
  }),
}),
  ResidualPlotCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/residual-plot-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PieChartCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/pie-chart-calculator`,
    method: "POST",
    body: data,
  }),
}),
  CoefficientOfVariationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/coefficient-of-variation-calculator`,
    method: "POST",
    body: data,
  }),
}),
  MeanMedianModeRangeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/mean-median-mode-range-calculator`,
    method: "POST",
    body: data,
  }),
}),
  QuartileCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/quartile-calculator`,
    method: "POST",
    body: data,
  }),
}),
  GeometricMeanCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/geometric-mean-calculator`,
    method: "POST",
    body: data,
  }),
}),
  HarmonicMeanCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/harmonic-mean-calculator`,
    method: "POST",
    body: data,
  }),
}),
  LoveCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/love-calculator`,
    method: "POST",
    body: data,
  }),
}),
  InterquartileRangeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/interquartile-range-calculator`,
    method: "POST",
    body: data,
  }),
}),
  MadCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/mad-calculator`,
    method: "POST",
    body: data,
  }),
}),
  StandardDeviationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/standard-deviation-calculator`,
    method: "POST",
    body: data,
  }),
}),
  FiveNumberSummaryCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/5-five-number-summary-calculator`,
    method: "POST",
    body: data,
  }),
}),
  VarianceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/variance-calculator`,
    method: "POST",
    body: data,
  }),
}),
  MidrangeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/midrange-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ChebyshevsTheoremCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/chebyshevs-theorem-calculator`,
    method: "POST",
    body: data,
  }),
}),
  CoefficientOfDeterminationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/coefficient-of-determination-calculator`,
    method: "POST",
    body: data,
  }),
}),
  CorrelationCoefficientCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/correlation-coefficient-calculator`,
    method: "POST",
    body: data,
  }),
}),
  LinearRegressionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/linear-regression-calculator`,
    method: "POST",
    body: data,
  }),
}),
  OutlierCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/outlier-calculator`,
    method: "POST",
    body: data,
  }),
}),
  QuadraticRegressionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/quadratic-regression-calculator`,
    method: "POST",
    body: data,
  }),
}),
  CombinationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/combination-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PermutationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/permutation-calculator`,
    method: "POST",
    body: data,
  }),
}),
  BinomialCoefficientCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/binomial-coefficient-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ClassWidthCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/class-width-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PertCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/pert-calculator`,
    method: "POST",
    body: data,
  }),
}),
  CovarianceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/covariance-calculator`,
    method: "POST",
    body: data,
  }),
}),
  SumOfSquaresCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/sum-of-squares-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PointEstimateCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/point-estimate-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PercentileCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/percentile-calculator`,
    method: "POST",
    body: data,
  }),
}),
  RsdCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/rsd-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PercentileRankCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/percentile-rank-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ZScoreToPercentile: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/z-score-to-percentile`,
    method: "POST",
    body: data,
  }),
}),
  RawScoreCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/raw-score-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PooledVarianceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/pooled-variance-calculator`,
    method: "POST",
    body: data,
  }),
}),
  SseCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/sse-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ResidualCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/residual-calculator`,
    method: "POST",
    body: data,
  }),
}),
  DecileCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/decile-calculator`,
    method: "POST",
    body: data,
  }),
}),
  SampleSizeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/sample-size-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ErrorPropagationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/error-propagation-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ZScoreCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/z-score-calculator`,
    method: "POST",
    body: data,
  }),
}),
  StandardErrorCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/standard-error-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ConfidenceIntervalCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/confidence-interval-calculator`,
    method: "POST",
    body: data,
  }),
}),
  CentralLimitTheoremCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/central-limit-theorem-calculator`,
    method: "POST",
    body: data,
  }),
}),
  InvnormCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/invnorm-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ProbabilityDensityFunctionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/probability-density-function-calculator`,
    method: "POST",
    body: data,
  }),
}),
  NormalDistributionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/normal-distribution-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PredictionIntervalCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/prediction-interval-calculator`,
    method: "POST",
    body: data,
  }),
}),
  SampleDistributionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/sample-distribution-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ChiSquareCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/chi-square-calculator`,
    method: "POST",
    body: data,
  }),
}),
  AnovaCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/anova-calculator`,
    method: "POST",
    body: data,
  }),
}),
  PValueCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/p-value-calculator`,
    method: "POST",
    body: data,
  }),
}),
  DegreesOfFreedomCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/degrees-of-freedom-calculator`,
    method: "POST",
    body: data,
  }),
}),
  TestStatisticCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/test-statistic-calculator`,
    method: "POST",
    body: data,
  }),
}),
  EffectSizeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/effect-size-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ExpectedValueCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/expected-value-calculator`,
    method: "POST",
    body: data,
  }),
}),
  RelativeFrequencyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/relative-frequency-calculator`,
    method: "POST",
    body: data,
  }),
}),
  ShannonDiversityIndexCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/shannon-diversity-index-calculator`,
    method: "POST",
    body: data,
  }),
}),
  AccuracyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/accuracy-calculator`,
    method: "POST",
    body: data,
  }),
}),
  RelativeRiskCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/relative-risk-calculator`,
    method: "POST",
    body: data,
  }),
}),


// Statistics



  // Chemistry Calculators start

  IdealGasLawCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ideal-gas-law-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  BoylesLawCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/boyles-law-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  StpCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/stp-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  CharlesLawCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/charles-law-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  CombinedGasLawCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/combined-gas-law-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  VaporPressureCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/vapor-pressure-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  PartialPressureCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/partial-pressure-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  GayLussacsLawCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gay-lussacs-law-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  PercentYieldCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percent-yield-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  MolarMassCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/molar-mass-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  BondOrderCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/bond-order-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  TheoreticalYieldCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/theoretical-yield-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  AtomicMassCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/atomic-mass-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  LimitingReactantCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/limiting-reactant-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  EmpiricalFormulaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/empirical-formula-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  StoichiometryCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/stoichiometry-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  MoleRatioCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mole-ratio-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  MoleFractionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mole-fraction-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  
  MmollToMgDlCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mmol-l-to-mg-dl-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  MolalityCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/molality-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  MassPercentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mass-percent-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  SolutionDilutionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/solution-dilution-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  MolarityCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/molarity-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  MlToMolesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ml-to-moles-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  PpmCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ppm-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  DilutionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/dilution-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  CalorimetryCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/calorimetry-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  EntropyCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/entropy-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  ActivationEnergyCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/activation-energy-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  GibbsFreeEnergyCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gibbs-free-energy-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  TitrationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/titration-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  EquilibriumConstantCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/equilibrium-constant-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  RedoxReactionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/redox-reaction-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  NernstEquationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/nernst-equation-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  PkaToPhCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/pka-to-ph-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  PhCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ph-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  ChemicalEquationBalancerCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/chemical-equation-balancer-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  MoleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mole-calculator`,
      method: "POST",
      body: data,
    }),
  }),


  GramsToMolesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/grams-to-moles-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  
  GramsToAtomsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/grams-to-atoms-calculator`,
      method: "POST",
      body: data,
    }),
  }),

    
  MolecularFormulaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/molecular-formula-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  MolesToGramsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/moles-to-grams-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  FormalChargeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/formal-charge-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  AtomsToMolesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/atoms-to-moles-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  ElectronConfigurationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/electron-configuration-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  RateConstantCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rate-constant-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  HalfLifeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/half-life-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  CfuCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/cfu-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  AverageAtomicMassCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/average-atomic-mass-calculator`,
      method: "POST",
      body: data,
    }),
  }),

// END chemistry



   // Physics calculator
 OhmsLawCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/ohms-law-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ElectricFieldCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/electric-field-calculator`,
    method: "POST",
    body: data,
  }),
}),
 VoltageDropCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/voltage-drop-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ElectricityCostCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/electricity-cost-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AmpHourCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/amp-hour-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ParallelResistorCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/parallel-resistor-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ResistanceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/resistance-calculator`,
    method: "POST",
    body: data,
  }),
}),
 CapacitanceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/capacitance-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ElectricFluxCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/electric-flux-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ElectricPotentialCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/electric-potential-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AmpsToWattsCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/amps-to-watts-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WattsToAmpsCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/watts-to-amps-calculator`,
    method: "POST",
    body: data,
  }),
}),
 Accelerationcalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/acceleration-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AverageVelocityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/average-velocity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 InstantaneousVelocityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/instantaneous-velocity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AngularVelocityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/angular-velocity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DisplacementCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/displacement-calculator`,
    method: "POST",
    body: data,
  }),
}),
 InstantaneousRateOfChangeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/instantaneous-rate-of-change-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ProjectileMotionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/projectile-motion-calculator`,
    method: "POST",
    body: data,
  }),
}),
 FreeFallCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/free-fall-calculator`,
    method: "POST",
    body: data,
  }),
}),
 SpeedDistanceTimeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/speed-distance-time-calculator`,
    method: "POST",
    body: data,
  }),
}),
 TerminalVelocityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/terminal-velocity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AngularAccelerationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/angular-acceleration-calculator`,
    method: "POST",
    body: data,
  }),
}),
 TimeOfFlightCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/time-of-flight-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AverageSpeedCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/average-speed-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WaveSpeedCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/wave-speed-calculator`,
    method: "POST",
    body: data,
  }),
}),
 TimeDilationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/time-dilation-calculator`,
    method: "POST",
    body: data,
  }),
}),
 SpeedOfSoundCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/speed-of-sound-calculator`,
    method: "POST",
    body: data,
  }),
}),
 PhotonEnergyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/photon-energy-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WavelengthCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/wavelength-calculator`,
    method: "POST",
    body: data,
  }),
}),
 IndexOfRefractionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/index-of-refraction-calculator`,
    method: "POST",
    body: data,
  }),
}),
 SnellsLawCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/snells-law-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WavePeriodCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/wave-period-calculator`,
    method: "POST",
    body: data,
  }),
}),
 RelativeRiskCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/relative-risk-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AngleOfRefractionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/angle-of-refraction-calculator`,
    method: "POST",
    body: data,
  }),
}),
 QuantumNumberCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/quantum-number-calculator`,
    method: "POST",
    body: data,
  }),
}),
 CrossProductCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/cross-product-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DotProductCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/dot-product-calculator`,
    method: "POST",
    body: data,
  }),
}),
 VectorMagnitudeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/vector-magnitude-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DimensionalAnalysisCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/dimensional-analysis-calculator`,
    method: "POST",
    body: data,
  }),
}),
 UnitVectorCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/unit-vector-calculator`,
    method: "POST",
    body: data,
  }),
}),
 CenterOfMassCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/center-of-mass-calculator`,
    method: "POST",
    body: data,
  }),
}),
 VectorProjectionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/vector-projection-calculator`,
    method: "POST",
    body: data,
  }),
}),
 GearRatioCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/gear-ratio-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WattCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/watt-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WattHourCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/watt-hour-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DensityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/density-calculator`,
    method: "POST",
    body: data,
  }),
}),
 SpecificHeatCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/specific-heat-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WaterViscosityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/water-viscosity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DewPointCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/dew-point-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WetBulbCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/wet-bulb-calculator`,
    method: "POST",
    body: data,
  }),
}),
 FlowRateCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/flow-rate-calculator`,
    method: "POST",
    body: data,
  }),
}),
 HeatIndexCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/heat-index-calculator`,
    method: "POST",
    body: data,
  }),
}),
 reynoldsNumberCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/reynolds-number-calculator`,
    method: "POST",
    body: data,
  }),
}),
 BuoyancyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/buoyancy-calculator`,
    method: "POST",
    body: data,
  }),
}),
 SpecificGravityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/specific-gravity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 KineticEnergyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/kinetic-energy-calculator`,
    method: "POST",
    body: data,
  }),
}),
 TorqueCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/torque-calculator`,
    method: "POST",
    body: data,
  }),
}),
 HorsepowerCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/horsepower-calculator`,
    method: "POST",
    body: data,
  }),
}),
 MomentumCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/momentum-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WorkCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/work-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ForceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/force-calculator`,
    method: "POST",
    body: data,
  }),
}),
 PotentialEnergyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/potential-energy-calculator`,
    method: "POST",
    body: data,
  }),
}),
 PowerToWeightRatioCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/power-to-weight-ratio-calculator`,
    method: "POST",
    body: data,
  }),
}),
 FrictionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/friction-calculator`,
    method: "POST",
    body: data,
  }),
}),
 CentripetalForceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/centripetal-force-calculator`,
    method: "POST",
    body: data,
  }),
}),
 FrictionalForceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/frictional-force-calculator`,
    method: "POST",
    body: data,
  }),
}),
 MechanicalEnergyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/mechanical-energy-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ChangeInMomentumCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/change-in-momentum-calculator`,
    method: "POST",
    body: data,
  }),
}),
 CcToHpCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/cc-to-hp-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ImpulseCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/impulse-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WhpToHpCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/whp-to-hp-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ResultantForceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/resultant-force-calculator`,
    method: "POST",
    body: data,
  }),
}),
 EnergyCostCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/energy-cost-calculator`,
    method: "POST",
    body: data,
  }),
}),
 NormalForceCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/normal-force-calculator`,
    method: "POST",
    body: data,
  }),
}),
 VelocityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/velocity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 KinematicsCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/kinematics-calculator`,
    method: "POST",
    body: data,
  }),
}),
 EnthalpyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/enthalpy-calculator`,
    method: "POST",
    body: data,
  }),
}),
 SpringConstantCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/spring-constant-calculator`,
    method: "POST",
    body: data,
  }),
}),
 MomentOfInertiaCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/moment-of-inertia-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ScaleCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/scale-calculator`,
    method: "POST",
    body: data,
  }),
}),
 TransformerCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/transformer-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ConstantOfProportionalityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/constant-of-proportionality-calculator`,
    method: "POST",
    body: data,
  }),
}),
 QuarterMileCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/quarter-mile-calculator`,
    method: "POST",
    body: data,
  }),
}),
 EscapeVelocityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/escape-velocity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 CoulombsLawCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/coulombs-law-calculator`,
    method: "POST",
    body: data,
  }),
}),
 GravityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/gravity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 SolarPanelCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/solar-panel-calculator`,
    method: "POST",
    body: data,
  }),
}),
 ArrowSpeedCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/arrow-speed-calculator`,
    method: "POST",
    body: data,
  }),
}),
 TensionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/tension-calculator`,
    method: "POST",
    body: data,
  }),
}),
 AirDensityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/air-density-calculator`,
    method: "POST",
    body: data,
  }),
}),
 BeamDeflectionCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/beam-deflection-calculator`,
    method: "POST",
    body: data,
  }),
}),
 WireSizeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/wire-size-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DbmToWatts: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/dbm-to-watts`,
    method: "POST",
    body: data,
  }),
}),
 AngleOfDeviationCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/angle-of-deviation-calculator`,
    method: "POST",
    body: data,
  }),
}),
 JouleCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/joule-calculator`,
    method: "POST",
    body: data,
  }),
}),
 EfficiencyCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/efficiency-calculator`,
    method: "POST",
    body: data,
  }),
}),
 VoltsToJoulesCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/volts-to-joules-calculator`,
    method: "POST",
    body: data,
  }),
}),
 FpeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/fpe-calculator`,
    method: "POST",
    body: data,
  }),
}),
 RelativeHumidityCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/relative-humidity-calculator`,
    method: "POST",
    body: data,
  }),
}),
 FrictionLossCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/friction-loss-calculator`,
    method: "POST",
    body: data,
  }),
}),
 OrbitalPeriodCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/orbital-period-calculator`,
    method: "POST",
    body: data,
  }),
}),
 NewtonsLawOfCoolingCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/newtons-law-of-cooling-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DcWireSizeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/dc-wire-size-calculator`,
    method: "POST",
    body: data,
  }),
}),
 DensityAltitudeCalculator: builder.mutation({
  query: (data) => ({
    url: `/calculators-lol/density-altitude-calculator`,
    method: "POST",
    body: data,
  }),
}),

      // Physics calculator



      
      // Math calculator
    ScientificNotationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/scientific-notation-calculator`,
      method: "POST",
      body: data,
    }),
}),
    LimitCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/limit-calculator`,
      method: "POST",
      body: data,
    }),
  }),

    PrimeFactorizationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/prime-factorization-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PercentErrorCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percent-error-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ModuloCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/modulo-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MidpointCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/midpoint-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LongAdditionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/long-addition-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    StandardFormCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/standard-form-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AverageCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/average-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LogAntilogCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/log-antilog-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CentroidTriangleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/centroid-triangle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RemainderCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/remainder-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    QuadraticFormulaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/quadratic-formula-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RoundingNumbersCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rounding-numbers-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FractionToDecimalCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/fraction-to-decimal-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DecimalToFractionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/decimal-to-fraction-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FractionToPercentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/fraction-to-percent-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PercentToFractionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percent-to-fraction-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MillionBillionLakhCrore: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/million-billion-lakh-crore`,
      method: "POST",
      body: data,
    }),
  }),
    PointSlopeFormCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/point-slope-form-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    HemisphereCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/hemisphere-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DiscriminantCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/discriminant-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    EndpointCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/endpoint-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SlopeInterceptFormCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/slope-intercept-form-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ExponentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/exponent-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SquareRootCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/square-root-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    BinaryCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/binary-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ProportionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/proportion-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LinearInterpolationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/linear-interpolation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PythagoreanTheoremCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/pythagorean-theorem-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    UnitCircleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/unit-circle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LaplaceTransformCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/laplace-transform-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    InflectionPointCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/inflection-point-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ArcLengthCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/arc-length-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ArcsinCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/arcsin-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    BinomialTheoremCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/binomial-theorem-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SineCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/sine-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ArccosCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/arccos-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ArctanCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/arctan-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CosineCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/cosine-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    TangentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/tangent-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SecantCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/secant-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CscCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/csc-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CotangentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/cotangent-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AreaBetweenTwoCurvesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/area-between-two-curves-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ECalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/e-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ParallelAndPerpendicularCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/parallel-and-perpendicular-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CompositeFunctionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/composite-function-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CoterminalAngleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/coterminal-angle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ArithmeticSequencesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/arithmetic-sequences-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    InverseFunctionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/inverse-function-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DoubleAngleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/double-angle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RiemannSumCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/riemann-sum-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MeanValueTheoremCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mean-value-theorem-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    HalfAngleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/half-angle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    NewtonsMethodCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/newtons-method-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    TrapezoidalRuleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/trapezoidal-rule-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FoilCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/foil-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    unitTangentVectorCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/unit-tangent-vector-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RemainderTheoremCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/remainder-theorem-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PowerSetCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/power-set-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    GradientCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gradient-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    VertexFormCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/vertex-form-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MidpointRuleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/midpoint-rule-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SubsetCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/subset-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MaclaurinSeriesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/maclaurin-series-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DifferenceQuotientCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/difference-quotient-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ComplexNumberCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/complex-number-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    WronskianCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/wronskian-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    InverseLaplaceTransformCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/inverse-laplace-transform-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SummationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/summation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PolarCoordinatesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/polar-coordinates-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ConvolutionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/convolution-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    JacobianCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/jacobian-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    HyperbolaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/hyperbola-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    WasherMethodCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/washer-method-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ShellMethodCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/shell-method-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ImplicitDifferentiationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/implicit-differentiation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CriticalPointsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/critical-points-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PartialDerivativeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/partial-derivative-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AbsoluteValueCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/absolute-value-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AreaUnderTheCurveCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/area-under-the-curve-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SecondDerivativeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/second-derivative-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DoubleIntegralCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/double-integral-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    TripleIntegralCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/triple-integral-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ZerosCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/zeros-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    GeometricSequenceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/geometric-sequence-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    TruthTableCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/truth-table-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    EvenOddFunctionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/even-odd-function-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SyntheticDivisionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/synthetic-division-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ProductRuleDerivativeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/product-rule-derivative-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    OrthocenterCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/orthocenter-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PolynomialLongDivisionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/polynomial-long-division-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RadiusOfConvergenceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/radius-of-convergence-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PowerSeriesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/power-series-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SimpsonsRuleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/simpsons-rule-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CurlCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/curl-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SaddlePointCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/saddle-point-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ImproperIntegralCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/improper-integral-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FourierSeriesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/fourier-series-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DivergenceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/divergence-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LeastToGreatestCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/least-to-greatest-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RationalExpressionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rational-expression-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AngleOfElevationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/angle-of-elevation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DilationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/dilation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SphereCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/sphere-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PercentageIncreaseCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percentage-increase-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PercentageDecreaseCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percentage-decrease-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PercentageDifferenceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percentage-difference-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    Variationcalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/variation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    StandardFormTolopeInterceptForm: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/standard-form-to-slope-intercept-form`,
      method: "POST",
      body: data,
    }),
  }),
    PolygonCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/polygon-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    GoldenRatioCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/golden-ratio-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ImproperFractionsToMixedNumbers: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/improper-fractions-to-mixed-numbers`,
      method: "POST",
      body: data,
    }),
  }),
    MixedNumbersToImproperFractions: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mixed-numbers-to-improper-fractions`,
      method: "POST",
      body: data,
    }),
  }),
    LocalMaximaAndMinimaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/local-maxima-and-minima-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LcdCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/lcd-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    EquivalentFractionsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/equivalent-fractions-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    UnitRateCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/unit-rate-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ComparingFractionsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/comparing-fractions-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    TimeToDecimalCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/time-to-decimal-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PercentToDecimalCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percent-to-decimal-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DecimalToPercentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/decimal-to-percent-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    IntegerCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/integer-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MultiplicativeInverseCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/multiplicative-inverse-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    InverseModuloCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/inverse-modulo-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CombineLikeTermsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/combine-like-terms-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SolveForXCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/solve-for-x-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    InequalityCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/inequality-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MultiplyingPolynomialsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/multiplying-polynomials-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    EquationOfALineCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/equation-of-a-line-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FractionExponentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/fraction-exponent-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AmplitudeAndPeriodCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/amplitude-and-period-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ExponentialGrowthCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/exponential-growth-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PerfectSquareTrinomialCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/perfect-square-trinomial-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PowerReducingFormulaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/power-reducing-formula-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FunctionOperationsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/function-operations-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DiamondCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/diamond-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CrossMultiplyCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/cross-multiply-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AreaOfASemicircle: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/area-of-a-semicircle`,
      method: "POST",
      body: data,
    }),
  }),
    DegreeAndLeadingCoefficient: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/degree-and-leading-coefficient`,
      method: "POST",
      body: data,
    }),
  }),
    EquivalentExpressionsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/equivalent-expressions-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DescartesRuleOfSignsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/descartes-rule-of-signs-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RotationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rotation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    ReciprocalCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/reciprocal-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CofunctionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/cofunction-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AdditiveInverseCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/additive-inverse-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MonomialCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/monomial-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LongMultiplicationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/long-multiplication-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DivisibleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/divisible-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AverageValueOfFunction: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/average-value-of-function`,
      method: "POST",
      body: data,
    }),
  }),
    ProductSumCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/product-sum-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PascalsTriangleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/pascals-triangle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    OrderOfOperationsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/order-of-operations-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CharacteristicPolynomialCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/characteristic-polynomial-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    InterceptsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/intercepts-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DomainAndRangeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/domain-and-range-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DistanceBetweenTwoPointsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/distance-between-two-points-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SasTriangleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/sas-triangle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    RadiusOfACircleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/radius-of-a-circle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    EquilateralTriangleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/equilateral-triangle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PointOfIntersection: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/point-of-intersection`,
      method: "POST",
      body: data,
    }),
  }),
    ExponentialFunctionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/exponential-function-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PowerOf10Calculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/power-of-10-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SlopePercentageCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/slope-percentage-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  
    ChangeOfBaseFormulaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/change-of-base-formula-calculator`,
      method: "POST",
      body: data,
    }),

  }),
  
    CompletingTheSquareCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/completing-the-square-calculator`,
      method: "POST",
      body: data,
    }),

  }),
    CubeRootCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/cube-root-calculator`,
      method: "POST",
      body: data,
    }),

  }),
    TruncatedPyramidCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/truncated-pyramid-calculator`,
      method: "POST",
      body: data,
    }),
      }),
    VolumeOfSquare: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/volume-of-square`,
      method: "POST",
      body: data,
    }),

  }),

    MixedNumberCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mixed-number-calculator`,
      method: "POST",
      body: data,
    }),

  }),
    FractionSimplifierCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/fraction-simplifier-calculator`,
      method: "POST",
      body: data,
    }),

  }),
    SgpaToPercentageCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/sgpa-to-percentage-calculator`,
      method: "POST",
      body: data,
    }),

  }),
    HexCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/hex-calculator`,
      method: "POST",
      body: data,
    }),

  }),
  
    WeightedAverageCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/weighted-average-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  
    TestCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/test-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MarksPercentageCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/marks-percentage-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DecimalCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/decimal-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    VennDiagramCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/venn-diagram-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FundamentalCountingPrincipleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/fundamental-counting-principle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    AveragePercentageCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/average-percentage-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    FibonacciCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/fibonacci-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    TaylorSeriesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/taylor-series-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DerivativeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/derivative-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CircumcenterCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/circumcenter-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    PercentageChangeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percentage-change-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    SlopeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/slope-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    DeterminantCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/determinant-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    EigenvectorsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/eigenvectors-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    NullSpaceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/null-space-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MatrixMultiplicationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/matrix-multiplication-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    MatrixTransposeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/matrix-transpose-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    LinearIndependenceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/linear-independence-calculator`,
      method: "POST",
      body: data,
    }),
  }),

  // Math calculator
    // Health calculator

    DressSizeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/dress-size-calculator`,
      method: "POST",
      body: data,
    }),
  }),
      // Health calculator





  }),
});

export const {
     // Health calculator
     useDressSizeCalculatorMutation,
      // Health calculator
      
  // Pets Calculators start
  useGetSingleCalculatorLanguageQuery,
  useGetSingleCalculatorDetailsMutation,
  useLoveCalculatorMutation,
  useLoveCalculatorCalculationMutation,
  useDogPregnancyCalculationMutation,
  useBenadrylForDogsCalculationMutation,
  useCatCalorieCalculationMutation,
  usePuppyweightCalculationMutation,
  usePearsonAgeCalculationMutation,
  useDogAgeCalculationMutation,
  useCatAgeCalculationMutation,
  useDogCrateSizeCalculationMutation,
  useDogFoodCalculationMutation,
  // Pets Calculators end

  // TimeDate Calculators start
  useTimeCalculationMutation,
  useTimecardCalculationMutation,
  useTimespanCalculationMutation,
  useTimedurationCalculationMutation,
  useAddtimeCalculationMutation,
  useMillitarytimeCalculationMutation,
  useReadingtimeCalculationMutation,
  useElapsedtimeCalculationMutation,
  useTimeuntilCalculationMutation,
  useHoursagoCalculationMutation,
  useDateCalculationMutation,
  useBusinessdaysCalculationMutation,
  useLeadtimeCalculationMutation,
  useDatedurationCalculationMutation,
  useMonthCalculationMutation,
  useDeadlineCalculationMutation,
  useWorkingdaysCalculationMutation,
  useTodaysdateCalculationMutation,
  useBirthyearCalculationMutation,
  useDaysuntilCalculationMutation,
  useWeekCalculationMutation,
  useWeeksfromtodayCalculationMutation,
  useYearsfromtodayCalculationMutation,
  useHoursfromnowCalculationMutation,
  useYearsagoCalculationMutation,
  useWeeksagoCalculationMutation,
  useDaysagoCalculationMutation,
  useDaysleftintheyearCalculationMutation,
  useJuliansdateCalculationMutation,
  useMonthsfromnowCalculationMutation,
  useWeeksleftintheyearCalculationMutation,
  useMonthsleftintheyearCalculationMutation,
  useHowmanydaysuntilmybirthdayCalculationMutation,
  useDayssincedateCalculationMutation,
  // TimeDate Calculators end

  // MATH
  useRoundedToTheNearestCentMutation,
  useAbsoluteChangeCalculatorMutation,
  useCircumferenceToDiameterCalculatorMutation,
  useComparingDecimalsCalculatorMutation,
  useDoublingTimeCalculatorMutation,
  useFibonacciCalculatorMutation,
  useLogBase2CalculatorMutation,
  usePercentErrorCalculatorMutation,
  useVariationCalculatorMutation,
  useVolumeOfSquareMutation,
  useSquareRootCurveCalculatorMutation,
  // MATH

  // Chemistry Calculators start
  // useBoylesLawCalculatorMutation,
  // useActivationEnergyCalculatorMutation,
  // useAtomicMassCalculatorMutation,
  // useAtomsToMolesCalculatorMutation,
  // useAverageAtomicMassCalculatorMutation,
  // useBondOrderCalculatorMutation,
  // useCalorimetryCalculatorMutation,
  // useCfuCalculatorMutation,
  // useCharlesLawCalculatorMutation,
  // useChemicalEquationBalancerCalculatorMutation,
  // useCombinedGasLawCalculatorMutation,
  // useDilutionCalculatorMutation,
  // useElectronConfigurationCalculatorMutation,
  // useEmpiricalFormulaCalculatorMutation,
  // useEntropyCalculatorMutation,
  // useEquilibriumConstantCalculatorMutation,
  // useFormalChargeCalculatorMutation,
  // useGayLussacsLawCalculatorMutation,
  // useGibbsFreeEnergyCalculatorMutation,
  // useGramsToAtomsCalculatorMutation,
  // useGramsToMolesCalculatorMutation,
  // useHalfLifeCalculatorMutation,
  // useIdealGasLawCalculatorMutation,
  // useLimitingReactantCalculatorMutation,
  // useMassPercentCalculatorMutation,
  // useMlToMolesCalculatorMutation,
  // useMmollToMgDlCalculatorMutation,
  // useMolalityCalculatorMutation,
  // useMolarMassCalculatorMutation,
  // useMolarityCalculatorMutation,
  // useMoleCalculatorMutation,
  // useMoleFractionCalculatorMutation,
  // useMoleRatioCalculatorMutation,
  // useMolecularFormulaCalculatorMutation,
  // useMolesToGramsCalculatorMutation,
  // useNernstEquationCalculatorMutation,
  // usePartialPressureCalculatorMutation,
  // usePercentYieldCalculatorMutation,
  // usePhCalculatorMutation,
  // usePkaToPhCalculatorMutation,
  // usePpmCalculatorMutation,
  // useRateConstantCalculatorMutation,
  // useRedoxReactionCalculatorMutation,
  // useSolutionDilutionCalculatorMutation,
  // useStoichiometryCalculatorMutation,
  // useStpCalculatorMutation,
  // useTheoreticalYieldCalculatorMutation,
  // useTitrationCalculatorMutation,
  // useVaporPressureCalculatorMutation,
  // useLazyGetSingleCalculatorLanguageQuery,
  // useROICalculatorMutation,
  // useCostOfEquityCalculatorMutation,
  // useFIFOAndLIFOCalculatorMutation,
  // useDepreciationCalculatorMutation,
  // useNPVCalculatorMutation,
  // useCostBasisCalculatorMutation,
  // useDiscountedCashFlowCalculatorMutation,
  // useMoneyCounterCalculatorMutation,
  // useZakatCalculatorMutation,
  // useDiscountCalculatorMutation,
  // usePaybackPeriodCalculatorMutation,
  // useEmployeeCostCalculatorMutation,
  // useCPMCalculatorMutation,
  // useCAGRCalculatorMutation,

  // Chemistry Calculators start

  // Finance
  useEnterpriseValueCalculatorMutation,
  useCapRateCalculatorMutation,
  useROASCalculatorMutation,
  useCurrentRatioCalculatorMutation,
  useBasisPointCalculatorMutation,
  useEBITDACalculatorMutation,
  useOpportunityCostCalculatorMutation,
  useCashBackCalculatorMutation,
  useBetaCalculatorMutation,
  useNPSCalculatorMutation,
  useMACRSDepreciationCalculatorMutation,
  useFutureValueOfAnnuityCalculatorMutation,
  useEarningsPerShareCalculatorMutation,
  useCarDepreciationCalculatorMutation,
  usePropertyDepreciationCalculatorMutation,
  useOutTheDoorPriceCalculatorMutation,
  useSalaryCalculatorMutation,
  useOvertimeCalculatorMutation,
  usePayRaiseCalculatorMutation,
  useAGICalculatorMutation,
  useGrossIncomeCalculatorMutation,
  useTimeAndHalfCalculatorMutation,
  useLaborCostCalculatorMutation,
  useTipCalculatorMutation,
  useHourlyToSalaryCalculatorMutation,
  useSalaryToHourlyCalculatorMutation,
  useIncomeTaxCalculatorMutation,
  useStampDutyCalculatorMutation,
  useVATCalculatorMutation,
  useSalesTaxCalculatorMutation,
  usePayPalFeeCalculatorMutation,
  useReverseSalesTaxCalculatorMutation,
  useWaterBillCalculatorMutation,
  useMarginCalculatorMutation,
  useMarginOfErrorCalculatorMutation,
  useMarginalCostCalculatorMutation,
  useMaximumProfitCalculatorMutation,
  useTuroCalculatorMutation,

  useVariableCostCalculatorMutation,
  useMarginalRevenueCalculatorMutation,
  useDeadweightLossCalculatorMutation,
  useCostOfGoodsSoldCalculatorMutation,
  useContributionMarginCalculatorMutation,
  usePriceElasticityOfDemandCalculatorMutation,
  useIncomeElasticityOfDemandCalculatorMutation,
  useMpcCalculatorMutation,
  useCrossPriceElasticityCalculatorMutation,
  useBuyingPowerCalculatorMutation,
  useRentIncreaseCalculatorMutation,
  useCPCCalculatorMutation,
  useStockCalculatorMutation,
  useMarkdownCalculatorMutation,
  useCommissionCalculatorMutation,
  useDividendYieldCalculatorMutation,
  useOptionsProfitCalculatorMutation,
  usePriceCalculatorMutation,
  useSalesPercentageCalculatorMutation,
  useYoutubeRevenueCalculatorMutation,
  useCTRCalculatorMutation,
  useActualCashValueCalculatorMutation,
  useRealEstateCommissionCalculatorMutation,
  useSalvageValueCalculatorMutation,
  useBookValueCalculatorMutation,
  useWeddingBudgetCalculatorMutation,
  useRentSplitCalculatorMutation,
  useUnemploymentRateCalculatorMutation,
  useGrowthRateCalculatorMutation,
  useComparativeAdvantageCalculatorMutation,
  useGDPPerCapitaCalculatorMutation,
  useGDPCalculatorMutation,
  useMarkupCalculatorMutation,
  useWaccCalculatorMutation,
  useCapmCalculatorMutation,
  useBondPriceCalculatorMutation,
  useNetWorthCalculatorMutation,
  useArvCalculatorMutation,
  useConsumerSurplusCalculatorMutation,
  useEbitCalculatorMutation,
  // health
  useA1cCalculatorMutation,
  useBunCreatinineRatioCalculatorMutation,
  useGramsToCaloriesCalculatorMutation,
  useIncidenceRateCalculatorMutation,
  useItRatioCalculatorMutation,
  useLdlCalculatorMutation,
  useMapCalculatorMutation,
  useMaxHeartRateCalculatorMutation,
  useOneRepMaxCalculatorMutation,
  usePackYearCalculatorMutation,
  useRuckingCalorieCalculatorMutation,
  useTacoBarCalculatorMutation,
  useWaterIntakeCalculatorMutation,
  useSvrCalculatorMutation,
  useWaistToHipRatioCalculatorMutation,
  useBodyShapeCalculatorMutation,
  useBraSizeCalculatorMutation,
  useJumpRopeCalorieCalculatorMutation,
  useStepsToMilesCalculatorMutation,
  useArmyBodyFatCalculatorMutation,
  useBenchPressCalculatorMutation,
  useIdealWeightCalculatorMutation,
  useWaistToHeightRatioCalculatorMutation,
  useCaloriesBurnedBikingCalculatorMutation,
  useFatBurningHeartRateMutation,
  useLeanBodyMassCalculatorMutation,
  useFfmiCalculatorMutation,
  useIpptCalculatorMutation,
  useStepsToCaloriesCalculatorMutation,
  useTreadmillCalorieCalculatorMutation,
  useEllipticalCalorieCalculatorMutation,
  useAdjustedBodyWeightCalculatorMutation,
  useTargetHeartRateCalculatorMutation,
  useAcftCalculatorMutation,
  useSwimmingCalorieCalculatorMutation,
  useRmrCalculatorMutation,
  useWeightLossPercentageCalculatorMutation,
  useWeightWatchersPointsCalculatorMutation,
  useBmrCalculatorMutation,
  useHarrisBenedictCalculatorMutation,
  useEerCalculatorMutation,
  useProteinCalculatorMutation,
  useBreastfeedingCalorieCalculatorMutation,
  useFoodCostCalculatorMutation,
  useNetCarbsCalculatorMutation,
  useMealCalorieCalculatorMutation,
  useOvulationCalculatorMutation,
  useHcgCalculatorMutation,
  useImplantationCalculatorMutation,
  useSixminuteWalkTestMutation,
  useAncCalculatorMutation,
  useCentorScoreCalculatorMutation,
  useMelatoninDosageCalculatorMutation,
  useTinettiCalculatorMutation,
  useCholesterolRatioCalculatorMutation,
  useStrokeVolumeCalculatorMutation,
  useBsaCalculatorMutation,
  useAlcCalculatorMutation,
  useChildPughCalculatorMutation,
  useProstateVolumeCalculatorMutation,
  useDripRateCalculatorMutation,
  useParacetamolDosageCalculatorMutation,
  useNntCalculatorMutation,
  useUrineOutputCalculatorMutation,
  useDrugHalfLifeCalculatorMutation,
  useCorrectedCalciumCalculatorMutation,
  useReticulocyteCountCalculatorMutation,
  useDosageCalculatorMutation,
  useAmoxicillinPediatricDosageCalculatorMutation,
  useAstAltRatioCalculatorMutation,
  useBishopScoreCalculatorMutation,
  useCarboplatinCalculatorMutation,
  useBloodTypeCalculatorMutation,
  useDihybridCrossCalculatorMutation,
  useAlleleFrequencyCalculatorMutation,
  useHeightPercentileCalculatorMutation,
  useBiologicalAgeCalculatorMutation,
  useWilksCalculatorMutation,
  useVo2MaxCalculatorMutation,
  useApftCalculatorMutation,
  useWalkingCalorieCalculatorMutation,
  useNavyBodyFatCalculatorMutation,
  usePaceCalculatorMutation,
  useHeightCalculatorMutation,
  useBodyFatPercentageCalculatorMutation,
  useWeightlossCalculatorMutation,
  useMealPlannerMutation,
  useMacroCalculatorMutation,
  useMaintenanceCalorieCalculatorMutation,
  useTdeeCalculatorMutation,
  useBulkingCalculatorMutation,
  useCalorieDeficitCalculatorMutation,
  useWeightGainCalculatorMutation,
  usePregnancyCalculatorMutation,
  usePediatricDoseCalculatorMutation,
  useUogGpaCalculatorMutation,

  // every day
  useVisaChanceCalculatorMutation,
  useSleepCalculatorMutation,
  useDistanceCalculatorMutation,
  useFreightClassCalculatorMutation,
  useTravelTimeCalculatorMutation,
  useTeslaChargingCalculatorMutation,
  useFuelCostCalculatorMutation,
  useCostPerMileDrivingCalculatorMutation,
  useDriveTimeCalculatorMutation,
  useMpgCalculatorMutation,
  useGasCalculatorMutation,
  useAspectRatioCalculatorMutation,
  useRingSizeCalculatorMutation,
  useCurtainSizeCalculatorMutation,
  useTaperCalculatorMutation,
  useCbmCalculatorMutation,
  useTireSizeCalculatorMutation,
  useBoardFootCalculatorMutation,
  useShoeSizeCalculatorMutation,
  useTvSizeCalculatorMutation,
  useScreenSizeCalculatorMutation,
  useBikeSizeCalculatorMutation,
  useDeskHeightCalculatorMutation,
  usePantSizeCalculatorMutation,
  useCeilingFanSizeCalculatorMutation,
  useRecessedLightingCalculatorMutation,
  useBlindSizeCalculatorMutation,
  useDilutionCalculatorMutation,
  useTurkeySizeCalculatorMutation,
  useMoistureContentCalculatorMutation,
  useWaterWeightCalculatorMutation,
  useEdpiCalculatorMutation,
  useDrawLengthCalculatorMutation,
  useMagicNumberCalculatorMutation,
  useBattingAverageCalculatorMutation,
  useWinningPercentageCalculatorMutation,
  useOnBasePercentageCalculatorMutation,
  useDunkCalculatorMutation,
  useBowlingCcoreCalculatorMutation,
  useKdCalculatorMutation,
  useSluggingPercentageCalculatorMutation,
  usePointBuyCalculatorMutation,
  useAgeCalculatorMutation,
  useSobrietyCalculatorMutation,
  useHalfBirthdayCalculatorMutation,
  useAgeDifferenceCalculatorMutation,
  useHouseAgeCalculatorMutation,
  useAnniversaryCalculatorMutation,
  useKoreanAgeCalculatorMutation,
  useBirthdayCalculatorMutation,
  useHourlyPayCalculatorMutation,
  usePopulationDensityCalculatorMutation,
  useShadedAreaCalculatorMutation,
  usePlantSpacingCalculatorMutation,
  useMcgToMgCalculatorMutation,
  useMagnificationCalculatorMutation,
  useYardsToTonsCalculatorMutation,
  useStairCalculatorMutation,
  useWordsperminuteCalculatorMutation,
  useSemestergradeCalculatorMutation,
  useAveragetimeCalculatorMutation,
  useProratedrentCalculatorMutation,
  useLawnmowingCostCalculatorMutation,
  useGoldCostPerPoundCalculatorMutation,
  useSplitbillCalculatorMutation,
  useEngineHoursToMilesCalculatorMutation,
  useBoxFillCalculatorMutation,
  useBatteryLifeCalculatorMutation,
  useTonnageCalculatorMutation,
  useCfmCalculatorMutation,
  useAcBtuCalculatorMutation,
  useNetherPortalCalculatorMutation,
  useVoriciChromaticCalculatorMutation,
  useRiverRockCalculatorMutation,
  useCircleSkirtCalculatorMutation,
  useFabricCalculatorMutation,
  useEraCalculatorMutation,
  useDownloadCalculatorMutation,
  useDataFransferCalculatorMutation,
  useCompressionHeightCalculatorMutation,
  useDilutionRatioCalculatorMutation,
  useGpmCalculatorMutation,
  useBotoxCostCalculatorMutation,
  useLogWeightCalculatorMutation,
  useAquariumCalculatorMutation,


  
  // Statistics  Calculators start
  useProbabilityCalculatorMutation,
  useCoefficientOfVariationCalculatorMutation,
  useCovarianceCalculatorMutation,
  useEmpiricalRuleCalculatorMutation,
  useMeanMedianModeRangeCalculatorMutation,
  useQuartileCalculatorMutation,
  useGeometricMeanCalculatorMutation,
  useHarmonicMeanCalculatorMutation,
  useInterquartileRangeCalculatorMutation,
  useSumOfSquaresCalculatorMutation,
  useStandardErrorCalculatorMutation,
  useExpectedValueCalculatorMutation,
  useMadCalculatorMutation,
  useCombinationCalculatorMutation,
  usePermutationCalculatorMutation,
  useStandardDeviationCalculatorMutation,
  useFiveNumberSummaryCalculatorMutation,
  useConfidenceIntervalCalculatorMutation,
  useCentralLimitTheoremCalculatorMutation,
  useCoefficientOfDeterminationCalculatorMutation,
  usePointEstimateCalculatorMutation,
  useVarianceCalculatorMutation,
  useRelativeFrequencyCalculatorMutation,
  usePoissonDistributionCalculatorMutation,
  useBinomialDistributionCalculatorMutation,
  useInvnormCalculatorMutation,
  useLinearRegressionCalculatorMutation,
  useOutlierCalculatorMutation,
  useQuadraticRegressionCalculatorMutation,
  usePercentileCalculatorMutation,
  useStemLeafPlotCalculatorMutation,
  useShannonDiversityIndexCalculatorMutation,
  useDegreesOfFreedomCalculatorMutation,
  useMidrangeCalculatorMutation,
  useRsdCalculatorMutation,
  useChebyshevsTheoremCalculatorMutation,
  useBoxPlotCalculatorMutation,
  useBinomialCoefficientCalculatorMutation,
  usePercentileRankCalculatorMutation,
  useCoinFlipCalculatorMutation,
  useEmpiricalProbabilityCalculatorMutation,
  useRawScoreCalculatorMutation,
  useSseCalculatorMutation,
  usePredictionIntervalCalculatorMutation,
  useResidualCalculatorMutation,
  useScatterPlotMakerMutation,
  useResidualPlotCalculatorMutation,
  useClassWidthCalculatorMutation,
  useRelativeRiskCalculatorMutation,
  useErrorPropagationCalculatorMutation,
  useChiSquareCalculatorMutation,
  usePieChartCalculatorMutation,
  useAccuracyCalculatorMutation,
  usePHatCalculatorMutation,
  useZScoreToPercentileMutation,
  useSampleSizeCalculatorMutation,

    // Statistics  Calculators start

  
  // Chemistry Calculators start
  useBoylesLawCalculatorMutation,
  useActivationEnergyCalculatorMutation,
  useAtomicMassCalculatorMutation,
  useAtomsToMolesCalculatorMutation,
  useAverageAtomicMassCalculatorMutation,
  useBondOrderCalculatorMutation,
  useCalorimetryCalculatorMutation,
  useCfuCalculatorMutation,
  useCharlesLawCalculatorMutation,
  useChemicalEquationBalancerCalculatorMutation,
  useCombinedGasLawCalculatorMutation,
  useElectronConfigurationCalculatorMutation,
  useEmpiricalFormulaCalculatorMutation,
  useEntropyCalculatorMutation,
  useEquilibriumConstantCalculatorMutation,
  useFormalChargeCalculatorMutation,
  useGayLussacsLawCalculatorMutation,
  useGibbsFreeEnergyCalculatorMutation,
  useGramsToAtomsCalculatorMutation,
  useGramsToMolesCalculatorMutation,
  useHalfLifeCalculatorMutation,
  useIdealGasLawCalculatorMutation,
  useLazyGetSingleCalculatorLanguageQuery,
  useLimitingReactantCalculatorMutation,
  useMassPercentCalculatorMutation,
  useMlToMolesCalculatorMutation,
  useMmollToMgDlCalculatorMutation,
  useMolalityCalculatorMutation,
  useMolarMassCalculatorMutation,
  useMolarityCalculatorMutation,
  useMoleCalculatorMutation,
  useMoleFractionCalculatorMutation,
  useMoleRatioCalculatorMutation,
  useMolecularFormulaCalculatorMutation,
  useMolesToGramsCalculatorMutation,
  useNernstEquationCalculatorMutation,
  usePartialPressureCalculatorMutation,
  usePercentYieldCalculatorMutation,
  usePhCalculatorMutation,
  usePkaToPhCalculatorMutation,
  usePpmCalculatorMutation,
  useRateConstantCalculatorMutation,
  useRedoxReactionCalculatorMutation,
  useSolutionDilutionCalculatorMutation,
  useStoichiometryCalculatorMutation,
  useStpCalculatorMutation,
  useTheoreticalYieldCalculatorMutation,
  useTitrationCalculatorMutation,
  useVaporPressureCalculatorMutation,
  useROICalculatorMutation,
  useCostOfEquityCalculatorMutation,
  useFIFOAndLIFOCalculatorMutation,
  useDepreciationCalculatorMutation,
  useNPVCalculatorMutation,
  useCostBasisCalculatorMutation,
  useDiscountedCashFlowCalculatorMutation,
  useMoneyCounterCalculatorMutation,
  useZakatCalculatorMutation,
  useDiscountCalculatorMutation,
  usePaybackPeriodCalculatorMutation,
  useEmployeeCostCalculatorMutation,
  useCPMCalculatorMutation,
  useCAGRCalculatorMutation,


  // Chemistry Calculators start


   // Physics calculator
   useCrossProductCalculatorMutation,
   useInstantaneousVelocityCalculatorMutation,
   useHorsepowerCalculatorMutation,
   usePhotonEnergyCalculatorMutation,
   useDotProductCalculatorMutation,
   useVectorMagnitudeCalculatorMutation,
   useProjectileMotionCalculatorMutation,
   usePotentialEnergyCalculatorMutation,
   useWavelengthCalculatorMutation,
   useSpringConstantCalculatorMutation,
   useDewPointCalculatorMutation,
   useWetBulbCalculatorMutation,
   usePowerToWeightRatioCalculatorMutation,
   useConstantOfProportionalityCalculatorMutation,
   useFrictionCalculatorMutation,
   useEscapeVelocityCalculatorMutation,
   useGravityCalculatorMutation,
   useArrowSpeedCalculatorMutation,
   useAngularAccelerationCalculatorMutation,
   useElectricityCostCalculatorMutation,
   useAirDensityCalculatorMutation,
   useTimeOfFlightCalculatorMutation,
   useFrictionalForceCalculatorMutation,
   useQuantumNumberCalculatorMutation,
   useMechanicalEnergyCalculatorMutation,
   useIndexOfRefractionCalculatorMutation,
   useSnellsLawCalculatorMutation,
   useCcToHpCalculatorMutation,
   useWhpToHpCalculatorMutation,
   useAverageSpeedCalculatorMutation,
   useDbmToWattsMutation,
   useCapacitanceCalculatorMutation,
   useAngleOfDeviationCalculatorMutation,
   useElectricPotentialCalculatorMutation,
   useWavePeriodCalculatorMutation,
  useAngleOfRefractionCalculatorMutation,
  useJouleCalculatorMutation,
  useEfficiencyCalculatorMutation,
  useVoltsToJoulesCalculatorMutation,
  useBuoyancyCalculatorMutation,
  useFpeCalculatorMutation,
  useWattCalculatorMutation,
  useRelativeHumidityCalculatorMutation,
  useFrictionLossCalculatorMutation,
  useTimeDilationCalculatorMutation,
  useEnergyCostCalculatorMutation,
  useOrbitalPeriodCalculatorMutation,
  useNewtonsLawOfCoolingCalculatorMutation,
  useWattHourCalculatorMutation,
  useSpeedOfSoundCalculatorMutation,
  useSpecificGravityCalculatorMutation,
  useDensityAltitudeCalculatorMutation,
  useAverageVelocityCalculatorMutation,
  useAmpHourCalculatorMutation,
  useWattsToAmpsCalculatorMutation,
  useAmpsToWattsCalculatorMutation,
  useWaveSpeedCalculatorMutation,
  useElectricFluxCalculatorMutation,
  useResultantForceCalculatorMutation,
  useParallelResistorCalculatorMutation,
  useTerminalVelocityCalculatorMutation,


  
    // Math calculator
    useLinearIndependenceCalculatorMutation,
    useMatrixTransposeCalculatorMutation,
    useMatrixMultiplicationCalculatorMutation,
    useNullSpaceCalculatorMutation,
    useEigenvectorsCalculatorMutation,
    useDeterminantCalculatorMutation,
    useSlopeCalculatorMutation,
    usePercentageChangeCalculatorMutation,
    useCircumcenterCalculatorMutation,
    useDerivativeCalculatorMutation,
    useTaylorSeriesCalculatorMutation,
    useAveragePercentageCalculatorMutation,
    useFundamentalCountingPrincipleCalculatorMutation,
    useVennDiagramCalculatorMutation,
    useDecimalCalculatorMutation,
    useMarksPercentageCalculatorMutation,
    useTestCalculatorMutation,
    useWeightedAverageCalculatorMutation,
    useHexCalculatorMutation,
    useSgpaToPercentageCalculatorMutation,
    useFractionSimplifierCalculatorMutation,
    useMixedNumberCalculatorMutation,
    useTruncatedPyramidCalculatorMutation,
    useCubeRootCalculatorMutation,
    useCompletingTheSquareCalculatorMutation,
    useChangeOfBaseFormulaCalculatorMutation,
    useSlopePercentageCalculatorMutation,
    useSquareRootCalculatorMutation,
    usePowerOf10CalculatorMutation,
    useExponentialFunctionCalculatorMutation,
    usePointOfIntersectionMutation,
    useEquilateralTriangleCalculatorMutation,
    useRadiusOfACircleCalculatorMutation,
    useSasTriangleCalculatorMutation,
    useDistanceBetweenTwoPointsCalculatorMutation,
    useDomainAndRangeCalculatorMutation,
    useInterceptsCalculatorMutation,
    useCharacteristicPolynomialCalculatorMutation,
    useOrderOfOperationsCalculatorMutation,
    usePascalsTriangleCalculatorMutation,
    useProductSumCalculatorMutation,
    useAverageValueOfFunctionMutation,
    useDivisibleCalculatorMutation,
    useLongMultiplicationCalculatorMutation,
    useMonomialCalculatorMutation,
    useAdditiveInverseCalculatorMutation,
    useCofunctionCalculatorMutation,
    useReciprocalCalculatorMutation,
    useRotationCalculatorMutation,
    useDescartesRuleOfSignsCalculatorMutation,
    useEquivalentExpressionsCalculatorMutation,
    useDegreeAndLeadingCoefficientMutation,
    useAreaOfASemicircleMutation,
    useCrossMultiplyCalculatorMutation,
    useDiamondCalculatorMutation,
    useFunctionOperationsCalculatorMutation,
    usePowerReducingFormulaCalculatorMutation,
    usePerfectSquareTrinomialCalculatorMutation,
    useExponentialGrowthCalculatorMutation,
    useAmplitudeAndPeriodCalculatorMutation,
    useFractionExponentCalculatorMutation,
    useEquationOfALineCalculatorMutation,
    useMultiplyingPolynomialsCalculatorMutation,
    useInequalityCalculatorMutation,
    useSolveForXCalculatorMutation,
    useCombineLikeTermsCalculatorMutation,
    useInverseModuloCalculatorMutation,
    useMultiplicativeInverseCalculatorMutation,
    useIntegerCalculatorMutation,
    useDecimalToPercentCalculatorMutation,
    usePercentToDecimalCalculatorMutation,
    useTimeToDecimalCalculatorMutation,
    useComparingFractionsCalculatorMutation,
    useUnitRateCalculatorMutation,
    useEquivalentFractionsCalculatorMutation,
    useLcdCalculatorMutation,
    useLocalMaximaAndMinimaCalculatorMutation,
    useMixedNumbersToImproperFractionsMutation,
    useImproperFractionsToMixedNumbersMutation,
    useGoldenRatioCalculatorMutation,
    usePolygonCalculatorMutation,
    useStandardFormTolopeInterceptFormMutation,
    useVariationcalculatorMutation,
    usePercentageDifferenceCalculatorMutation,
    usePercentageDecreaseCalculatorMutation,
    usePercentageIncreaseCalculatorMutation,
    useSphereCalculatorMutation,
    useDilationCalculatorMutation,
    useAngleOfElevationCalculatorMutation,
    useRationalExpressionCalculatorMutation,
    useLeastToGreatestCalculatorMutation,
    useDivergenceCalculatorMutation,
    useFourierSeriesCalculatorMutation,
    useImproperIntegralCalculatorMutation,
    useSaddlePointCalculatorMutation,
    useCurlCalculatorMutation,
    useSimpsonsRuleCalculatorMutation,
    usePowerSeriesCalculatorMutation,
    useRadiusOfConvergenceCalculatorMutation,
    usePolynomialLongDivisionCalculatorMutation,
    useOrthocenterCalculatorMutation,
    useProductRuleDerivativeCalculatorMutation,
    useSyntheticDivisionCalculatorMutation,
    useEvenOddFunctionCalculatorMutation,
    useTruthTableCalculatorMutation,
    useGeometricSequenceCalculatorMutation,
    useZerosCalculatorMutation,
    useTripleIntegralCalculatorMutation,
    useDoubleIntegralCalculatorMutation,
    useSecondDerivativeCalculatorMutation,
    useAreaUnderTheCurveCalculatorMutation,
    useAbsoluteValueCalculatorMutation,
    usePartialDerivativeCalculatorMutation,
    useCriticalPointsCalculatorMutation,
    useImplicitDifferentiationCalculatorMutation,
    useShellMethodCalculatorMutation,
    useWasherMethodCalculatorMutation,
    useHyperbolaCalculatorMutation,
    useJacobianCalculatorMutation,
    useConvolutionCalculatorMutation,
    usePolarCoordinatesCalculatorMutation,
    useSummationCalculatorMutation,
    useInverseLaplaceTransformCalculatorMutation,
    useWronskianCalculatorMutation,
    useComplexNumberCalculatorMutation,
    useDifferenceQuotientCalculatorMutation,
    useMaclaurinSeriesCalculatorMutation,
    useSubsetCalculatorMutation,
    useMidpointRuleCalculatorMutation,
    useVertexFormCalculatorMutation,
    useGradientCalculatorMutation,
    usePowerSetCalculatorMutation,
    useRemainderTheoremCalculatorMutation,
    useUnitTangentVectorCalculatorMutation,
    useFoilCalculatorMutation,
    useTrapezoidalRuleCalculatorMutation,
    useNewtonsMethodCalculatorMutation,
    useHalfAngleCalculatorMutation,
    useMeanValueTheoremCalculatorMutation,
    useRiemannSumCalculatorMutation,
    useDoubleAngleCalculatorMutation,
    useInverseFunctionCalculatorMutation,
    useArithmeticSequencesCalculatorMutation,
    useCoterminalAngleCalculatorMutation,
    useCompositeFunctionCalculatorMutation,
    useParallelAndPerpendicularCalculatorMutation,
    useECalculatorMutation,
    useAreaBetweenTwoCurvesCalculatorMutation,
    useCotangentCalculatorMutation,
    useCscCalculatorMutation,
    useSecantCalculatorMutation,
    useTangentCalculatorMutation,
    useCosineCalculatorMutation,
    useArctanCalculatorMutation,
    useArccosCalculatorMutation,
    useSineCalculatorMutation,
    useBinomialTheoremCalculatorMutation,
    useArcsinCalculatorMutation,
    useArcLengthCalculatorMutation,
    useInflectionPointCalculatorMutation,
    useLaplaceTransformCalculatorMutation,
    useUnitCircleCalculatorMutation,
    usePythagoreanTheoremCalculatorMutation,
    useLinearInterpolationCalculatorMutation,
    useProportionCalculatorMutation,
    useBinaryCalculatorMutation,
    useExponentCalculatorMutation,
  useSlopeInterceptFormCalculatorMutation,
  useEndpointCalculatorMutation,
  useDiscriminantCalculatorMutation,
  useHemisphereCalculatorMutation,
  usePointSlopeFormCalculatorMutation,
  useMillionBillionLakhCroreMutation,
  useScientificNotationCalculatorMutation,
  useLimitCalculatorMutation,
  usePrimeFactorizationCalculatorMutation,
  useModuloCalculatorMutation,
  useMidpointCalculatorMutation,
  useLongAdditionCalculatorMutation,
  useStandardFormCalculatorMutation,
  useAverageCalculatorMutation,
  useLogAntilogCalculatorMutation,
  useCentroidTriangleCalculatorMutation,
  useRemainderCalculatorMutation,
  useQuadraticFormulaCalculatorMutation,
  useRoundingNumbersCalculatorMutation,
  useFractionToDecimalCalculatorMutation,
  useDecimalToFractionCalculatorMutation,
  useFractionToPercentCalculatorMutation,
  usePercentToFractionCalculatorMutation,
  useGramSchmidtCalculatorMutation,

    // Math calculator



} = calculatorApi;
