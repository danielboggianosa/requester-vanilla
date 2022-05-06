// Do request using html information and show response
const methodSelect = document.getElementById("method");
const urlInput = document.getElementById("url");
const dataInput = document.getElementById("data");
const requestForm = document.getElementById("form");
const response = document.getElementById("response");
const headers = document.getElementById("headers");
const addHeader = document.getElementById("addHeader");
const addTest = document.getElementById("addTest");

const statusCode = document.getElementById("statusCode");
const responseHeaders = document.getElementById("responseHeaders");
const responseBody = document.getElementById("responseBody");
const responseTests = document.getElementById("responseTests");

const request = new XMLHttpRequest();

window.addEventListener("load", () => {
  const methods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "CONNECT",
    "TRACE",
    "COPY",
    "LOCK",
    "MKCOL",
    "MOVE",
    "PROPFIND",
    "LINK",
    "UNLINK",
  ];
  methods.forEach((method) => {
    const option = document.createElement("option");
    option.value = method;
    option.innerHTML = method;
    methodSelect.appendChild(option);
  });
});

requestForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // get all values of select with name headerKey[]
  const headerKeys = [];
  document.getElementsByName("headerKey[]").forEach((element) => {
    if (element.value !== "") {
      headerKeys.push(element.value);
    }
  });
  const headerValues = [];
  document.getElementsByName("headerValue[]").forEach((element) => {
    headerValues.push(element.value);
  });
  const tests = [];
  document.getElementsByName("testName[]").forEach((element, index) => {
    tests.push({ index, name: element.value });
  });
  document.getElementsByName("testProperty[]").forEach((element, index) => {
    tests[index].property = element.value;
  });
  document.getElementsByName("testOperator[]").forEach((element, index) => {
    tests[index].operator = element.value;
  });
  document.getElementsByName("testValue[]").forEach((element, index) => {
    tests[index].value = element.value;
  });
  request.open(methodSelect.value, urlInput.value);
  headerKeys.forEach((key, index) => {
    request.setRequestHeader(key, headerValues[index]);
  });
  request.send(dataInput.value);
  request.onload = () => {
    statusCode.innerHTML = request.status;
    responseHeaders.innerHTML = request.getAllResponseHeaders();
    responseBody.innerHTML = request.responseText;
    responseTests.innerHTML = "";
    testRequest(request, tests).forEach((test) => {
      const testElement = document.createElement("div");
      testElement.classList.add("d-flex");
      testElement.classList.add("justify-content-between");
      const testName = document.createElement("h5");
      testName.innerHTML = test.name;
      const testResult = document.createElement("h5");
      testResult.innerHTML = test.result ? "Pass" : "Fail";
      testResult.className = test.result ? "btn btn-success" : "btn btn-danger";
      testElement.appendChild(testName);
      testElement.appendChild(testResult);
      responseTests.appendChild(testElement);
    });
  };
});

