import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {

  /* NOTES & URL MANIPULATION ALGORITHMS
  - Listener function waiting to intercept ESBuild's 'onResolve' call request, which overwrites ESBuild's default query to the local hard drive 
  - onResolve() will be called anytime a request is made for a specific NPM file
  */

  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^index\.js$/ }, () => {
        // Case of ESBuild handling index.js file.
        return { path: 'index.js', namespace: 'a' };
      });

      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        // Case of ESBuild handling a relative file.
        return {
          namespace: 'a',
          path: new URL(
            args.path,
            'https://unpkg.com' + args.resolveDir + '/').href
        };
      });

      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // Case of ESBuilding seeking main file of the requested module.
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        };
      });

      /* NOTES
      - Listener to intercept ESBuild's 'onLoad' call requests, and send back custom an object containing the filepath with the content ESBuild requested from the 'onResolve' method 

      * The `URL` utility class inside browser environments, produces an instance that can dynamically combine a URL domain & the file/module that has been requested for download. 
      */


    },
  };
};