+++
tags = []
date = "2022-09-10T07:56:06+10:00"
draft = false
title = "Micro Frontends 101 👨🏻‍🏫"
coverImage = "/blog/images/micro-frontends-101/cover.png"
coverImageId = "micro-frontends-101-cover"
headerImage = "/blog/images/micro-frontends-101/header.png"
headerImageId = "micro-frontends-101-header"
+++

Yo!
Ever here'd this term before Micro Frontend or MFE and been like what da heck is that? Well you have stumbled across the right class room. In this introductory class Mr.Forte is going to be going over a high level overview of:

1. What is a Micro Frontend (MFE).
2. What are the pro's.
3. What are the cons.
4. Common Principals to follow.
5. How might we implement an MFE.

## What is a Micro Frontend (MFE)

A Micro Frontend is just an architectural **design approach** to breaking down a larger monolithic frontend application into smaller reusable applications. I also like to refer to this as pulling apart the monster 😈

These smaller applications are then hosted inside of a larger application which we like to call the **Host**.

Between the Host and the MFE we utilise some form of MFE Framework or Adaptor which acts as the glue between the Host and MFE allowing the host to mount/unmount the MFE plus do any other work which is necessary in order to get the two to play nicely together.

![glue](/blog/images/micro-frontends-101/glue-stick.png)

Each MFE will serve as its own standalone, independently deployable application which is loosely coupled from other applications. Each MFE will also have such things as its own CI/CD pipeline as shown in the diagram below.

![cicd](/blog/images/micro-frontends-101/cicd.png)

## What are the pro's

### 1. Reusability

One of the main benefits of utilising MFE's is their ability to be reused across multiple applications due to their nature of being loosely coupled. In the below image I have a products Micro Frontend which has the sole responsibility of displaying products to the client. It contains all the logic related to products and doesn't do anything else other than provide functionality related to products.

![reusability](/blog/images/micro-frontends-101/reusability.png)

### 2. Increased Delivery Speed

With Micro Frontends due to their nature of being these small isolated applications with their own continuous integration and delivery pipelines. It allows for independent development and release cycles resulting in faster build times. With cross functional teams solely focusing on the development of their MFE it allows for multiple teams to work in parallel along side one another minimising blockers teams might face when working on a large monolithic application therefore resulting in a increased delivery speed.

### 3. Scalability

As an organisation grows and more and more developers are onboarded into the system you will usually find their comes issues with how do we scale the system along with this increased growth.

One struggle is onboarding time ie: the time it takes to onboard a new developer and get them up to speed with the entirety of the system. This can be a real challenge if it is a large monolithic application. On the flip side we can have a new developer work on an MFE which will be a much smaller section of the entire system. This will allow the developer to solely focus on this part of the system which will be much easier for them to wrap their head around and get up to speed allowing them to take part in the development process much sooner and then gradually introduce them to the remainder of the system.

Due to the nature of Micro Frontend's being loosely coupled from the remainder of the system it allows for one teams work to not effect another teams work which stops teams from stepping on each others toes therefore improving the development speed as mentioned above while also aiding in the continuous growth of the system.

### 4. Technology Agnosticism

Another major benefit to MFE's is it allows teams to pick their own technology stack which is best suited for the task at hand. Whether you want to have this is up to you but it is a possibility with Micro Frontends. For example my host application might be written in Angular but my MFE's might be written in Vue or React.

![framework agnostic](/blog/images/micro-frontends-101/framework-agnostic.png)

### 5. Decoupling

With a decoupled application architecture it allows for each app to perform its own task independently with complete autonomy allowing for a change in one service to not effect changes in another. This decoupled application architecture is one of the main benefits of Micro Frontends which also ties back into scalability and the ability for the system to grow.

### 6. Maintenance

As a monolithic application grows to become an absolute monster of an app there tends to be a correlation between the size of the application and the maintenance involved. As new features are added and existing code is modified there is the likely hood for regressions to be introduced along with new bugs.

![maintenance](/blog/images/micro-frontends-101/maintenance.png)

