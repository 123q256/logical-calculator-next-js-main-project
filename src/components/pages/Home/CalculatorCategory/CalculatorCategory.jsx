import React from "react";
import MathematicalCalculators from "./Section/MathematicalCalculators";
import StatisticsCalculators from "./Section/StatisticsCalculators";
import FinanceCalculators from "./Section/FinanceCalculators";
import DailyLifeCalculators from "./Section/DailyLifeCalculators";
import HealthCalculators from "./Section/HealthCalculators";
import PhysicsCalculators from "./Section/PhysicsCalculators";
import ChemistryCalculators from "./Section/ChemistryCalculators";
import ConstructionCalculators from "./Section/ConstructionCalculators";
import DateTimeCalculators from "./Section/DateTimeCalculators";
import PetCalculators from "./Section/PetCalculators";
import PopularCalculators from "./Section/PopularCalculators";

const CalculatorCategory = () => {
  return (
    <>
        <PopularCalculators />
      <div className="bg-[#F4F4F4] py-1">
        <HealthCalculators />
        <FinanceCalculators />
        <MathematicalCalculators />
        <PhysicsCalculators />
        <ChemistryCalculators />
        <StatisticsCalculators />
        <DailyLifeCalculators />
        <ConstructionCalculators />
        <DateTimeCalculators />
        <PetCalculators />
      </div>
    </>
  );
};

export default CalculatorCategory;
