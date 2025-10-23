import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { datetimeBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const dateCalculatorApi = createApi({
  reducerPath: "dateCalculatorApi",
  baseQuery: datetimeBaseQueryWithoutToken,
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
    loveCalculatorCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/love-calculator`,
        method: "POST",
        body: data,
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
    daysfromtodayCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/days-from-today`,
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
    EbitCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ebit-calculator`,
        method: "POST",
        body: data,
      }),
    }),

    // health
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
    weeksLeftInTheYearCalculation: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weeks-left-in-the-year`,
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
        url: `/calculators-lol/one-rep-max-calculator"`,
        method: "POST",
        body: data,
      }),
    }),
    OneRepMaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/one-rep-max-calculator"`,
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


    MACRSDepreciationCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/macrs-depreciation-calculator`,
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


    IntegralCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/integral-calculator`,
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
    MonthlyIncomeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/monthly-income-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    VaDisabilityCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/va-disability-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tax-calculator`,
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
    CagrCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cagr-calculator`,
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
    DiscountCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/discount-calculator`,
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
    WeeksBetweenDatesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weeks-between-dates-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TimeCardAdvanceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/time-card-advance-calculator`,
        method: "POST",
        body: data,
      }),
    }),


    // health start 
    BMICalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/bmi-calculator`,
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

    IpptCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ippt-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    ACFTCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/acft-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    Eercalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/eer-calculator`,
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
    BabyWeightPercentileCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weight-percentile-calculator`,
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
    StrokeVolumeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stroke-volume-calculator`,
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
    HeightPercentileCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/height-percentile-calculator`,
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
    VO2MaxCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/vo2-max-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    APFTCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/apft-calculator`,
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
    PaceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pace-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    HeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/height-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    BodyFatCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/body-fat-percentage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    WeightLossCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/weightloss-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    TDEECalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tdee-calculator`,
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
   // everyday
   SleepCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/sleep-calculator`,
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
   TravelTimeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/travel-time-calculator`,
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
   MpgCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/mpg-calculator`,
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
   AgeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/age-calculator`,
        method: "POST",
        body: data,
      }),
    }),
   PpiCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ppi-calculator`,
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
   SobrietyCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/sobriety-calculator`,
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
   BirthdayCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/birthday-calculator`,
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
   PantSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pant-size-calculator`,
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
   PlantSpacingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/plant-spacing-calculator`,
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
   StairCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stair-calculator`,
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
   AquariumCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/aquarium-calculator`,
        method: "POST",
        body: data,
      }),
    }),
   AverageTimeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/average-time-calculator`,
        method: "POST",
        body: data,
      }),
    }),
   HowManyWordsCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/how-many-words-calculator`,
        method: "POST",
        body: data,
      }),
    }),
   HowManyPagesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/how-many-pages-calculator`,
        method: "POST",
        body: data,
      }),
    }),
    
    // Construction Calculators

      CubicFeetCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cubic-feet-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      SquareInchesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/square-inches-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      CubicYardCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cubic-yard-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      RoomSizeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/room-size-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      FeetAndInchesCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/feet-and-inches-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      CarpetCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/carpet-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      WallpaperCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/wallpaper-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      SquareYardsCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/square-yards-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      SquareFootageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/square-footage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      SquareMeterCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/square-meter-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      RebarCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/rebar-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      MulchCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/mulch-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      ConcreteCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/concrete-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      SodCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/sod-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      SandCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/sand-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      TopsoilCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/topsoil-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      GravelCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/gravel-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      AsphaltCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/asphalt-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      PipeVolumeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/pipe-volume-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      CylinderVolumeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/cylinder-volume-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      TankVolumeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tank-volume-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      RoofPitchCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/roof-pitch-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      PricePerSquareFootCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/price-per-square-foot-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      BrickCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/brick-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      ConcreteBlockCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/concrete-block-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      DeckingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/decking-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      FenceCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/fence-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      StudCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stud-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      AcreageCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/acreage-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      MaterialCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/material-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      MetalRoofCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/metal-roof-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      FramingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/framing-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      SonotubeCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/sonotube-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      TileCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/tile-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      RampCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ramp-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      MsPlateWeightCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/ms-plate-weight-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      RetainingWallCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/retaining-wall-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      RoofReplacementCostCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/roof-replacement-cost-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      RoofingCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/roofing-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      PaverCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/paver-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      FlooringCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/flooring-calculator`,
        method: "POST",
        body: data,
      }),
    }),
      StoneCalculator: builder.mutation({
      query: (data) => ({
        url: `/calculators-lol/stone-calculator`,
        method: "POST",
        body: data,
      }),
    }),

  // chemistry
    IdealGasLawCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ideal-gas-law-calculator`,
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
    PartialPressureCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/partial-pressure-calculator`,
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
    PhCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ph-calculator`,
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
    CombinedGasLawCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/combined-gas-law-calculator`,
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
    MassPercentCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/mass-percent-calculator`,
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
    RateConstantCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rate-constant-calculator`,
      method: "POST",
      body: data,
    }),
  }),

   // Statistics  Calculators start
    HypergeometricCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/hypergeometric-calculator`,
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
    CorrelationCoefficientCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/correlation-coefficient-calculator`,
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
    PValueCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/p-value-calculator`,
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
    DecileCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/decile-calculator`,
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
    PooledVarianceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/pooled-variance-calculator`,
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
    NormalDistributionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/normal-distribution-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    CriticalValueCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/critical-value-calculator`,
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
    AnovaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/anova-calculator`,
      method: "POST",
      body: data,
    }),
  }),


  
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


// math

  FractionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/order-calculator`, //fraction-calculator
      method: "POST",
      body: data,
    }),
  }),
  PercentageCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/percentage-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  CircumferenceCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/circumference-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  LcmCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/lcm-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  GcfCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gcf-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  FactorialCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/factorial-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  RatioCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ratio-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  IntervalNotationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/interval-notation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  FactoringCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/factoring-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  LinearApproximationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/linear-approximation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  AverageRateOfChangeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/average-rate-of-change-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  EulersMethodCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/eulers-method-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  TriangleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/triangle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  TangentPlaneCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/tangent-plane-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  AxisOfSymmetryCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/axis-of-symmetry-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  DistributivePropertyCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/distributive-property-calculator`,
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
  AreaOfASectorCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/area-of-a-sector-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  ReferenceAngleCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/reference-angle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  RationalOrIrrationalCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rational-or-irrational-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  RatioToFractionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ratio-to-fraction-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  ThirtySixtyNinetyCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/30-60-90-triangle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  LiteralEquationsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/literal-equations-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  PerimeterCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/perimeter-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  ParallelogramCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/parallelogram-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  SimplifyRadicalsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/simplify-radicals-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  EllipseEquationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ellipse-equation-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  RrefCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rref-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  AreaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/area-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  VolumeOfTriangularPyramid: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/volume-of-triangular-pyramid`,
      method: "POST",
      body: data,
    }),
  }),
  TrigonometryCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/trigonometry-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  SohcahtoaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/sohcahtoa-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  FortyFiveFortyFiveNinetyCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/45-45-90-triangle-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  ParabolaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/parabola-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  TwosComplementCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/twos-complement-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    
  OnesComplementCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/ones-complement-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  TangentLineCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/tangent-line-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  HypotenuseCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/hypotenuse-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  LawOfSinesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/law-of-sines-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  LawOfCosinesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/law-of-cosines-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  AngleBetweenTwoVectorsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/angle-between-two-vectors-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  DirectionalDerivativeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/directional-derivative-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  EquationOfACircle: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/equation-of-a-circle`,
      method: "POST",
      body: data,
    }),
  }),
  SubstitutionMethodCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/substitution-method-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  SystemOfEquationsCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/system-of-equations-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  VectorAdditionCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/vector-addition-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  GaussSeidelCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gauss-seidel-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  RationalizeTheDenominatorCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rationalize-the-denominator-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  LengthOfCurveCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/length-of-curve-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  DiagonalCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/diagonal-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  RationalZerosCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/rational-zeros-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  ElementaryMatrixCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/elementary-matrix-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  SimilarTrianglesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/similar-triangles-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  VolumeOfARectangle: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/volume-of-a-rectangle`,
      method: "POST",
      body: data,
    }),
  }),
  ConicalFrustumVolumeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/conical-frustum-volume-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  DistanceFormulaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/distance-formula-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  VolumeOfCapsule: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/volume-of-capsule`,
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

  
  BussinessDaysCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/bussiness-days-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  GramSchmidtCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gram-schmidt-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  AugmentedMatrixCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/augmented-matrix-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  GaussianEliminationCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gaussian-elimination-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  EigenvaluesCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/eigenvalues-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  InverseMatrixCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/inverse-matrix-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  GematriaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/gematria-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  BaseCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/base-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  VolumeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/volume-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  SurfaceAreaCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/surface-area-calculator`,
      method: "POST",
      body: data,
    }),
  }),
  FinalGradeCalculator: builder.mutation({
    query: (data) => ({
      url: `/calculators-lol/final-grade-calculator`,
      method: "POST",
      body: data,
    }),
  }),
    




  }),
});




