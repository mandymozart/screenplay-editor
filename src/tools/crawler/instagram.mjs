import Instagram from 'instagram-scraper';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Downloads a video using wget
 * @param {string} videoUrl - The direct URL of the video
 * @param {string} outputPath - The path where the video will be saved
 */
const downloadWithWget = (videoUrl, outputPath) => {
    return new Promise((resolve, reject) => {
        console.log(`Downloading video from: ${videoUrl}`);
        const command = `wget -O "${outputPath}" "${videoUrl}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`wget error: ${stderr}`);
                reject(new Error(`Failed to download video from ${videoUrl}`));
            } else {
                console.log(`Downloaded successfully: ${outputPath}`);
                resolve();
            }
        });
    });
};

/**
 * Function to download videos using instagram-scraper
 * @param {Array} jsonData - Array of objects containing video metadata
 * @param {string} outputDir - Directory to save downloaded videos
 */
const downloadInstagramVideos = async (jsonData, outputDir) => {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const scraper = new Instagram();

    for (const entry of jsonData) {
        try {
            const { url, text } = entry;

            console.log(`Fetching video metadata from URL: ${url}`);

            // Get video metadata
            const mediaData = await scraper.getMediaByUrl(url);
            if (!mediaData || !mediaData.video) {
                console.log(`No video found for URL: ${url}`);
                continue;
            }

            const videoUrl = mediaData.video;
            const videoFileName = `${text.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
            const outputPath = path.join(outputDir, videoFileName);

            // Download video using wget
            await downloadWithWget(videoUrl, outputPath);
        } catch (error) {
            console.error(`Error processing URL ${entry.url}:`, error.message);
        }
    }
};

// Example usage
const __dirname = path.resolve(); // Use this if not already available

// Resolve paths
const jsonFilePath = path.resolve(__dirname, '/shorts.json'); // Path to your JSON file
const outputDirectory = path.resolve(__dirname, '../../../downloads'); // Directory to save downloaded videos

// Check file existence
if (!fs.existsSync(jsonFilePath)) {
    console.error('shorts.json does not exist in the expected location.');
    process.exit(1);
}

if (!fs.existsSync(outputDirectory)) {
    console.error('downloads directory does not exist.');
    process.exit(1);
}

// Read and process the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading JSON file: ${err.message}`);
        return;
    }

    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseError) {
        console.error(`Error parsing JSON file: ${parseError.message}`);
        return;
    }

    downloadInstagramVideos(jsonData, outputDirectory);
});