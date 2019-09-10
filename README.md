Thank you for the opportunity to submit this coding challenge. I found it very enjoyable. Cloud Kitchens sounds like a great opportunity.

My solutions stack is React for the view library and Redux for state management. I chose these two technologies because they are industry leaders with a large user and knowledge base. It makes it easier to find people and solutions. Also a big user base enhances the longevity of the product.

Personally I like React because it lends itself to a web components architecture which I find easy to share, extend and maintain. Also it runs on node which plays to my skill set. When paired with Redux I find it very easy to write components in a Model-View, View, Controller design pattern with Redux supplying the model and controller functionality. Redux also nicely encapsulates the business logic in the reducer and controller. And while not being totally portable, it does keep everything in one place and provides a template for component design.

Sass for css optimization, Bootstrap for page layout, underscore for utilities and socket.io were also chosen because they are all very accessible and easy to use.

My code is written in a mostly functional manner with a shared library of components. I have left comments in the code explaining the behavior. The tests are written using Jest and Enzyme, two other industry standards, and while not being exhaustive, they are adequate for the situation.

The challenge was bootstrapped with create-react-app and the details for running it are detailed below. It requires node version v11.10.1 or above. 

## Summery of operations:

### `npm start`
to start the simulation, both the socket server and the React front end

### `npm test`
to run the Jest unit tests

### `npm run start_server`
to independently run the socket server

The green "start" button at the top left corner of the app starts the simulation, that is, instructs the socket server to being serving orders. Clicking it again stops and resets the simulation. 

The code has been zipped and attached. The code is also hosted on my Github account [here](https://github.com/mgable/order_tracking)

If you have and questions, comments or concerns please reach out!

Thanks again.


====================================================================================================
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
