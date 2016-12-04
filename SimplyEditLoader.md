# Hands-on with SimplyEdit: Automated attribute switching

A tools I like to use when creating websites is [SimplyEdit].
With SimplyEdit it is trivial to make content editable for the owner of the website.
It is simply a matter of adding a `<script>` tag and some `data` attributes.
(It's called **Simply**Edit for a reason...)

One thing I noticed when developing with [SimplyEdit], was that I kept switching
API keys and storage endpoints between environments. I was manually editing the
attributes of the script tag.

Being a developer, I prefer automating things to save time and avoid human error.
So I created a small javascript snippet to automate this process.

## TL;DR

If you use [SimplyEdit], the snippet below will make it easier to switch API
keys and/or configuration while switching between development/test/production
environments.

### Usage 

The snippet exposes two functions:
- `simply.key(key [, host])` to set an API key
- `simply.set(name, value [, host])` to set any given SimplyEdit attribute.

Both functions allow adding a host name, to indicate that the value should only
be set when on _that_ host.

The name of the function, `simply`, is configurable in case there is already another piece of Javascript with the name "simply" in use.

### The Snippet

    <!-- SimplyEdit Loader-->
    <script>
    (function(s,i,m,p,l,y){function c(i,e,n){(void 0===n||n===s.location.host)&&l.setAttribute(i,e)}
    l=l||i.createElement(m),l.async=1,l.src="https://cdn.simplyedit.io/1/simply-edit.js",
    y=y||i.scripts[0],y.parentNode.insertBefore(l,y),s[p]=s[p]||{key:function(t,i){
    c("data-api-key",t,i)},set:function(t,i,e){c("data-simply-"+t,i,e)}}
    })(window,document,"script","simply");

    simply.key('my-awesome-api-key');
    simply.set('endpoint', '/');

    </script>
    <!-- End SimplyEdit Loader-->

## The Full Story

### SimplyEdit `data` attributes

The script tag, beside pointing the `src` to the `simply-edit.js` file,
also needs to contain an api-key. Depending on how SimplyEdit is used, 
other attributes can also be set to configure SimplyEdit.

For instance, the script tag from the **simplyedit.io** website looks like this:

    <script src="//cdn.simplyedit.io/1/simply-edit.js"
        data-api-key="ba1a14669981509ed5012533e8a54bf9"
        data-simply-endpoint="/"
        data-simply-files="/files/"
        data-simply-images="/img/"
        data-simply-settings="myCustomSettings"
    ></script>

SimplyEdit Launched version 1.0 in October 2016 but I was lucky enough to be
[the first registrant] when SimplyEdit went into Beta back in November 2015.
This earned me a vanity key to use with their API.

When on a development environment, I tend to use so called [canary] (early release) version instead of the stable release.

As [my website] is hosted using [Github Pages], I also need to add a custom endpoint
where SimplyEdit can store my data.

Putting all of this together, _my_ script tag looks like this:

    <script src="https://canary.simplyedit.io/1/simply-edit.js"
        data-api-key="potherca"
        data-simply-endpoint="https://github.com/Potherca/potherca.github.io/"
    ></script>

### SimplyEdit API keys

Although a comercial license is required for use in production, SimplyEdit is
graceful enough to offer development API keys for free. These work on Localhost,
Github or Heroku (depending on the API key used). They also offer a 30 day free trial.

### Automing the process

What I tended to do, when I switched environments or development machines (desktop, laptop, chromebook, tablet) is change the API key, as each machine had a different URL on which development took place.

Depending on the phase the project was in (concept, develop, test, acceptance, production), I also tended to change the storage URL. I really didn't want to accidentally mess up the content in production when testing things.

So I created a small javascript snippet to automate this process. 

### The Javascript snippet

After some tweaking, the snippet ended up like this:

    (function createSimplyEditScriptTag(window, document, elementName, functionName, element, siblingElement) {

      function setAttribute(p_sKey, p_sValue, p_sHost) {
        if (p_sHost === undefined || p_sHost === window.location.host) {
          element.setAttribute(p_sKey, p_sValue);
        }
      }

      element = element || document.createElement(elementName);
      element.async = 1;
      element.src = 'https://cdn.simplyedit.io/1/simply-edit.js';

      siblingElement = siblingElement || document.scripts[0];
      siblingElement.parentNode.insertBefore(element, siblingElement);

      window[functionName] = window[functionName] || {
        key: function (p_sKey, p_sHost) {
          setAttribute('data-api-key', p_sKey, p_sHost);
        },
        set: function (p_sKey, p_sValue, p_sHost) {
          setAttribute('data-simply-' + p_sKey, p_sValue, p_sHost);
        }
      };
    })(window, document, 'script', 'simply');

Although the code should be simple enough to understand, adding 25 lines of JS code does not exactly feel "lightweight". 

### Minifying

Taking a cue from [Google's Analytics tracking snippet] (and Mathias Bynens [optimizations of the snippet]), I decided to minify the code. The final result is this:

    (function(s,i,m,p,l,y){function c(i,e,n){(void 0===n||n===s.location.host)&&l.setAttribute(i,e)}
    l=l||i.createElement(m),l.async=1,l.src="https://cdn.simplyedit.io/1/simply-edit.js",
    y=y||i.scripts[0],y.parentNode.insertBefore(l,y),s[p]=s[p]||{key:function(t,i){
    c("data-api-key",t,i)},set:function(t,i,e){c("data-simply-"+t,i,e)}}
    })(window,document,"script","simply");

The functionality is exactly the same only a lot less readable. It is also lot shorter. Pasting a mere 5 lines feels a lot more lightweight.

### Examples

#### The SimplyEdit Website

For an example, take the data atributes from the SimplyEdit website. The snippet with those attributes would look like this:

    <!-- SimplyEdit Loader-->
    <script>
    (function(s,i,m,p,l,y){function c(i,e,n){(void 0===n||n===s.location.host)&&l.setAttribute(i,e)}
    l=l||i.createElement(m),l.async=1,l.src="https://cdn.simplyedit.io/1/simply-edit.js",
    y=y||i.scripts[0],y.parentNode.insertBefore(l,y),s[p]=s[p]||{key:function(t,i){
    c("data-api-key",t,i)},set:function(t,i,e){c("data-simply-"+t,i,e)}}
    })(window,document,"script","simply");

    simply.key('ba1a14669981509ed5012533e8a54bf9');
    simply.set('endpoint', '/');
    simply.set('files', '/files/');
    simply.set('images', '/img/');
    simply.set('settings', 'myCustomSettings');

    </script>
    <!-- End SimplyEdit Loader-->

The attributes are all rather straightforward. As no host switching is used, it isn't really sensible to use the snippet, but merely using it as an example to compare with the tag  at the start of this article seemed sensible enough :-)

#### My attributes

For my attributes I would add some extra settings for use an various different hosts. Putting it together it would look like this:

    <!-- SimplyEdit Loader-->
    <script>
    (function(s,i,m,p,l,y){function c(i,e,n){(void 0===n||n===s.location.host)&&l.setAttribute(i,e)}
    l=l||i.createElement(m),l.async=1,l.src="https://cdn.simplyedit.io/1/simply-edit.js",
    y=y||i.scripts[0],y.parentNode.insertBefore(l,y),s[p]=s[p]||{key:function(t,i){
    c("data-api-key",t,i)},set:function(t,i,e){c("data-simply-"+t,i,e)}}
    })(window,document,"script","simply");

    /* My API key also works on localhost */
    simply.key('potherca');
    /* Use github to run a testing environment */
    simply.key('github', 'potherca.github.io');
    /* Use Heroku to run an acceptance environment */
    simply.key('heroku', 'potherca.herokuapp.com');
    
    /* Production data is stored on Github */
    simply.set('endpoint', 'https://github.com/Potherca/potherca.github.io/');
    /* When developing on Cloud9 (https://c9.io/) data is stored elsewhere */
    simply.set('endpoint', '/storage/', 'website-potherca.c9users.io');
    /* On a development environment, use the canary build */
    simply.set('src', 'https://canary.simplyedit.io/1/simply-edit.js', 'localhost');
    simply.set('src', 'https://canary.simplyedit.io/1/simply-edit.js', 'website-potherca.c9users.io');
    </script>
    <!-- End SimplyEdit Loader-->

[canary]: http://martinfowler.com/bliki/CanaryRelease.html
[Github Pages]: https://pages.github.com/
[Google's Analytics tracking snippet]: https://developers.google.com/analytics/devguides/collection/analyticsjs/
[my website]: https://pother.ca/
[optimizations of the snippet]: https://mathiasbynens.be/notes/async-analytics-snippet
[SimplyEdit]: https://simplyedit.io/
[the first registrant]: https://twitter.com/potherca/status/665236400112074752