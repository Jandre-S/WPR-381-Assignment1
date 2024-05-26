/* Before program can run you need to install the following:
npm install spotify-web-api-node
npm install dotenv
*/

require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const readline = require('readline');

// Spotify API client setup
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Get Spotify access token
async function initializeSpotifyApi() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Spotify access token set');
        promptUserForSong();
    } catch (err) {
        console.error('Error retrieving Spotify access token', err);
    }
}

// Function to perform a Spotify song lookup
async function lookupSong(songName) {
    try {
        const data = await spotifyApi.searchTracks(`track:${songName}`);
        const song = data.body.tracks.items[0];
        if (song) {
            console.log(`Artist: ${song.artists.map(artist => artist.name).join(', ')}`);
            console.log(`Song: ${song.name}`);
            console.log(`Preview Link: ${song.preview_url}`);
            console.log(`Album: ${song.album.name}`);
        } else {
            console.log('Song not found!');
        }
    } catch (err) {
        console.error('Error fetching song:', err);
    }
}

// Function to prompt user for song name and lookup the song in a loop
function promptUserForSong() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function askForSong() {
        rl.question('Enter song name (or type "exit" to quit): ', async (songName) => {
            if (songName.toLowerCase() === 'exit') {
                console.log('Exiting...');
                rl.close();
            } else {
                console.log(`You entered: ${songName}`);
                await lookupSong(songName);
                askForSong(); // Loop back to ask for another song after lookup is done
            }
        });
    }

    askForSong(); // Initial call to start the loop
}

// Main logic to initialize APIs and prompt user for input
initializeSpotifyApi();
