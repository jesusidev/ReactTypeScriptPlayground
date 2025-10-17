console.clear();
//imports
import("./testingarea");
import("./colors");

// Basic Types/Primitive
let id: number = 5;
id = 6;
console.log(id);

const cName: string = "Jesus Guzman";
console.log(cName);

const isLoggedIn: boolean = true;
console.log(isLoggedIn);

const randomNumbersArray: number[] = [];
randomNumbersArray.push(6);
randomNumbersArray.push(8);
randomNumbersArray.push(500);
console.log(randomNumbersArray);

// Tuple
const product: [number, string, number, boolean] = [12, "New Item", 5, true];
console.log(product);

// Array Tuples
let cars: [string, string, boolean][];
cars = [
  ["honda", "accord", true],
  ["ford", "raptor", false],
];
console.log(cars);

// Union
let selectedProduct: number | string;
selectedProduct = "Nike";
console.log(selectedProduct);
selectedProduct = 21;
console.log(selectedProduct);

let sampleCars: "ford" | "chevy";
sampleCars = "chevy";
console.log(sampleCars);

// Enum has values starting from 0
enum FetchStates {
  LOADING,
  SUCCESSFUL,
  FAILED,
  CANCELLED,
}
console.log(FetchStates);

function fetchItems(status: FetchStates): void {
  switch (status) {
    case 0:
      console.log("Loading...", status);
      return;
    case 1:
      console.log("Successful", status);
      return;
    case 2:
      console.log("Failed", status);
      return;
    case 3:
      console.log("Cancelled Request", status);
      return;
  }
}
fetchItems(1);

// Enum as const
const LoadingStatus = {
  LOADING: "Loading",
  SUCCESSFUL: "Successful",
  ERROR: "Error",
  SPACING_ERROR: "Spacing Error",
} as const;

type LoadingStatusType = (typeof LoadingStatus)[keyof typeof LoadingStatus];

const doLoading: LoadingStatusType = LoadingStatus.SPACING_ERROR;

console.log("DoLoading::", doLoading);

// More Enum
enum LeadStatus {
  NEW = "New",
  IN_PROGRESS = "In Progress",
  CLOSED_WON = "Closed Won",
  CLOSED_LOST = "Closed Lost",
}

const isProgress: LeadStatus = LeadStatus.IN_PROGRESS;
console.log("Progress::", isProgress);

// Objects
type TAddress = {
  city: string;
  state: string;
  zip: number;
};
type TUser = {
  id: number | string;
  name: string;
  isPaid: boolean;
  address: TAddress;
  phone: number | string;
};
const userAccount: TUser = {
  id: 1,
  name: "Jacob James",
  isPaid: false,
  address: {
    city: "New York",
    state: "New York",
    zip: 10019,
  },
  phone: 6466909997,
};
console.log(userAccount);

// Type Assertion
const phoneNumber: any = 2223456789;
let customerSupportNumber = <string>phoneNumber;
customerSupportNumber = "2223456789";
console.log(phoneNumber);
console.log(customerSupportNumber);

// Function that returns nothing
function logger(
  id: number,
  type: string | number,
  message: string,
  other?: Record<string, unknown>
): void {
  console.log("Logger", { id, type, message, ...other });
}

// Function with return of string
function setname(firstName: string, lastName: string): string {
  logger(1, "function", "Set Name Function", {
    name: "jesus",
    isItemOnSale: false,
  });
  return `${firstName} ${lastName}`;
}
console.log(setname("Jesus", "Guzman"));

// Function with return of an array of strings
function getName(): [string, string] {
  logger(12, "function", "This is a test message");
  const testname = setname("logi", "tech");
  const arrName = testname.split(" ");
  const firstName = arrName[0],
    lastName = arrName[1];
  return [firstName, lastName];
}
const [firstName, lastName] = getName();
console.log("First Name:", firstName);
console.log("Last Name:", lastName);

// Interfaces
interface IProduct {
  readonly id: number;
  name: string;
  price: number;
  isOnSale: boolean;
}

const product1: IProduct = {
  id: 2,
  name: "Nike",
  price: 299.99,
  isOnSale: false,
};
console.log(product1);

// Interface Function
type IMathFun = (x: number, y: number) => number;
const add: IMathFun = (x: number, y: number): number => x + y;
console.log(add(4, 4));

// Satifies
type Route = { path: string; children?: Routes };
type Routes = Record<string, Route>;
export const routes: Routes = {
  AUTH: {
    path: "/auth",
  },
  HOME: {
    path: "/",
  },
} as const;
// Autcompletion happens
console.log("Routes::", routes.HOME.path);