Because MFE's are these small manageable applications with clearly defined dependencies it makes building a mental model of the app a lot simpler for developers allowing for developers to clearly understand how the MFE works therefore making it simpler for teams to maintain and add new functionality.

### 7. Fault Tolerance

In the case of a monolithic application if a part of the system fails then it will stop the whole system from working. This is also referred to as a single point of failure. 
In the case of an MFE we can have it though if our Micro Frontend fails it will not bring down the remainder of the Frontend. This results in a more resilient system, which is less prone to failure. It also helps to create a more highly available system, minimising down time which therefore helps us to further strive towards building a more reliable and robust system.

## What are the Con's

### 1. Increased Complexity

MFE's can't all be sunshine and rainbows. With Every architectural decision we make as Engineers it is all about weighing up the pro's and con's. One of the major downsides with MFE's is the improved complexity which comes along with setting up our MFE's as there has to exist some form of middle ground between the two which allows our host to implement our MFE and our remote to be used as an MFE.

![adaptor](/blog/images/micro-frontends-101/adaptor.png)

There are also other things to consider such as routing and how might our MFE communicate with the host or vice verser. These are all things which become some what more difficult with MFE's.

As the number of Micro Frontends continues to grow so will the complexity of the overall system. There is also the possibility for our Frontend architecture to turn into a Monolithic Micro-services, though with careful planning and guidelines put in place this can help to mitigate against this risk.

### 2. Larger Payloads

