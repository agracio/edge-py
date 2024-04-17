## edge-py

### Python compiler for Edge.Js.

### This libarary is based on https://github.com/tjanczuk/edge-py all credit for original work goes to Tomasz Janczuk. 
-------

**NOTE** This functionality requires [IronPython 3.4](https://github.com/IronLanguages/ironpython3/releases) and has been tested on Windows only. 

Install edge-js and edge-py modules:

```
npm install edge-js
npm install edge-py
```

```javascript
var edge = require('edge-js');

var hello = edge.func('py', function () {/*
    def hello(input):
        return "Python welcomes " + input

    lambda x: hello(x)
*/});

hello('Node.js', function (error, result) {
    if (error) throw error;
    console.log(result);
});
```

#### The interop model

Your Python script must evaluate to a lambda expression that accepts a single parameter. The parameter represents marshalled input from the Node.js code. The return value of the lambda expression is passed back as the result to Node.js code. The Python script can contain constructs (e.g. Python functions) that are used in the closure of the lambda expression. The instance of the script with associated state is created when `edge.func` is called in Node.js. Each call to the function referes to that instance.

The simplest *echo* Python script you can embed in Node.js looks like this:

```python
lambda x: x
```

To say hello, you can use something like this:

```python
lambda: x: "Hello, " + x
```

To maintain a running sum of numbers:

```python
current = 0

def add(x):
    global current
    current = current + x
    return current

lambda x: add(x)
```

#### Python in its own file

You can reference Python script stored in a *.py file instead of embedding Python code in a Node.js script.

In your hello.py file:

```python
def hello(input):
    return "Python welcomes " + input

lambda x: hello(x)
```

In your hello.js file:

```javascript
var edge = require('edge-js');

var hello = edge.func('py', 'hello.py');

hello('Node.js', function (error, result) {
    if (error) throw error;
    console.log(result);
});
```

#### To sync or to async, that is the question

In the examples above Python script was executing asynchronously on its own thread without blocking the singleton V8 thread on which the Node.js event loop runs. This means your Node.js application remains responsive while the Python code executes in the background. 

If you know your Python code is non-blocking, or if you know what you are doing, you can tell Edge.js to execute Python code on the singleton V8 thread. This will improve performance for non-blocking Python scripts embedded in a Node.js application:

```javascript
var edge = require('edge-js');

var hello = edge.func('py', {
    source: function () {/*
        def hello(input):
            return "Python welcomes " + input

        lambda x: hello(x)
    */},
    sync: true
});

console.log(hello('Node.js', true));
```

The `sync: true` property in the call to `edge.func` tells Edge.js to execute Python code on the V8 thread as opposed to creating a new thread to run Python script on. The `true` parameter in the call to `hello` requests that Edge.js does in fact call the `hello` function synchronously, i.e. return the result as opposed to calling a callback function. 

See [Edge.Js on GitHub](https://github.com/agracio/egde-js) for more information. 
