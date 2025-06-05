const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Function to sanitize filename by removing invalid characters
function sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim();
}

// Function to convert Google Drive preview URL to download URL
function convertGoogleDriveUrl(url) {
    if (url.includes('drive.google.com') && url.includes('/preview')) {
        const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch) {
            return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
    }
    return url;
}

// Function to download a single PDF
async function downloadPdf(url, filename, index, total) {
    try {
        console.log(`[${index}/${total}] Downloading: ${filename}`);
        
        const downloadUrl = convertGoogleDriveUrl(url);
        const response = await axios({
            method: 'GET',
            url: downloadUrl,
            responseType: 'stream',
            timeout: 30000, // 30 second timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const filePath = path.join(__dirname, 'pdfs', filename);
        const writer = fs.createWriteStream(filePath);
        
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`✓ Downloaded: ${filename}`);
                resolve();
            });
            writer.on('error', reject);
        });
        
    } catch (error) {
        console.error(`✗ Failed to download ${filename}:`, error.message);
        throw error;
    }
}

// Main function to download all PDFs
async function downloadAllPdfs() {
    try {
        // Read the allProblems.json file
        const allProblemsPath = path.join(__dirname, 'allProblems.json');
        if (!fs.existsSync(allProblemsPath)) {
            console.error('Error: allProblems.json file not found!');
            return;
        }

        const allProblems = JSON.parse(fs.readFileSync(allProblemsPath, 'utf8'));
        
        // Create pdfs directory if it doesn't exist
        const pdfDir = path.join(__dirname, 'pdfs');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        // Filter problems that have PDF links
        const problemsWithPdf = Object.values(allProblems).filter(problem => 
            problem.pdf && problem.pdf.trim() !== ''
        );

        console.log(`Found ${problemsWithPdf.length} problems with PDF links`);
        
        if (problemsWithPdf.length === 0) {
            console.log('No PDFs to download.');
            return;
        }

        let successCount = 0;
        let failCount = 0;

        // Download each PDF
        for (let i = 0; i < problemsWithPdf.length; i++) {
            const problem = problemsWithPdf[i];
            
            // Create filename in format: [contest] - [title] - [index].pdf
            const contest = sanitizeFilename(problem.contest || 'Unknown Contest');
            const title = sanitizeFilename(problem.title || 'Unknown Title');
            const index = problem.index || (i + 1);
            
            const filename = `[${contest}] - [${title}] - [${index}].pdf`;
            const filePath = path.join(pdfDir, filename);
            
            // Skip if file already exists
            if (fs.existsSync(filePath)) {
                console.log(`⏭ Skipping (already exists): ${filename}`);
                successCount++;
                continue;
            }
            
            try {
                await downloadPdf(problem.pdf, filename, i + 1, problemsWithPdf.length);
                successCount++;
                
                // Add a small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                failCount++;
                console.error(`Failed to download: ${filename}`);
            }
        }

        console.log('\n=== Download Summary ===');
        console.log(`Total problems with PDF: ${problemsWithPdf.length}`);
        console.log(`Successfully downloaded: ${successCount}`);
        console.log(`Failed downloads: ${failCount}`);
        console.log(`PDFs saved to: ${pdfDir}`);

    } catch (error) {
        console.error('Error in main function:', error.message);
    }
}

// Run the download process
if (require.main === module) {
    console.log('Starting PDF download process...');
    downloadAllPdfs()
        .then(() => {
            console.log('Download process completed.');
        })
        .catch((error) => {
            console.error('Download process failed:', error.message);
        });
}

module.exports = { downloadAllPdfs, downloadPdf, sanitizeFilename, convertGoogleDriveUrl };