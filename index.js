// Event listener for catching FetchEvents
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Returns one of two URL variants as new Response 
 * @param {Response} request 
 */
async function handleRequest(request) {
    // By checking our given URL, we can see that
    // it's just a body of text. To parse it as JSON,
    // we get our fetch response as text using .text(),
    // then we can parse it using JSON.parse()
    try {
        // Our response; since it's an async function we can use 'await'
        const response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
        // Read our response as text
        const text = await response.text();
        //console.log("this is to confirm u got it lol");
        console.log(text);
        // parse text to JSON
        const urls = JSON.parse(text);
        //console.log(urls.variants);
        
    } catch(err) {
        console.log("lmfao loser");
    }

    return new Response('Hello worker!', {
        headers: { 'content-type': 'text/plain' },
    });
}