export const {

   useFinalGradeCalculatorMutation,
  useSurfaceAreaCalculatorMutation,
  useVolumeCalculatorMutation,
  useBaseCalculatorMutation,
  useGematriaCalculatorMutation,
  useInverseMatrixCalculatorMutation,
  useEigenvaluesCalculatorMutation,
  useGaussianEliminationCalculatorMutation,
  useAugmentedMatrixCalculatorMutation,
  useGramSchmidtCalculatorMutation,

  
  // Pets Calculators start
  useGetSingleCalculatorLanguageQuery,
  useGetSingleCalculatorDetailsMutation,
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
  useDaysfromtodayCalculationMutation,
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
   useWeeksBetweenDatesCalculatorMutation,
    useTimeCardAdvanceCalculatorMutation,
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
    useIntegralCalculatorMutation,
  // Finance
  useEbitCalculatorMutation,
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
   useSalaryCalculatorMutation,
   useGrossIncomeCalculatorMutation,
   useMonthlyIncomeCalculatorMutation,
   useVaDisabilityCalculatorMutation,
   useTaxCalculatorMutation,
   useDepreciationCalculatorMutation,
   useCagrCalculatorMutation,
   useDiscountedCashFlowCalculatorMutation,
   useDiscountCalculatorMutation,
   useMoneyCounterCalculatorMutation,
  useWeeksLeftInTheYearCalculationMutation,
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
  useSvrCalculatorMutation,
  useTacoBarCalculatorMutation,
  useWaterIntakeCalculatorMutation,
  useBMICalculatorMutation,
  useJumpRopeCalorieCalculatorMutation,
  useIpptCalculatorMutation,
  useACFTCalculatorMutation,
  useEercalculatorMutation,
  useOvulationCalculatorMutation,
  useBabyWeightPercentileCalculatorMutation,
  usePregnancyWeightGainCalculatorMutation,
  useStrokeVolumeCalculatorMutation,
  useCarboplatinCalculatorMutation,
  useHeightPercentileCalculatorMutation,
  useBiologicalAgeCalculatorMutation,
  useVO2MaxCalculatorMutation,
  useAPFTCalculatorMutation,
  useNavyBodyFatCalculatorMutation,
  usePaceCalculatorMutation,
  useHeightCalculatorMutation,
  useBodyFatCalculatorMutation,
  useWeightLossCalculatorMutation,
  useTDEECalculatorMutation,
  useCalorieDeficitCalculatorMutation,

    // every day
    useSleepCalculatorMutation,
    useFreightClassCalculatorMutation,
    useTravelTimeCalculatorMutation,
    useDriveTimeCalculatorMutation,
    useGasCalculatorMutation,
    useMpgCalculatorMutation,
    useAgeCalculatorMutation,
    usePpiCalculatorMutation,
    useAgeDifferenceCalculatorMutation,
    useSobrietyCalculatorMutation,
    useHouseAgeCalculatorMutation,
    useBirthdayCalculatorMutation,
    useHalfBirthdayCalculatorMutation,
    usePantSizeCalculatorMutation,
    useAnniversaryCalculatorMutation,
    usePlantSpacingCalculatorMutation,
    usePointBuyCalculatorMutation,
    useStairCalculatorMutation,
    useBattingAverageCalculatorMutation,
    useAquariumCalculatorMutation,
    useAverageTimeCalculatorMutation,
    useHowManyPagesCalculatorMutation,
    useHowManyWordsCalculatorMutation,

    
    // Construction Calculators
    useRoofPitchCalculatorMutation,
    useCubicFeetCalculatorMutation,
    useFeetAndInchesCalculatorMutation,
    useAcreageCalculatorMutation,
    useRebarCalculatorMutation,
    usePipeVolumeCalculatorMutation,
    useMsPlateWeightCalculatorMutation,
    usePricePerSquareFootCalculatorMutation,
    useMaterialCalculatorMutation,
    useRetainingWallCalculatorMutation,
    useSquareYardsCalculatorMutation,
    useBrickCalculatorMutation,
    useMetalRoofCostCalculatorMutation,
    useSquareInchesCalculatorMutation,
    useSodCalculatorMutation,
    useConcreteBlockCalculatorMutation,
    useCarpetCalculatorMutation,
    useCylinderVolumeCalculatorMutation,
    useFramingCalculatorMutation,
    useRoofingCalculatorMutation,
    useDeckingCalculatorMutation,
    useSonotubeCalculatorMutation,
    useRoofReplacementCostCalculatorMutation,
    useStoneCalculatorMutation,

    useGravelCalculatorMutation,
    useMulchCalculatorMutation,
    useSandCalculatorMutation,
    useAsphaltCalculatorMutation,
    useSquareFootageCalculatorMutation,
    useConcreteCalculatorMutation,
    usePaverCalculatorMutation,
    useFenceCalculatorMutation,
    useTopsoilCalculatorMutation,
    useCubicYardCalculatorMutation,
    useTileCalculatorMutation,
    useTankVolumeCalculatorMutation,
    useFlooringCalculatorMutation,
    useWallpaperCalculatorMutation,
    useStudCalculatorMutation,
    useRampCalculatorMutation,
    useSquareMeterCalculatorMutation,
    useRoomSizeCalculatorMutation,


    

 // Statistics  Calculators start
  useHypergeometricCalculatorMutation,
  useZScoreCalculatorMutation,
  useCorrelationCoefficientCalculatorMutation,
  useEffectSizeCalculatorMutation,
  usePValueCalculatorMutation,
  useProbabilityDensityFunctionCalculatorMutation,
  useDecileCalculatorMutation,
  usePertCalculatorMutation,
  usePooledVarianceCalculatorMutation,
  useSampleDistributionCalculatorMutation,
  useNormalDistributionCalculatorMutation,
  useCriticalValueCalculatorMutation,
  useTestStatisticCalculatorMutation,
  useAnovaCalculatorMutation,
 // Statistics  Calculators start


 // Chemistry Calculators start
  useIdealGasLawCalculatorMutation,
  useMoleFractionCalculatorMutation,
  usePartialPressureCalculatorMutation,
  useCharlesLawCalculatorMutation,
  usePhCalculatorMutation,
  useBoylesLawCalculatorMutation,
  useCombinedGasLawCalculatorMutation,
  useGayLussacsLawCalculatorMutation,
  useMassPercentCalculatorMutation,
  useCalorimetryCalculatorMutation,
  useRateConstantCalculatorMutation,


    useActivationEnergyCalculatorMutation,
    useAtomicMassCalculatorMutation,
    useAtomsToMolesCalculatorMutation,
    useAverageAtomicMassCalculatorMutation,
    useBondOrderCalculatorMutation,
    useCfuCalculatorMutation,
    useChemicalEquationBalancerCalculatorMutation,
    useDilutionCalculatorMutation,
    useElectronConfigurationCalculatorMutation,
    useEmpiricalFormulaCalculatorMutation,
    useEntropyCalculatorMutation,
    useEquilibriumConstantCalculatorMutation,
    useFormalChargeCalculatorMutation,
    useGibbsFreeEnergyCalculatorMutation,
    useGramsToAtomsCalculatorMutation,
    useGramsToMolesCalculatorMutation,
    useHalfLifeCalculatorMutation,
    useLazyGetSingleCalculatorLanguageQuery,
    useLimitingReactantCalculatorMutation,
    useMlToMolesCalculatorMutation,
    useMmollToMgDlCalculatorMutation,
    useMolalityCalculatorMutation,
    useMolarMassCalculatorMutation,
    useMolarityCalculatorMutation,
    useMoleCalculatorMutation,
    useMoleRatioCalculatorMutation,
    useMolecularFormulaCalculatorMutation,
    useMolesToGramsCalculatorMutation,
    useNernstEquationCalculatorMutation,
    usePercentYieldCalculatorMutation,
    usePkaToPhCalculatorMutation,
    usePpmCalculatorMutation,
    useRedoxReactionCalculatorMutation,
    useSolutionDilutionCalculatorMutation,
    useStoichiometryCalculatorMutation,
    useStpCalculatorMutation,
    useTheoreticalYieldCalculatorMutation,
    useTitrationCalculatorMutation,
    useVaporPressureCalculatorMutation,
  
    // Chemistry Calculators start


    
   // Physics calculator
  useDimensionalAnalysisCalculatorMutation,
  useVelocityCalculatorMutation,
  useDisplacementCalculatorMutation,
  useOhmsLawCalculatorMutation,
  useTorqueCalculatorMutation,
  useHorsepowerCalculatorMutation,
  useInstantaneousRateOfChangeCalculatorMutation,
  useKineticEnergyCalculatorMutation,
  useSpecificHeatCalculatorMutation,
  useWorkCalculatorMutation,
  useWaterViscosityCalculatorMutation,
  useUnitVectorCalculatorMutation,
  useFreeFallCalculatorMutation,
  useSpeedDistanceTimeCalculatorMutation,
  useQuarterMileCalculatorMutation,
  useCoulombsLawCalculatorMutation,
  useSolarPanelCalculatorMutation,
  useCentripetalForceCalculatorMutation,
  useAngularAccelerationCalculatorMutation,
  useTensionCalculatorMutation,
  useHeatIndexCalculatorMutation,
  useReynoldsNumberCalculatorMutation,
  useChangeInMomentumCalculatorMutation,
  useSnellsLawCalculatorMutation,
  useImpulseCalculatorMutation,
  useWattCalculatorMutation,
  useRelativeHumidityCalculatorMutation,
  useTimeDilationCalculatorMutation,
  useOrbitalPeriodCalculatorMutation,
  useDensityAltitudeCalculatorMutation,
  useForceCalculatorMutation,
  useGearRatioCalculatorMutation,
  useWireSizeCalculatorMutation,
  useDcWireSizeCalculatorMutation,
  useResultantForceCalculatorMutation,
  useAngularVelocityCalculatorMutation,
  useDensityCalculatorMutation,
  useEnthalpyCalculatorMutation,
  useScaleCalculatorMutation,
  useResistanceCalculatorMutation,
  useMomentumCalculatorMutation,
  useAccelerationcalculatorMutation,
  useKinematicsCalculatorMutation,
  useBeamDeflectionCalculatorMutation,
  useFlowRateCalculatorMutation,
  useNormalForceCalculatorMutation,
  useElectricFieldCalculatorMutation,
  useCenterOfMassCalculatorMutation,
  useMomentOfInertiaCalculatorMutation,
  useVoltageDropCalculatorMutation,
  useTransformerCalculatorMutation,
  useVectorProjectionCalculatorMutation,

  
   // Math calculator
   usePregnancyCalculatorMutation,
   useVolumeOfCapsuleMutation,
   useDistanceFormulaCalculatorMutation,
   useConicalFrustumVolumeCalculatorMutation,
   useVolumeOfARectangleMutation,
   useSimilarTrianglesCalculatorMutation,
   useElementaryMatrixCalculatorMutation,
   useRationalZerosCalculatorMutation,
   useDiagonalCalculatorMutation,
   useLengthOfCurveCalculatorMutation,
   useRationalizeTheDenominatorCalculatorMutation,
   useGaussSeidelCalculatorMutation,
   useVectorAdditionCalculatorMutation,
   useSystemOfEquationsCalculatorMutation,
   useSubstitutionMethodCalculatorMutation,
   useEquationOfACircleMutation,
   useDirectionalDerivativeCalculatorMutation,
   useAngleBetweenTwoVectorsCalculatorMutation,
   useLawOfCosinesCalculatorMutation,
   useLawOfSinesCalculatorMutation,
   useHypotenuseCalculatorMutation,
   useTangentLineCalculatorMutation,
   useOnesComplementCalculatorMutation,
   useTwosComplementCalculatorMutation,
   useParabolaCalculatorMutation,
   useFortyFiveFortyFiveNinetyCalculatorMutation,
   useSohcahtoaCalculatorMutation,
   useTrigonometryCalculatorMutation,
   useVolumeOfTriangularPyramidMutation,
   useAreaCalculatorMutation,
   useRrefCalculatorMutation,
   useEllipseEquationCalculatorMutation,
   useSimplifyRadicalsCalculatorMutation,
   useParallelogramCalculatorMutation,
   usePerimeterCalculatorMutation,
   useLiteralEquationsCalculatorMutation,
   useThirtySixtyNinetyCalculatorMutation,
   useRatioToFractionCalculatorMutation,
   useRationalOrIrrationalCalculatorMutation,
   useReferenceAngleCalculatorMutation,
   useAreaOfASectorCalculatorMutation,
   useRationalExpressionCalculatorMutation,
   useDistributivePropertyCalculatorMutation,
   useAxisOfSymmetryCalculatorMutation,
   useTangentPlaneCalculatorMutation,
   useTriangleCalculatorMutation,
   useEulersMethodCalculatorMutation,
   useAverageRateOfChangeCalculatorMutation,
   useLinearApproximationCalculatorMutation,
   useFactoringCalculatorMutation,
   useIntervalNotationCalculatorMutation,
   useRatioCalculatorMutation,
   useFactorialCalculatorMutation,
   useGcfCalculatorMutation,
   useLcmCalculatorMutation,
   useCircumferenceCalculatorMutation,
   usePercentageCalculatorMutation,
   useFractionCalculatorMutation,
    

} = dateCalculatorApi;
