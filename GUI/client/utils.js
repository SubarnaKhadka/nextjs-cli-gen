import {  clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const lowerCaseFirst = (word) => word.charAt(0).toLowerCase() + word.slice(1);

export const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
