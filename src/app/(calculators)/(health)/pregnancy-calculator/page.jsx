"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePregnancyCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PregnancyCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean); // remove empty strings

  let url = "";

  if (parts.length === 1) {
    // sirf ek part
    url = parts[0]; // "age-calculator"
  } else {
    // do ya zyada parts
    url = parts[0] + "/" + parts[1]; // "de/age-calculator"
  }
  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const handleFetchDetails = async () => {
    try {
      // Call the mutation with the `tech_calculator_link`
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_method: "Last",
    tech_date: "2025-04-28",
    tech_cycle: "28",
    tech_ivf: "Last",
    tech_week: "21",
    tech_days: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePregnancyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_date: formData.tech_date,
        tech_cycle: formData.tech_cycle,
        tech_ivf: formData.tech_ivf,
        tech_week: formData.tech_week,
        tech_days: formData.tech_days,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_method: "Last",
      tech_date: "2025-04-28",
      tech_cycle: "28",
      tech_ivf: "Last",
      tech_week: "21",
      tech_days: "5",
    });
    setResult(null);
    setFormError(null);
  };
  // currency code
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };

    fetchCurrency();
  }, []);
  // currency code

  const formatDate = (
    dateStr,
    format = { month: "short", day: "2-digit", year: "numeric" }
  ) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", format);
  };

  const today = new Date();
  const baseDate = new Date(result?.tech_ovu_date);

  const ovuDate = baseDate;
  const pregText = new Date(baseDate.getTime() + 9 * 86400000); // +9 days
  const heartBeat = new Date(baseDate.getTime() + 21 * 86400000); // +21 days
  const morning = new Date(baseDate.getTime() + 7 * 7 * 86400000); // +7 weeks
  const midwife = new Date(baseDate.getTime() + 8 * 7 * 86400000); // +8 weeks
  const second = new Date(baseDate.getTime() + 11 * 7 * 86400000); // +11 weeks
  const ears = new Date(baseDate.getTime() + 13 * 7 * 86400000); // +13 weeks
  const feeling = new Date(baseDate.getTime() + 15 * 7 * 86400000); // +15 weeks
  const scan = new Date(baseDate.getTime() + 16 * 7 * 86400000); // +16 weeks
  const organs = new Date(baseDate.getTime() + 22 * 7 * 86400000); // +22 weeks
  const third = new Date(baseDate.getTime() + 25 * 7 * 86400000); // +25 weeks
  const deliver = new Date(baseDate.getTime() + 34 * 7 * 86400000); // +34 weeks
  const full = new Date(baseDate.getTime() + 35 * 7 * 86400000); // +35 weeks
  const due = new Date(baseDate.getTime() + 38 * 7 * 86400000); // +38 weeks

  const formatDatex = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };

  const rows = [];

  // Ovulation Date Row
  if (today < ovuDate) {
    rows.push(
      <tr key="ovu-before">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(ovuDate)}
        </td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["8"]}</td>
      </tr>
    );
  } else if (today.getTime() === ovuDate.getTime()) {
    rows.push(
      <tr className="bg-blue-500 " key="ovu-today">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(ovuDate)}
        </td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["8"]}</td>
      </tr>
    );
  } else if (today > ovuDate) {
    rows.push(
      <tr key="ovu-after">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(ovuDate)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["8"]}
        </td>
      </tr>
    );
  }

  // In-between Ovulation and Preg Text
  if (today > ovuDate && today < pregText) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-ovu-preg">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }
  // Preg Text
  if (today < pregText) {
    rows.push(
      <tr key="preg-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(pregText)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["10"]}</td>
      </tr>
    );
  } else if (today.getTime() === pregText.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="preg-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(pregText)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["10"]}</td>
      </tr>
    );
  } else if (today > pregText) {
    rows.push(
      <tr key="preg-after">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(pregText)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["10"]}
        </td>
      </tr>
    );
  }

  // In-between Preg Text and Heart Beat
  if (today > pregText && today < heartBeat) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-preg-heart">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Heart Beat
  if (today < heartBeat) {
    rows.push(
      <tr key="heart-before">
        <td className="text-blue border-b pe-2 p-2">
          {formatDatex(heartBeat)}
        </td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["11"]}</td>
      </tr>
    );
  } else if (today.getTime() === heartBeat.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="heart-today">
        <td className="text-blue border-b pe-2 p-2">
          {formatDatex(heartBeat)}
        </td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["11"]}</td>
      </tr>
    );
  } else if (today > heartBeat) {
    rows.push(
      <tr key="heart-after">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(heartBeat)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["11"]}
        </td>
      </tr>
    );
  }

  // Between Heart Beat and Morning Sickness
  if (today > heartBeat && today < morning) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-heart-morning">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Morning Sickness
  if (today < morning) {
    rows.push(
      <tr key="morning-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(morning)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["12"]}</td>
      </tr>
    );
  }

  if (today.getTime() === morning.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="morning-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(morning)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["12"]}</td>
      </tr>
    );
  } else if (today > morning) {
    rows.push(
      <tr key="morning-passed">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(morning)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["12"]}
        </td>
      </tr>
    );
  }

  if (today > morning && today < midwife) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-morning-midwife">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  if (today < midwife) {
    rows.push(
      <tr key="midwife-upcoming">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(midwife)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["13"]}</td>
      </tr>
    );
  } else if (today.getTime() === midwife.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="midwife-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(midwife)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["13"]}</td>
      </tr>
    );
  } else if (today > midwife) {
    rows.push(
      <tr key="midwife-passed">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(midwife)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["13"]}
        </td>
      </tr>
    );
  }

  if (today > midwife && today < second) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-midwife-second">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  if (today < second) {
    rows.push(
      <tr key="second-upcoming">
        <td className="border-b pe-2 p-2">
          <strong className="text-blue">{formatDatex(second)}</strong>
        </td>
        <td className="border-b p-2">
          <strong>
            {data?.payload?.tech_lang_keys["2nd"]} (13{" "}
            {data?.payload?.tech_lang_keys["week"]})
          </strong>
        </td>
      </tr>
    );
  } else if (today.getTime() === second.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="second-today">
        <td className="border-b pe-2 p-2">
          <strong className="text-blue">{formatDatex(second)}</strong>
        </td>
        <td className="border-b p-2">
          <strong>
            {data?.payload?.tech_lang_keys["2nd"]} (13{" "}
            {data?.payload?.tech_lang_keys["week"]})
          </strong>
        </td>
      </tr>
    );
  } else if (today > second) {
    rows.push(
      <tr key="second-passed">
        <td className="border-b pe-2 p-2">
          <strong className="color_gray">{formatDatex(second)}</strong>
        </td>
        <td className="border-b p-2">
          <strong className="color_gray">
            {data?.payload?.tech_lang_keys["2nd"]} (13{" "}
            {data?.payload?.tech_lang_keys["week"]})
          </strong>
        </td>
      </tr>
    );
  }

  if (today > second && today < ears) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-second-ears">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }
  if (today < ears) {
    rows.push(
      <tr key="ears-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(ears)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["14"]}</td>
      </tr>
    );
  } else if (today.getTime() === ears.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="ears-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(ears)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["14"]}</td>
      </tr>
    );
  } else if (today > ears) {
    rows.push(
      <tr key="ears-after">
        <td className="text-blue-500 border-b pe-2 p-2">{formatDatex(ears)}</td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["14"]}
        </td>
      </tr>
    );
  }

  // Between ears and feeling
  if (today > ears && today < feeling) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-ears-feeling">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Feeling
  if (today < feeling) {
    rows.push(
      <tr key="feeling-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(feeling)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["15"]}</td>
      </tr>
    );
  } else if (today.getTime() === feeling.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="feeling-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(feeling)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["15"]}</td>
      </tr>
    );
  } else if (today > feeling) {
    rows.push(
      <tr key="feeling-after">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(feeling)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["15"]}
        </td>
      </tr>
    );
  }

  // Between feeling and scan
  if (today > feeling && today < scan) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-feeling-scan">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Scan
  if (today < scan) {
    rows.push(
      <tr key="scan-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(scan)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["16"]}</td>
      </tr>
    );
  } else if (today.getTime() === scan.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="scan-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(scan)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["16"]}</td>
      </tr>
    );
  } else if (today > scan) {
    rows.push(
      <tr key="scan-after">
        <td className="text-blue-500 border-b pe-2 p-2">{formatDatex(scan)}</td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["16"]}
        </td>
      </tr>
    );
  }

  // Between scan and organs
  if (today > scan && today < organs) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-scan-organs">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Organs
  if (today < organs) {
    rows.push(
      <tr key="organs-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(organs)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["17"]}</td>
      </tr>
    );
  } else if (today.getTime() === organs.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="organs-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(organs)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["17"]}</td>
      </tr>
    );
  } else if (today > organs) {
    rows.push(
      <tr key="organs-after">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(organs)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["17"]}
        </td>
      </tr>
    );
  }

  // Between organs and third trimester
  if (today > organs && today < third) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-organs-third">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  if (today < third) {
    rows.push(
      <tr key="third-before">
        <td className="border-b pe-2 p-2">
          <strong className="text-blue">{formatDatex(third)}</strong>
        </td>
        <td className="border-b p-2">
          <strong>
            {data?.payload?.tech_lang_keys["3rd"]} (28{" "}
            {data?.payload?.tech_lang_keys["week"]})
          </strong>
        </td>
      </tr>
    );
  } else if (today.getTime() === third.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="third-today">
        <td className="border-b pe-2 p-2">
          <strong className="text-blue">{formatDatex(third)}</strong>
        </td>
        <td className="border-b p-2">
          <strong>
            {data?.payload?.tech_lang_keys["3rd"]} (28{" "}
            {data?.payload?.tech_lang_keys["week"]})
          </strong>
        </td>
      </tr>
    );
  } else if (today > third) {
    rows.push(
      <tr key="third-after">
        <td className="border-b pe-2 p-2">
          <strong className="color_gray">{formatDatex(third)}</strong>
        </td>
        <td className="border-b p-2">
          <strong className="color_gray">
            {data?.payload?.tech_lang_keys["3rd"]} (28{" "}
            {data?.payload?.tech_lang_keys["week"]})
          </strong>
        </td>
      </tr>
    );
  }

  // Between third and delivery
  if (today > third && today < deliver) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-third-deliver">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Delivery
  if (today < deliver) {
    rows.push(
      <tr key="deliver-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(deliver)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["18"]}</td>
      </tr>
    );
  } else if (today.getTime() === deliver.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="deliver-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(deliver)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["18"]}</td>
      </tr>
    );
  } else if (today > deliver) {
    rows.push(
      <tr key="deliver-after">
        <td className="text-blue-500 border-b pe-2 p-2">
          {formatDatex(deliver)}
        </td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["18"]}
        </td>
      </tr>
    );
  }

  // Between delivery and full term
  if (today > deliver && today < full) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-deliver-full">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Full term
  if (today < full) {
    rows.push(
      <tr key="full-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(full)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["19"]}</td>
      </tr>
    );
  } else if (today.getTime() === full.getTime()) {
    rows.push(
      <tr className="bg_blue_g text-white " key="full-today">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(full)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["19"]}</td>
      </tr>
    );
  } else if (today > full) {
    rows.push(
      <tr key="full-after">
        <td className="text-blue-500 border-b pe-2 p-2">{formatDatex(full)}</td>
        <td className="color_gray border-b p-2">
          {data?.payload?.tech_lang_keys["19"]}
        </td>
      </tr>
    );
  }

  // Between full and due
  if (today > full && today < due) {
    rows.push(
      <tr className="bg_blue_g text-white " key="between-full-due">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(today)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["9"]}</td>
      </tr>
    );
  }

  // Due date
  if (today < due) {
    rows.push(
      <tr key="due-before">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(due)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["20"]}</td>
      </tr>
    );
  } else if (today.getTime() === due.getTime() || today > due) {
    rows.push(
      <tr className="bg_blue_g text-white " key="due-now">
        <td className="text-blue border-b pe-2 p-2">{formatDatex(due)}</td>
        <td className="border-b p-2">{data?.payload?.tech_lang_keys["20"]}</td>
      </tr>
    );
  }

  // second time
  function formatDatexx(date) {
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * 86400000);
  }

  const ovuDatex = new Date(result?.tech_ovu_date);

  const firstStart = addDays(ovuDatex, -14); // -2 weeks
  const firstEnd = addDays(ovuDatex, 77 - 1); // 11 weeks -1 day

  const secondStart = addDays(ovuDatex, 77); // 11 weeks
  const secondEnd = addDays(ovuDatex, 175 - 1); // 25 weeks -1 day

  const thirdStart = addDays(ovuDatex, 175); // 25 weeks
  const thirdEnd = addDays(ovuDatex, 266); // 38 weeks

  // chart js

  function generateDateLabels(ovuDate) {
    const start = new Date(ovuDate);
    start.setDate(start.getDate() + 36 * 7); // 36 weeks
    const labels = [];
    for (let i = 0; i < 33; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      labels.push(
        d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      );
    }
    return labels;
  }

  const labels = generateDateLabels(result?.tech_ovu_date);

  // Bar Chart Data
  const barData = {
    labels,
    datasets: [
      {
        label: data?.payload?.tech_lang_keys["48"],
        data: [
          1.4, 1.3, 1.4, 1.9, 2.4, 2.1, 2.7, 3.1, 2.8, 2.9, 3.8, 4.0, 4.0, 4.6,
          6.9, 5.2, 4.5, 4.3, 4.0, 4.1, 4.2, 4.0, 3.1, 2.4, 2.3, 1.7, 1.3, 1.1,
          0.7, 0, 0, 0, 0,
        ].slice(0, labels.length),
        backgroundColor: "#3b82f6", // blue
        borderRadius: 5,
      },
    ],
  };

  // Bar Chart Options
  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: data?.payload?.tech_lang_keys["46"],
        font: { size: 18 },
      },
      legend: {
        position: "right",
        align: "start",
        labels: { boxWidth: 20 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `${val}%`,
        },
      },
    },
  };

  // Line Chart Data
  const lineData = {
    labels,
    datasets: [
      {
        label: data?.payload?.tech_lang_keys["49"],
        data: [
          10.8, 12.1, 13.5, 15.4, 17.9, 19.9, 22.6, 26.6, 28.4, 31.4, 35.2,
          39.3, 43.3, 47.9, 54.4, 60.0, 64.5, 68.8, 72.8, 76.8, 81.0, 85.1,
          88.2, 90.7, 93.0, 94.7, 96.0, 97.1, 97.8, 0, 0, 0, 0,
        ].slice(0, labels.length),
        borderColor: "#2563eb", // blue-600
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        fill: true,
        tension: 0.3,
        pointStyle: (ctx) => (ctx.dataIndex === 14 ? "image" : "circle"),
        pointRadius: 5,
        pointHoverRadius: 7,
        // NOTE: Chart.js doesn't support custom image points natively, you would need a plugin for birth icon
      },
    ],
  };

  // Line Chart Options
  const lineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: data?.payload?.tech_lang_keys["47"],
        font: { size: 18 },
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `${val}%`,
        },
      },
    },
  };

  return (
    <Calculator
      isLoading={isLoading}
      data={data}
      links={[
        { name: "Home", path: "/" },
        {
          name: data?.payload?.tech_cal_cat,
          path: "/" + data?.payload?.tech_cal_cat,
        },
        {
          name: data?.payload?.tech_calculator_title,
          path: pathname, // This will use the current path dynamically
        },
      ]}
    >
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 px-2">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["cal_method"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="Last">
                      {data?.payload?.tech_lang_keys["m1"]}{" "}
                    </option>
                    <option value="Due">Due Date </option>
                    <option value="Conception">
                      {data?.payload?.tech_lang_keys["m2"]}{" "}
                    </option>
                    <option value="IVF">
                      {data?.payload?.tech_lang_keys["m3"]}{" "}
                    </option>
                    <option value="Ulrasound">
                      {data?.payload?.tech_lang_keys["m4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                {formData.tech_method == "Last" && (
                  <>
                    <label htmlFor="tech_date" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["start_date"]}
                    </label>
                  </>
                )}
                {formData.tech_method == "Due" && (
                  <>
                    <label htmlFor="tech_date" className="label">
                      {" "}
                      Due Date:
                    </label>
                  </>
                )}
                {formData.tech_method == "Conception" && (
                  <>
                    <label htmlFor="tech_date" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["con"]}
                    </label>
                  </>
                )}
                {formData.tech_method == "IVF" && (
                  <>
                    <label htmlFor="tech_date" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["ivf"]}
                    </label>
                  </>
                )}
                {formData.tech_method == "Ulrasound" && (
                  <>
                    <label htmlFor="tech_date" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["ultra"]}
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="date"
                    step="any"
                    name="tech_date"
                    id="tech_date"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_method == "Last" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 cycle">
                    <label htmlFor="tech_cycle" className="label">
                      {data?.payload?.tech_lang_keys["cycle_len"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_cycle"
                        id="tech_cycle"
                        min="22"
                        max="44"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_cycle}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "IVF" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ivf ">
                    <label htmlFor="tech_ivf" className="label">
                      {data?.payload?.tech_lang_keys["e_age"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_ivf"
                        id="tech_ivf"
                        value={formData.tech_ivf}
                        onChange={handleChange}
                      >
                        <option value="Last">
                          {data?.payload?.tech_lang_keys["m1"]}{" "}
                        </option>
                        <option value="Due">Due Date</option>
                        <option value="Conception">
                          {data?.payload?.tech_lang_keys["m2"]}{" "}
                        </option>
                        <option value="IVF">
                          {data?.payload?.tech_lang_keys["m3"]}{" "}
                        </option>
                        <option value="Ulrasound">
                          {data?.payload?.tech_lang_keys["m4"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "Ulrasound" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 week_day">
                    <label htmlFor="tech_week" className="label">
                      {data?.payload?.tech_lang_keys["week"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_week"
                        id="tech_week"
                        min="1"
                        max="24"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_week}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 week_day">
                    <label htmlFor="tech_days" className="label">
                      {data?.payload?.tech_lang_keys["days"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        min="0"
                        max="6"
                        step="any"
                        name="tech_days"
                        id="tech_days"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_days}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-3 rounded-lg mt-3">
                      <div className="row ">
                        <div className="flex flex-wrap px-1 lg:px-3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                          <div className="col">
                            <div className="w-full mt-4 justify-center">
                              <div className="bg-gradient-to-r from-blue-50 via-sky-100 to-blue-50 bordered border-blue-200 shadow-lg rounded-xl p-4">
                                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                  <div className="text-center md:text-left">
                                    <p className="text-lg font-semibold text-blue-600">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "your_due"
                                        ]
                                      }
                                      <span className="text-blue-800">
                                        {formatDate(result?.tech_EstimatedAge)}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="hidden md:block md:border-r border-blue-300 pr-4 mr-4"></div>

                                  <div className="flex items-center space-x-4 text-2xl text-gray-700">
                                    <strong>
                                      {formatDate(result?.tech_EstimatedAge, {
                                        month: "short",
                                      })}
                                    </strong>
                                    <div className="relative">
                                      <img
                                        src="/images/empty_calender.png"
                                        alt="Calendar"
                                        className="w-[350px] hidden md:block transform transition-transform hover:scale-105"
                                      />
                                      <img
                                        src="/images/empty_calender.png"
                                        alt="Calendar"
                                        className="w-[50px] block md:hidden transform transition-transform hover:scale-105"
                                      />
                                      <strong className="text-green-500 absolute inset-0 flex items-center justify-center text-xl">
                                        {formatDate(result?.tech_EstimatedAge, {
                                          day: "2-digit",
                                        })}
                                      </strong>
                                    </div>
                                    <strong>
                                      {formatDate(result?.tech_EstimatedAge, {
                                        year: "numeric",
                                      })}
                                    </strong>
                                  </div>
                                </div>

                                <p className="text-sm mt-4 text-gray-600">
                                  <strong className="text-red-500">
                                    {data?.payload?.tech_lang_keys["cong"]}!
                                  </strong>
                                </p>

                                <p className="text-sm text-gray-700">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["1"]}{" "}
                                    {result?.tech_RemainingWeeks}{" "}
                                    {data?.payload?.tech_lang_keys["week"]},{" "}
                                    {result?.tech_RemainingDays}{" "}
                                    {data?.payload?.tech_lang_keys["days"]}{" "}
                                    {data?.payload?.tech_lang_keys["2"]}
                                  </strong>
                                </p>

                                {formData?.tech_method === "Due" && (
                                  <p className="text-sm text-gray-700">
                                    {data?.payload?.tech_lang_keys["con"]}:
                                    <strong className="text-black">
                                      {formatDate(result?.tech_ovu_date)}
                                    </strong>
                                  </p>
                                )}
                              </div>

                              <div className="w-full flex justify-center mt-6">
                                <div className="bg-gradient-to-r from-blue-50 via-sky-100 to-blue-50 bordered border-blue-200 shadow-md rounded-xl px-6 py-5">
                                  <p className="text-lg font-bold text-blue-600">
                                    {data?.payload?.tech_lang_keys["5"]}
                                    <span className="text-blue-800">
                                      {data?.payload?.tech_lang_keys["week"]}{" "}
                                      {result?.tech_RemainingWeeks}{" "}
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </span>
                                  </p>

                                  {(() => {
                                    const weekKeyMap = {
                                      0: "w1&2",
                                      1: "w1&2",
                                      2: "w1&2",
                                      3: "w3",
                                      40: "w40",
                                    };
                                    const weekKey =
                                      weekKeyMap[result?.tech_RemainingWeeks];
                                    if (
                                      !weekKey ||
                                      !data?.payload?.tech_lang_keys[weekKey]
                                    )
                                      return null;

                                    const [title, desc] =
                                      data.payload.tech_lang_keys[
                                        weekKey
                                      ].split("@");
                                    return (
                                      <>
                                        <p className="text-lg font-semibold text-gray-800">
                                          {title}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {desc}
                                        </p>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>

                              <div className="w-full">
                                <p className="text-lg mt-6 text-center font-bold text-blue-600 border-b-2 border-blue-500 inline-block pb-1">
                                  {data?.payload?.tech_lang_keys["24"]}
                                </p>

                                {/* First Trimester */}
                                <div className="w-full mt-4">
                                  <div className="bg-white flex items-center py-2 rounded-lg shadow">
                                    <div className="w-full bg-gray-100 rounded-lg px-4 py-2 flex flex-col justify-center">
                                      <p className="text-blue-600 font-bold">
                                        {data?.payload?.tech_lang_keys["1st"]}
                                      </p>
                                      <p className="text-gray-500 text-sm">
                                        {formatDatexx(firstStart)} to{" "}
                                        {formatDatexx(firstEnd)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Second Trimester */}
                                <div className="w-full mt-4">
                                  <div className="bg-white flex items-center py-2 rounded-lg shadow">
                                    <div className="w-full bg-gray-100 rounded-lg px-4 py-2 flex flex-col justify-center">
                                      <p className="text-blue-600 font-bold">
                                        {data?.payload?.tech_lang_keys["2nd"]}
                                      </p>
                                      <p className="text-gray-500 text-sm">
                                        {formatDatexx(secondStart)} to{" "}
                                        {formatDatexx(secondEnd)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Third Trimester */}
                                <div className="w-full mt-4">
                                  <div className="bg-white flex items-center py-2 rounded-lg shadow">
                                    <div className="w-full bg-gray-100 rounded-lg px-4 py-2 flex flex-col justify-center">
                                      <p className="text-blue-600 font-bold">
                                        {data?.payload?.tech_lang_keys["3rd"]}
                                      </p>
                                      <p className="text-gray-500 text-sm">
                                        {formatDatexx(thirdStart)} to{" "}
                                        {formatDatexx(thirdEnd)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Final Message */}
                                <p className="mt-6 text-lg font-bold">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </p>
                                <p className="text-gray-700">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="w-full lg:w-[100%] mt-3">
                              <div className=" bordered rounded-2xl px-3 py-2">
                                <p className="text-center">
                                  {" "}
                                  <strong className="text-blue-500">
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </p>
                                <div className="w-full overflow-auto">
                                  <table className="w-full" cellSpacing="0">
                                    <tbody>{rows}</tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="font-s-18 my-3">
                        <strong className="border-b-blue text-blue pb-1">
                          {data?.payload?.tech_lang_keys["21"]}
                        </strong>
                      </p>
                      <div className="overflow-auto">
                        <div
                          className="row mt-3 flex md:w-full"
                          style={{ width: "750px" }}
                        >
                          <div className="col-2 w-[23%] d-lg-block border-r-2 border-white">
                            <div className="col-12 text-center bg-gray border-white">
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </div>
                            <div
                              className="col-12 p-2 trim_height text-center orange border-white orange_color"
                              style={{
                                justifyContent: "center",
                                display: "grid",
                              }}
                            >
                              <b>{data?.payload?.tech_lang_keys["1st"]}</b>
                              <img
                                src="/images/1st_trim.png"
                                alt="1st trimester"
                                className="mt-2"
                                width={90}
                                height={90}
                              />
                            </div>
                            <div
                              className="col-12 p-2 trim_height text-center light-blue border-white text-blue"
                              style={{
                                borderBottom: "2px solid white",
                                borderTop: "2px solid white",
                                justifyContent: "center",
                                display: "grid",
                              }}
                            >
                              <b>{data?.payload?.tech_lang_keys["2nd"]}</b>
                              <img
                                src="/images/2nd_trim.png"
                                alt="2nd trimester"
                                className="mt-2"
                                width={80}
                                height={80}
                              />
                            </div>
                            <div
                              className="col-12 p-2 trim_height text-center lime border-white green_color"
                              style={{
                                justifyContent: "center",
                                display: "grid",
                              }}
                            >
                              <b>{data?.payload?.tech_lang_keys["3rd"]}</b>
                              <img
                                src="/images/3rd_trim.png"
                                alt="3rd trimester"
                                className="mt-2"
                                width={90}
                                style={{ maxHeight: 120 }}
                              />
                            </div>
                          </div>
                          <div className="col-2 w-[13%] col-lg-1 border-r-2 border-white">
                            <div className="col-12 text-center bg-gray border-white">
                              <strong>
                                {data?.payload?.tech_lang_keys["22"]}
                              </strong>
                            </div>

                            {[
                              {
                                key: "tech_one_t",
                                label: "1",
                                styleBottom: false,
                                defaultClass: "light-orange orange_color",
                              },
                              {
                                key: "tech_two_t",
                                label: "2",
                                styleBottom: false,
                                defaultClass: "light-orange orange_color",
                              },
                              {
                                key: "tech_three_t",
                                label: "3",
                                styleBottom: true,
                                defaultClass: "light-orange orange_color",
                              },
                              {
                                key: "tech_four_t",
                                label: "4",
                                styleBottom: false,
                                defaultClass: "lighter-blue text-blue",
                              },
                              {
                                key: "tech_five_t",
                                label: "5",
                                styleBottom: false,
                                defaultClass: "lighter-blue text-blue",
                              },
                              {
                                key: "tech_six_t",
                                label: "6",
                                styleBottom: true,
                                defaultClass: "lighter-blue text-blue",
                              },
                              {
                                key: "tech_seven_t",
                                label: "7",
                                styleBottom: false,
                                defaultClass: "light-lime green_color",
                              },
                              {
                                key: "tech_eight_t",
                                label: "8",
                                styleBottom: false,
                                defaultClass: "light-lime green_color",
                              },
                              {
                                key: "tech_nine_t",
                                label: "9",
                                styleBottom: false,
                                defaultClass: "light-lime green_color",
                              },
                            ].map(
                              ({ key, label, styleBottom, defaultClass }) => {
                                // Determine dynamic class from result or fallback to default
                                const dynamicClass =
                                  result && result[key]
                                    ? result[key]
                                    : defaultClass;

                                return (
                                  <b
                                    key={key}
                                    className={`col-12 border-white week_height text-center ${dynamicClass}`}
                                    style={
                                      styleBottom
                                        ? { borderBottom: "2px solid white" }
                                        : undefined
                                    }
                                  >
                                    {label}
                                  </b>
                                );
                              }
                            )}
                          </div>
                          <div className="col-4 w-[32%] border-r-2 border-white">
                            <div className="col-12 text-center bg-gray border-white">
                              <strong>
                                {data?.payload?.tech_lang_keys["24"]}
                              </strong>
                            </div>

                            <div className="row p-2 text-[10px] border-white trim_height light-orange orange_color overflow-auto overflow-md-visible">
                              <div className="col-lg-6 px-2 overflow-auto">
                                <b>{data?.payload?.tech_lang_keys["27"]}</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["28"]
                                    ?.split(",")
                                    .map((val, idx) => (
                                      <React.Fragment key={idx}>
                                        {val.trim()}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </p>
                              </div>
                              <div className="col-lg-6 px-2 overflow-auto">
                                <b>{data?.payload?.tech_lang_keys["29"]}:</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["31"]
                                    ?.split(",")
                                    .map((val, idx) => (
                                      <React.Fragment key={idx}>
                                        {val.trim()}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </p>
                              </div>
                              <div className="col-lg-6 px-2 d-none d-lg-block">
                                <b>{data?.payload?.tech_lang_keys["30"]}</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["32"]
                                    ?.split(",")
                                    .map((val, idx) => (
                                      <React.Fragment key={idx}>
                                        {val.trim()}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </p>
                              </div>
                            </div>

                            <div
                              className="row p-2 text-[14px] border-white trim_height lighter-blue text-blue overflow-auto"
                              style={{
                                borderBottom: "2px solid white",
                                borderTop: "2px solid white",
                              }}
                            >
                              <div className="col-12 px-2 overflow-auto">
                                <b>{data?.payload?.tech_lang_keys["33"]}</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["34"]
                                    ?.split(",")
                                    .map((val, idx) => (
                                      <React.Fragment key={idx}>
                                        {val.trim()}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </p>
                              </div>
                              <div className="col-lg-6 px-2 overflow-auto">
                                <b>{data?.payload?.tech_lang_keys["29"]}:</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["35"]
                                    ?.split(",")
                                    .map((val, idx) => (
                                      <React.Fragment key={idx}>
                                        {val.trim()}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </p>
                              </div>
                              <div className="col-lg-6 px-2 d-none d-lg-block">
                                <b>{data?.payload?.tech_lang_keys["30"]}</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["36"]}
                                </p>
                              </div>
                            </div>

                            <div className="row p-2 text-[11px] border-white trim_height light-lime green_color overflow-auto overflow-md-visible">
                              <div className="col-lg-6 px-2 overflow-auto">
                                <b>{data?.payload?.tech_lang_keys["37"]}:</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["38"]
                                    ?.split(",")
                                    .map((val, idx) => (
                                      <React.Fragment key={idx}>
                                        {val.trim()}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </p>
                              </div>
                              <div className="col-lg-6 px-2 overflow-auto">
                                <b>{data?.payload?.tech_lang_keys["29"]}:</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["39"]
                                    ?.split(",")
                                    .map((val, idx) => (
                                      <React.Fragment key={idx}>
                                        {val.trim()}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </p>
                              </div>
                              <div className="col-lg-6 px-2 d-none d-lg-block">
                                <b>{data?.payload?.tech_lang_keys["30"]}:</b>
                                <p className="font-s-12">
                                  {data?.payload?.tech_lang_keys["40"]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-4 w-[32%] border-r-2 border-white">
                            <div className="col-12 text-center bg-gray border-white">
                              <strong>
                                {data?.payload?.tech_lang_keys["25"]}
                              </strong>
                            </div>

                            <div className="col-12 p-2 text-[14px] border-white trim_height light-orange orange_color overflow-auto">
                              <b>{data?.payload?.tech_lang_keys["41"]}</b>
                              <p className="font-s-12">
                                {data?.payload?.tech_lang_keys["43"]
                                  ?.split(",")
                                  .map((val, idx) => (
                                    <React.Fragment key={idx}>
                                      {val.trim()}
                                      <br />
                                    </React.Fragment>
                                  ))}
                              </p>
                              <b>{data?.payload?.tech_lang_keys["42"]}</b>
                              <p className="font-s-12">
                                1/4" --&gt; 209" & 0.8 oz
                              </p>
                            </div>

                            <div
                              className="col-12 p-2 text-blue border-white trim_height lighter-blue overflow-auto"
                              style={{
                                borderBottom: "2px solid white",
                                borderTop: "2px solid white",
                              }}
                            >
                              <b>{data?.payload?.tech_lang_keys["41"]}</b>
                              <p className="font-s-12">
                                {data?.payload?.tech_lang_keys["44"]
                                  ?.split(",")
                                  .map((val, idx) => (
                                    <React.Fragment key={idx}>
                                      {val.trim()}
                                      <br />
                                    </React.Fragment>
                                  ))}
                              </p>
                              <b>{data?.payload?.tech_lang_keys["42"]}</b>
                              <p className="font-s-12">
                                3.4" --&gt; 1.5 oz & 14" & 1.7 lbs
                              </p>
                            </div>

                            <div className="col-12 p-2 text-[14px] border-white trim_height light-lime green_color overflow-auto">
                              <b>{data?.payload?.tech_lang_keys["41"]}</b>
                              <p className="font-s-12">
                                {data?.payload?.tech_lang_keys["45"]
                                  ?.split(",")
                                  .map((val, idx) => (
                                    <React.Fragment key={idx}>
                                      {val.trim()}
                                      <br />
                                    </React.Fragment>
                                  ))}
                              </p>
                              <b>{data?.payload?.tech_lang_keys["42"]}</b>
                              <p className="font-s-12">
                                14.4" & 2.9 lbs --&gt; 20.3" & 8.1 lbs
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 mt-3">
                        <div className="w-full h-">
                          <Bar data={barData} options={barOptions} />
                        </div>
                        <div className="w-full h-">
                          <Line data={lineData} options={lineOptions} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default PregnancyCalculator;