addHeader.addEventListener("click", () => {
  const headerKeyOptions = [
    "Accept",
    "Accept-Charset",
    "Accept-Encoding",
    "Accept-Language",
    "Accept-Ranges",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin",
    "Access-Control-Expose-Headers",
    "Access-Control-Max-Age",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
    "Age",
    "Allow",
    "Authorization",
    "Cache-Control",
    "Connection",
    "Content-Disposition",
    "Content-Encoding",
    "Content-Language",
    "Content-Length",
    "Content-Location",
    "Content-Range",
    "Content-Type",
    "Cookie",
    "Date",
    "ETag",
    "Expect",
    "Expires",
    "From",
    "Host",
    "If-Match",
    "If-Modified-Since",
    "If-None-Match",
    "If-Range",
    "If-Unmodified-Since",
    "Last-Modified",
    "Location",
    "Max-Forwards",
    "Origin",
    "Pragma",
    "Proxy-Authenticate",
    "Proxy-Authorization",
    "Range",
    "Referer",
    "Retry-After",
    "Server",
    "Set-Cookie",
    "Strict-Transport-Security",
    "Trailer",
    "Transfer-Encoding",
    "Upgrade",
    "User-Agent",
    "Vary",
    "Via",
    "Warning",
    "WWW-Authenticate",
    "X-Content-Type-Options",
    "X-Forwarded-For",
    "X-Forwarded-Host",
    "X-Forwarded-Proto",
    "X-Frame-Options",
    "X-Requested-With",
    "X-XSS-Protection",
    "Custom",
  ];
  // create select that accepts custom option
  const selectHeaderKey = document.createElement("select");
  selectHeaderKey.id = "headerKey";
  selectHeaderKey.name = "headerKey[]";
  selectHeaderKey.className = "form-control";
  selectHeaderKey.innerHTML = `<option value="">Select Header Key</option>`;
  headerKeyOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.innerHTML = option;
    selectHeaderKey.appendChild(optionElement);
  });
  // if Custom is selected, create input for custom header key
  const customHeaderKey = document.createElement("input");
  customHeaderKey.name = "headerKey[]";
  customHeaderKey.className = "form-control d-none";
  customHeaderKey.type = "text";
  customHeaderKey.placeholder = "Custom Header Key";
  selectHeaderKey.addEventListener("change", () => {
    console.log(selectHeaderKey.value);
    if (selectHeaderKey.value === "Custom") {
      customHeaderKey.classList.toggle("d-none");
      selectHeaderKey.remove();
    }
  });
  const headerValue = document.createElement("input");
  headerValue.name = "headerValue[]";
  headerValue.className = "form-control";
  headerValue.type = "text";
  headerValue.placeholder = "Enter Header Value";
  const header = document.createElement("div");
  header.className = "form-group d-flex";
  const remove = document.createElement("button");
  remove.className = "btn btn-danger";
  remove.innerHTML = "X";
  remove.addEventListener("click", () => {
    header.remove();
  });
  header.appendChild(customHeaderKey);
  header.appendChild(selectHeaderKey);
  header.appendChild(headerValue);
  header.appendChild(remove);
  headers.appendChild(header);
});

addTest.addEventListener("click", () => {
  const testOperators = [
    "=",
    "!=",
    ">",
    "<",
    ">=",
    "<=",
    "in",
    "not in",
    "contains",
    "not contains",
    "starts with",
    "not starts with",
    "ends with",
    "not ends with",
    "matches",
    "not matches",
    "is null",
    "is not null",
    "is empty",
    "is not empty",
    "is true",
    "is not true",
    "is false",
    "is not false",
    "is undefined",
    "is not undefined",
    "is NaN",
    "is not NaN",
    "is finite",
    "is not finite",
    "is empty string",
    "is not empty string",
    "is empty array",
    "is not empty array",
    "is empty object",
    "is not empty object",
    "is empty set",
    "is not empty set",
    "is empty map",
    "is not empty map",
    "is empty weakmap",
    "is not empty weakmap",
    "is empty weakset",
    "is not empty weakset",
    "is empty date",
    "is not empty date",
    "is empty regexp",
    "is not empty regexp",
    "is empty function",
    "is not empty function",
    "is empty string",
    "is not empty string",
    "is empty number",
    "is not empty number",
    "is empty boolean",
    "is not empty boolean",
    "is empty array",
    "is not empty array",
    "is empty object",
    "is not empty object",
    "is empty set",
    "is not empty set",
    "is empty map",
    "is not empty map",
    "is empty weakmap",
    "is not empty weakmap",
    "is empty weakset",
    "is not empty weakset",
  ];
  const test = document.createElement("div");
  test.className = "form-group d-flex";
  const testName = document.createElement("input");
  testName.name = "testName[]";
  testName.className = "form-control";
  testName.type = "text";
  testName.placeholder = "Enter Test Name";
  const testProperty = document.createElement("input");
  testProperty.name = "testProperty[]";
  testProperty.className = "form-control";
  testProperty.type = "text";
  testProperty.placeholder = "Enter Test Property";
  const testOperator = document.createElement("select");
  testOperator.name = "testOperator[]";
  testOperator.className = "form-control";
  testOperator.innerHTML = `<option value="">Select Operator</option>`;
  testOperators.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.innerHTML = option;
    testOperator.appendChild(optionElement);
  });
  const testValue = document.createElement("input");
  testValue.name = "testValue[]";
  testValue.className = "form-control d-none";
  testValue.type = "text";
  testValue.placeholder = "Enter Test Value";
  const remove = document.createElement("button");
  remove.className = "btn btn-danger";
  remove.innerHTML = "X";
  remove.addEventListener("click", () => {
    test.remove();
  });
  testOperator.addEventListener("change", () => {
    if (testOperator.value.includes("is")) {
      testValue.classList.add("d-none");
      testValue.value = "";
    } else {
      testValue.classList.remove("d-none");
    }
  });
  test.appendChild(testName);
  test.appendChild(testProperty);
  test.appendChild(testOperator);
  test.appendChild(testValue);
  test.appendChild(remove);
  tests.appendChild(test);
});

