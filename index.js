// Event listener for catching FetchEvents
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

/**
 * Handler for incoming elements
 */
class ElementHandler {
    constructor(attributeName) {
        this.attributeName = attributeName;
    }

    // Changes attribute value if @param attributeName is an attribute,
    // or if element is a <title> tag, change the title.
    // Else, do nothing (empty parameter).
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
                text.replace('LinkedIn');
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

// TODO: persist URL/cookie implementation
/**
 * Returns one of two URL variants as new Response 
 * @param {Response} request 
 */
async function handleRequest(request) {
    // By checking our given URL, we can see that it's just a body of text.
    // To parse it as JSON, we get our fetch response as text using .text(),
    // then we can parse it using JSON.parse()
    try {
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

        // Randomly redirect user to either variant A/B with a 50/50 chance
        if (Math.random() < 0.5) {
            // Variant 1
            const A = await fetch(urls.variants[0]); 
            //return A;
            return rewriter.transform(A);
        } else {
            // Variant 2
            const B = await fetch(urls.variants[1]);
            //return B;
            return rewriter.transform(B);
        }
        
    } catch(err) {
        console.log(err);
    }
}