---
title: "Middleware Pattern with AWS Lambdas and Python"
description: "How to implement the middleware pattern in AWS Lambda functions using Python decorators."
pubDate: 2021-07-26
tags: ["AWS", "Python", "Lambda", "Middleware", "Design Patterns"]
---

> *This article is also available on [Medium](https://medium.com/@adrien.petitjean84/middleware-pattern-with-aws-lambdas-and-python-bee87667d908).*

So now, let’s say you want to do the move to Python, and write your AWS lambdas with this awesome language.
Cherry on the top *you want to use the middleware pattern*. In other words, you want to:

1. Keep the business logic inside the handler function.
2. Execute any type of code in a middleware.
3. Eventually read from or modify context objects.
4. Terminate the middleware cycle.
5. Call the next middleware function in the pipeline.

As I am writing these lines I did not find any middleware library in python for AWS lambdas.
But of course, there is a solution to every problem, especially with python!

## The Decorator Pattern

A very convenient way to do what middleware pattern does, is to use the **decorator pattern**.

Decorator is a design pattern that allows you to add a new functionality to an object or a function without changing its structure.

Given this let’s try to re-write the logging middleware and the error handler middleware using Python decorators.

### The Logger Middleware

The logger decorator which is a closure, takes the handler as parameter, then `*args` represents the event and the context parameters given to the handler.

```python
def logger(handler):
    def wrapper(*args, **kwargs):
        print("Log before the handler")
        return handler(*args, **kwargs)
    return wrapper
```

In this example the logger decorator is attached to the handler and it will log the message "Log before the handler", before the execution of the handler.
In a case where we want to do some action after the handler, the wrapper function could save the return of the handler then executes some other instructions after.

### The Error Handler Middleware

Now let’s try to do our error handler!

```python
def error_handler(env):
    def decorator(handler):
        def wrapper(*args, **kwargs):
            try:
                return handler(*args, **kwargs)
            except Exception as e:
                print(f"Error caught in {env}: {str(e)}")
                return {
                    'statusCode': 500,
                    'body': f"Internal Server Error in {env}"
                }
        return wrapper
    return decorator
```

In this example the `error_handler` decorator takes the `env` parameter, in the exact same way we can pass any context, configuration or options to the decorator.

### Putting It All Together

The handler now has 2 decorators, and the order matters: the logger decorator will be called first, the error_handler in second. As you can see we just pass the environment directly to the error_handler.

```python
@logger
@error_handler(env="production")
def lambda_handler(event, context):
    # Your business logic here
    return {
        'statusCode': 200,
        'body': 'Hello from Lambda!'
    }
```

The `error_handler` will catch Exceptions and send back an error response if an Exception has been raised.

### Conclusion

At the end, doing the middleware implementation with decorators in python answered all the points we had:

- It keeps the business logic tight to the handler function.
- We can execute any type of code in a decorator, and even pass some parameters to it.
- We can manipulate some context objects, since they are passed to the wrapper function.
- We can terminate the middleware cycle by throwing an error for example.
- Call the next middleware function in the pipeline, by simply calling the handler within the decorator.

So that’s it! Hope you like this article, feel free to comment and share any thoughts about this.
