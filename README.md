# EcbProto

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Run `ng serve --proxy-config proxy.conf.json` to run with proxy server

## Serving from Dist folder
By default Angular runs in dev mode. To run the Production first run `npm install` and then run `lite-server --baseDir="dist/ecb-proto"
`  the application should open in the browser 

## Documentation
Run `npm run compodoc` for generating documentation. Run ` compodoc -s`  to serve the documentation and is available at  http://127.0.0.1:8080. 

 
## HELP USING MOCK SERVER
Dont forget to start the mock server for the application to display data.
Get inside the mock server folder  `cd mockServerApi` and then run `node app.js` 



