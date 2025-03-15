const fs = require('fs').promises;
const path = require('path');

// Configuration
const outputFile = 'project_code.md';
const excludedFolders = ['.git', 'node_modules', '.next', '.vercel'];
const includeFileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json', '.md', '.py', '.php', '.txt'];

// Function to determine language for Markdown code block
function getCodeLanguage(extension) {
  switch (extension) {
    case '.js': return 'javascript';
    case '.jsx': return 'jsx';
    case '.ts': return 'typescript';
    case '.tsx': return 'tsx';
    case '.css': return 'css';
    case '.scss': return 'scss';
    case '.html': return 'html';
    case '.json': return 'json';
    case '.md': return 'markdown';
    case '.py': return 'python';
    case '.php': return 'php';
    case '.txt': return 'plaintext';
    default: return 'plaintext';
  }
}

// Recursive function to read files
async function readFiles(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });  // Get file types

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (excludedFolders.includes(file.name)) {
      continue;  // Skip excluded folders
    }

    if (file.isDirectory()) {
      await readFiles(filePath, fileList);  // Recurse into subdirectories
    } else if (includeFileExtensions.includes(path.extname(file.name))) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        fileList.push({ path: filePath, content: content }); // Store content with path
      } catch (readError) {
        console.error(`Error reading file ${filePath}: ${readError.message}`);
      }
    }
  }

  return fileList;
}

async function generateMarkdown() {
  try {
    // Clear the output file
    await fs.writeFile(outputFile, '# Project Code Documentation\n', 'utf8');

    // Add timestamp
    await fs.appendFile(outputFile, `Generated on ${new Date().toLocaleString()}\n\n`, 'utf8');

    // Read all files
    const files = await readFiles(process.cwd());

    // Process each file
    for (const fileInfo of files) {
      const relativePath = path.relative(process.cwd(), fileInfo.path);
      const language = getCodeLanguage(path.extname(fileInfo.path));

      // Write file path as a header
      await fs.appendFile(outputFile, `## ${relativePath}\n\n`, 'utf8');

      // Write file content in a code block with language
      await fs.appendFile(outputFile, `\`\`\`${language}\n${fileInfo.content}\n\`\`\`\n\n`, 'utf8');
    }

    console.log('Completed! All code has been saved to', outputFile);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the script
generateMarkdown();
