/**
 * Handler for incoming elements;
 * Rewrites attributes + text
 */
class ElementHandler {
    constructor(attributeName) {
        this.attributeName = attributeName;
    }

    // Changes attribute value if @param attributeName is an attribute,
    // or if element is a <title> tag, change the title.
    // Else, do nothing (empty parameter).
    // From: https://blog.cloudflare.com/introducing-htmlrewriter/
    element(element) {
        // Get element attribute as String 
        const attribute = element.getAttribute(this.attributeName);
        // If attribute returns a valid attribute
        if (attribute) {
            // Set 'href' attribute to value: 'https://bjma.github.io'
            // It's not a complete website, I know :(
            element.setAttribute(
                this.attributeName,
                attribute.replace('https://cloudflare.com', 'https://www.linkedin.com/in/brian-j-ma')
            );
        }

        // If our element isn't an attribute, but a title, change title
        if (element.tagName === 'title') {
            element.setInnerContent('bjma');
        }
    }

    // Change text value of current `element` to new text
    // TODO: see if we can do something about saving Variant #  
    text(text) {
        if (!text.lastInTextNode) {
            if (text.text.includes("Return to cloudflare.com")) { // change <a> text
                text.replace('My LinkedIn');
            }

            if (text.text.includes("Variant")) { // change <h1> text
                text.replace('Hi, Cloudflare recruitment team!');
            }

            if (text.text.includes("take home project")) { // replace <p> text
                text.replace("Thanks for this fun challenge!");
            }
        } else {
            text.replace('');
        }
    }
}

/**
 * Grabs cookie w/ @param name from request headers
 * From: // https://developers.cloudflare.com/workers/templates/pages/cookie_extract/
 * @param {Request} request 
 * @param {String} name 
 */
function getCookie(request, name) {
    // Return result
    let result = null;
    // Retrieve Cookie as string
    let cookieString = request.headers.get('Cookie');
    // If cookieString gets valid cookie/not empty string
    if (cookieString) {
        // split all our cookies into an array w/o semicolons
        let cookies = cookieString.split(';');
        // loop through each cookie to search for cookie w/ name @param name
        cookies.forEach(cookie => {
            // get cookie name
            let cookieName = cookie.split('=')[0].trim();
            // check if current cookie is the cookie we want
            if (cookieName === name) {
                // get value of cookie
                let cookieVal = cookie.split('=')[1];
                result = cookieVal;
            }
        });
    }
    return result;
}

// Event listener for catching FetchEvents
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});


/**
 * Returns one of two URL variants as new Response 
 * @param {Response} request 
 */
async function handleRequest(request) {
    // By checking our given URL, we can see that it's just a body of text.
    // To parse it as JSON, we get our fetch response as text using .text(),
    // then we can parse it using JSON.parse()
    try {
        // store variant url on launch to cookie
        const cookie = getCookie(request, "variant");

        // User's first time on site; no cookies stored, just return a variant
        if (!cookie) {
            // Fetch url and get response
            const response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
            // Read our response as text
            const text = await response.text();
            // Parse text to JSON
            const urls = JSON.parse(text);

            // Init new HTMLRewriter that handles
            // <a> tags; we use this to change 'href'
            // and 'text' values
            const rewriter = new HTMLRewriter()
                .on('a#url', new ElementHandler('href'))
                .on('h1#title', new ElementHandler())
                .on('p#description', new ElementHandler())
                .on('title', new ElementHandler());

            // choose variant
            const variant = (Math.random() < 0.5) ? 0: 1;
            // fetch variant url
            const url = await fetch(urls.variants[variant]);
            // transform variant 
            const result = rewriter.transform(url);
            // redirect to variant
            return result;
        } else {  
            return rewriter.transform(cookie);
        }
        
    } catch(err) {
        console.log(err);
    }
}