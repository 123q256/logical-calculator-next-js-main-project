"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useSquareFootageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssOrderOfOperationsCalculator.css";
import { FaTimes } from "react-icons/fa";

const SquareFootageCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let url = "";
  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
  }

  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Form state
  const [roomUnit, setRoomUnit] = useState("1");
  const [rooms, setRooms] = useState([
    {
      tech_shape_unit: "sq",
      tech_sidealength: "6",
      tech_sidealength_unit: "cm",
      tech_length: "6",
      tech_length_unit: "cm",
      tech_width: "6",
      tech_width_unit: "cm",
      tech_inner_length: "6",
      tech_inner_length_unit: "cm",
      tech_inner_width: "6",
      tech_inner_width_unit: "cm",
      tech_border_width: "6",
      tech_border_width_unit: "cm",
       tech_sideclength: "6",
        tech_sideclength_unit: "cm",
      tech_sideblength: "6",
      tech_sideblength_unit: "cm",
      tech_height: "6",
      tech_height_unit: "cm",
      tech_diameter: "6",
      tech_diameter_unit: "cm",
      tech_base: "6",
      tech_base_unit: "cm",
      tech_axisa: "6",
      tech_axisa_unit: "cm",
      tech_axisb: "6",
      tech_axisb_unit: "cm",
      tech_radius: "6",
      tech_radius_unit: "cm",
      tech_angle: "6",
      tech_inner_diameter: "6",
      tech_inner_diameter_unit: "cm",
      tech_outer_diameter: "6",
      tech_outer_diameter_unit: "cm",
      tech_sides: "6",
    },
  ]);

  const [formData, setFormData] = useState({
    tech_price: "8",
    tech_price_unit: "m²",
    tech_quantity: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const shapeImages = {
    sq: "/images/square.png",
    rec: "/images/rectangle.png",
    recbor: "/images/rectangle_border.png",
    para: "/images/pp.png",
    tri: "/images/triangle.png",
    cir: "/images/circle.png",
    ell: "/images/ellipse.png",
    sec: "/images/ss.png",
    oct: "/images/octagon.png",
    ann: "/images/Annulus.png",
    cirborder: "/images/circle_border.png",
    hex: "/images/hexagon.png",
    tra: "/images/Trapezoid.png",
  };

  const [
    squareFootageCalculator,
    { isLoading: calculateLoading, isError, error: calculateError },
  ] = useSquareFootageCalculatorMutation();

  const shapes = [
    { value: "sq", label: "Square" },
    { value: "rec", label: "Rectangle" },
    { value: "recbor", label: "Rectangle Border" },
    { value: "tra", label: "Trapezoid" },
    { value: "para", label: "Parallelogram" },
    { value: "tri", label: "Triangle" },
    { value: "cir", label: "Circle" },
    { value: "ell", label: "Ellipse" },
    { value: "sec", label: "Sector" },
    { value: "hex", label: "Hexagon" },
    { value: "oct", label: "Octagon" },
    { value: "ann", label: "Annulus" },
    { value: "cirborder", label: "Circle Border" },
  ];

  const unitOptions = ["in", "ft", "yd", "mm", "cm", "m"];
  const priceUnitOptions = ["ft²", "yd²", "m²"];

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleRoomUnitChange = (unit) => {
    setRoomUnit(unit);
    if (unit === "1") {
      setRooms(rooms.slice(0, 1));
    }
    setResult(null);
    setFormError("");
  };

  const handleAddRoom = () => {
    if (rooms.length < 5) {
      const newRoom = {
        tech_shape_unit: "sq",
        tech_sidealength: "6",
        tech_sidealength_unit: "cm",
        tech_length: "6",
        tech_length_unit: "cm",
        tech_width: "6",
        tech_width_unit: "cm",
        tech_inner_length: "6",
        tech_inner_length_unit: "cm",
        tech_inner_width: "6",
        tech_inner_width_unit: "cm",
        tech_border_width: "6",
        tech_border_width_unit: "cm",
         tech_sideclength: "6",
        tech_sideclength_unit: "cm",
        tech_sideblength: "6",
        tech_sideblength_unit: "cm",
        tech_height: "6",
        tech_height_unit: "cm",
        tech_diameter: "6",
        tech_diameter_unit: "cm",
        tech_base: "6",
        tech_base_unit: "cm",
        tech_axisa: "6",
        tech_axisa_unit: "cm",
        tech_axisb: "6",
        tech_axisb_unit: "cm",
        tech_radius: "6",
        tech_radius_unit: "cm",
        tech_angle: "6",
        tech_inner_diameter: "6",
        tech_inner_diameter_unit: "cm",
        tech_outer_diameter: "6",
        tech_outer_diameter_unit: "cm",
        tech_sides: "6",
      };
      setRooms([...rooms, newRoom]);
    } else {
      toast.error("Maximum 5 rooms allowed");
    }

    setResult(null);
    setFormError("");
  };

  const handleRemoveRoom = (index) => {
    if (rooms.length > 1) {
      const updatedRooms = [...rooms];
      updatedRooms.splice(index, 1);
      setRooms(updatedRooms);
    } else {
      toast.error("At least one room is required");
    }
    setResult(null);
    setFormError("");
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
    setResult(null);
    setFormError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
  };

  const getVisibleFields = (shape) => {
    const fields = {
      sq: ["tech_sidealength"],
      rec: ["tech_length", "tech_width"],
      recbor: ["tech_inner_length", "tech_inner_width", "tech_border_width"],
      para: ["tech_base", "tech_height"],
     tri: ["tech_sidealength", "tech_sideblength", "tech_sideclength"],
      cir: ["tech_diameter"],
      ell: ["tech_axisa", "tech_axisb"],
      sec: ["tech_radius", "tech_border_width"],
      oct: ["tech_sidealength"],
      ann: ["tech_inner_diameter", "tech_outer_diameter"],
      cirborder: ["tech_inner_diameter", "tech_border_width"],
      hex: ["tech_sidealength"],
      tra: ["tech_sidealength", "tech_sideblength", "tech_height"],
    };
    return fields[shape] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const room of rooms) {
      const visibleFields = getVisibleFields(room.tech_shape_unit);
      for (const field of visibleFields) {
        if (!room[field] || room[field] === "") {
          setFormError(
            `Please fill in all required fields for room ${
              rooms.indexOf(room) + 1
            }`
          );
          toast.error(
            `Please fill in all required fields for room ${
              rooms.indexOf(room) + 1
            }`
          );
          return;
        }
      }
    }

    setFormError("");

    try {
      const requestData = {
        tech_room_unit: roomUnit,
        tech_shape_unit: rooms.map((room) => room.tech_shape_unit),
        tech_length: rooms.map((room) => room.tech_length || "6"),
        tech_length_unit: rooms.map((room) => room.tech_length_unit || "cm"),
        tech_width: rooms.map((room) => room.tech_width || "6"),
        tech_width_unit: rooms.map((room) => room.tech_width_unit || "cm"),
        tech_inner_length: rooms.map((room) => room.tech_inner_length || "6"),
        tech_inner_length_unit: rooms.map(
          (room) => room.tech_inner_length_unit || "cm"
        ),
        tech_inner_width: rooms.map((room) => room.tech_inner_width || "6"),
        tech_inner_width_unit: rooms.map(
          (room) => room.tech_inner_width_unit || "cm"
        ),
        tech_border_width: rooms.map((room) => room.tech_border_width || "6"),
        tech_border_width_unit: rooms.map(
          (room) => room.tech_border_width_unit || "cm"
        ),
        tech_sidealength: rooms.map((room) => room.tech_sidealength || "6"),
        tech_sidealength_unit: rooms.map(
          (room) => room.tech_sidealength_unit || "cm"
        ),
        tech_sideblength: rooms.map((room) => room.tech_sideblength || "6"),
        tech_sideblength_unit: rooms.map(
          (room) => room.tech_sideblength_unit || "cm"
        ),
        tech_sideclength: rooms.map((room) => room.tech_sideclength || "6"),
        tech_sideclength_unit: rooms.map(
          (room) => room.tech_sideclength_unit || "cm"  
        ),
        tech_height: rooms.map((room) => room.tech_height || "6"),
        tech_height_unit: rooms.map((room) => room.tech_height_unit || "cm"),
        tech_diameter: rooms.map((room) => room.tech_diameter || "6"),
        tech_diameter_unit: rooms.map(
          (room) => room.tech_diameter_unit || "cm"
        ),
        tech_base: rooms.map((room) => room.tech_base || "6"),
        tech_base_unit: rooms.map((room) => room.tech_base_unit || "cm"),
        tech_axisa: rooms.map((room) => room.tech_axisa || "6"),
        tech_axisa_unit: rooms.map((room) => room.tech_axisa_unit || "cm"),
        tech_axisb: rooms.map((room) => room.tech_axisb || "6"),
        tech_axisb_unit: rooms.map((room) => room.tech_axisb_unit || "cm"),
        tech_radius: rooms.map((room) => room.tech_radius || "6"),
        tech_radius_unit: rooms.map((room) => room.tech_radius_unit || "cm"),
        tech_angle: rooms.map((room) => room.tech_angle || "6"),
        tech_inner_diameter: rooms.map(
          (room) => room.tech_inner_diameter || "6"
        ),
        tech_inner_diameter_unit: rooms.map(
          (room) => room.tech_inner_diameter_unit || "cm"
        ),
        tech_outer_diameter: rooms.map(
          (room) => room.tech_outer_diameter || "6"
        ),
        tech_outer_diameter_unit: rooms.map(
          (room) => room.tech_outer_diameter_unit || "cm"
        ),
        tech_sides: rooms.map((room) => room.tech_sides || "6"),
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
        tech_quantity: formData.tech_quantity,
        tech_submit: "calculate",
      };

      // console.log("Sending request data:", requestData);

      const response = await squareFootageCalculator(requestData).unwrap();
      setResult(response?.payload || response);
      toast.success("Calculated Successfully");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.payload?.error ||
        err?.data?.payload?.error ||
        err?.message ||
        "Something went wrong";

      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    setRooms([
      {
        tech_shape_unit: "sq",
        tech_sidealength: "6",
        tech_sidealength_unit: "cm",
        tech_length: "6",
        tech_length_unit: "cm",
        tech_width: "6",
        tech_width_unit: "cm",
        tech_inner_length: "6",
        tech_inner_length_unit: "cm",
        tech_inner_width: "6",
        tech_inner_width_unit: "cm",
        tech_border_width: "6",
        tech_border_width_unit: "cm",
        tech_sideblength: "6",
        tech_sideblength_unit: "cm",
        tech_sideclength: "6",
        tech_sideclength_unit: "cm",
        tech_height: "6",
        tech_height_unit: "cm",
        tech_diameter: "6",
        tech_diameter_unit: "cm",
        tech_base: "6",
        tech_base_unit: "cm",
        tech_axisa: "6",
        tech_axisa_unit: "cm",
        tech_axisb: "6",
        tech_axisb_unit: "cm",
        tech_radius: "6",
        tech_radius_unit: "cm",
        tech_angle: "6",
        tech_inner_diameter: "6",
        tech_inner_diameter_unit: "cm",
        tech_outer_diameter: "6",
        tech_outer_diameter_unit: "cm",
        tech_sides: "6",
      },
    ]);
    setFormData({
      tech_price: "8",
      tech_price_unit: "m²",
      tech_quantity: "1",
    });
    setResult(null);
    setFormError("");
  };

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

  // Field configurations
  const fieldConfigs = {
    tech_sidealength: { label: "Side Length (a) Length:", key: "25" },
    tech_length: { label: "Length (l):", key: "19" },
    tech_width: { label: "Width (w):", key: "20" },
    tech_inner_length: { label: "Inner Length (t):", key: "22" },
    tech_inner_width: { label: "Inner Width (s):", key: "23" },
    tech_border_width: { label: "Border Width:", key: "24" },
    tech_sideblength: { label: "Side (b) Length:", key: "25" },
     tech_sideclength: { label: "Side (c) Length:", key: "26" },
    tech_height: { label: "Height h=", key: "27" },
    tech_diameter: { label: "Diameter:", key: "28" },
    tech_base: { label: "Base:", key: "29" },
    tech_axisa: { label: "Axis (a):", key: "30" },
    tech_axisb: { label: "Axis (b):", key: "30" },
    tech_radius: { label: "Radius (r):", key: "31" },
    tech_angle: { label: "Angle °:", key: "32", isAngle: true },
    tech_inner_diameter: { label: "Inner Diameter:", key: "33" },
    tech_outer_diameter: { label: "Outer Diameter:", key: "34" },
    tech_sides: { label: "No. of Sides:", key: "35", isSides: true },
  };

  // Render individual field with dropdown
  const renderField = (room, index, field, config) => {
    if (!config) return null;

    const isVisible = getVisibleFields(room.tech_shape_unit).includes(field);
    if (!isVisible) return null;

    const fieldKey = `${field}_${index}`;
    const unitKey = `${field}_unit_${index}`;
    const unitField = `${field}_unit`;

    return (
      <div key={fieldKey} className="space-y-2">
        <label htmlFor={fieldKey} className="label">
          {data?.payload?.tech_lang_keys[config.key] || config.label}
        </label>
        <div className="relative w-full">
          {config.isAngle || config.isSides ? (
            <input
              type="number"
              step="any"
              id={fieldKey}
              name={field}
              className="input"
              value={room[field]}
              onChange={(e) => handleRoomChange(index, field, e.target.value)}
              placeholder="00"
            />
          ) : (
            <>
              <input
                type="number"
                step="any"
                id={fieldKey}
                name={field}
                className="input"
                value={room[field]}
                onChange={(e) => handleRoomChange(index, field, e.target.value)}
                placeholder="00"
              />
              <label
                htmlFor={unitKey}
                className="absolute cursor-pointer text-sm underline right-6 top-3"
                onClick={() =>
                  setActiveDropdown(activeDropdown === unitKey ? null : unitKey)
                }
              >
                {room[unitField]} ▾
              </label>
              {activeDropdown === unitKey && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                  {unitOptions.map((unit) => (
                    <p
                      key={unit}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleRoomChange(index, unitField, unit);
                        setActiveDropdown(null);
                      }}
                    >
                      {unit}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderPriceField = () => (
    <div className="space-y-2">
      <label htmlFor="tech_price" className="label">
        {data?.payload?.tech_lang_keys["36"]} (
        {data?.payload?.tech_lang_keys["37"]}):
      </label>
      <div className="relative w-full">
        <input
          type="number"
          name="tech_price"
          id="tech_price"
          step="any"
          className="input"
          value={formData.tech_price}
          onChange={handleFormChange}
          placeholder="00"
        />
        <label
          htmlFor="tech_price_unit"
          className="absolute cursor-pointer text-sm underline right-6 top-3"
          onClick={() =>
            setActiveDropdown(
              activeDropdown === "tech_price_unit" ? null : "tech_price_unit"
            )
          }
        >
          {formData.tech_price_unit} ▾
        </label>
        {activeDropdown === "tech_price_unit" && (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
            {priceUnitOptions.map((unit) => (
              <p
                key={unit}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
                  setActiveDropdown(null);
                }}
              >
                {unit}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
          path: pathname,
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto">
            {/* Room Type Selector */}
            <div className="w-full">
              <input type="hidden" name="tech_room_unit" value={roomUnit} />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300  ${
                      roomUnit === "1" ? "tagsUnit bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => handleRoomUnitChange("1")}
                  >
                    {data?.payload?.tech_lang_keys["2"]}/
                    {data?.payload?.tech_lang_keys["3"]}
                  </div>
                </div>
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300  ${
                      roomUnit === "2" ? "tagsUnit bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => handleRoomUnitChange("2")}
                  >
                    {data?.payload?.tech_lang_keys["4"]}/
                    {data?.payload?.tech_lang_keys["3"]}
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div className="mt-5 space-y-6">
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-12 gap-3 p-4 bordered rounded-lg bg-gray-50"
                >
                  {/* Remove button for additional rooms */}
                  {index > 0 && (
                    <button
                      type="button"
                      className="absolute cursor-pointer top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveRoom(index)}
                      title="Remove Room"
                    >
                      <FaTimes size={20} />
                    </button>
                  )}

                  {/* Room label for additional rooms */}
                  {index > 0 && (
                    <div className="col-span-12">
                      <p className="font-semibold text-lg">Room {index + 1}</p>
                    </div>
                  )}

                  {/* Left column - Inputs */}
                  <div className="col-span-6 space-y-4">
                    {/* Shape Selector */}
                    <div className="space-y-2">
                      <label
                        htmlFor={`tech_shape_unit_${index}`}
                        className="label"
                      >
                        {data?.payload?.tech_lang_keys["5"]}
                      </label>
                      <select
                        id={`tech_shape_unit_${index}`}
                        name="tech_shape_unit"
                        className="input"
                        value={room.tech_shape_unit}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "tech_shape_unit",
                            e.target.value
                          )
                        }
                      >
                        {shapes.map((shape, shapeIndex) => (
                          <option key={shape.value} value={shape.value}>
                            {data?.payload?.tech_lang_keys[
                              (shapeIndex + 6).toString()
                            ] || shape.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic Fields based on shape */}
                    {Object.keys(fieldConfigs).map((field) =>
                      renderField(room, index, field, fieldConfigs[field])
                    )}

                    {/* Price field only for first room */}
                    {index === 0 && renderPriceField()}
                  </div>

                  {/* Right column - Quantity and Image */}
                  <div className="col-span-6 space-y-4">
                    {/* Quantity - only for first room */}
                    {index === 0 && (
                      <div className="space-y-2">
                        <label htmlFor="tech_quantity" className="label">
                          {data?.payload?.tech_lang_keys["21"]}
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="tech_quantity"
                          id="tech_quantity"
                          className="input"
                          value={formData.tech_quantity}
                          onChange={handleFormChange}
                        />
                      </div>
                    )}

                    {/* Shape Image */}
                    <div className="mt-4">
                      <img
                        src={
                          shapeImages[room.tech_shape_unit] ||
                          "/images/square.png"
                        }
                        alt="Shape"
                        className="w-full h-auto rounded-lg"
                      />
                      {/* Formula Display */}
                      <div className="mt-2 text-sm text-gray-600">
                        {room.tech_shape_unit === "sq" && (
                          <div>Formula: Area = Side × Side</div>
                        )}
                        {room.tech_shape_unit === "rec" && (
                          <div>Formula: Area = Length × Width</div>
                        )}
                        {room.tech_shape_unit === "recbor" && (
                          <div>
                            Formula: Area = (Length × Width) - (Inner Length ×
                            Inner Width)
                          </div>
                        )}
                        {room.tech_shape_unit === "para" && (
                          <div>Formula: Area = Base × Height</div>
                        )}
                        {room.tech_shape_unit === "tri" && (
                          <div>Formula: Area = (Base × Height) ÷ 2</div>
                        )}
                        {room.tech_shape_unit === "cir" && (
                          <div>Formula: Area = π × (Radius)²</div>
                        )}
                        {room.tech_shape_unit === "ell" && (
                          <div>Formula: Area = π × Axis A × Axis B</div>
                        )}
                        {room.tech_shape_unit === "sec" && (
                          <div>
                            Formula: Area = (Angle ÷ 360) × π × (Radius)²
                          </div>
                        )}
                        {room.tech_shape_unit === "hex" && (
                          <div>Formula: Area = (3√3 ÷ 2) × (Side)²</div>
                        )}
                        {room.tech_shape_unit === "oct" && (
                          <div>Formula: Area = 2 × (1 + √2) × (Side)²</div>
                        )}
                        {room.tech_shape_unit === "ann" && (
                          <div>
                            Formula: Area = π × (Outer Radius² - Inner Radius²)
                          </div>
                        )}
                        {room.tech_shape_unit === "cirborder" && (
                          <div>
                            Formula: Area = π × (Outer Radius² - Inner Radius²)
                          </div>
                        )}
                        {room.tech_shape_unit === "tra" && (
                          <div>
                            Formula: Area = (Base A + Base B) ÷ 2 × Height
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Button - only for multiple rooms mode */}
            {roomUnit === "2" && rooms.length < 5 && (
              <div className="mt-4 flex justify-center">
                <div
                  className="bg-[#2845F5] text-white px-6 py-3 cursor-pointer rounded-lg border text-center font-semibold  transition-colors"
                  onClick={handleAddRoom}
                >
                  + Add More Room
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mb-6 mt-10 text-center space-x-2">
              <Button type="submit" isLoading={calculateLoading}>
                {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
              </Button>
              {(result ||
                rooms.length > 1 ||
                formData.tech_price !== "8" ||
                formData.tech_quantity !== "1") && (
                <ResetButton type="button" onClick={handleReset}>
                  {data?.payload?.tech_lang_keys["locale"] === "en"
                    ? "RESET"
                    : data?.payload?.tech_lang_keys["reset"] || "RESET"}
                </ResetButton>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-[100%] w-full mx-auto">
          <div className="col-span-12">
            {isLoading && (
              <div className="result_calculator rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            )}

            {result !== null && !isLoading && (
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full bg-light-blue result p-3 rounded-lg">
                    <div className="w-full result_table overflow-auto">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td width="60%" className="border-b py-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["39"]} :
                              </strong>
                            </td>
                            <td className="border-b py-3">
                              {result?.tech_ans
                                ? parseFloat(result.tech_ans).toFixed(2)
                                : "0"}{" "}
                              (ft²)
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2" className="pt-3">
                              Square Footage in Other Units
                            </td>
                          </tr>
                          <tr>
                            <td className="border-b py-3">
                              {data?.payload?.tech_lang_keys["40"]} :
                            </td>
                            <td className="border-b py-3">
                              {result?.tech_sqyards
                                ? parseFloat(result.tech_sqyards).toFixed(4)
                                : "0"}{" "}
                              (yd²)
                            </td>
                          </tr>
                          <tr>
                            <td className="border-b py-3">
                              {data?.payload?.tech_lang_keys["41"]} :
                            </td>
                            <td className="border-b py-3">
                              {result?.tech_sqmeters
                                ? parseFloat(result.tech_sqmeters).toFixed(4)
                                : "0"}{" "}
                              (m²)
                            </td>
                          </tr>
                          <tr>
                            <td className="border-b py-3">
                              {data?.payload?.tech_lang_keys["42"]} :
                            </td>
                            <td className="border-b py-3">
                              {result?.tech_acres
                                ? parseFloat(result.tech_acres).toFixed(4)
                                : "0"}{" "}
                              (acres)
                            </td>
                          </tr>
                          <tr>
                            <td className="border-b py-3">
                              {data?.payload?.tech_lang_keys["43"]} :
                            </td>
                            <td className="border-b py-3">
                              {currency.symbol}{" "}
                              {result?.tech_cost
                                ? parseFloat(result.tech_cost).toFixed(4)
                                : "0"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default SquareFootageCalculator;
