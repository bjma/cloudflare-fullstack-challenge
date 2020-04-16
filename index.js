// Event listener for catching FetchEvents
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

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
        //console.log("this is to confirm u got it lol");
        //console.log(text);
        // Parse text to JSON
        const urls = JSON.parse(text);
        
        // Randomly redirect user to either variant A/B with a 50/50 chance
        //return (Math.random() < 0.5) ? new Response(urls.variant[0].url) : new Response(urls.variant[1]);
        if (Math.random() < 0.5) {
            return await fetch(urls.variants[0]); // A

        } else {
            return await fetch(urls.variants[1]); // B
        }
        
    } catch(err) {
        console.log(err);
    }

    /*return new Response('Hello worker!', {
        headers: { 'content-type': 'text/plain' },
    });*/
}