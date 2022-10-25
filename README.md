# JSONBin

This is a small demo project to demonstrate a couple of core pieces of functionality in working with [JSONBin](https://jsonbin.io/). It goes without saying you'll need an account. You'll also need to [create a bin](https://jsonbin.io/app/bins). If you want to pre-populate it with data, you can. One thing to note is that JSON is different from working with JavaScript objects, even though they are quite similar. The big difference here is that all of your keys must be strings. 

After you've done this, you'll need some information from your account. If you want to read and write to your JSONBin (which you probably do), you'll need the string of text called the `X-MASTER-KEY`.[^1] I have not included this in the example code for obvious reasons. 

Next, you'll need to make an HTTP request. I'm going to show examples using JavaScript's [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API, the JSONBin documentation uses [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), and you could certainly use a third-party library like [Axios](https://axios-http.com/). Regardless, you are doing the same thing: making HTTP requests: `GET`, `POST`, `UPDATE`, and `DELETE`. You'll see how neatly these align with CRUD.

I've written two functions to wrap these requests, and included status updates as well.[^2]

```javascript
function getAllData() {
  displayText = "retrieving data"
  fetch( jsonBin.rootURL + '/' + jsonBin.ID, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': jsonBin.accessKey
    }
  })
  .then((response) => response.json())
  .then((data) => jsonBin.data = data.record )
  .then(()=>displayText = "data fetched")
  .catch( e => displayText = `error during fetch ${e}`);  
}
```

Here you can see the request address getting built, and then an object that is used to construct the rest of the request. I define which kind of request (`GET`) I'll use, and then send along a couple of headers, including the access key. `fetch` works asynchronously and returns a `Promise`. There are a couple of ways to deal with this, but I like the [`then...catch...finally`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) pattern. It is also what is in the `fetch` documentation. After the response comes back, we transform it into JSON, and then get the information in the record property[^3] and assign it to a variable (`jsonBin.data`). Now we access the JSON object through that variable. All the changes, however are only on our local copy until we upload the changes. 

```javascript
function sync(finishedText="done syncing", errorText="error while syncing") {
  displayText = "syncing data";
  fetch( jsonBin.rootURL + '/' + jsonBin.ID, {
    method: 'PUT',
    body: JSON.stringify(jsonBin.data),
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': jsonBin.masterKey
    }
  })
  .then( () => displayText = finishedText )
  .then( () => getAllData() )
  .catch(e=>console.log(`${errorText}: ${e}`))  
}
```

The structure here is quite similar. Obviously, the HTTP request method is different (`PUT`), and it includes a `body` (which is a `stringify`'d version of a JSON object), and we have to use the "X-Master-Key" provided for us on JSONBin since we are making changes. One other note is that after the request goes through, I then immediately make another request for the current information. I probably don't have to do this, but it does lead to the interesting question: what happens when two (or more) people are making changes at the same time? We are certainly not creating a robust solution here, but this highlights the problem area. 

<!-- Footnotes -->
[^1]: There are certainly plenty of reasons why you _wouldn't_ want write access. In these instances, you would create and then use the `X-ACCESS-KEY`.
[^2]: It should be noted that using p5 for this is not ideal, since UI interactions are not a strong suit of the platform. That said, you certainly could use the DOM functions and utilize HTML elements to build a viable app.
[^3]: JSONBin actually returns some metadata along with the request. Check the docs out if you're curious. 