When implementing MFE's there is the possibility to have some level of code duplication across your MFE's and depending on how you implement your MFE this can result in a larger payload when we render our application to the client which results in a level of decreased performance though there are ways to efficiently handle this through utilising such means as [Code Splitting](https://reactjs.org/docs/code-splitting.html)

### 3. Inconsistencies in design

Because each MFE is its own isolated entity there is a chance that when the host renders the MFE we can have an inconsistency in the designs. Though there are ways we can work around this through using popular component libraries such us [Material UI](https://mui.com/) throughout our Hosts and MFE's or forming themes which the MFE can inherent from the Parent ie: [tailwind theme](https://tailwindcss.com/docs/theme), [emotion theme](https://emotion.sh/docs/theming).

One little gotcha with MFE's depending on the approach you take is that there is possibilities for css to clash as one MFE might bring in different styles compared to the other and if there are classes, attributes or id's with overlapping styles there is the possibility that one MFE's styles might override the others which will cause inconsistencies in our designs.

Below are some ways as to how we might tackle this problem:

- Use a css-in-js library such as [Emotion](https://emotion.sh/docs/introduction)
- Use css-modules as described in [What are CSS Modules and why do we need them](https://css-tricks.com/css-modules-part-1-need/)

### 4. No Standards

Within the MFE space there is no set standard or best way to go about implementing a Micro Frontend architecture as there are so many different ways to go about implementing MFE's we have to consider what's the best way to implement a Micro Frontend which suits our particular use case as this can vary quite drastically from one application to another.

## Common Principals to Follow

### A Domain Driven Design Approach

Domain Driven Design (DDD) is a design approach for modelling our software around the domains of the business where by breaking our system down into Bounded Contexts which acts as a boundary around our domains.

For Example we may have an application which involves a user to:

1. search for products.
2. fulfil some order flow to enable the capturing of the users details ie: address, email, phone, name.
3. pay for the order.
4. order gets shipped. Might also provide some form of parcel tracking.

![bounded context](/blog/images/micro-frontends-101/bounded-context.png)

This would then allow us to break down our Monolithic app into 4 seperate MFE's. One for the Searching of Products, another for Ordering, Payment and Shipping.
We could then if we wanted to apply a BFF (Backend For Frontend) which acts as an API for dealing directly with its own MFE. Each BFF would then contain all the functionality for dealing directly with its own domain ie: Payment BFF would contain all the logic for validating credit cards, processing payments etc..

![domain driven design](/blog/images/micro-frontends-101/ddd.png)

This approach then if we wanted to would allow for 4 cross functional teams to work in parallel of one another and become masters of their own domains.

### Share Nothing

Each MFE is meant to be its own self contained application which is decoupled from the remainder of the other applications. 
Once we start sharing things such as state and logic across our MFE's then we start to cross our bounded contexts and start to form some overlap within our MFE's which could lead us down a dark path of a Monolith Micro-service. 
So I advise any time you are considering sharing something across your MFE's just take a step back and have a long hard think about it 🤔

## How might we implement an MFE

Just before we finish our MFE 101 class I would like to go over MFE Integration and a few different alternatives you might want to consider.
With there being so many different solutions I will only touch base on a couple but just keep in mind their is no one size fits all approach and before we consider how might we implement our MFE's we must weigh up the pros and cons and pick an approach that is more tailored towards our use case.

### Server Side Integration

With this approach the MFE's are composed on the server side before being sent to the client. Facebook follows a similar approach. Though it refers to its MFE as a Pagelet. How it approaches MFE's is by rendering a template on the server and then dishing this up to the client while the web server continues to generate MFE's in the background which are then served up to the client whereby replacing the corresponding divs placeholder with the Pagelet's HTML markup. If you would like to read more about Facebooks MFE implementation approach you can read more about it at [Facebook Engineering](https://engineering.fb.com/2010/06/04/web/bigpipe-pipelining-web-pages-for-high-performance/)

### Build Time Integration

With a build time integration the Host application will get access to the MFE's source code before being rendered on the browser.

![build time](/blog/images/micro-frontends-101/npm.png)

The upside to this is that it is pretty easy to setup our MFE as a package though the downside to this is that every time we make a change to our MFE and redeploy it, we then have to bump the package number of our MFE package in the host and then redeploy the host. It is also possible to start bleeding the lines between the MFE and Host when we have an MFE as a package which could lead to tight coupling of our services.

### Run Time Integration

With a runtime integration the Host application will get access to the the MFE's source code after the host is loaded in the browser. The upside to taking a runtime approach is that we can deploy our MFE's at any time and have it instantly visible in our Host or we can version it and have the host decide which version of the MFE it would like to see. The downside to this is that the tooling and setup is more complicated.

There are numerous ways to integrate our MFE's into our host at runtime the first being [iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe). This approach is relatively easy to implement and facilitates isolation between our host application and the MFE keeping them both loosely coupled. Though the downsides to using iframes is that we loose all accessibility and it adds a lot of complexity when it comes to building a responsive site.

Another approach would be to use [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/) which is a new feature of Webpack 5.

It allows devs to create multiple seperate builds and then share these builds with other applications at runtime who also utilise the Module Federation plugin. The great thing about Module Federation is that it makes sharing code extremely easy and though it is not intended for Micro Frontends it does make a good fit for integrating MFE's and is slowly becoming the adopted approach for an MFE Architecture.

In the below diagram we can see how we can utilise Module Federation to create the build of our MFE.

![module federation](/blog/images/micro-frontends-101/module-federation.png)

When your host application loads it will fetch the remoteEntry.js file which contains a list of directions on how to get the necessary Javascript files to load your MFE. Webpack does majority of the heavy lifting it mainly just comes down to you as the developer to configure Module Federation in your Webpack config.

Well thats pretty much all I got for todays class I hope y'all enjoyed this brief introduction to Micro Frontends and I look forward to seeing you in the next one!

Peace homies ✌️

### References

- [Microfrontends with React: A Complete Developer's Guide](https://www.udemy.com/course/microfrontend-course/)
- [Micro-Frontends Course - Beginner to Expert](https://www.youtube.com/watch?v=lKKsjpH09dU)
- [Micro Frontends - Martin Fowler](https://martinfowler.com/articles/micro-frontends.html)
- [Micro Frontends extending the microservice idea to frontend development](https://micro-frontends.org/)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Micro Frontend Architecture - Luca Mezzalira, DAZN](https://www.youtube.com/watch?v=BuRB3djraeM)
- [Micro-Frontends: What, why and how](https://www.youtube.com/watch?v=w58aZjACETQ)