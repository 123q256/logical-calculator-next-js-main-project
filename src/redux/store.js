import { configureStore } from "@reduxjs/toolkit";
import { blogApi } from "./services/blog/blogApi";
import { categoryApi } from "./services/category/categoryApi";
import { calculatorApi } from "./services/calculator/calculatorApi";
import { contactApi } from "./services/AllEmails/contactApi";
import { feedbackApi } from "./services/AllEmails/feedbackApi";
import { calculatorfeedbackApi } from "./services/AllEmails/calculatorfeedbackApi";
import { userresponseApi } from "./services/Userresponse/userresponse";
import { dateCalculatorApi } from "./services/datecalculator/dateCalculatorApi";
import { authApi } from "./services/auth/authApi";
import { authTokenApi } from "./services/auth/authTokenApi";
import { converterApi } from "./services/converter/converterApi";

export const store = configureStore({
  reducer: {
    [blogApi.reducerPath]: blogApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [calculatorApi.reducerPath]: calculatorApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [calculatorfeedbackApi.reducerPath]: calculatorfeedbackApi.reducer,
    [userresponseApi.reducerPath]: userresponseApi.reducer,
    [dateCalculatorApi.reducerPath]: dateCalculatorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [authTokenApi.reducerPath]: authTokenApi.reducer,
    [converterApi.reducerPath]: converterApi.reducer,
    // homePage: homePageReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      blogApi.middleware,
      categoryApi.middleware,
      calculatorApi.middleware,
      contactApi.middleware,
      feedbackApi.middleware,
      calculatorfeedbackApi.middleware,
      userresponseApi.middleware,
      dateCalculatorApi.middleware,
      authApi.middleware,
      authTokenApi.middleware,
      converterApi.middleware
    ),
});

export default store;