function testRequest(request, tests) {
  const testResults = [];
  tests.forEach(({ name, property, operator, value }) => {
    const test = { name };
    let propertyValue = request;
    const body = JSON.parse(request.responseText);
    if (property.includes("body")) {
      propertyValue = { body };
    }
    if (property.includes(".") || property.includes("[")) {
      const properties = property.split(".");
      properties.forEach((prop) => {
        if (prop.includes("[")) {
          const index = prop.split("[")[1].split("]")[0];
          prop = prop.split("[")[0];
          propertyValue = propertyValue[prop][index];
        } else {
          propertyValue = propertyValue[prop];
        }
      });
    } else {
      propertyValue = propertyValue[property];
    }
    switch (operator) {
      case "=":
        test.result = propertyValue == value;
        break;
      case "!=":
        test.result = propertyValue != value;
        break;
      case ">":
        test.result = propertyValue > value;
        break;
      case "<":
        test.result = propertyValue < value;
        break;
      case ">=":
        test.result = propertyValue >= value;
        break;
      case "<=":
        test.result = propertyValue <= value;
        break;
      case "in":
        test.result = value.includes(propertyValue);
        break;
      case "not in":
        test.result = !value.includes(propertyValue);
        break;
      case "contains":
        test.result = propertyValue.includes(value);
        break;
      case "not contains":
        test.result = !propertyValue.includes(value);
        break;
      case "starts with":
        test.result = propertyValue.startsWith(value);
        break;
      case "not starts with":
        test.result = !propertyValue.startsWith(value);
        break;
      case "ends with":
        test.result = propertyValue.endsWith(value);
        break;
      case "not ends with":
        test.result = !propertyValue.endsWith(value);
        break;
      case "matches":
        test.result = propertyValue.match(value);
        break;
      case "not matches":
        test.result = !propertyValue.match(value);
        break;
      case "is null":
        test.result = propertyValue === null;
        break;
      case "is not null":
        test.result = propertyValue !== null;
        break;
      case "is empty":
        test.result = propertyValue === "";
        break;
      case "is not empty":
        test.result = propertyValue !== "";
        break;
      case "is true":
        test.result = propertyValue === true;
        break;
      case "is not true":
        test.result = propertyValue !== true;
        break;
      case "is false":
        test.result = propertyValue === false;
        break;
      case "is not false":
        test.result = propertyValue !== false;
        break;
      case "is undefined":
        test.result = propertyValue === undefined;
        break;
      case "is not undefined":
        test.result = propertyValue !== undefined;
        break;
      case "is empty string":
        test.result = propertyValue === "";
        break;
      case "is not empty string":
        test.result = propertyValue !== "";
        break;
      case "is empty array":
        test.result = propertyValue.length === 0;
        break;
      case "is not empty array":
        test.result = propertyValue.length !== 0;
        break;
      case "is empty object":
        test.result = Object.keys(propertyValue).length === 0;
        break;
      case "is not empty object":
        test.result = Object.keys(propertyValue).length !== 0;
        break;
      case "is empty set":
        test.result = propertyValue.size === 0;
        break;
      case "is not empty set":
        test.result = propertyValue.size !== 0;
        break;
      case "is empty map":
        test.result = propertyValue.size === 0;
        break;
      case "is not empty map":
        test.result = propertyValue.size !== 0;
        break;
      case "is empty weakmap":
        test.result = propertyValue.size === 0;
        break;
      case "is not empty weakmap":
        test.result = propertyValue.size !== 0;
        break;
      case "is empty weakset":
        test.result = propertyValue.size === 0;
        break;
      case "is not empty weakset":
        test.result = propertyValue.size !== 0;
        break;
      case "is empty date":
        test.result = propertyValue === null;
        break;
      case "is not empty date":
        test.result = propertyValue !== null;
        break;
      case "is empty number":
        test.result = propertyValue === 0;
        break;
      case "is not empty number":
        test.result = propertyValue !== 0;
        break;
      case "is empty boolean":
        test.result = propertyValue === false;
        break;
      case "is not empty boolean":
        test.result = propertyValue !== false;
        break;
      default:
        test.result = false;
        break;
    }
    testResults.push(test);
  });
  return testResults;
}
