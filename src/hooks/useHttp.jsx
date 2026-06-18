import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url , config) {
    const response = await fetch(url , config );

    const resData = await response.json();

    if(!response.ok){
        throw new Error( resData.message || 'something went wrong, failed to send request.');
    }

    return resData;
    
}


export default function useHttp(url , config , initalData){

    const [ data , setData ] = useState(initalData);

    const [isLoading , setIsLoading] = useState(false);

    const [error ,setError] = useState();

    function clearData(){
        setData(initalData);
    }

    const sendRequest = useCallback( 
    async function sendRequest(data){
        setIsLoading(true);
        try{
            const resData = await sendHttpRequest(url , {...config , body:data});
            setData(resData);
        }
        catch(error){
            setError(error.message || 'something went wrong!')
        }
        setIsLoading(false);
    },[url , config]);

    useEffect(()=>{
        if(config && ( config.method === "GET" || !config.method )){
            sendRequest();
        }    
    },[sendRequest, config]);

    return{
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    }

}


/*
This video is teaching you how to build a **custom React hook** called `useHttp` to handle HTTP requests in a clean reusable way instead of repeating fetch logic in multiple components.

You are learning:

* Custom Hooks
* Fetching data
* Loading states
* Error handling
* `useEffect`
* `useCallback`
* Async/Await
* Infinite loop problems in React
* Why objects/functions in dependencies matter

I’ll explain EVERYTHING step by step like you're learning it for the first time.

---

# What Problem Are We Solving?

The app has TWO components:

* `Meals`
* `Checkout`

Both need to send HTTP requests.

Without a custom hook, you'd repeat:

* loading logic
* error logic
* fetch logic
* success logic

in multiple places.

That is BAD because:

* duplicated code
* harder to maintain
* messy components

So the instructor creates:

# `useHttp`

A reusable custom hook.

---

# Final Goal

Instead of writing fetch logic everywhere:

```js
fetch(...)
```

You will do:

```js
const {
  data,
  isLoading,
  error,
  sendRequest
} = useHttp(...)
```

Very clean.

---

# Step 1 — Create Hooks Folder

Inside `src` create:

```txt
src/
 └── hooks/
      └── useHttp.js
```

---

# Step 2 — Create the Custom Hook

Inside `useHttp.js`

```js
export default function useHttp() {

}
```

---

# VERY IMPORTANT CONCEPT

## Why Custom Hook?

Because React state must update the UI.

A normal function cannot manage React state correctly.

Custom hooks CAN use:

* `useState`
* `useEffect`
* `useCallback`

and therefore can control UI updates.

---

# Step 3 — Create Helper Function

The instructor first creates a helper function OUTSIDE the hook.

```js
async function sendHttpRequest(url, config) {

}
```

Why outside?

Because this function itself does NOT need React state.

It is just a utility function.

---

# Step 4 — Use Fetch

```js
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);
}
```

---

# Step 5 — Convert Response to JSON

```js
const resData = await response.json();
```

Why?

Because backend responses are usually JSON.

Example:

```json
{
  "meals": [...]
}
```

---

# Step 6 — Handle Errors

```js
if (!response.ok) {
  throw new Error(
    resData.message || 'Something went wrong!'
  );
}
```

---

# IMPORTANT CONCEPT

## `response.ok`

This becomes false when:

* 404
* 500
* bad request
* server error

---

# IMPORTANT CONCEPT

## Why Throw Error?

Because we want the `catch` block later to handle errors.

Example:

```js
throw new Error("Failed");
```

This immediately jumps to `catch`.

---

# Step 7 — Return Data

```js
return resData;
```

So the helper function returns backend data.

---

# Full Helper Function

```js
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || 'Something went wrong!'
    );
  }

  return resData;
}
```

---

# Step 8 — Add State Inside Hook

Inside `useHttp`

```js
const [data, setData] = useState();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState();
```

---

# IMPORTANT CONCEPT

These states control the UI.

## `data`

Stores successful response.

---

## `isLoading`

Used to show:

```txt
Loading...
```

---

## `error`

Used to show error messages.

---

# Step 9 — Create sendRequest Function

Inside hook:

```js
async function sendRequest() {

}
```

This function:

* starts loading
* sends request
* handles success
* handles errors

---

# Step 10 — Start Loading

```js
setIsLoading(true);
```

---

# Step 11 — Try/Catch

```js
try {

} catch(error) {

}
```

---

# IMPORTANT CONCEPT

Why `try/catch`?

Because:

* fetch may fail
* internet may fail
* backend may fail

---

# Step 12 — Await Request

```js
const resData = await sendHttpRequest(url, config);
```

---

# IMPORTANT CONCEPT

This was one of the BIGGEST bugs in the video.

The instructor FORGOT `await`.

Wrong:

```js
const resData = sendHttpRequest(...);
```

This stores a PROMISE.

Correct:

```js
const resData = await sendHttpRequest(...);
```

This stores REAL DATA.

---

# PROMISE VS REAL DATA

Without await:

```js
Promise { ... }
```

With await:

```js
[
  { id: 1, name: "Burger" }
]
```

---

# Step 13 — Store Data

```js
setData(resData);
```

---

# Step 14 — Handle Errors

```js
catch(error) {
  setError(error.message || 'Something went wrong!');
}
```

---

# Step 15 — Stop Loading

```js
setIsLoading(false);
```

Must happen after request finishes.

---

# Full sendRequest Function

```js
async function sendRequest() {
  setIsLoading(true);

  try {
    const resData = await sendHttpRequest(url, config);

    setData(resData);
  } catch(error) {
    setError(error.message || 'Something went wrong!');
  }

  setIsLoading(false);
}
```

---

# Step 16 — Return Values From Hook

```js
return {
  data,
  isLoading,
  error,
  sendRequest
};
```

---

# IMPORTANT CONCEPT

This is how hooks expose functionality.

Now any component can use:

```js
const { data, isLoading, error } = useHttp();
```

---

# Step 17 — Automatically Send GET Requests

The instructor uses:

```js
useEffect(() => {
  sendRequest();
}, [sendRequest]);
```

---

# IMPORTANT CONCEPT

`useEffect` runs AFTER component renders.

Perfect for:

* fetching data
* side effects
* API calls

---

# Step 18 — Infinite Loop Problem

The app suddenly sends:

```txt
100000000 requests
```

Why?

Because `sendRequest` changes every render.

---

# IMPORTANT CONCEPT

Functions are recreated every render.

This means:

```js
function hello() {}
```

inside a component becomes:

* new function
* new memory reference
* every render

So `useEffect` thinks dependency changed.

---

# Solution → useCallback

```js
const sendRequest = useCallback(async () => {

}, [url, config]);
```

---

# IMPORTANT CONCEPT

## `useCallback`

It memorizes the function.

React reuses the SAME function reference unless dependencies change.

---

# Another Infinite Loop Bug

This caused problems:

```js
useHttp(url, {})
```

Why?

Because `{}` is a NEW OBJECT every render.

---

# IMPORTANT CONCEPT

Objects are recreated every render.

Even if empty.

So React sees:

```js
{}
!== 
{}
```

Different memory references.

---

# Solution

Move object OUTSIDE component.

```js
const requestConfig = {};
```

Then:

```js
useHttp(url, requestConfig)
```

Now same object reference.

No infinite loop.

---

# Step 19 — Initial Undefined Error

The app crashes:

```txt
Cannot read properties of undefined (reading 'map')
```

Why?

Because data has not loaded yet.

Initially:

```js
data = undefined
```

But React renders immediately.

So:

```js
loadedMeals.map(...)
```

fails.

---

# Solution

Pass initial data.

Example:

```js
useHttp(url, {}, [])
```

Initial data becomes empty array.

Now:

```js
[].map(...)
```

works safely.

---

# Final Hook Structure

Your final hook roughly becomes:

```js
import { useState, useEffect, useCallback } from 'react';

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || 'Something went wrong!'
    );
  }

  return resData;
}

export default function useHttp(url, config, initialData) {

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback(async function() {

    setIsLoading(true);

    try {
      const resData = await sendHttpRequest(url, config);

      setData(resData);

    } catch(error) {
      setError(error.message || 'Something went wrong!');
    }

    setIsLoading(false);

  }, [url, config]);

  useEffect(() => {

    if (!config || config.method === 'GET') {
      sendRequest();
    }

  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest
  };
}
```

---

# What Happens in Meals Component?

Before:

```js
useEffect(() => {
 fetch(...)
}, [])
```

After:

```js
const {
  data: loadedMeals,
  isLoading,
  error
} = useHttp(url, requestConfig, []);
```

VERY CLEAN.

---

# Output of the Video

At the end:

* meals load correctly
* loading text appears
* errors handled correctly
* no infinite loops
* reusable HTTP hook created

---

# MOST IMPORTANT THINGS YOU LEARNED

## 1. Custom Hooks

Reusable React logic.

---

## 2. useEffect

Runs side effects after render.

---

## 3. useCallback

Prevents infinite loops from recreated functions.

---

## 4. Async/Await

Wait for async operations.

---

## 5. Loading State

Shows UI while waiting.

---

## 6. Error State

Handles failed requests.

---

## 7. Initial Data

Prevents undefined crashes.

---

## 8. Objects in Dependencies

Objects/functions recreate every render.

---

# Visual Flow

```txt
Component renders
       ↓
useEffect runs
       ↓
sendRequest()
       ↓
isLoading = true
       ↓
fetch request
       ↓
response received
       ↓
setData()
       ↓
isLoading = false
       ↓
UI updates automatically
```

---

# Big React Lesson From This Video

React components:

* render FIRST
* async code finishes LATER

That is why:

* loading states matter
* undefined errors happen
* effects are important

---

# What You Should Practice Now

Try building:

1. A custom hook for users API
2. A custom hook for posts API
3. Add loading spinner
4. Add error message
5. Add POST request support

That will make this topic much easier.

*/