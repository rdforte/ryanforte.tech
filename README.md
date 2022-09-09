# RyanForte.tech

This project uses [HUGO](https://gohugo.io/) with [Webpack](https://webpack.js.org/).

Webpack is needed for the following.
- Extract [Tailwind CSS](https://tailwindcss.com/)
- Transpile and Polyfill Javascript

---
#### Get Started.
**1. You will need the following installed**
- [Nodejs](https://nodejs.org/en/)
- [Hugo CLI](https://gohugo.io/getting-started/installing/)

**2. You will need to install dependencies**
run the following command:
```
npm install
```
---

#### Run Development Server
```
npm run dev
```
This will run webpack in watch mode along with hugo server in parallel.
webpack in watch mode will polyfill our Javascript and extract our CSS from tailwind.
webpack will output the transpiled js and css into /static/assets. These files are
then referenced in the head.html.
Hugo Server will update when there are any changes so each time webpack transpile the css or javascript hugo will hot reload the browser for us.

During development the start up time may take a bit longer than usual. The reason being is because during development we extract all the tailwind
classes. This is a work around in development to get tailwind, webpack and hugo server to all play nice together. When running the production build
we do a check in the tailwind.config.js for the environment variable **NODE_ENV** if it is production then we do not generate all tailwind classes
but only those we need.

---

#### Compressing Blog images
Compressing blog images requires:
[pngquant](https://pngquant.org)

you can download pngquant via homebrew
```
 brew install pngquant
```
To compress blog images. From your root directory run the following command:
```
make compress
```