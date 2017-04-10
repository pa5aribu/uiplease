# cleanup-dependencies
"clean-deps" is a node CLI command to cleanup un-used node dependencies

# Installation
npm install cleanup-dependencies

# Usage
Your node project's package.json might have some un-used dependencies listed, which, if not removed, will be downloaded and packaged as part of your node component during build time.

to find and remove unused deps :
1. CD into your project folder and
2. execute "clean-deps"

# Example 

<pre><code>
package.json [BEFORE] :
{
  "name": "some-node-component",
  ...
  ...
  ...
  "dependencies": {
    "underscore": "*",
    "array-uniq": "*",
    "fs-extra": "*",
    "jsonfile": "*",
    "process": "*",
    "jsonupdate" : "*",
    "abcd" : "*",
    "xyz" : "*"
  },
  ...
  ...
  ...
}
</code></pre>

<pre><code>
==> $clean-deps 
// will identify the dependencies that are actually used and only keep them. 
// package.json will be automatically be updated as shown below.
</code></pre>

<pre><code>
package.json [AFTER] :
{
  "name": "some-node-component",
  ...
  ...
  ...
  "dependencies": {
    "underscore": "*",
    "fs-extra": "*",
    "jsonfile": "*"
  },
  ...
  ...
  ...
}
</code></pre>

